define([
  'N/record',
  'N/search',
  '../library/ramda.min',
  '../gw_dao/transactionSearch/gw_transaction_fields',
], (record, search, ramda, transSearchFields) => {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2021 Gateweb
   * @author Sean Lin <sean.hyl@gmail.com>
   *
   * @NApiVersion 2.1
   * @NModuleScope Public

   */
  let exports = {}

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
    return search.create({
      type: search.Type.INVOICE,
      filters: searchFilters,
      columns: searchColumns,
    })
  }

  /**
   * Only Used for map reduce process, all search results for 1 invoice
   *
   * @param invoiceSearchResults {{Object}[]}
   * @return {{}}
   */
  function composeInvObj(invoiceSearchResults) {
    var invMainObj = ramda.filter((result) => {
      return result.mainline === '*'
    }, invoiceSearchResults)[0]
    if (!invMainObj) {
      throw 'No invoice body defined'
    }
    invMainObj.lines = ramda.filter((result) => {
      return result.mainline !== '*' && result.itemtype !== 'TaxItem'
    }, invoiceSearchResults)
    invMainObj.taxLines = ramda.filter((result) => {
      return result.mainline !== '*' && result.itemtype === 'TaxItem'
    }, invoiceSearchResults)
    return invMainObj
  }

  exports.gwtInvoiceToIssueEguiSearch = gwtInvoiceToIssueEguiSearch
  exports.composeInvObj = composeInvObj
  return exports
})
