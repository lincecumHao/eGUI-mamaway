require([
  'SuiteApps/com.gateweb.gwegui/gw_dao/applyPeriod/gw_dao_apply_period_21',
], (gwApplyPeriodDao) => {
  const applyPeriod11004 = gwApplyPeriodDao.getByText('11004')
  log.debug({ title: 'applyPeriod11004', details: applyPeriod11004 })
  log.debug({ title: 'Execution end' })
})
