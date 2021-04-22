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

  function isLengthValid(value, docType) {}

  function isFormatValid(value, docType) {}

  function isSimilarToEguiNumberFormat(value) {
    var eguiFormat = /^([A-Z]{0,2})([0-9]{8})$/
    return eguiFormat.test(value)
  }

  exports.isLengthValid = isLengthValid
  exports.isFormatValid = isFormatValid
  return exports
})
