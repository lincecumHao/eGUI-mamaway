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
  var docTypeRecordTypeId = 'customrecord_gw_doc_format_option'

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

  function getOptionsByValue(value) {
    return allOptions.filter(function (option) {
      return option.value.toString() === value.toString()
    })
  }

  function getAllOptions() {
    var columns = [
      'custrecord_gw_doc_format_value',
      'custrecord_gw_doc_format_text',
      'custrecord_gw_doc_format_mof_code',
    ]
    var result = GwSearch.runSearch(docTypeRecordTypeId, columns)
    allOptions = result.map(function (recordObj) {
      return {
        id: recordObj.id,
        value: recordObj['custrecord_gw_doc_format_value'],
        text: recordObj['custrecord_gw_doc_format_text'],
        mofCode: recordObj['custrecord_gw_doc_format_mof_code'],
      }
    })
    return allOptions
  }

  function getDocTypeByValueAndMofCode(value, mofCode) {
    if (!mofCode) {
      mofCode = '00'
    }
    return allOptions.filter(function (option) {
      return (
        parseInt(option.value) === parseInt(value) && mofCode === option.mofCode
      )
    })[0]
  }

  function getDefaultEguiDocFormat() {
    return getDocTypeByValueAndMofCode(35, '07')
  }

  exports.getDocTypeById = constructorWrapper(getOptionById)
  exports.getDocTypesByValue = constructorWrapper(getOptionsByValue)
  exports.getDocTypeByValueAndInvoiceCode = constructorWrapper(
    getDocTypeByValueAndMofCode
  )
  exports.getDefaultEguiDocFormat = constructorWrapper(getDefaultEguiDocFormat)
  exports.getAllDoctype = getAllOptions
  return exports
})
