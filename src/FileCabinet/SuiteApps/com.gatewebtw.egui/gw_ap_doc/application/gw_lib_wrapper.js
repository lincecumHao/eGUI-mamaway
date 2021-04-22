define(['./moment-with-locales', 'N/runtime'], function (moment, runtime) {
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
      var remainingUsageOnStart = runtime.getCurrentScript().getRemainingUsage()
      log.audit({ title: funcNameTitle + ' start', details: arguments })
      var result = func.apply(this, arguments)
      var endTime = new Date()
      var timeDiff = endTime - startTime //in ms
      var remainingUsageOnEnd = runtime.getCurrentScript().getRemainingUsage()
      log.audit({
        title: funcNameTitle + ' total execution time (ms)',
        details: timeDiff,
      })
      log.audit({
        title: funcNameTitle + ' total usage',
        details: remainingUsageOnStart - remainingUsageOnEnd,
      })
      log.audit({ title: funcNameTitle + ' end, result', details: result })
      return result
    }
  }

  function clientLogWrapper(func) {
    return function () {
      console.log(func.name + ' start, parameters', arguments)
      var result = func.apply(this, arguments)
      console.log(func.name + ' end, result', result)
      return result
    }
  }

  exports.logWrapper = logWrapper
  exports.clientLogWrapper = clientLogWrapper
  return exports
})
