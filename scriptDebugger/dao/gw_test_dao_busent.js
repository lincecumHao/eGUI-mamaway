require([
  'SuiteApps/com.gateweb.gwegui/gw_dao/busEnt/gw_dao_business_entity_21',
], (gwBusinessEntDao) => {
  const busEnt = gwBusinessEntDao.getBySubsidiary('3')
  log.debug({ title: 'busEnt', details: busEnt })
  log.debug({ title: 'Execution end' })
})
