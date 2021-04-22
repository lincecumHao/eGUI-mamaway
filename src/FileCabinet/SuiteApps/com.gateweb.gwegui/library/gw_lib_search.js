define(['N/search', 'N/runtime'], function (search, runtime) {
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

  /**
   * Returns a new created search instance
   *
   * @param {string} type
   * @param {array} searchFilters
   * @param {array} searchColumns
   * @return {Search} customSearch
   */
  function getSearch(type, searchColumns, searchFilters) {
    if (!searchColumns || searchColumns.length === 0) {
      throw 'columns not defined'
    }
    var customSearch = search.create({
      type: type,
      columns: searchColumns,
    })
    if (searchFilters && searchFilters.length > 0) {
      customSearch.filterExpression = searchFilters
    }
    return customSearch
  }

  /**
   * Returns a search instance by loading a saved search
   *
   * @param {string} searchId
   * @param {array} additionalFilters
   * @return {Search} customSearch
   */
  function getSavedSearch(searchId, additionalFilters) {
    var customSearch = search.load({
      id: searchId,
    })
    var currentFilterExp = JSON.parse(
      JSON.stringify(customSearch.filterExpression)
    )
    if (additionalFilters && additionalFilters.length > 0) {
      currentFilterExp.push('AND')
      additionalFilters.forEach(function (filter) {
        currentFilterExp.push(filter)
      })
      customSearch.filterExpression = currentFilterExp
    }
    return customSearch
  }

  /**
   * Returns an array of search results
   *
   * @param {Search} customSearch
   * @return {array} allResults
   */
  function getAllPagedData(customSearch) {
    var allResults = []
    var columns = customSearch.columns
    var pagedData = customSearch.runPaged({
      pageSize: 1000,
    })
    for (var i = 0; i < pagedData.pageRanges.length; i++) {
      var currentPage = pagedData.fetch({ index: i })
      currentPage.data.forEach(function (result) {
        allResults.push(getResultObj(result, columns))
      })
    }
    return allResults
  }

  function getResultObj(result, columns) {
    var resultObj = {}
    columns.forEach(function (column) {
      var colOptions = {
        name: column.name,
      }
      if (column.join) {
        colOptions.join = column.join
      }
      var value = result.getValue(colOptions)
      var text = result.getText(colOptions)
      var valueObj = value
      if (text) {
        valueObj = {
          value: value,
          text: text,
        }
      }
      if (column.join) {
        if (!resultObj[column.join]) {
          resultObj[column.join] = {}
        }
        resultObj[column.join][column.name] = valueObj
      } else {
        resultObj[column.name] = valueObj
      }
    })
    resultObj.id = result.id
    return resultObj
  }

  /**
   * Returns an array of search results from a saved search
   *
   * @param {string} searchId
   * @param {array} additionalFilters
   * @return {array} allResults
   */
  function runSavedSearch(searchId, additionalFilters) {
    return getAllPagedData(getSavedSearch(searchId, additionalFilters))
  }

  /**
   * Returns an object compose of search results and search columns from a saved search
   *
   * @param {string} searchId
   * @param {array} additionalFilters
   * @return {{data: {Object[]}, columns: {Object[]}}} allResults
   */
  function runSavedSearchWithColumns(searchId, additionalFilters) {
    var customSearch = getSavedSearch(searchId, additionalFilters)
    return {
      data: getAllPagedData(customSearch),
      columns: customSearch.columns,
    }
  }

  /**
   * Returns an array of search results from
   * a new search built from filters and columns
   *
   * @param {string} type
   * @param {array} searchFilters
   * @param {array} searchColumns
   * @return {array} allResults
   */
  function runSearch(type, searchColumns, searchFilters) {
    return getAllPagedData(getSearch(type, searchColumns, searchFilters))
  }

  /**
   * Returns an object compose of search results and search columns from
   * a new search built from filters and columns
   *
   * @param {string} type
   * @param {array} searchFilters
   * @param {array} searchColumns
   * @return {{data: {Object[]}, columns: {Object[]}}} allResults
   */
  function runSearchWithColumns(type, searchColumns, searchFilters) {
    var customSearch = getSearch(type, searchColumns, searchFilters)
    return {
      data: getAllPagedData(customSearch),
      columns: customSearch.columns,
    }
  }

  function lookupFields(type, id, fields) {
    var result = search.lookupFields({
      type: type,
      id: id,
      columns: fields,
    })
    fields.forEach(function (fieldId) {
      if (typeof result[fieldId] === 'object') {
        result[fieldId] = {
          value: result[fieldId][0].value,
          text: result[fieldId][0].text,
        }
      }
    })

    return result
  }

  exports.runSearch = runSearch
  exports.runSearchWithColumns = runSearchWithColumns
  exports.runSavedSearch = runSavedSearch
  exports.runSavedSearchWithColumns = runSavedSearchWithColumns
  exports.lookupFields = lookupFields
  return exports
})
