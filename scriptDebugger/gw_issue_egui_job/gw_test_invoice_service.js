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
    var searchColumns = getSearchColumns()
    log.debug({ title: 'searchColumns', details: searchColumns })
    // TODO
    return search.create({
      type: search.Type.INVOICE,
      filters: searchFilters,
      columns: searchColumns,
    })
  }

  function getSearchColumns() {
    return [
      'internalId',
      'mainline',
      'trandate',
      'subsidiary',
      'type',
      'entity',
      'tranid',
      'transactionnumber',
      'memomain',
      'memo',
      'amount',
      'fxamount',
      'grossamount',
      'netamountnotax',
      'netamount',
      'taxamount',
      'taxtotal',
      'total',
      'department',
      'createdby',
      'createdfrom',
      'class',
      'location',
      'itemtype',
      'linesequencenumber',
      'line',
      'item',
      'unitabbreviation',
      'quantity',
      'taxcode',
      'rate',
      'fxrate',
      'custcol_gw_item_unit_amt_inc_tax',
      'custcol_gw_item_memo',
      'custbody_gw_gui_date',
      'custbody_gw_gui_tax_file_date',
      'custbody_gw_lock_transaction',
      'custbody_gw_gui_not_upload',
      'custbody_gw_is_issue_egui',
      'custbody_gw_allowance_num_start',
      'custbody_gw_allowance_num_end',
      'custbody_gw_customs_export_no',
      'custbody_gw_customs_export_category',
      'custbody_gw_gui_address',
      'custbody_gw_gui_title',
      'custbody_gw_gui_num_start',
      'custbody_gw_gui_num_end',
      'custbody_gw_tax_id_number',
      'custbody_gw_customs_export_date',
      'custbody_gw_egui_clearance_mark',
      'custbody_gw_applicable_zero_tax',
      'custbody_gw_gui_main_memo',
      'custbody_gw_gui_sales_amt_tax_exempt',
      'custbody_gw_gui_sales_amt',
      'custbody_gw_gui_sales_amt_tax_zero',
      'custbody_gw_gui_tax_amt',
      'custbody_gw_creditmemo_deduction_list',
      'custbody_gw_gui_donation_code',
      'custbody_gw_gui_donation_mark',
      'custbody_gw_gui_carrier_type',
      'custbody_gw_gui_carrier_id_1',
      'custbody_gw_gui_carrier_id_2',
      'custbody_gw_gui_apply_period',
      'custbody_gw_gui_format',
      'custbody_gw_gui_class',
      'custbody_gw_gui_department',
      'statusref',
      'taxItem.rate',
    ]
    let searchColumns = JSON.parse(
      JSON.stringify(transSearchFields.allFieldIds)
    )
    searchColumns.push('taxItem.rate')
    return searchColumns
  }

  var searchObj = gwtInvoiceToIssueEguiSearch()
  searchObj.run().each((result) => {
    var searchResult = JSON.parse(JSON.stringify(result))
    // log.debug({ title: 'searchResultObj', details: result })
    log.debug({ title: 'searchResult', details: searchResult })
  })
  log.debug({ title: 'Execution end' })
})
