require([
  'SuiteApps/com.gateweb.gwegui/gw_issue_egui_job/services/email/gw_service_egui_email',
  'SuiteApps/com.gateweb.gwegui/gw_dao/voucher/gw_dao_voucher',
], (gwEmailService, gwVoucherDao) => {
  var eguiObj = gwVoucherDao.searchVoucherByIds([1302])
  log.debug({ title: 'eguiObj', details: eguiObj })
  var result = gwEmailService.send(eguiObj[0])
  log.debug({ title: 'result', details: result })
  log.debug({ title: 'Execution end' })
})
