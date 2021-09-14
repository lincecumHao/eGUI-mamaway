require(['SuiteApps/com.gateweb.gwegui/domain/eGUI/gw_reissue_egui'], (eguiReIssueService) => {
  var service = new eguiReIssueService(3256, 2343746)
  var result = service.execute()
  log.debug({title: 'Execution end'})
});
