define(['../../library/gw_lib_search'], function (GwSearch) {
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
  var customClearanceMarkRecordTypeId = 'customrecord_gw_clearance_mark_options'
  var allOptions = []

  function constructorWrapper(func) {
    return function () {
      if (allOptions.length === 0) {
        getAllOptions()
      }
      return func.apply(this, arguments)
    }
  }

  function getOptionById(id) {
    return allOptions.filter(function (option) {
      return parseInt(option.id) === parseInt(id)
    })[0]
  }

  function getOptionByValue(value) {
    return allOptions.filter(function (option) {
      return option.value.toString() === value.toString()
    })[0]
  }

  function getAllOptions() {
    var columns = [
      'custrecord_gw_clearance_value',
      'custrecord_gw_clearance_text',
    ]
    var result = GwSearch.runSearch(customClearanceMarkRecordTypeId, columns)
    allOptions = result.map(function (recordObj) {
      return {
        id: recordObj.id,
        value: recordObj['custrecord_gw_clearance_value'],
        text: recordObj['custrecord_gw_clearance_text'],
      }
    })
    return allOptions
  }

  exports.getCustomClearanceMarkById = constructorWrapper(getOptionById)
  exports.getAllCustomClearanceMark = getAllOptions
  exports.getCustomClearanceMarkByValue = constructorWrapper(getOptionByValue)
  return exports
})
