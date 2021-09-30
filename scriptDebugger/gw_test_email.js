require([
  'SuiteApps/com.gateweb.gwegui/gw_issue_egui/services/email/gw_service_egui_email'
], (gwEmailService) => {
  var result = gwEmailService.sendByVoucherId('debuggerTest Email', 2251)
  log.debug({ title: 'result', details: result })
  log.debug({ title: 'Execution end' })
})
