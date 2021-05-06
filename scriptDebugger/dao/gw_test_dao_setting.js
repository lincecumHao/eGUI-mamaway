require([
  'SuiteApps/com.gateweb.gwegui/gw_dao/settings/gw_dao_egui_config_21',
], (gwEguiConfigDao) => {
  var config = gwEguiConfigDao.getConfig()
  log.debug({ title: 'config', details: config })
  log.debug({ title: 'Execution end' })
})
