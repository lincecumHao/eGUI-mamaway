require([
  'SuiteApps/com.gateweb.gwegui/gw_issue_egui_job/mockData/gw_issue_egui_job_mock_data_shopping99',
  'SuiteApps/com.gateweb.gwegui/gw_issue_egui_job/gw_invoice_service',
  'SuiteApps/com.gateweb.gwegui/gw_issue_egui_job/gw_egui_service'
], (mockData, gwInvoiceService, gwEguiService) => {
  var invoiceSearchResult = gwInvoiceService.getInvoiceSearchResultDebugger(
    2343746
  )
  log.debug({ title: 'invoiceSearchResult', details: invoiceSearchResult })
  var invObj = gwInvoiceService.composeInvObj(invoiceSearchResult)
  log.debug({ title: 'invObj', details: invObj })
  var eguiService = new gwEguiService(invObj)
  log.debug({ title: 'eguiObj', details: eguiService.getEgui() })
  // var voucherId = eguiService.issueEgui()
  // log.debug({ title: 'voucherId', details: voucherId })
  // if (voucherId && eguiService.getEgui().isNotUploadEGui === 'F') {
  //   var uploadEguiResult = eguiService.uploadEgui(voucherId)
  // }
  log.debug({ title: 'Execution end' })
})
