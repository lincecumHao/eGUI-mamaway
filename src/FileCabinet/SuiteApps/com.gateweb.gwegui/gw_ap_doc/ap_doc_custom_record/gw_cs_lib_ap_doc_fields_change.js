define([
  'N/search',
  'N/runtime',
  'N/url',
  'N/https',
  '../vo/gw_ap_doc_fields',
  '../application/gw_service_ap_doc_type_options',
  './gw_cs_ap_form_display',
  '../application/gw_service_ap_doc_consolidate_mark_options',
  '../application/gw_service_ap_doc_currency_options',
  '../application/gw_service_ap_doc_status_options',
  '../application/moment-with-locales',
], function (
  search,
  runtime,
  url,
  https,
  apDocFields,
  apDocTypeService,
  sublistDisplay,
  apDocConsolidateMarkService,
  apDocCurrencyService,
  apDocStatusService,
  moment
) {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2020 Gateweb
   * @author Sean Lin <seanlin816@gmail.com>
   *
   * @NApiVersion 2.x
   * @NModuleScope Public
   */

  var exports = {}
  var getCurrencyFieldValue = floatWrapper(getValue)
  var getNumberFieldValue = integerWrapper(getValue)
  var getDateTimeFieldValue = dateTimeWrapper(getValue)
  var currentTransactionRecord = null
  var currentContext = null

  function setCurrentRecord(inputRecord) {
    currentTransactionRecord = inputRecord
  }

  function setCurrentContext(inputContext) {
    currentContext = inputContext
    currentTransactionRecord = inputContext.currentRecord
  }

  /**
   * <code>DocumentTypeChanged</code> event handler
   *
   * @gov XXX
   *
   * @param context
   *    {Object}
   * @param context.currentRecord
   *    {record} The current record the user is manipulating in the UI
   * @param context.sublistId
   *    {string} The internal ID of the sublist.
   * @param context.fieldId
   *    {string} The internal ID of the field that was changed.
   * @param [context.lineNum=undefined]
   *    {string} The index of the line if the field is in a sublist or
   *      matrix.
   * @param [context.columnNum=undefined]
   *    {string} The index of the column if the field is in a matrix.
   *
   * @return {void}
   *
   * @static
   * @function DocumentTypeChanged
   */
  function documentTypeChanged(context) {
    var selectedDocTypeId = getValue(apDocFields.fields.docType.id)
    if (!selectedDocTypeId || selectedDocTypeId === '') {
      console.log('null value')
      return
    }
    var docTypeCode = apDocTypeService.getDocTypeCodeByRecordId(
      selectedDocTypeId
    )
    sublistDisplay.setCurrentContext(context)
    sublistDisplay.displayFields(docTypeCode)
    if (apDocConsolidateMarkService.isFormConsolidated(docTypeCode)) {
      setConsolidateMarkToA()
      // consolidationMarkChanged(context)
    }
    setDocStatus()
    setApplyPeriodValue()
    setCurrency()
    setBuyer()
    setSeller()
    var taxType = getNumberFieldValue(apDocFields.fields.taxType.id)
    if (taxType) {
      taxTypeChanged(context)
    }
  }

  function setDocStatus() {
    var defaultDocStatus = apDocStatusService.getStatusByValue(1)
    var currentStatusValue = getNumberFieldValue(
      apDocFields.fields.guiStatus.id
    )
    if (!currentStatusValue) {
      setValue(apDocFields.fields.guiStatus.id, defaultDocStatus.id)
    }
  }

  function setApplyPeriodValue() {
    var currentApplyPeriodValue = getCurrencyFieldValue(
      apDocFields.fields.applyPeriod.id
    )
    if (!currentApplyPeriodValue || currentApplyPeriodValue === '') {
      setValue(
        apDocFields.fields.applyPeriod.id,
        convertToApplyPeriod(moment())
      )
    }
  }

  function setBuyer() {
    var buyerTaxId = getValue(apDocFields.fields.buyerTaxId.id)
    var buyerName = getValue(apDocFields.fields.buyerName.id)
    var subsidiary = runtime.getCurrentUser().subsidiary
    var buyerInfo = getBuyer(subsidiary)
    if (isStringEmptyOrNull(buyerTaxId)) {
      setValue(apDocFields.fields.buyerTaxId.id, buyerInfo.buyerTaxId)
    }
    if (isStringEmptyOrNull(buyerName)) {
      setValue(apDocFields.fields.buyerName.id, buyerInfo.buyerName)
    }
  }

  function isStringEmptyOrNull(value) {
    if (value === 'undefined' || value === undefined) {
      return true
    }
    return !value || value === ''
  }

  function getBuyer(subsidiary) {
    var buyerInfoUrl = url.resolveScript({
      deploymentId: 'customdeploy_gw_sl_business_info_data',
      scriptId: 'customscript_gw_sl_business_info_data',
      params: { subsidiary: subsidiary },
      returnExternalUrl: false,
    })
    var buyerInfoResponse = https.get({
      url: buyerInfoUrl,
    })
    console.log('getBuyer buyerInfoResponse body', buyerInfoResponse.body)
    console.log(
      'getBuyer buyerInfoResponse body type',
      typeof buyerInfoResponse.body
    )
    var buyerInfo = JSON.parse(buyerInfoResponse.body)
    return buyerInfo
  }

  function setSeller() {
    var sellerTaxId = getValue(apDocFields.fields.sellerTaxId.id)
    var sellerName = getValue(apDocFields.fields.sellerName.id)
    var seller = getSeller()
    if (isStringEmptyOrNull(sellerTaxId)) {
      setValue(apDocFields.fields.sellerTaxId.id, seller.sellerTaxId)
    }
    if (isStringEmptyOrNull(sellerName)) {
      setValue(apDocFields.fields.sellerName.id, seller.sellerName)
    }
  }

  function getSeller() {
    var sellerId = currentTransactionRecord.getValue({
      fieldId: 'entity',
    })
    var seller = {}
    var columnMapper = {
      custentity_gw_tax_id_number: 'sellerTaxId',
      custentity_gw_gui_title: 'sellerName',
    }
    Object.keys(columnMapper).forEach(function (columnId) {
      var outputAttr = columnMapper[columnId]
      seller[outputAttr] = ''
    })
    if (sellerId) {
      var sellerInfo = search.lookupFields({
        type: search.Type.VENDOR,
        id: sellerId,
        columns: Object.keys(columnMapper),
      })
      Object.keys(columnMapper).forEach(function (columnId) {
        var outputAttr = columnMapper[columnId]
        seller[outputAttr] = sellerInfo[columnId]
      })
    }
    return seller
  }

  function convertToApplyPeriod(dateTimeValue) {
    var currentDate = dateTimeValue ? moment(dateTimeValue) : moment()
    var currentYear = currentDate.year()
    var currentMonth = currentDate.month() + 1
    var currentDay = currentDate.date()
    var applyYear = currentYear - 1911
    var applyMonth =
      currentMonth % 2 === 0
        ? currentMonth
        : currentDay <= 15
        ? currentMonth - 1
        : currentMonth + 1
    if (applyMonth === 0) {
      applyMonth = applyMonth + 12
      applyYear = applyYear - 1
    }
    return applyYear.toString() + ('0' + applyMonth.toString()).slice(-2)
  }

  function setCurrency() {
    var defaultCurrencyValue = 'TWD'
    var defaultCurrencyOptionId = apDocCurrencyService.getCurrencyRecordIdByValue(
      defaultCurrencyValue
    )
    var currentCurrencyValue = getValue(apDocFields.fields.currency.id)
    if (!currentCurrencyValue || currentCurrencyValue === 0) {
      setValue(apDocFields.fields.currency.id, defaultCurrencyOptionId)
    }
  }

  /**
   * <code>salesAmtChanged</code> event handler
   *
   * @gov XXX
   *
   * @param context
   *    {Object}
   * @param context.currentRecord
   *    {record} The current record the user is manipulating in the UI
   * @param context.sublistId
   *    {string} The internal ID of the sublist.
   * @param context.fieldId
   *    {string} The internal ID of the field that was changed.
   * @param [context.lineNum=undefined]
   *    {string} The index of the line if the field is in a sublist or
   *      matrix.
   * @param [context.columnNum=undefined]
   *    {string} The index of the column if the field is in a matrix.
   *
   * @return {void}
   *
   * @static
   * @function salesAmtChanged
   */
  function salesAmtChanged(context) {
    var value = getCurrencyFieldValue(context.fieldId)
    var taxAmt = getCurrencyFieldValue(apDocFields.fields.taxAmt.id)
    var totalAmt = value + taxAmt
    setTotalAmt(totalAmt)
  }

  /**
   * <code>taxAmtChanged</code> event handler
   *
   * @gov XXX
   *
   * @param context
   *    {Object}
   * @param context.currentRecord
   *    {record} The current record the user is manipulating in the UI
   * @param context.sublistId
   *    {string} The internal ID of the sublist.
   * @param context.fieldId
   *    {string} The internal ID of the field that was changed.
   * @param [context.lineNum=undefined]
   *    {string} The index of the line if the field is in a sublist or
   *      matrix.
   * @param [context.columnNum=undefined]
   *    {string} The index of the column if the field is in a matrix.
   *
   * @return {void}
   *
   * @static
   * @function taxAmtChanged
   */
  function taxAmtChanged(context) {
    var value = getCurrencyFieldValue(context.fieldId)
    var salesAmt = getCurrencyFieldValue(apDocFields.fields.salesAmt.id)
    var totalAmt = value + salesAmt
    setTotalAmt(totalAmt)
  }

  function setTotalAmt(value) {
    setValue(apDocFields.fields.totalAmt.id, value)
  }

  /**
   * <code>ConsolidationMarkChanged</code> event handler
   *
   * @gov XXX
   *
   * @param context
   *    {Object}
   * @param context.currentRecord
   *    {record} The current record the user is manipulating in the UI
   * @param context.sublistId
   *    {string} The internal ID of the sublist.
   * @param context.fieldId
   *    {string} The internal ID of the field that was changed.
   * @param [context.lineNum=undefined]
   *    {string} The index of the line if the field is in a sublist or
   *      matrix.
   * @param [context.columnNum=undefined]
   *    {string} The index of the column if the field is in a matrix.
   *
   * @return {void}
   *
   * @static
   * @function ConsolidationMarkChanged
   */
  function consolidationMarkChanged(context) {
    console.log(
      'ConsolidationMarkChanged context.currentRecord',
      context.currentRecord
    )
    sublistDisplay.setCurrentContext(context)
    var value = getValue(apDocFields.fields.consolidationMark.id)
    if (value) {
      var consolMark = apDocConsolidateMarkService.getConsolidateMarkValueByRecordId(
        value
      )
      console.log('ConsolidationMarkChanged consolMark', consolMark)
      var docType = getNumberFieldValue(apDocFields.fields.docType.id)
      console.log('ConsolidationMarkChanged docType', docType)
      if (consolMark === 'A') {
        clearTextFieldValue(apDocFields.fields.sellerTaxId.id)
        // toggleFieldEnabled(apDocFields.fields.sellerTaxId.id, false)
      }
      if (consolMark === 'A' && parseInt(docType) === 22) {
        var commonNumField = getField(apDocFields.fields.commonNumber.id)
        commonNumField.isMandatory = true
      }
    }
  }

  function setConsolidateMarkToA() {
    var consolidateMarkId = apDocConsolidateMarkService.getConsolidateMarkRecordIdByValue(
      'A'
    )
    setValue(apDocFields.fields.consolidationMark.id, consolidateMarkId)
    sublistDisplay.toggleFieldEnabled(
      apDocFields.fields.consolidationMark.id,
      true
    )
  }

  /**
   * <code>TaxTypeChanged</code> event handler
   *
   * @gov XXX
   *
   * @param context
   *    {Object}
   * @param context.currentRecord
   *    {record} The current record the user is manipulating in the UI
   * @param context.sublistId
   *    {string} The internal ID of the sublist.
   * @param context.fieldId
   *    {string} The internal ID of the field that was changed.
   * @param [context.lineNum=undefined]
   *    {string} The index of the line if the field is in a sublist or
   *      matrix.
   * @param [context.columnNum=undefined]
   *    {string} The index of the column if the field is in a matrix.
   *
   * @return {void}
   *
   * @static
   * @function TaxTypeChanged
   */
  function taxTypeChanged(context) {
    console.log('TaxTypeChanged context.currentRecord', context.currentRecord)
    sublistDisplay.setCurrentContext(context)
    var value = getNumberFieldValue(apDocFields.fields.taxType.id)
    var handleOtherFieldsFunc = []
    handleOtherFieldsFunc.push(handleFieldsForTaxable)
    handleOtherFieldsFunc.push(handleFieldsForTaxExemption)
    handleOtherFieldsFunc.push(handleFieldsForZeroTax)
    handleOtherFieldsFunc.push(handleFieldsForMixTaxOrDefault)
    handleOtherFieldsFunc.forEach(function (handleFunc) {
      handleFunc(context, value)
    })
    // for (var i = 0; i < handleOtherFieldsFunc.length; i++) {
    //   handleOtherFieldsFunc[i](context, value)
    // }
    console.log('TaxTypeChanged value', parseInt(value))
  }

  function handleFieldsForTaxable(context, taxType) {
    if (taxType !== 1) return
    sublistDisplay.toggleFieldEnabled(
      apDocFields.fields.taxExemptedSalesAmt.id,
      false
    )
    setFieldToZero(apDocFields.fields.taxExemptedSalesAmt.id)
    sublistDisplay.toggleFieldEnabled(
      apDocFields.fields.zeroTaxSalesAmt.id,
      false
    )
    setFieldToZero(apDocFields.fields.zeroTaxSalesAmt.id)

    sublistDisplay.toggleFieldEnabled(apDocFields.fields.salesAmt.id, true)
  }

  function handleFieldsForTaxExemption(context, taxType) {
    if (taxType !== 2) return
    setFieldToZero(apDocFields.fields.salesAmt.id)
    setFieldToZero(apDocFields.fields.taxExemptedSalesAmt.id)
    clearTextFieldValue(apDocFields.fields.zeroTaxSalesAmt.id)
    sublistDisplay.toggleFieldEnabled(
      apDocFields.fields.taxExemptedSalesAmt.id,
      false
    )
    sublistDisplay.toggleFieldEnabled(
      apDocFields.fields.zeroTaxSalesAmt.id,
      true
    )
    sublistDisplay.toggleFieldEnabled(apDocFields.fields.salesAmt.id, false)
  }

  function handleFieldsForZeroTax(context, taxType) {
    if (taxType !== 3) return
    setFieldToZero(apDocFields.fields.zeroTaxSalesAmt.id)
    setFieldToZero(apDocFields.fields.salesAmt.id)
    clearTextFieldValue(apDocFields.fields.taxExemptedSalesAmt.id)
    sublistDisplay.toggleFieldEnabled(
      apDocFields.fields.zeroTaxSalesAmt.id,
      false
    )
    sublistDisplay.toggleFieldEnabled(
      apDocFields.fields.taxExemptedSalesAmt.id,
      true
    )
    sublistDisplay.toggleFieldEnabled(apDocFields.fields.salesAmt.id, false)
  }

  function handleFieldsForMixTaxOrDefault(context, taxType) {
    if (taxType !== 4 && taxType !== 0) return
    clearTextFieldValue(apDocFields.fields.zeroTaxSalesAmt.id)
    clearTextFieldValue(apDocFields.fields.taxExemptedSalesAmt.id)
    sublistDisplay.toggleFieldEnabled(
      apDocFields.fields.zeroTaxSalesAmt.id,
      true
    )
    sublistDisplay.toggleFieldEnabled(
      apDocFields.fields.taxExemptedSalesAmt.id,
      true
    )
    sublistDisplay.toggleFieldEnabled(apDocFields.fields.salesAmt.id, true)
  }

  // Common Functions
  function setFieldToZero(fieldId) {
    setValue(fieldId, 0)
  }

  function clearTextFieldValue(fieldId) {
    setValue(fieldId, '')
  }

  function floatWrapper(func) {
    return function () {
      var value = func.apply(this, arguments)
      return parseFloat(value) || 0
    }
  }

  function integerWrapper(func) {
    return function () {
      var value = func.apply(this, arguments)
      return parseInt(value) || 0
    }
  }

  function dateTimeWrapper(func) {
    return function () {
      var value = func.apply(this, arguments)
      return parseFloat(value) || 0
    }
  }

  function getValue(fieldId) {
    return currentTransactionRecord.getValue({
      fieldId: fieldId,
    })
  }

  function getField(fieldId) {
    return currentTransactionRecord.getField({
      fieldId: fieldId,
    })
  }

  function setValue(fieldId, value) {
    currentTransactionRecord.setValue({
      fieldId: fieldId,
      value: value,
    })
  }

  exports.setCurrentContext = setCurrentContext
  exports.setCurrentRecord = setCurrentRecord
  exports.salesAmtChanged = salesAmtChanged
  exports.taxAmtChanged = taxAmtChanged
  exports.documentTypeChanged = documentTypeChanged
  exports.consolidationMarkChanged = consolidationMarkChanged
  exports.taxTypeChanged = taxTypeChanged
  return exports
})
