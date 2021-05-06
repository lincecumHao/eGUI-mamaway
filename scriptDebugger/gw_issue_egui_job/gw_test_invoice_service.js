require([
  'N/search',
  'SuiteApps/com.gateweb.gwegui/gw_dao/transactionSearch/gw_transaction_fields',
], (search, transSearchFields) => {
  function gwtInvoiceToIssueEguiSearch() {
    var searchFilters = []
    searchFilters.push(['cogs', 'is', 'F'])
    searchFilters.push('AND')
    searchFilters.push(['status', 'noneof', 'CustInvc:V', 'CustCred:V'])
    searchFilters.push('AND')
    searchFilters.push(['type', 'is', 'CustInvc'])
    searchFilters.push('AND')
    searchFilters.push(['shipping', 'is', 'F'])
    searchFilters.push('AND')
    searchFilters.push(['custbody_gw_lock_transaction', 'is', 'F'])
    searchFilters.push('AND')
    searchFilters.push(['custbody_gw_is_issue_egui', 'is', 'T'])
    searchFilters.push('AND')
    searchFilters.push(['custbody_gw_gui_num_start', 'isempty', ''])
    var searchColumns = JSON.parse(
      JSON.stringify(transSearchFields.allFieldIds)
    )
    searchColumns.push('taxItem.rate')
    log.debug({ title: 'searchColumns', details: searchColumns })
    // TODO
    return search.create({
      type: search.Type.INVOICE,
      filters: searchFilters,
      columns: searchColumns,
    })
  }
  var searchObj = gwtInvoiceToIssueEguiSearch()
  searchObj.run().each((result) => {
    // var searchResult = JSON.parse(result)
    log.debug({ title: 'searchResultObj', details: result })
    // log.debug({ title: 'searchResult', details: searchResult })
  })
  log.debug({ title: 'Execution end' })
})
