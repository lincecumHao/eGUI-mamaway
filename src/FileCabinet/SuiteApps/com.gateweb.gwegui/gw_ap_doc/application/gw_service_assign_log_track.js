define([
  'N/record',
  './gw_lib_search',
  'N/search',
  './gw_lib_wrapper',
], function (record, GwSearch, search, wrapperLib) {
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
  var assignLogTrackRecordTypeId = 'customrecord_gw_assignlog_track'
  var assignLogTrackColumns = [
    'custrecord_gw_track_year_month',
    'custrecord_gw_track_type_code',
    'custrecord_gw_track_invoice_track',
    'custrecord_gw_track_invoice_type',
  ]
  var allOptions = []

  function constructorWrapper(func) {
    return function () {
      if (allOptions.length === 0) {
        log.debug({
          title: 'assign log track constructor wrapper get all options',
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
      'custrecord_gw_track_year_month',
      'custrecord_gw_track_type_code',
      'custrecord_gw_track_invoice_track',
      'custrecord_gw_track_invoice_type',
    ]
    var result = GwSearch.search(assignLogTrackRecordTypeId, columns)
    allOptions = result.map(function (recordObj) {
      return {
        id: recordObj.id,
        applyPeriod: recordObj['custrecord_gw_track_year_month'],
        docTypeCode: recordObj['custrecord_gw_track_type_code'],
        guiTrack: recordObj['custrecord_gw_track_invoice_track'],
        mofDocType: recordObj['custrecord_gw_track_invoice_type'],
      }
    })
    return allOptions
  }

  function getRecordsByDocTypeGuiTrackAndApplyPeriodCore(
    docTypeCode,
    guiTrack,
    applyPeriod
  ) {
    var options = allOptions.filter(function (option) {
      return (
        option.docTypeCode.toString() === docTypeCode.toString() &&
        option.guiTrack.toString() === guiTrack.toString() &&
        option.applyPeriod.toString() === applyPeriod.toString()
      )
    })
    return options
  }

  function getAvaliableGuiTrackCore(docTypeObj, applyPeriod) {
    var options = allOptions.filter(function (option) {
      return option.applyPeriod.toString() === applyPeriod
    })
    if (docTypeObj.mofDocType.toString() !== '00') {
      options = options.filter(function (option) {
        return option.mofDocType.toString() === docTypeObj.mofDocType.toString()
      })
    }
  }

  function getAvailableGuiTrack(docTypeObj, applyPeriod) {
    var allResults = []
    var searchColumns = [
      'custrecord_gw_track_year_month',
      'custrecord_gw_track_type_code',
      'custrecord_gw_track_invoice_track',
      'custrecord_gw_track_invoice_type',
    ]
    var searchFilters = []
    searchFilters.push([
      'custrecord_gw_track_type_code',
      'is',
      docTypeObj.docType.toString(),
    ])
    searchFilters.push('AND')
    searchFilters.push(['custrecord_gw_track_year_month', 'is', applyPeriod])
    if (docTypeObj.mofDocType.toString() !== '00') {
      searchFilters.push('AND')
      searchFilters.push([
        'custrecord_gw_track_invoice_type',
        'is',
        docTypeObj.mofDocType.toString(),
      ])
    }

    var trackSearch = search.create({
      type: assignLogTrackRecordTypeId,
      columns: searchColumns,
    })
    trackSearch.filterExpression = searchFilters
    var pagedData = trackSearch.runPaged({
      pageSize: 1000,
    })
    for (var i = 0; i < pagedData.pageRanges.length; i++) {
      var currentPage = pagedData.fetch(i)
      currentPage.data.forEach(function (result) {
        var resultObj = {}
        searchColumns.forEach(function (column) {
          var value = result.getValue({
            name: column.name,
          })
          resultObj[column.name] = value
        })
        resultObj.id = result.id
        allResults.push(resultObj)
      })
    }

    return allResults
  }

  function getAllResults(pagedData, searchColumns) {
    var allResults = []
    for (var i = 0; i < pagedData.pageRanges.length; i++) {
      var currentPage = pagedData.fetch(i)
      currentPage.data.forEach(function (result) {
        var resultObj = {}
        searchColumns.forEach(function (column) {
          var value = result.getValue({
            name: column.name,
          })
          resultObj[column.name] = value
        })
        resultObj.id = result.id
        allResults.push(resultObj)
      })
    }
    return allResults
  }

  function getRecordsByDocTypeGuiTrackAndApplyPeriod(
    docTypeCode,
    guiTrack,
    applyPeriod
  ) {
    var searchFilters = []
    searchFilters.push([
      'custrecord_gw_track_type_code',
      'is',
      docTypeCode.toString(),
    ])
    searchFilters.push('AND')
    searchFilters.push([
      'custrecord_gw_track_year_month',
      'is',
      applyPeriod.toString(),
    ])
    searchFilters.push('AND')
    searchFilters.push([
      'custrecord_gw_track_invoice_track',
      'is',
      guiTrack.toString(),
    ])
    var trackSearch = search.create({
      type: assignLogTrackRecordTypeId,
      columns: assignLogTrackColumns,
    })
    trackSearch.filterExpression = searchFilters
    var pagedData = trackSearch.runPaged({
      pageSize: 1000,
    })
    var results = getAllResults(pagedData, trackSearch.columns)
    return results
  }

  exports.getRecordsByDocTypeGuiTrackAndApplyPeriod = constructorWrapper(
    getRecordsByDocTypeGuiTrackAndApplyPeriodCore
  ) //getRecordsByDocTypeGuiTrackAndApplyPeriod
  exports.getAvailableGuiTrack = constructorWrapper(getAvaliableGuiTrackCore) //getAvailableGuiTrack
  return exports
})
