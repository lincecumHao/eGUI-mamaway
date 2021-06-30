require([
  'SuiteApps/com.gateweb.gwegui/gw_issue_egui_job/mockData/gw_issue_egui_job_mock_data_shopping99',
  'SuiteApps/com.gateweb.gwegui/gw_issue_egui_job/gw_invoice_service',
  'SuiteApps/com.gateweb.gwegui/gw_issue_egui_job/gw_egui_service'
], (mockData, gwInvoiceService, gwEguiService) => {
  var invObj = gwInvoiceService.composeInvObj(
    mockData.shopping99SearchResults.IV00000056492670
  )
  log.debug({ title: 'invObj', details: invObj })
  var eguiService = new gwEguiService(invObj)
  log.debug({ title: 'eguiObj', details: eguiService.getEgui() })
  // var voucherId = eguiService.issueEgui()
  // log.debug({ title: 'voucherId', details: voucherId })
  log.debug({ title: 'Execution end' })
})
