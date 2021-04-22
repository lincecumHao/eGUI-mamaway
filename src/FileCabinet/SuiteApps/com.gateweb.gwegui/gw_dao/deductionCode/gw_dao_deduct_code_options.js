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
  var deductionCodeRecordTypeId = 'customrecord_gw_deduct_option'
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
      'custrecord_gw_deduct_value',
      'custrecord_gw_deduct_text',
      'custrecord_gw_deduct_csv_value',
    ]
    var result = GwSearch.runSearch(deductionCodeRecordTypeId, columns)
    allOptions = result.map(function (recordObj) {
      return {
        id: recordObj.id,
        value: recordObj['custrecord_gw_deduct_value'],
        text: recordObj['custrecord_gw_deduct_text'],
        csvValue: recordObj['custrecord_gw_deduct_csv_value'],
      }
    })
    return allOptions
  }

  function getDeductionCodeByCsvValue(csvValue) {
    if (!csvValue) {
      return getOptionById(1)
    }
    return allOptions.filter(function (option) {
      var csvAcceptableValues = option.csvValue.split(',')
      return csvAcceptableValues.indexOf(csvValue) > -1
    })[0]
  }

  exports.getDeductionCodeById = constructorWrapper(getOptionById)
  exports.getAllDeductionCodeOptions = getAllOptions
  exports.getDeductionCodeByValue = constructorWrapper(getOptionByValue)
  exports.getDeductionCodeByCsvValue = constructorWrapper(
    getDeductionCodeByCsvValue
  )
  return exports
})
