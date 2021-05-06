require(['SuiteApps/com.gateweb.gwegui/gw_dao/migType/gw_dao_mig_type_21'], (
  gwMigTypeDao
) => {
  const migType = gwMigTypeDao.getIssueEguiMigType(
    gwMigTypeDao.businessTranTypeEnum.B2C
  )
  log.debug({ title: 'migType', details: migType })
  log.debug({ title: 'Execution end' })
})
