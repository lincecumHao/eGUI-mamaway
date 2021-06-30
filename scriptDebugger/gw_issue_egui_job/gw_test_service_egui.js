require(['SuiteApps/com.gateweb.gwegui/gw_issue_egui_job/gw_egui_service'], (
  gwEguiService
) => {
  const eGuiService = new gwEguiService()
  var result = eGuiService.uploadEgui(1450)
  log.debug({ title: 'result', details: result })
  log.debug({ title: 'Execution end' })
})
