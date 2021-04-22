define([
  '../../library/gw_lib_search',
  './gw_mig_type_fields',
  '../../library/ramda.min',
], function (searchLib, fieldConfig, ramda) {
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
  var recordTypeId = 'customrecord_gw_mig_type'
  var allOptions = []

  function constructorWrapper(func) {
    return function () {
      if (allOptions.length === 0) {
        getAllOptions()
      }
      return func.apply(this, arguments)
    }
  }

  function transformResult(columns, recordObj) {
    var optionObject = {}
    columns.forEach(function (columnId) {
      var attribute = fieldConfig.fieldOutputMapping[columnId]
      optionObject[attribute] = recordObj[columnId]
    })
    optionObject.id = recordObj.id
    return optionObject
  }

  function transformResults(result, columns) {
    return result.map(function (recordObj) {
      return transformResult(columns, recordObj)
    })
  }

  function getAllOptions() {
    var columns = fieldConfig.allFieldIds
    var searchColumns = JSON.parse(JSON.stringify(columns))
    var result = searchLib.runSearch(recordTypeId, searchColumns)
    allOptions = transformResults(result, columns)
    return allOptions
  }

  function getAll() {
    return allOptions
  }

  function getByBusinessTypeAndDocType(action, businessType, docType) {
    return ramda.filter(function (option) {
      return (
        option[
          fieldConfig.fields.custrecord_gw_mt_egui_type.outputField
        ].toUpperCase() === docType.toUpperCase() &&
        option[
          fieldConfig.fields.custrecord_gw_mt_bus_tran_type.outputField
        ].toUpperCase() === businessType.toUpperCase() &&
        option[
          fieldConfig.fields.custrecord_gw_mt_action_mode.outputField
        ].toUpperCase() === action.toUpperCase()
      )
    }, allOptions)[0]
  }

  function getById(id) {
    return ramda.filter(function (option) {
      return option.id.toString() === id.toString()
    }, allOptions)[0]
  }

  exports.getAll = constructorWrapper(getAll)
  exports.getType = constructorWrapper(getByBusinessTypeAndDocType)
  exports.getById = constructorWrapper(getById)
  return exports
})
