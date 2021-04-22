require(['SuiteApps/com.gateweb.egui/dao/guiType/gw_dao_egui_type_21'], (
  gwGuiTypeDao
) => {
  var guiType = gwGuiTypeDao.getByValue('07')
  log.debug({ title: 'guiType', details: guiType })
  log.debug({ title: 'Execution end' })
})
