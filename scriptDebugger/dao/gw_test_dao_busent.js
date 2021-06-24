require([
  'SuiteApps/com.gateweb.gwegui/gw_dao/busEnt/gw_dao_business_entity_21'
], (gwBusinessEntDao) => {
  const allBusEnt = gwBusinessEntDao.getAll()
  const busEntBySubsidiary = gwBusinessEntDao.getBySubsidiary('56')
  // const busEntByTax = gwBusinessEntDao.getByTaxId()
  log.debug({ title: 'allBusEnt', details: allBusEnt })
  log.debug({ title: 'busEntBySubsidiary', details: busEntBySubsidiary })
  log.debug({ title: 'Execution end' })
})
