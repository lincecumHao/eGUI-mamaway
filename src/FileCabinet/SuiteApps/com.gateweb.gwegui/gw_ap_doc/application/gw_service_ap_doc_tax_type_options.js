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
  var apDocTaxTypeRecordTypeId = 'customrecord_gw_ap_doc_tax_type_option'

  var allOptions = []

  function constructorWrapper(func) {
    return function () {
      if (allOptions.length === 0) {
        log.debug({ title: 'tax type constructor wrapper get all options' })
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
      'custrecord_gw_ap_doc_tax_type_value',
      'custrecord_gw_ap_doc_tax_type_text',
      'custrecord_gw_ap_doc_tax_type_csv_value',
    ]
    var result = GwSearch.search(apDocTaxTypeRecordTypeId, columns)
    allOptions = result.map(function (recordObj) {
      return {
        id: recordObj.id,
        value: parseInt(recordObj['custrecord_gw_ap_doc_tax_type_value']),
        text: recordObj['custrecord_gw_ap_doc_tax_type_text'],
        csvValue: recordObj['custrecord_gw_ap_doc_tax_type_csv_value'],
      }
    })
    return allOptions
  }

  function getTaxTypeValueByRecordId(id) {
    var option = getOptionById(id)
    return option ? option.value : ''
  }

  function getTaxTypeRecordIdByValue(value) {
    var option = getOptionByValue(value)
    return option ? option.id : 0
  }

  function isTaxable(value) {
    return parseInt(value) === 1
  }

  function isTaxExempt(value) {
    return parseInt(value) === 3
  }

  function isZeroTax(value) {
    return parseInt(value) === 2
  }

  function isMixTax(value) {
    return parseInt(value) === 4
  }

  function getTaxTypeRecordIdByCsvValue(csvValue) {
    var taxTypeOption = allOptions.filter(function (option) {
      var csvAcceptableValues = option.csvValue.split(',')
      return csvAcceptableValues.indexOf(csvValue) > -1
    })[0]
    if (taxTypeOption) {
      return taxTypeOption.id
    }
    return 0
  }

  exports.getTaxTypeValueByRecordId = constructorWrapper(
    getTaxTypeValueByRecordId
  )
  exports.getAllTaxType = getAllOptions
  exports.getTaxTypeRecordIdByValue = constructorWrapper(
    getTaxTypeRecordIdByValue
  )
  exports.getTaxTypeRecordIdByCsvValue = constructorWrapper(
    getTaxTypeRecordIdByCsvValue
  )
  exports.isTaxable = isTaxable
  exports.isTaxExempt = isTaxExempt
  exports.isZeroTax = isZeroTax
  exports.isMixTax = isMixTax
  return exports
})
