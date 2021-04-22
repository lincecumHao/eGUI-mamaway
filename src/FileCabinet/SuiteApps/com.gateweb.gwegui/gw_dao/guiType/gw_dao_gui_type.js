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
  var guiTypeRecordTypeId = 'customrecord_gw_gui_book_type'
  var columnObj = {
    custrecord_gw_gbt_value: 'custrecord_gw_gbt_value',
    custrecord_gw_gbt_text: 'custrecord_gw_gbt_text',
  }
  var columns = Object.keys(columnObj).map(function (key) {
    return key
  })
  var columnMap = {
    custrecord_gw_gbt_value: 'value',
    custrecord_gw_gbt_text: 'text',
  }
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
    var searchColumns = JSON.parse(JSON.stringify(columns))
    var result = GwSearch.runSearch(guiTypeRecordTypeId, searchColumns)
    allOptions = result.map(function (recordObj) {
      var optionObject = {}
      columns.forEach(function (columnId) {
        var attribute = columnMap[columnId]
        optionObject[attribute] = recordObj[columnId]
      })
      optionObject.id = recordObj.id
      return optionObject
    })
    return allOptions
  }

  exports.getGuiTypeById = constructorWrapper(getOptionById)
  exports.getGuiTypeByValue = constructorWrapper(getOptionByValue)
  return exports
})
