require(['SuiteApps/com.gateweb.egui/egui_book/service/gw_egui_book_manager'], (
  gwEguiBookManager,
) => {
  // Test Import
  /**
   var import_params = {
    taxId: '24549210',
    taxPeriod: '11004',
    track: 'HJ',
    startNum: '37527150',
    endNum: '37527649',
    bookGuiType: '07',
  }
   var result = gwEguiBookManager.importGuiNumber(import_params)
   log.debug({ title: 'result', details: result })
   */
    // Test Get GuiNumber
  var params = {
      taxId: '24549210',
      taxPeriod: '11004',
      count: 100,
    }
  var result = gwEguiBookManager.getNewEguiNumber(params)
  log.debug({ title: 'result', details: result })
  log.debug({ title: 'Execution end' })
})
