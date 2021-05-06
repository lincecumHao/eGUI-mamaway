require([
  'SuiteApps/com.gateweb.gwegui/gw_dao/taxCalcMethod/gw_dao_tax_calc_method_21',
], (gwTaxCalculationDao) => {
  const taxCalculation = gwTaxCalculationDao.getById('1')
  log.debug({ title: 'taxCalculation', details: taxCalculation })
  log.debug({ title: 'Execution end' })
})
