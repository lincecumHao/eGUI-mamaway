require(['SuiteApps/com.gateweb.gwegui/gw_dao/guiType/gw_dao_egui_type_21'], (
  gwGuiTypeDao
) => {
  const regularType = gwGuiTypeDao.getRegularGuiType()
  log.debug({ title: 'regularType', details: regularType })
  const specialType = gwGuiTypeDao.getSpecialGuiType()
  log.debug({ title: 'specialType', details: specialType })
  log.debug({ title: 'Execution end' })
})
