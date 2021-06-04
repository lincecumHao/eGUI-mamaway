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

  var allOptions = []
  var recordTypeId = 'customrecord_gw_ap_doc_tax_type_option'
  var columns = [
    'custrecord_gw_ap_doc_tax_type_value',
    'custrecord_gw_ap_doc_tax_type_text',
    'custrecord_gw_ap_doc_tax_type_csv_value',
    'custrecord_gw_tax_type_tax_code'
  ]
  var columnMap = {
    custrecord_gw_ap_doc_tax_type_value: 'value',
    custrecord_gw_ap_doc_tax_type_text: 'text',
    custrecord_gw_ap_doc_tax_type_csv_value: 'csvValue',
    custrecord_gw_tax_type_tax_code: 'taxCodes'
  }

  function constructorWrapper(func) {
    return function () {
      if (allOptions.length === 0) {
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
    return allOptions.filter(function (option) {
      return option.value.toString() === value.toString()
    })[0]
  }

  function getAllOptions() {
    var searchColumns = JSON.parse(JSON.stringify(columns))
    var result = GwSearch.runSearch(recordTypeId, searchColumns, null)
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

  function isTaxable(value) {
    return parseInt(value) === 1
  }

  function isTaxExempt(value) {
    return parseInt(value) === 3
  }

  function isZeroTax(value) {
    return parseInt(value) === 2
  }

  function isSpecialTax(value) {
    return parseInt(value) === 4
  }

  function getTaxTypeByCsvValue(csvValue) {
    return allOptions.filter(function (option) {
      return option.csvValue.split(',').indexOf(csvValue) > -1
    })[0]
  }

  function getTaxTypeByTaxCode(taxCode) {
    return allOptions.filter(function (option) {
      if (option.taxCodes) {
        return option.taxCodes.value.split(',').indexOf(taxCode.toString()) > -1
      }
      return false
    })[0]
  }

  function getTaxTypeByTaxCodeText(taxCodeText) {
    return allOptions.filter(function (option) {
      if (option.taxCodes) {
        return option.taxCodes.text.split(',').indexOf(taxCodeText) > -1
      }
      return false
    })[0]
  }

  exports.getTaxTypeById = constructorWrapper(getOptionById)
  exports.getAllTaxType = getAllOptions
  exports.getTaxTypeByValue = constructorWrapper(getOptionByValue)
  exports.getTaxTypeByCsvValue = constructorWrapper(getTaxTypeByCsvValue)
  exports.getTaxTypeByTaxCode = constructorWrapper(getTaxTypeByTaxCode)
  exports.getTaxTypeByTaxCodeText = constructorWrapper(getTaxTypeByTaxCodeText)
  exports.isTaxable = isTaxable
  exports.isTaxExempt = isTaxExempt
  exports.isZeroTax = isZeroTax
  exports.isSpecialTax = isSpecialTax
  return exports
})
