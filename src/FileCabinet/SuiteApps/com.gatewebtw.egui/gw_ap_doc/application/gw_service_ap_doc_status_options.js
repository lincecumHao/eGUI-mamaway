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
  var apDocStatusRecordTypeId = 'customrecord_gw_ap_doc_status_option'

  var allOptions = []

  function constructorWrapper(func) {
    return function () {
      if (allOptions.length === 0) {
        log.debug({ title: 'doc status constructor wrapper get all options' })
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
    console.log('getOptionByValue, allOptions', allOptions)
    console.log('getOptionByValue, option', option)
    return option
  }

  function getAllOptions() {
    var columns = [
      'custrecord_gw_ap_doc_status_value',
      'custrecord_gw_ap_doc_status_text',
      'custrecord_gw_ap_doc_status_csv_value',
    ]
    var result = GwSearch.search(apDocStatusRecordTypeId, columns)
    allOptions = result.map(function (recordObj) {
      return {
        id: recordObj.id,
        value: recordObj['custrecord_gw_ap_doc_status_value'],
        text: recordObj['custrecord_gw_ap_doc_status_text'],
        csvValue: recordObj['custrecord_gw_ap_doc_status_csv_value'],
      }
    })
    return allOptions
  }

  function getStatusByRecordId(id) {
    var option = getOptionById(id)
    return option ? option.value : ''
  }

  function getStatusByValue(value) {
    var option = getOptionByValue(value)
    console.log('option', option)
    return option ? parseInt(option.id) : 0
  }

  function getStatusIdByCsvValue(csvValue) {
    var result = allOptions.filter(function (option) {
      // log.debug({ title: 'getStatusIdByCsvValue option', details: option })
      var csvAcceptableValues = option.csvValue.split(',')
      return csvAcceptableValues.indexOf(csvValue) > -1
    })[0]
    if (result) {
      return result.id
    }
    return 0
  }

  exports.getStatusByRecordId = constructorWrapper(getStatusByRecordId)
  exports.getAllStatus = getAllOptions
  exports.getStatusByValue = constructorWrapper(getStatusByValue)
  exports.getStatusIdByCsvValue = constructorWrapper(getStatusIdByCsvValue)

  return exports
})
