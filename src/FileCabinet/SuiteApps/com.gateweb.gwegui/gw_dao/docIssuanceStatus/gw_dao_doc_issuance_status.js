define(['N/record', '../../library/gw_lib_search'], function (
  record,
  GwSearch
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
  var recordTypeId = 'customrecord_gw_ed_issuance_status'
  var columnObj = {
    name: 'name',
    custrecord_gw_edis_text: 'custrecord_gw_edis_text',
    custrecord_gw_edis_value: 'custrecord_gw_edis_value', // Get GUI Number for EGUI, Self Define for Allowance
    custrecord_gw_edis_code: 'custrecord_gw_edis_code',
  }
  var columns = Object.keys(columnObj).map(function (key) {
    return key
  })

  var columnMap = {
    name: 'name',
    custrecord_gw_edis_text: 'text',
    custrecord_gw_edis_value: 'value',
    custrecord_gw_edis_code: 'statusCode',
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

  function getAllOptions() {
    var searchColumns = JSON.parse(JSON.stringify(columns))
    var result = GwSearch.runSearch(recordTypeId, searchColumns)
    allOptions = result.map(function (recordObj) {
      return getSearchResultObj(recordObj)
    })
    return allOptions
  }

  function getSearchResultObj(recordObj) {
    var optionObject = {}
    columns.forEach(function (columnId) {
      var attribute = columnMap[columnId]
      optionObject[attribute] = recordObj[columnId]
    })
    optionObject.id = recordObj.id
    return optionObject
  }

  function getAllStatus() {
    return allOptions
  }

  function getOptionById(id) {
    return allOptions.filter(function (option) {
      return parseInt(option.id) === parseInt(id)
    })[0]
  }

  function getOptionByText(text) {
    return allOptions.filter(function (option) {
      return option.text === text
    })[0]
  }

  function getOptionByStatusCode(statusCode) {
    return allOptions.filter(function (option) {
      return option.statusCode === statusCode
    })[0]
  }

  function getOptionByName(name) {
    return allOptions.filter(function (option) {
      return option.name === name
    })[0]
  }
  function getOptionByValue(value) {
    return allOptions.filter(function (option) {
      return option.value.toString() === value.toString()
    })[0]
  }

  /* Status value rule
   - 2 digits
   - first digit is step number
   - second digit is result branch number (1 is always happy path)
   */
  function getDocSaveStatus() {
    return getOptionByValue(11)
  }

  function getUploadSuccessStatus() {
    return getOptionByValue(21)
  }

  function getUploadFailedStatus() {
    return getOptionByValue(22)
  }

  function getPendingBuyerResponse() {
    return getOptionByValue(23)
  }

  function getIssueSuccessStatus() {
    return getOptionByValue(31)
  }

  function getIssueFailedStatus() {
    return getOptionByValue(32)
  }

  exports.getAllStatus = constructorWrapper(getAllStatus)
  exports.getById = constructorWrapper(getOptionById)
  exports.getByText = constructorWrapper(getOptionByText)
  exports.getByStatusCode = constructorWrapper(getOptionByStatusCode)
  exports.getByValue = constructorWrapper(getOptionByValue)
  exports.getSavedStatus = constructorWrapper(getDocSaveStatus)
  exports.getUploadSuccessStatus = constructorWrapper(getUploadSuccessStatus)
  exports.getUploadFailedStatus = constructorWrapper(getUploadFailedStatus)
  exports.getPendingBuyerResponseStatus = constructorWrapper(
    getPendingBuyerResponse
  )
  exports.getIssueSuccessStatus = constructorWrapper(getIssueSuccessStatus)
  exports.getIssueFailedStatus = constructorWrapper(getIssueFailedStatus)
  return exports
})
