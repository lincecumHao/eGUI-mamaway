define([
  './moment-with-locales',
  'N/record',
  './gw_lib_search',
  './gw_lib_wrapper',
], function (moment, record, GwSearch, wrapperLib) {
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
  var applyPeriodRecordTypeId = 'customrecord_gw_apply_period_options'
  var applyPeriodNsRecord = null
  // var applyPeriods = []
  var allOptions = []

  function constructorWrapper(func) {
    return function () {
      if (allOptions.length === 0) {
        log.debug({ title: 'apply period constructor wrapper get all options' })
        getAllOptions()
      }
      var result = func.apply(this, arguments)
      return result
    }
  }

  function getOptionById(id) {
    var option = allOptions.filter(function (option) {
      return parseInt(option.id) === parseInt(id)
    })[0]
    return option
  }

  function getOptionByValue(value) {
    var option = allOptions.filter(function (option) {
      return option.value.toString() === value.toString()
    })[0]
    return option
  }

  function convertToApplyPeriod(dateTimeValue) {
    var currentDate = dateTimeValue ? moment(dateTimeValue) : moment()
    var currentYear = currentDate.year()
    var currentMonth = currentDate.month() + 1
    var currentDay = currentDate.date()
    var applyYear = currentYear - 1911
    var applyMonth =
      currentMonth % 2 === 0
        ? currentMonth
        : currentDay <= 15
        ? currentMonth - 1
        : currentMonth + 1
    if (applyMonth === 0) {
      applyMonth = applyMonth + 12
      applyYear = applyYear - 1
    }
    return applyYear.toString() + ('0' + applyMonth.toString()).slice(-2)
  }

  function convertGuiPeriod(dateTimeValue) {
    var currentDate = dateTimeValue ? moment(dateTimeValue) : moment()
    var currentYear = currentDate.year()
    var currentMonth = currentDate.month() + 1
    var applyYear = currentYear - 1911
    var applyMonth = currentMonth % 2 === 0 ? currentMonth : currentMonth + 1
    return applyYear.toString() + ('0' + applyMonth.toString()).slice(-2)
  }

  function getAllOptions() {
    var columns = [
      'custrecord_gw_apply_period_value',
      'custrecord_gw_apply_period_text',
      'custrecord_gw_apply_period_year',
      'custrecord_gw_apply_period_month',
    ]
    var result = GwSearch.search(applyPeriodRecordTypeId, columns)
    allOptions = result.map(function (recordObj) {
      return {
        id: recordObj.id,
        value: recordObj['custrecord_gw_apply_period_value'],
        text: recordObj['custrecord_gw_apply_period_text'],
        year: parseInt(recordObj['custrecord_gw_apply_period_year']),
        month: parseInt(recordObj['custrecord_gw_apply_period_month']),
      }
    })
  }

  function getApplyPeriodById(id) {
    return getOptionById(id)
  }

  function getNsRecord(id) {
    if (
      applyPeriodNsRecord &&
      parseInt(applyPeriodNsRecord.id) === parseInt(id)
    ) {
      return applyPeriodNsRecord
    }
    applyPeriodNsRecord = record.load({
      type: applyPeriodRecordTypeId,
      id: id,
      isDynamic: false,
    })
    return applyPeriodNsRecord
  }

  function getApplyPeriodByValue(value) {
    return getOptionByValue(value)
  }

  function getNsRecordByValue(value) {
    var result = allOptions.filter(function (applyPeriodObj) {
      return applyPeriodObj.value.toString().trim() === value.toString().trim()
    })[0]
    return getNsRecord(result.id)
  }

  exports.getRecord = constructorWrapper(getApplyPeriodById)
  exports.getNsRecord = getNsRecord
  exports.getRecordByValue = constructorWrapper(getApplyPeriodByValue)
  exports.getNsRecordByValue = constructorWrapper(getNsRecordByValue)
  exports.convertToApplyPeriod = convertToApplyPeriod
  exports.convertGuiPeriod = convertGuiPeriod
  return exports
})
