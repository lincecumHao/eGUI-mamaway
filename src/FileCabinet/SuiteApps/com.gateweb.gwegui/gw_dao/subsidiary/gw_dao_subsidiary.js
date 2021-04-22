define(['../../library/gw_lib_search', 'N/record'], function (
  GwSearch,
  record
) {
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

  var allOptions = []

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
    var columns = [
      'name',
      'namenohierarchy',
      'parent',
      'email',
      'custrecord_gw_tw_tax_id',
      'legalname',
      'taxidnum',
      'custrecord_gw_non_value_added_company',
    ]
    allOptions = GwSearch.runSearch('subsidiary', columns)
    return allOptions
  }

  function getSubsidiaryBy(func) {
    return allOptions.filter(func)[0]
  }

  function getAllSubsidiary() {
    return allOptions
  }

  function getSubsidiaryByTaxId(taxId) {
    return allOptions.filter(function (option) {
      return option.custrecord_gw_tw_tax_id === taxId
    })[0]
  }

  function getSubsidiaryById(id) {
    var subsidiaryRecord = record.load({
      type: 'subsidiary',
      id: id,
    })
    var subsidiaryObj = {}
    var columns = [
      'name',
      'namenohierarchy',
      'parent',
      'email',
      'custrecord_gw_tw_tax_id',
      'legalname',
      'taxidnum',
      'DATEFORMAT',
      'custrecord_gw_non_value_added_company',
    ]
    columns.forEach(function (colId) {
      var value = subsidiaryRecord.getValue({
        fieldId: colId,
      })
      var text = subsidiaryRecord.getText({
        fieldId: colId,
      })
      subsidiaryObj[colId.toLowerCase()] = value
      if (text && value !== text) {
        subsidiaryObj[colId.toLowerCase()] = {
          value: value,
          text: text,
        }
      }
    })
    subsidiaryObj.id = id
    return subsidiaryObj
  }

  exports.getAllSubsidiaries = constructorWrapper(getAllSubsidiary)
  exports.getSubsidiaryById = getSubsidiaryById
  exports.getSubsidiaryBy = constructorWrapper(getSubsidiaryBy)
  exports.getSubsidiaryByTaxId = constructorWrapper(getSubsidiaryByTaxId)

  return exports
})
