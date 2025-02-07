define(['../vo/gw_ap_doc_fields'], function (apDocFields) {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2020 Gateweb
   * @author Sean Lin <seanlin816@gmail.com>
   *
   * @NApiVersion 2.0
   * @NModuleScope Public

   */
  var exports = {}
  var currentRecord = null
  var currentContext = null
  var currentSublistIndex = 0
  var apDocFields = apDocFields.fields
  var apSublistId = 'recmachcustrecord_gw_apt_doc_tran_id'

  var formDisplaySettings = {
    21: {
      mandatoryFields: [
        apDocFields.guiNum,
        apDocFields.guiStatus,
        apDocFields.guiDate,
        apDocFields.buyerTaxId,
        apDocFields.buyerName,
        apDocFields.sellerTaxId,
        apDocFields.salesAmt,
        apDocFields.zeroTaxSalesAmt,
        apDocFields.taxExemptedSalesAmt,
        apDocFields.taxAmt,
        apDocFields.totalAmt,
        apDocFields.taxType,
        apDocFields.deductionCode,
        apDocFields.currency,
        apDocFields.applyPeriod,
      ],
      disabledFields: [
        apDocFields.commonNumber,
        apDocFields.consolidationMark,
        apDocFields.consolidationQty,
        apDocFields.customClearanceMark,
        apDocFields.zeroTaxMark,
        apDocFields.outputDate,
      ],
    },
    22: {
      mandatoryFields: [
        apDocFields.guiStatus,
        apDocFields.guiDate,
        apDocFields.buyerTaxId,
        apDocFields.buyerName,
        apDocFields.salesAmt,
        apDocFields.taxAmt,
        apDocFields.totalAmt,
        apDocFields.taxType,
        apDocFields.taxExemptedSalesAmt,
        apDocFields.zeroTaxSalesAmt,
        apDocFields.deductionCode,
        apDocFields.currency,
        apDocFields.applyPeriod,
      ],
      disabledFields: [
        apDocFields.customClearanceMark,
        apDocFields.zeroTaxMark,
        apDocFields.outputDate,
      ],
    },
    23: {
      mandatoryFields: [
        apDocFields.guiNum,
        apDocFields.guiStatus,
        apDocFields.guiDate,
        apDocFields.buyerTaxId,
        apDocFields.buyerName,
        apDocFields.sellerTaxId,
        apDocFields.sellerName,
        apDocFields.salesAmt,
        apDocFields.taxAmt,
        apDocFields.totalAmt,
        apDocFields.taxType,
        apDocFields.taxExemptedSalesAmt,
        apDocFields.zeroTaxSalesAmt,
        apDocFields.deductionCode,
        apDocFields.currency,
        apDocFields.applyPeriod,
      ],
      disabledFields: [
        apDocFields.commonNumber,
        apDocFields.consolidationMark,
        apDocFields.consolidationQty,
        apDocFields.customClearanceMark,
        apDocFields.zeroTaxMark,
        apDocFields.outputDate,
      ],
    },
    24: {
      mandatoryFields: [
        apDocFields.guiStatus,
        apDocFields.guiDate,
        apDocFields.buyerTaxId,
        apDocFields.buyerName,
        apDocFields.sellerTaxId,
        apDocFields.sellerName,
        apDocFields.salesAmt,
        apDocFields.taxAmt,
        apDocFields.totalAmt,
        apDocFields.taxType,
        apDocFields.taxExemptedSalesAmt,
        apDocFields.zeroTaxSalesAmt,
        apDocFields.deductionCode,
        apDocFields.currency,
        apDocFields.applyPeriod,
      ],
      disabledFields: [
        apDocFields.consolidationMark,
        apDocFields.consolidationQty,
        apDocFields.customClearanceMark,
        apDocFields.zeroTaxMark,
        apDocFields.outputDate,
      ],
    },
    25: {
      mandatoryFields: [
        apDocFields.guiStatus,
        apDocFields.guiDate,
        apDocFields.buyerTaxId,
        apDocFields.buyerName,
        apDocFields.salesAmt,
        apDocFields.taxAmt,
        apDocFields.totalAmt,
        apDocFields.taxType,
        apDocFields.taxExemptedSalesAmt,
        apDocFields.zeroTaxSalesAmt,
        apDocFields.deductionCode,
        apDocFields.currency,
        apDocFields.applyPeriod,
      ],
      disabledFields: [
        apDocFields.customClearanceMark,
        apDocFields.zeroTaxMark,
        apDocFields.outputDate,
      ],
    },
    26: {
      mandatoryFields: [
        apDocFields.guiNum,
        apDocFields.guiStatus,
        apDocFields.guiDate,
        apDocFields.buyerTaxId,
        apDocFields.buyerName,
        apDocFields.salesAmt,
        apDocFields.taxAmt,
        apDocFields.totalAmt,
        apDocFields.taxType,
        apDocFields.taxExemptedSalesAmt,
        apDocFields.zeroTaxSalesAmt,
        apDocFields.deductionCode,
        apDocFields.consolidationMark,
        apDocFields.consolidationQty,
        apDocFields.currency,
        apDocFields.applyPeriod,
      ],
      disabledFields: [
        apDocFields.commonNumber,
        apDocFields.customClearanceMark,
        apDocFields.zeroTaxMark,
        apDocFields.outputDate,
      ],
    },
    27: {
      mandatoryFields: [
        apDocFields.guiStatus,
        apDocFields.guiDate,
        apDocFields.buyerTaxId,
        apDocFields.buyerName,
        apDocFields.salesAmt,
        apDocFields.taxAmt,
        apDocFields.totalAmt,
        apDocFields.taxType,
        apDocFields.taxExemptedSalesAmt,
        apDocFields.zeroTaxSalesAmt,
        apDocFields.deductionCode,
        apDocFields.consolidationMark,
        apDocFields.consolidationQty,
        apDocFields.currency,
        apDocFields.applyPeriod,
      ],
      disabledFields: [
        apDocFields.customClearanceMark,
        apDocFields.zeroTaxMark,
        apDocFields.outputDate,
      ],
    },
    28: {
      mandatoryFields: [
        apDocFields.commonNumber,
        apDocFields.guiStatus,
        apDocFields.guiDate,
        apDocFields.buyerTaxId,
        apDocFields.buyerName,
        apDocFields.salesAmt,
        apDocFields.taxAmt,
        apDocFields.totalAmt,
        apDocFields.taxType,
        apDocFields.taxExemptedSalesAmt,
        apDocFields.zeroTaxSalesAmt,
        apDocFields.deductionCode,
        apDocFields.currency,
        apDocFields.applyPeriod,
      ],
      disabledFields: [
        apDocFields.guiNum,
        apDocFields.sellerTaxId,
        apDocFields.sellerName,
        apDocFields.consolidationMark,
        apDocFields.consolidationQty,
        apDocFields.customClearanceMark,
        apDocFields.zeroTaxMark,
        apDocFields.outputDate,
      ],
    },
    29: {
      mandatoryFields: [
        apDocFields.commonNumber,
        apDocFields.guiStatus,
        apDocFields.guiDate,
        apDocFields.buyerTaxId,
        apDocFields.buyerName,
        apDocFields.salesAmt,
        apDocFields.taxAmt,
        apDocFields.totalAmt,
        apDocFields.taxType,
        apDocFields.taxExemptedSalesAmt,
        apDocFields.zeroTaxSalesAmt,
        apDocFields.deductionCode,
        apDocFields.currency,
        apDocFields.applyPeriod,
      ],
      disabledFields: [
        apDocFields.guiNum,

        apDocFields.consolidationMark,
        apDocFields.consolidationQty,
        apDocFields.customClearanceMark,
        apDocFields.zeroTaxMark,
        apDocFields.outputDate,
      ],
    },
  }

  function setCurrentContext(inputContext) {
    currentContext = inputContext
    currentRecord = inputContext.currentRecord
  }

  function resetAllFields() {
    console.log('displayAllFields')
    var apDocSublist = currentRecord.getSublist({
      sublistId: apSublistId,
    })
    Object.keys(apDocFields).forEach(function (fieldName) {
      var fieldObj = apDocFields[fieldName]
      var column = apDocSublist.getColumn({
        fieldId: fieldObj.id,
      })
      if (column) {
        column.isDisabled = isColumnDisabled()
        column.isMandatory = fieldObj.id === apDocFields.docType.id
      }
    })
    // currentRecord.cancelLine({
    //   sublistId: apSublistId,
    // })
  }

  function displayFieldsWrapper(func) {
    return function (docTypeCode) {
      resetAllFields()
      return func.call(this, docTypeCode)
    }
  }

  function isColumnDisabled() {
    // return currentRecord.getValue('custbody_gw_gui_verified') || false
    return currentRecord.getValue('custbody_gw_lock_transaction') || false
  }

  /**
   * <code>display form fields</code> event handler
   *
   * @gov XXX
   *
   * @param currentRecord
   *    {record} The current record the user is manipulating in the UI
   * @return {void}
   *
   * @static
   * @function displayForm21
   */
  function initSublistDisplay(docTypeCode) {
    console.log('params', docTypeCode)
    var apDocSublist = currentRecord.getSublist({
      sublistId: apSublistId,
    })
    if (formDisplaySettings[docTypeCode]) {
      var mandatoryFields = formDisplaySettings[docTypeCode].mandatoryFields
      var disabledFields = formDisplaySettings[docTypeCode].disabledFields
      // TODO restore for integration testing
      mandatoryFields.forEach(function (fieldObj) {
        var column = apDocSublist.getColumn({
          fieldId: fieldObj.id,
        })
        column.isMandatory = true
      })
      disabledFields.forEach(function (fieldObj) {
        var column = apDocSublist.getColumn({
          fieldId: fieldObj.id,
        })
        column.isDisabled = true
        // If default is disabled, meaning can't have value, then reset value to ''
        currentRecord.setCurrentSublistValue({
          sublistId: apSublistId,
          fieldId: fieldObj.id,
          value: '',
        })
      })
    }
  }

  function clearDisabledFieldsContent(docTypeCode) {
    var disabledFields = formDisplaySettings[docTypeCode].disabledFields
    disabledFields.forEach(function (fieldObj) {
      currentRecord.setCurrentSublistValue({
        sublistId: apSublistId,
        fieldId: fieldObj.id,
        value: '',
      })
    })
  }

  function displaySublistFields(formCode) {
    console.log('form code', formCode)
    var formDisplayFunc = displayFieldsWrapper(initSublistDisplay)
    try {
      formDisplayFunc(formCode)
    } catch (e) {
      throw e
    }
  }

  function toggleFieldEnabled(fieldId, enabled) {
    var apDocSublist = currentRecord.getSublist({
      sublistId: apSublistId,
    })
    var column = apDocSublist.getColumn({
      fieldId: fieldId,
    })
    column.isDisabled = !enabled
  }

  function isFieldDisabled(fieldId, docTypeCode) {
    var docTypeDisabledFields = formDisplaySettings[docTypeCode].disabledFields
    var disabledFieldIds = docTypeDisabledFields.map(function (fieldObj) {
      return fieldObj.id
    })
    return disabledFieldIds.indexOf(fieldId) > -1
  }

  exports.resetAllFields = resetAllFields
  exports.displaySublistFields = displaySublistFields
  exports.toggleFieldEnabled = toggleFieldEnabled
  exports.setCurrentContext = setCurrentContext
  exports.isFieldDisabled = isFieldDisabled
  exports.clearDisabledFieldsContent = clearDisabledFieldsContent
  exports.formDisplaySettings = formDisplaySettings
  return exports
})
