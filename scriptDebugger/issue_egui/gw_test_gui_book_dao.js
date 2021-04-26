require(['SuiteApps/com.gateweb.gwegui/dao/eguiBook/gw_dao_egui_book_21'], (
  gwEguiBookDao
) => {
  // Test Import
  var import_params = {
    taxId: '24549210',
    taxPeriod: '11004',
  }
  var result = gwEguiBookDao.getBooks(import_params)
  log.debug({ title: 'result', details: result })
  log.debug({ title: 'Execution end' })
})
