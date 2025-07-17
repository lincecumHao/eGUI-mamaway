define(['./gw_lib_error_messages'], function (GwError) {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2020 Gateweb
   * @author Sean Lin <seanlin816@gmail.com>
   *
   * @NApiVersion 2.1
   * @NModuleScope Public

   */
  var exports = {}

  function isLengthValid(value) {
    return value.toString().length <= 10
  }

  function validateTaxableValue() {
    // tax type : 1
  }

  function validateTaxExemptValue() {
    // tax type : 1
  }

  function validateTaxFreeValue() {
    // tax type : 1
  }

  function validateMixTaxValue() {
    // tax type : 1
  }

  function isValueValid(value, taxType) {
    var valid = true
    switch (taxType) {
      case 1:
        return value > 0
      case 2:
      case 3:
        return parseInt(value) === 0
      default:
        return valid
    }
  }

  function isTaxAmtOver500(taxType, docType, value) {
    return value <= 500
  }

  function isTaxAmtInRange(salesAmt, taxAmt) {
    return Math.abs(taxAmt - getRegularTaxAmt(salesAmt)) <= 5
  }

  function getRegularTaxAmt(salesAmt) {
    return Math.round((salesAmt * 5) / 100)
  }

  function isTaxTotalValid(value, quantity) {
    const oneQuantityTax = 500;
    const maxTax = oneQuantityTax * parseInt(quantity);

    return parseInt(value) <= maxTax
  }

  exports.isLengthValid = isLengthValid
  exports.isValueValid = isValueValid
  exports.isTaxAmtOver500 = isTaxAmtOver500
  exports.isTaxAmtInAccetableRange = isTaxAmtInRange
  exports.isTaxTotalValid = isTaxTotalValid
  return exports
})
