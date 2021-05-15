require([
  'SuiteApps/com.gateweb.gwegui/gw_issue_egui_job/services/upload/gw_service_upload_egui',
], (gwUploadEguiService) => {
  var service = new gwUploadEguiService()
  service.log.debug({ title: 'Execution end' })
})
