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
  var twYearMonthExpression = /^(\d{2,3})([0][1-9]|[1][0-2])$/
  var westYearMonthExpression = /^(\d{4})([0][1-9]|[1][0-2])$/
  var isLenthValidWithResult = resultWrapper(isLengthValid)

  function isLengthValid(value) {
    return value.toString().length === 6 || value.toString().length === 5
  }

  function parseApplyPeriod(value) {
    var applyPeriod = { year: 0, month: 0 }
    var matchResult = []
    if (value.length === 5) {
      matchResult = twYearMonthExpression.exec(value)
      applyPeriod.year = parseInt(matchResult[1])
      applyPeriod.month = parseInt(matchResult[2])
    } else {
      matchResult = westYearMonthExpression.exec(value)
      applyPeriod.year = parseInt(matchResult[1]) - 1911
      applyPeriod.month = parseInt(matchResult[2])
    }
    return applyPeriod
  }

  function isFormatValid(value) {
    return (
      twYearMonthExpression.test(value) || westYearMonthExpression.test(value)
    )
  }

  function isValueValid(value) {
    // TODO
  }

  function convertToApplyPeriod(dateTimeValue) {
    var currentDate = dateTimeValue ? moment(dateTimeValue) : moment()
    var currentYear = currentDate.year()
    var currentMonth = currentDate.month() + 1
    var currentDay = currentDate.date()
    console.log('convertToApplyPeriod currentYear', currentYear)
    console.log('convertToApplyPeriod currentMonth', currentMonth)
    console.log('convertToApplyPeriod currentDay', currentDay)
    var applyYear = currentYear - 1911
    console.log('apply year', applyYear)
    var applyMonth =
      currentMonth % 2 === 0
        ? currentMonth
        : currentDay <= 15
        ? currentMonth - 1
        : currentMonth + 1
    console.log('apply month', applyMonth)
    if (applyMonth === 0) {
      applyMonth = applyMonth + 12
      applyYear = applyYear - 1
    }
    return applyYear.toString() + ('0' + applyMonth.toString()).slice(-2)
  }

  function resultWrapper(func) {
    return function () {
      var result = {
        success: true,
        error: {},
      }
      try {
        var isValid = func.apply(this, arguments)
      } catch (e) {
        result.success = false
        result.error = e
      } finally {
        return result
      }
    }
  }

  exports.isLengthValid = isLengthValid
  exports.isFormatValid = isFormatValid
  exports.isValueValid = isValueValid
  exports.parseApplyPeriod = parseApplyPeriod
  exports.convertToApplyPeriod = convertToApplyPeriod
  return exports
})
