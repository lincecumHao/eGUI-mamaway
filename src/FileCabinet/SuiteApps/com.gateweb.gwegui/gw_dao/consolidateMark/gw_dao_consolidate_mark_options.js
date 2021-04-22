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
  var consolidateMarkRecordTypeId = 'customrecord_gw_consol_mark_option'
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
    var columns = ['custrecord_gw_consol_value', 'custrecord_gw_consol_text']
    var result = GwSearch.runSearch(consolidateMarkRecordTypeId, columns)
    allOptions = result.map(function (recordObj) {
      return {
        id: recordObj.id,
        value: recordObj['custrecord_gw_consol_value'],
        text: recordObj['custrecord_gw_consol_text'],
      }
    })
    return allOptions
  }

  function getAllConsolidateMark() {
    return allOptions
  }

  function isSingle(value) {
    return value.toString() === 'S'
  }

  function isShared(value) {
    return value.toString() === 'B'
  }

  function isConsolidate(value) {
    return value.toString() === 'A'
  }

  function isFormConsolidated(docTypeCode) {
    return parseInt(docTypeCode) === 26 || parseInt(docTypeCode) === 27
  }

  exports.getConsolidateMarkById = constructorWrapper(getOptionById)
  exports.getAllConsolidateMark = constructorWrapper(getAllConsolidateMark)
  exports.getConsolidateMarkByValue = constructorWrapper(getOptionByValue)
  exports.isFormConsolidated = isFormConsolidated
  exports.isSingle = isSingle
  exports.isShared = isShared
  exports.isConsolidate = isConsolidate
  return exports
})
