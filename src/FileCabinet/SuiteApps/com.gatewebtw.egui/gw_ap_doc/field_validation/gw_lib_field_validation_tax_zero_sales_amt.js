define([], function () {
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

  function isValueValid(value, taxType) {
    switch (taxType) {
      case 1:
      case 3:
        return parseFloat(value) === 0
      case 2:
      case 4:
        return parseFloat(value) > 0
      default:
        return true
    }
  }

  exports.isLengthValid = isLengthValid
  exports.isValueValid = isValueValid
  return exports
})
