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
  var apDocDeductionCodeRecordTypeId = 'customrecord_gw_ap_doc_deduct_option'
  var allOptions = []

  function constructorWrapper(func) {
    return function () {
      if (allOptions.length === 0) {
        log.debug({
          title: 'deduction code constructor wrapper get all options',
        })
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
      'custrecord_gw_ap_doc_deduct_value',
      'custrecord_gw_ap_doc_deduct_text',
      'custrecord_gw_ap_doc_deduct_csv_value',
    ]
    var result = GwSearch.search(apDocDeductionCodeRecordTypeId, columns)
    allOptions = result.map(function (recordObj) {
      return {
        id: recordObj.id,
        value: recordObj['custrecord_gw_ap_doc_deduct_value'],
        text: recordObj['custrecord_gw_ap_doc_deduct_text'],
        csvValue: recordObj['custrecord_gw_ap_doc_deduct_csv_value'],
      }
    })
    return allOptions
  }

  function getDeductionCodeValueByRecordId(id) {
    var option = getOptionById(id)
    return option ? option.value : ''
  }

  function getDeductionCodeRecordIdByValue(value) {
    var option = getOptionByValue(value)
    return option ? parseInt(option.id) : 0
  }

  function getDeductionCodeRecordIdByCsvValue(csvValue) {
    // var allOptions = getAllDeductionCodeOptions()
    if (csvValue) {
      var deductionCodeOption = allOptions.filter(function (option) {
        var csvAcceptableValues = option.csvValue.split(',')
        return csvAcceptableValues.indexOf(csvValue) > -1
        // return option.csvValue === csvValue
      })[0]
      if (deductionCodeOption) {
        return parseInt(deductionCodeOption.id)
      }
    }
    return 1
  }

  exports.getDeductionCodeValueByRecordId = constructorWrapper(
    getDeductionCodeValueByRecordId
  )
  exports.getAllDeductionCodeOptions = getAllOptions
  exports.getDeductionCodeRecordIdByValue = constructorWrapper(
    getDeductionCodeRecordIdByValue
  )
  exports.getDeductionCodeRecordIdByCsvValue = constructorWrapper(
    getDeductionCodeRecordIdByCsvValue
  )
  return exports
})
