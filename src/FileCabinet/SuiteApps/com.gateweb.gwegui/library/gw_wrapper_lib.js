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

  function performanceMeterWrapper(func) {
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
      return result
    }
  }

  function usageMeterWrapper(func) {
    return function () {
      var funcNameTitle = '[' + func.name + ']'
      var remainingUsageOnStart = runtime.getCurrentScript().getRemainingUsage()
      log.audit({
        title: funcNameTitle + ' start, currentUsage',
        details: remainingUsageOnStart,
      })
      var result = func.apply(this, arguments)
      var remainingUsageOnEnd = runtime.getCurrentScript().getRemainingUsage()
      log.audit({
        title: funcNameTitle + ' total usage',
        details: remainingUsageOnStart - remainingUsageOnEnd,
      })
      return result
    }
  }

  function logWrapper(func) {
    return function () {
      var funcNameTitle = '[' + func.name + ']'
      log.audit({ title: funcNameTitle + ' start', details: arguments })
      var result = func.apply(this, arguments)
      log.audit({ title: funcNameTitle, details: result })
      return result
    }
  }

  function exceptionHandler(func) {
    try {
      var result = func.apply(this, arguments)
      return result
    } catch (err) {
      console.log(err)
    }
  }

  exports.logWrapper = logWrapper
  exports.performanceMeterWrapper = performanceMeterWrapper
  exports.usageMeterWrapper = usageMeterWrapper
  exports.exceptionHandler = exceptionHandler
  exports.defaultWrapper = usageMeterWrapper(
    performanceMeterWrapper(exceptionHandler)
  )
  return exports
})
