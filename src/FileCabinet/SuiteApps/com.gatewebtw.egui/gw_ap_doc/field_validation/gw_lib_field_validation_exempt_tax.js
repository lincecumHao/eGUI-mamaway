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
    return value.toString().length <= 12
  }

  function isTypeValid(value) {
    var acceptTypes = ['float', 'int']
  }

  function isValueValid(value, taxType) {
    switch (taxType) {
      case 1:
      case 2:
        return parseFloat(value) === 0
      case 3:
      case 4:
        return parseFloat(value) > 0
      default:
        throw new Error(GwError.TaxTypeError.message)
    }
  }

  exports.isValueValid = isValueValid
  return exports
})
