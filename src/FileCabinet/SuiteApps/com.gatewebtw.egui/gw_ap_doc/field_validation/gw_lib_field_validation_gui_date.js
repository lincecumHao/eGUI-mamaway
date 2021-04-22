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
  var guiDateExpression = /^(\d{4})-?(\d{2})-?(\d{2})$/gm

  function isFormatValid(value) {
    return guiDateExpression.test(value)
  }

  function isValueValid(value) {}

  exports.isFormatValid = isFormatValid
  exports.isValueValid = isValueValid

  return exports
})
