define(['../vo/gw_ap_doc_fields'], function(apDocFields) {
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
        apDocFields.source,
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
    Object.keys(apDocFields).forEach(function(fieldName) {
      var fieldObj = apDocFields[fieldName]
      var field = currentRecord.getField({
        fieldId: fieldObj.id,
      })
      if (field) {
        field.isDisabled = false
        field.isMandatory = fieldObj.id === apDocFields.docType.id
      }
    })
  }

  function displayFieldsWrapper(func) {
    return function(docTypeCode) {
      resetAllFields()
      return func.call(this, docTypeCode)
    }
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
  function initDisplay(docTypeCode) {
    console.log('params', docTypeCode)
    var formDisplaySetting = formDisplaySettings[docTypeCode]
    if (formDisplaySetting) {
      var mandatoryFields = formDisplaySettings[docTypeCode].mandatoryFields
      var disabledFields = formDisplaySettings[docTypeCode].disabledFields
      // TODO restore for integration testing
      mandatoryFields.forEach(function(fieldObj) {
        var field = currentRecord.getField({
          fieldId: fieldObj.id,
        })
        field.isMandatory = true
      })
      disabledFields.forEach(function(fieldObj) {
        var field = currentRecord.getField({
          fieldId: fieldObj.id,
        })
        field.isDisabled = true
        // If default is disabled, meaning can't have value, then reset value to ''
        currentRecord.setValue({
          fieldId: fieldObj.id,
          value: '',
        })
      })
    }
  }

  function displayFields(formCode) {
    console.log('form code', formCode)
    var formDisplayFunc = displayFieldsWrapper(initDisplay)
    try {
      formDisplayFunc(formCode)
    } catch (e) {
      throw e
    }
  }

  function toggleFieldEnabled(fieldId, enabled) {
    var field = currentRecord.getField({
      fieldId: fieldId,
    })
    field.isDisabled = !enabled
  }

  exports.resetAllFields = resetAllFields
  exports.displayFields = displayFields
  exports.toggleFieldEnabled = toggleFieldEnabled
  exports.setCurrentContext = setCurrentContext
  return exports
})
