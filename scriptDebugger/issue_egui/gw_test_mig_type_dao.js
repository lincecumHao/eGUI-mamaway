require(['SuiteApps/com.gateweb.gwegui/dao/migType/gw_dao_mig_type_21'], (
  gwMigTypeDao
) => {
  var migType = gwMigTypeDao.getIssueEguiMigType()
  log.debug({ title: 'migType', details: migType })
  log.debug({ title: 'Execution end' })
})
