require([
  'SuiteApps/com.gateweb.gwegui/gw_issue_egui_job/gw_invoice_service',
  'SuiteApps/com.gateweb.gwegui/gw_issue_egui_job/gw_egui_service'
], (gwInvoiceService, gwEguiService) => {
  let searchResult = gwInvoiceService.getInvoiceSearchResultDebugger(21847);
  log.debug({ title: 'searchResult', details: searchResult })
  let invoiceObj = gwInvoiceService.composeInvObj(searchResult)
  log.debug({ title: 'invoiceObj', details: invoiceObj })
  let eguiService = new gwEguiService(invoiceObj)
  log.debug({title:"eguiObj", details:eguiService.getEgui()});
  let voucherId = eguiService.issueEgui()
  log.debug({title:"voucherId", details:voucherId});
  log.debug({ title: 'Execution end' })
})
