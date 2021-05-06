require([
  'SuiteApps/com.gateweb.gwegui/gw_dao/assignLog/gw_dao_assign_log_21',
], (gwAssignLogDao) => {
  const params = {
    taxId: '24549210',
    departmentId: '',
    classId: '',
    yearMonth: '11004',
    guiType: '07',
    statusId: ['11', '12'],
  }
  var assignLogs = gwAssignLogDao.getAssignLogs(params)
  log.debug({ title: 'assignLogs', details: assignLogs })
  log.debug({ title: 'Execution end' })
})
