define(['N/search'], function (search) {
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

  function newSearch(type, searchColumns, searchFilters) {
    // console.log('newSearch searchColumns', searchColumns)
    var allResults = []
    var s = search.create({
      type: type,
      columns: searchColumns,
    })
    if (!searchColumns || searchColumns.length === 0) {
      throw 'columns not defined'
    }
    if (searchFilters && searchFilters.length > 0) {
      s.filterExpression = searchFilters
    }
    var pagedData = s.runPaged({
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

  function searchValuesFromRecord(recordType, recordId, columns) {
    var results = search.lookupFields({
      type: recordType,
      columns: columns,
      id: recordId,
    })

    return results
  }

  function savedSearch() {}

  exports.search = newSearch
  exports.searchBySavedSearch = savedSearch
  exports.searchValuesFromRecord = searchValuesFromRecord
  return exports
})
