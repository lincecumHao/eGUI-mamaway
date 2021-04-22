define(['N/record', './gw_lib_search', './gw_lib_wrapper'], function (
  record,
  GwSearch,
  wrapperLib
) {
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
  var apDocCurrencyRecordTypeId = 'customrecord_gw_ap_doc_currency_option'
  // var apDocCurrencyOptions = null
  var allOptions = []

  function constructorWrapper(func) {
    return function () {
      if (allOptions.length === 0) {
        log.debug({ title: 'currency constructor wrapper get all options' })
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

  function getAllOptions() {
    var columns = [
      'custrecord_gw_ap_doc_currency_value',
      'custrecord_gw_ap_doc_currency_text',
    ]
    var result = GwSearch.search(apDocCurrencyRecordTypeId, columns)
    allOptions = result.map(function (recordObj) {
      return {
        id: recordObj.id,
        value: recordObj['custrecord_gw_ap_doc_currency_value'],
        text: recordObj['custrecord_gw_ap_doc_currency_text'],
      }
    })
    return allOptions
  }

  function getCurrencyValueByRecordId(id) {
    var result = getOptionById(id)
    return result ? result.value : ''
  }

  function getCurrencyRecordIdByValue(value) {
    var option = getOptionByValue(value)
    if (option) {
      return option.id
    }
    return 0
  }

  exports.getCurrencyValueByRecordId = constructorWrapper(
    getCurrencyValueByRecordId
  )
  exports.getAllCurrency = getAllOptions
  exports.getCurrencyRecordIdByValue = constructorWrapper(
    getCurrencyRecordIdByValue
  )
  return exports
})
