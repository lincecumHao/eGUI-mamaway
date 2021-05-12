require([
  'SuiteApps/com.gateweb.gwegui/gw_issue_egui_job/gw_egui_book_service',
], (gwEguiBookService) => {
  var params = {
    taxId: '24549210',
    departmentId: '',
    classId: '',
    yearMonth: '11004',
    guiType: '07',
    statusId: ['11', '12'],
    eguiFormatValue: '35',
  }
  var eguiNumbers = gwEguiBookService.getNewEGuiNumber(
    params.guiType,
    params.taxId,
    params.departmentId,
    params.classId,
    params.yearMonth,
    '',
    1
  )
  log.debug({ title: 'eguiNumbers', details: eguiNumbers })
  log.debug({ title: 'Execution end' })
})
