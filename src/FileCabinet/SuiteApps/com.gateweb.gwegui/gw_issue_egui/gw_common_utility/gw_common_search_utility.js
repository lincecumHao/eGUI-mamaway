/**
 *String Invoice Tool
 *gwInvoiceUtility.js
 *@NApiVersion 2.0
 */
define(['N/search'], function (search) {
  /*
   * type : Record ID
   * filters : filters
   * columns : results
   */
  function getSearchResult(type, filters, columns) {
    var allResults = []
    try {
      var s = search.create({
        type: type,
        columns: columns,
        filters: filters,
      })
      var pagedData = s.runPaged({
        pageSize: 1000,
      })
      for (var i = 0; i < pagedData.pageRanges.length; i++) {
        var currentPage = pagedData.fetch(i)

        currentPage.data.forEach(function (result) {
          allResults.push(result)
        })
      }
    } catch (e) {
      log.debug(e.name, e.message)
    }

    return allResults
  }

  function getAllCustomerSearchResult() {
    var allResults = []
    try {
      var _type = search.Type.CUSTOMER
      var _filters = []
      var _columns = [
        'entityid',
        'companyname',
        'custentity_gw_tax_id_number',
        'address',
        'email',
      ]
      allResults = getSearchResult(_type, _filters, _columns)
    } catch (e) {
      log.debug(e.name, e.message)
    }

    return allResults
  }

  return {
    getSearchResult: getSearchResult,
    getAllCustomerSearchResult: getAllCustomerSearchResult,
  }
})
