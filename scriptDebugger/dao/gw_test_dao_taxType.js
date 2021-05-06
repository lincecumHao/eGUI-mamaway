require(['SuiteApps/com.gateweb.gwegui/gw_dao/taxType/gw_dao_tax_type_21'], (
  gwTaxTypeDao
) => {
  const taxType = gwTaxTypeDao.getTaxTypeByTaxCode('6')
  log.debug({ title: 'taxType', details: taxType })
  log.debug({ title: 'Execution end' })
})
