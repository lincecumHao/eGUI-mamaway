require([
  'SuiteApps/com.gateweb.gwegui/gw_issue_egui_job/mockData/gw_issue_egui_job_mock_data',
  'SuiteApps/com.gateweb.gwegui/gw_issue_egui_job/gw_invoice_service',
  'SuiteApps/com.gateweb.gwegui/gw_issue_egui_job/gw_egui_service'
], (mockData, gwInvoiceService, gwEguiService) => {
  var invObj = gwInvoiceService.composeInvObj(
    mockData.jkIssuedAndNotImportedSearchResults
  )
  log.debug({ title: 'invObj', details: invObj })
  var eguiService = new gwEguiService(invObj)
  log.debug({ title: 'eguiObj', details: eguiService.getEgui() })
  log.debug({ title: 'Execution end' })
})
