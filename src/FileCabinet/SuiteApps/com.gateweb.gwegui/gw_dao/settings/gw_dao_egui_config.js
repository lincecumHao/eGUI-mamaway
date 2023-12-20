define([
  '../../library/gw_lib_search',
  './gw_egui_config_fields',
  'N/config',
  '../../library/ramda.min',
], function (searchLib, fieldConfig, config, ramda) {
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
  var recordTypeId = 'customrecord_gw_egui_config'
  var allOptions = []

  function constructorWrapper(func) {
    return function () {
      if (allOptions.length === 0) {
        getAllOptions()
      }
      return func.apply(this, arguments)
    }
  }

  function getSetting() {
    var companyId = getAccountId()
    return allOptions.filter(function (option) {
      return option.nsAcctId.toString() === companyId.toString()
    })[0]
  }

  function getAccountId() {
    var companyInfo = config.load({
      type: config.Type.COMPANY_INFORMATION,
    })
    return companyInfo.getValue({
      fieldId: 'companyid',
    })
  }

  function getAllOptions() {
    var columns = fieldConfig.allFieldIds
    var searchColumns = JSON.parse(JSON.stringify(columns))
    var searchFilters = []
    searchFilters.push(['isinactive', 'is', false])
    var result = searchLib.runSearch(recordTypeId, searchColumns, searchFilters)
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

  exports.getSetting = constructorWrapper(getSetting)

  return exports
})
