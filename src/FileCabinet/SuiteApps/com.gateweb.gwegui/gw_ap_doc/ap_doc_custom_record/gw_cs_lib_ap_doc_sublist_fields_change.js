define([
  '../vo/gw_ap_doc_fields',
  '../application/gw_service_ap_doc_type_options',
  './gw_cs_ap_form_display',
  '../application/gw_service_ap_doc_consolidate_mark_options',
], function (
  ApDocFields,
  ApDocTypeService,
  formDisplay,
  ApDocConsolidateMarkService
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
  var totalAmt = 0
  var currentFormValue = {}

  /**
   * <code>fieldChanged</code> event handler
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
   * @function fieldChanged
   */
  function SalesAmtChanged(context) {
    var value = getCurrencyValue(context.currentRecord, context.fieldId)
    var taxAmt = getCurrencyValue(
      context.currentRecord,
      ApDocFields.fields.taxAmt.id
    )
    totalAmt = value + taxAmt
    setTotalAmt(context.currentRecord)
  }

  /**
   * <code>TaxAmtChanged</code> event handler
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
   * @function TaxAmtChanged
   */
  function TaxAmtChanged(context) {
    var value = getCurrencyValue(context.currentRecord, context.fieldId)
    var salesAmt = getCurrencyValue(
      context.currentRecord,
      ApDocFields.fields.salesAmt.id
    )
    totalAmt = value + salesAmt
    setTotalAmt(context.currentRecord)
  }

  function getCurrencyValue(currentRecord, fieldId) {
    var value =
      parseFloat(
        currentRecord.getValue({
          fieldId: fieldId,
        })
      ) || 0
    return value
  }

  function setTotalAmt(currentRecord) {
    currentRecord.setValue({
      fieldId: ApDocFields.fields.totalAmt.id,
      value: totalAmt,
    })
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
  function DocumentTypeChanged(context) {
    var currentRecord = context.currentRecord
    var docTypeFieldId = ApDocFields.fields.docType.id
    var selectedDocTypeId = currentRecord.getValue({
      fieldId: docTypeFieldId,
    })
    if (!selectedDocTypeId || selectedDocTypeId === '') {
      console.log('null value')
      return
    }
    var docTypeCode = ApDocTypeService.getDocTypeCodeByRecordId(
      selectedDocTypeId
    )
    console.log('docTypeCode', docTypeCode)
    console.log('currentRecord', currentRecord)
    formDisplay.displayFormFields(docTypeCode, currentRecord)
    currentFormValue[ApDocFields.fields.docType.id] = docTypeCode
    if (parseInt(docTypeCode) === 26 || parseInt(docTypeCode) === 27) {
      setConsolidateMarkToA(currentRecord)
    }
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
  function ConsolidationMarkChanged(context) {
    console.log(
      'ConsolidationMarkChanged context.currentRecord',
      context.currentRecord
    )
    var value = context.currentRecord.getValue({
      fieldId: context.fieldId,
    })
    var consolMark = ApDocConsolidateMarkService.getConsolidateMarkValueByRecordId(
      value
    )
    console.log('ConsolidationMarkChanged consolMark', consolMark)
    var docType = currentFormValue[ApDocFields.fields.docType.id]
    console.log('ConsolidationMarkChanged docType', docType)
    if (consolMark === 'A' && parseInt(docType) === 22) {
      var commonNumField = context.currentRecord.getField({
        fieldId: ApDocFields.fields.commonNumber.id,
      })
      commonNumField.isMandatory = true
    }
  }

  function setConsolidateMarkToA(currentRecord) {
    var consolidateMarkId = ApDocConsolidateMarkService.getConsolidateMarkRecordIdByValue(
      'A'
    )
    currentRecord.setValue({
      fieldId: ApDocFields.fields.consolidationMark.id,
      value: consolidateMarkId,
    })
    var consolidateMarkField = currentRecord.getField({
      fieldId: ApDocFields.fields.consolidationMark.id,
    })
    consolidateMarkField.isDisabled = true
  }

  exports.SalesAmtChanged = SalesAmtChanged
  exports.TaxAmtChanged = TaxAmtChanged
  exports.DocumentTypeChanged = DocumentTypeChanged
  exports.ConsolidationMarkChanged = ConsolidationMarkChanged
  return exports
})
