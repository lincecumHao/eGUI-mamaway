define([
  '../../library/gw_lib_search',
  './gw_tax_calc_method_fields',
], function (searchLib, fieldConfig) {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2021 Gateweb
   * @author Sean Lin <sean.hyl@gmail.com>
   *
   * @NApiVersion 2.0
   * @NModuleScope Public

   */
  var exports = {}
  var recordTypeId = 'customrecord_gw_tax_calc_method_option'
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

  function getOptionByText(text) {
    return allOptions.filter(function (option) {
      return option.text.toString() === text.toString()
    })[0]
  }

  function getAllOptions() {
    var columns = fieldConfig.allFieldIds
    var searchColumns = JSON.parse(JSON.stringify(columns))
    var result = searchLib.runSearch(recordTypeId, searchColumns)
    allOptions = result.map(function (recordObj) {
      var optionObject = {}
      columns.forEach(function (columnId) {
        var attribute = fieldConfig.fieldOutputMapping[columnId]
        optionObject[attribute] = recordObj[columnId]
      })
      optionObject.id = recordObj.id
      return optionObject
    })
    return allOptions
  }

  exports.getById = constructorWrapper(getOptionById)
  exports.getByValue = constructorWrapper(getOptionByValue)
  exports.getByText = constructorWrapper(getOptionByText)

  return exports
})
