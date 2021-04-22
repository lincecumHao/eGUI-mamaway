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
  var recordTypeId = 'customrecord_gui_track_list'
  var columns = [
    'custrecord_gw_gnt_period',
    'custrecord_gw_gnt_format_code',
    'custrecord_gw_gnt_track',
    'custrecord_gw_gnt_mof_code',
  ]
  var columnMap = {
    custrecord_gw_gnt_period: 'guiPeriod',
    custrecord_gw_gnt_format_code: 'docFormatCode',
    custrecord_gw_gnt_track: 'guiTrack',
    custrecord_gw_gnt_mof_code: 'mofDocCode',
  }
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
    var searchColumns = JSON.parse(JSON.stringify(columns))
    var result = GwSearch.runSearch(recordTypeId, searchColumns)
    allOptions = result.map(function (recordObj) {
      return getSearchResultObj(recordObj)
    })
    return allOptions
  }

  function getRecordsByDocTypeGuiTrackAndPeriodCore(
    docFormatCode,
    guiTrack,
    guiPeriod
  ) {
    return allOptions.filter(function (option) {
      return (
        option.docFormatCode.toString() === docFormatCode.toString() &&
        option.guiTrack.toString() === guiTrack.toString() &&
        option.guiPeriod.toString() === guiPeriod.toString()
      )
    })
  }

  function getAvailableGuiTrackCore(docTypeObj, guiPeriod) {
    var options = allOptions.filter(function (option) {
      return option.guiPeriod.toString() === guiPeriod
    })
    if (docTypeObj.mofDocCode.toString() !== '00') {
      options = options.filter(function (option) {
        return option.mofDocCode.toString() === docTypeObj.mofDocCode.toString()
      })
    }
  }

  function getAvailableGuiTrack(guiPeriod, docFormatCode, mofCode, guiTrack) {
    var searchColumns = JSON.parse(JSON.stringify(columns))
    var searchFilters = []
    searchFilters.push(['custrecord_gw_gnt_period', 'is', guiPeriod.toString()])
    searchFilters.push('AND')
    searchFilters.push([
      'custrecord_gw_gnt_format_code',
      'is',
      docFormatCode.toString(),
    ])
    if (mofCode && mofCode.toString() !== '00') {
      searchFilters.push('AND')
      searchFilters.push([
        'custrecord_gw_gnt_mof_code',
        'is',
        mofCode.toString(),
      ])
    }
    if (guiTrack) {
      searchFilters.push('AND')
      searchFilters.push(['custrecord_gw_gnt_track', 'is', guiTrack.toString()])
    }
    var result = GwSearch.runSearch(recordTypeId, searchColumns, searchFilters)
    return result.map(function (recordObj) {
      return getSearchResultObj(recordObj)
    })
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

  exports.getAvailableGuiTrack = getAvailableGuiTrack
  return exports
})
