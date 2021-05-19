require(['SuiteApps/com.gateweb.gwegui/gw_dao/taxType/gw_dao_tax_type_21'], (
  gwTaxTypeDao
) => {
  const taxTypes = gwTaxTypeDao.getAll()
  log.debug({ title: 'taxTypes', details: taxTypes })
  log.debug({ title: 'Execution end' })
})
