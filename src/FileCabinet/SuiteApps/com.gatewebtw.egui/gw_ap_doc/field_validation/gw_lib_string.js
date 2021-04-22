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

  function isNullOrEmpty(input) {
    if (typeof input === 'undefined' || input == null) return true
    return input.replace(/\s/g, '').length < 1
  }

  exports.isNullOrEmpty = isNullOrEmpty
  return exports
})
