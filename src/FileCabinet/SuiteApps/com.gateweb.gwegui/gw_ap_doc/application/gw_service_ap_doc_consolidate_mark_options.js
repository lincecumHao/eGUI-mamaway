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
  var apDocConsolidateMarkRecordTypeId = 'customrecord_gw_ap_doc_consol_option'
  var allOptions = []

  function constructorWrapper(func) {
    return function () {
      if (allOptions.length === 0) {
        log.debug({
          title: 'consolidation mark constructor wrapper get all options',
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
      'custrecord_gw_ap_doc_consol_value',
      'custrecord_gw_ap_doc_consol_text',
    ]
    var result = GwSearch.search(apDocConsolidateMarkRecordTypeId, columns)
    allOptions = result.map(function (recordObj) {
      return {
        id: recordObj.id,
        value: recordObj['custrecord_gw_ap_doc_consol_value'],
        text: recordObj['custrecord_gw_ap_doc_consol_text'],
      }
    })
    return allOptions
  }

  function getAllConsolidateMark() {
    return allOptions
  }

  function getConsolidateMarkValueByRecordId(id) {
    if (!id) {
      return ''
    }
    var option = getOptionById(id)
    if (option) {
      return option.value
    }
    return ''
  }

  function getConsolidateMarkRecordIdByValue(value) {
    var option = getOptionByValue(value)
    if (option) {
      return option.id
    }
    return 0
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

  exports.getConsolidateMarkValueByRecordId = constructorWrapper(
    getConsolidateMarkValueByRecordId
  )
  exports.getAllConsolidateMark = constructorWrapper(getAllConsolidateMark)
  exports.getConsolidateMarkRecordIdByValue = constructorWrapper(
    getConsolidateMarkRecordIdByValue
  )
  exports.isFormConsolidated = isFormConsolidated
  exports.isSingle = isSingle
  exports.isShared = isShared
  exports.isConsolidate = isConsolidate
  exports.getAllOptions = getAllOptions
  return exports
})
