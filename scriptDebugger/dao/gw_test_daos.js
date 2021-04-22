require([
  'SuiteApps/com.gateweb.gwegui/gw_dao/applyPeriod/gw_dao_apply_period_21',
  'SuiteApps/com.gateweb.gwegui/gw_dao/busEnt/gw_dao_business_entity_21',
], (gwApplyPeriodDao, gwBusinessEntityDao) => {
  var applyPeriods = gwApplyPeriodDao.getByValue('11004')
  log.debug({ title: 'applyPeriod', details: applyPeriods })
  var businessEnt = gwBusinessEntityDao.getByTaxId('24549210')
  log.debug({ title: 'businessEnt', details: businessEnt })
  log.debug({ title: 'Execution end' })
})
