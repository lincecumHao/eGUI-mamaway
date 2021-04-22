define(['./moment-with-locales', './gw_string_util'], (moment, stringUtil) => {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2020 Gateweb
   * @author Sean <seanlin816@gmail.com>
   *
   * @NApiVersion 2.1
   * @NModuleScope Public

   */
  let exports = {}

  function toTwYear(year) {
    return year - 1911
  }

  function getApplyPeriodText(year, month) {
    return `${toTwYear(year)}${stringUtil.padding(month, 2)}`
  }

  function getCurrentApplyPeriod() {
    return getApplyPeriodText(moment().year(), moment().month() + 1)
  }

  function getApplyPeriodList() {
    const applyPeriodKeys = generateApplyPeriodList(
      moment().year(),
      moment().month() + 1
    )

    const applyPeriods = {}
    applyPeriodKeys.forEach((key) => {
      applyPeriods[key] = {}
      applyPeriods[key].name = key
      applyPeriods[key].code = key
      applyPeriods[key].label = key
    })
    return applyPeriods
  }

  function generateApplyPeriodList(year, month) {
    var applyPeriods = []
    for (var i = -2; i <= 2; i++) {
      let outputYear = year
      let outputMonth = month + i
      if (month + i <= 0) {
        outputYear--
        outputMonth += 12
      }
      var key = getApplyPeriodText(outputYear, outputMonth)
      applyPeriods.push(key)
    }
    return applyPeriods
  }

  exports.toTwYear = toTwYear
  exports.getApplyPeriod = getApplyPeriodList
  exports.generateApplyPeriod = generateApplyPeriodList
  exports.getCurrentApplyPeriod = getCurrentApplyPeriod
  exports.getApplyPeriodText = getApplyPeriodText
  exports.CurrentApplyPeriod = getApplyPeriodText(
    moment().year(),
    moment().month() + 1
  )
  return exports
})
