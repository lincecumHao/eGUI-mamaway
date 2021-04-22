define([
  '../../library/gw_lib_search',
  './gw_egui_book_type_fields',
  '../../library/ramda.min',
], function (searchLib, fieldConfig, ramda) {
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
  var recordTypeId = 'customrecord_gw_gui_book_type'
  var columnMap = fieldConfig.fieldOutputMapping
  var allOptions = []

  var daoParams = {
    taxId: '',
    taxPeriod: gwDateUtil.getGuiPeriod(),
    typeId: '',
    departmentId: '',
    classificationId: '',
  }

  function constructorWrapper(func) {
    return function () {
      if (!daoParams.taxId) throw 'Please setParam() first'
      if (allOptions.length === 0) {
        getAllOptions()
      }
      return func.apply(this, arguments)
    }
  }

  /**
   *
   * @param taxID
   * @param period
   */
  function setParams(params) {
    if (!params.taxPeriod) {
      params.taxPeriod = gwDateUtil.getGuiPeriod()
    }
    if (!isParamEqual(params, daoParams)) {
      daoParams = params
      getAllOptions()
    }
  }

  function isParamEqual(inputParam, existingParam) {
    if (inputParam.taxId === existingParam.taxId) {
      return true
    }
    return false
  }

  var getAllOptions = gwWrapper.performanceMeterWrapper(getAllOptionsCore)

  function getAllOptionsCore() {
    var searchColumns = JSON.parse(JSON.stringify(columns))
    var searchFilter = getSearchFilters(daoParams)
    var result = searchLib.runSearch(recordTypeId, searchColumns, searchFilter)
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

  function getGuiBooks() {
    return allOptions
  }

  /**
   *
   * @param params {{taxId: string, taxPeriod: string, typeId:string, departmentId: string, classificationId: string}}
   * @returns {[]}
   */
  function getSearchFilters(params) {
    if (!params.taxPeriod) {
      params.taxPeriod = gwDateUtil.getGuiPeriod()
    }
    var searchFilter = []
    searchFilter.push([
      columnObj.custrecord_gw_gb_company_tax_id,
      'is',
      params.taxId,
    ])
    searchFilter.push('AND')
    searchFilter.push([
      columnObj.custrecord_gw_gb_period,
      'is',
      params.taxPeriod,
    ])
    if (params.typeId) {
      searchFilter.push('AND')
      searchFilter.push([
        columnObj.custrecord_gw_gb_book_type,
        'is',
        params.typeId,
      ])
    }
    if (params.departmentId) {
      searchFilter.push('AND')
      searchFilter.push([
        columnObj.custrecord_gw_gb_department,
        'is',
        params.departmentId,
      ])
    }
    if (params.classificationId) {
      searchFilter.push('AND')
      searchFilter.push([
        columnObj.custrecord_gw_gb_classification,
        'is',
        params.departmentId,
      ])
    }
    return searchFilter
  }

  function filterGuiBooksByDepartment(guiBooks, departmentId) {
    return guiBooks.filter(function (recordObj) {
      return (
        recordObj[columnMap.custrecord_gw_gb_department].value ===
        departmentId.toString()
      )
    })
  }

  function filterGuiBooksByClass(guiBooks, classId) {
    return guiBooks.filter(function (recordObj) {
      return recordObj[columnMap.classification].value === classId.toString()
    })
  }

  function getGuiBooksByPeriod(period) {
    return allOptions.filter(function (recordObj) {
      return recordObj[columnMap.custrecord_gw_gn_period] === period
    })
  }

  function getGuiBooksByDepartment(departmentId) {
    return allOptions.filter(function (recordObj) {
      return (
        recordObj[columnMap.custrecord_gw_gn_department].value ===
        departmentId.toString()
      )
    })
  }

  function getGuiBooksByClass(classId) {
    return allOptions.filter(function (recordObj) {
      return recordObj[columnMap.classification].value === classId.toString()
    })
  }

  function getGuiBooksByCustomParam(params) {
    var searchFilter = getSearchFilters(params)
    var searchColumns = JSON.parse(JSON.stringify(columns))
    var result = searchLib.runSearch(recordTypeId, searchColumns, searchFilter)
    return result.map(function (recordObj) {
      return getSearchResultObj(recordObj)
    })
  }

  exports.getGuiBooks = constructorWrapper(getGuiBooks)
  exports.getGuiBooksByPeriod = constructorWrapper(getGuiBooksByPeriod)
  exports.getGuiBooksByDepartment = constructorWrapper(getGuiBooksByDepartment)
  exports.getGuiBooksByClass = constructorWrapper(getGuiBooksByClass)
  exports.getGuiBooksByCustomParam = getGuiBooksByCustomParam
  exports.filterGuiBooksByDepartment = filterGuiBooksByDepartment
  exports.filterGuiBooksByClass = filterGuiBooksByClass
  exports.setParams = setParams
  return exports
})
