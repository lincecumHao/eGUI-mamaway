require([
  'SuiteApps/com.gateweb.gwegui/gw_dao/docFormat/gw_dao_doc_format_21',
], (gwDocFormatDao) => {
  const docFormatDefault = gwDocFormatDao.getById(20)
  log.debug({ title: 'applyPeriod11004', details: docFormatDefault })
  log.debug({ title: 'Execution end' })
})
