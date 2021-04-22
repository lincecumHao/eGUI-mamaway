define(['../vo/gw_ap_doc_fields'], function (apDocFields) {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2020 Gateweb
   * @author Sean Lin <seanlin816>
   *
   * @NApiVersion 2.0
   * @NModuleScope XXX

   */
  var exports = {}
  var getCurrencySublistFieldValue = floatWrapper(getSublistValue)
  var getNumberSublistFieldValue = integerWrapper(getSublistValue)
  var currentRecordObj = {}

  function validateDoc21(recordObj) {
    var docType = 21
    currentRecordObj = recordObj
    var taxType = getNumberSublistFieldValue(apDocFields.fields.taxType.id)
    var salesAmt = getNumberSublistFieldValue(apDocFields.fields.salesAmt.id)
    var taxAmt = getNumberSublistFieldValue(apDocFields.fields.taxAmt.id)
  }

  function validateDoc22(recordObj) {}

  // Common Functions
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

  function getSublistValue(fieldId) {
    return currentRecordObj[fieldId]
  }

  exports.validateDoc21 = validateDoc21
  exports.validateDoc22 = validateDoc22
  return exports
})
