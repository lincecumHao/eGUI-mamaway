define(['./gw_lib_error_messages'], function (GwError) {
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

  function isLengthValid(value) {
    return value.toString().length === 1
  }

  function isDataTypeValid(value) {
    return typeof value === 'number'
  }

  function isValueValid(value, taxType) {
    switch (taxType) {
      case 1:
        return value >= 1 && value <= 4
      case 2:
      case 3:
        return value === 3 || value === 4
      default:
        throw new Error(GwError.TaxTypeError.message)
    }
  }

  exports.isLengthValid = isLengthValid
  exports.isDataTypeValid = isDataTypeValid
  exports.isValueValid = isValueValid

  return exports
})
