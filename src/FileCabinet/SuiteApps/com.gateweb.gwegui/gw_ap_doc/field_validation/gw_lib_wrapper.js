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
   * @NModuleScope XXX

   */
  var exports = {}

  function validationResultWrapper(func) {
    return function () {
      var result = {
        success: true,
        error: {},
      }
      var isValid = func.apply(this, arguments)
      result.success = isValid
      if (!isValid) {
        result.error = {
          message: 'Validation Error',
        }
      }
      return result
    }
  }

  exports.validationResultWrapper = validationResultWrapper
  return exports
})
