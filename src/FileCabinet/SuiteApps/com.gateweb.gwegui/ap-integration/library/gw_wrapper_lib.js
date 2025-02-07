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
      const funcNameTitle = '[' + func.name +']';
      const startTime = new Date();
      const remainingUsageOnStart = runtime.getCurrentScript().getRemainingUsage();
      log.audit({ title: funcNameTitle + ' start, params', details: arguments })
      const result = func.apply(this, arguments);
      const remainingUsageOnEnd = runtime.getCurrentScript().getRemainingUsage();
      const endTime = new Date();
      const timeDiff = endTime - startTime; //in ms
      const usage = remainingUsageOnStart - remainingUsageOnEnd
      log.audit({ title: funcNameTitle + ' end, result', details: result })
      log.audit({
        title: funcNameTitle + ' total execution time (ms)',
        details: timeDiff,
      })
      log.audit({
        title: funcNameTitle + ' total usage',
        details: usage,
      })
      return result
    }
  }

  exports.logWrapper = logWrapper
  return exports
})
