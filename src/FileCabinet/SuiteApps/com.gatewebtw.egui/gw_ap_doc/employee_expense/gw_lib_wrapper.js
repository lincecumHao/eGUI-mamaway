define(['../application/moment-with-locales'], function (moment) {
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

  function logWrapper(func) {
    return function () {
      var startTime = new Date()
      var funcNameTitle = '[' + func.name + ']'
      log.audit({ title: funcNameTitle + ' start', details: arguments })
      var result = func.apply(this, arguments)
      var endTime = new Date()
      var timeDiff = endTime - startTime //in ms
      log.audit({
        title: funcNameTitle + ' total execution time (ms)',
        details: timeDiff,
      })
      log.audit({ title: funcNameTitle + ' end, result', details: result })
      return result
    }
  }

  exports.logWrapper = logWrapper
  return exports
})
