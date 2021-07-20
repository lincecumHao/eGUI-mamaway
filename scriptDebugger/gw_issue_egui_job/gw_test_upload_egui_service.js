require([
  'SuiteApps/com.gateweb.gwegui/gw_dao/voucher/gw_dao_voucher',
  'SuiteApps/com.gateweb.gwegui/gw_issue_egui_job/services/upload/gw_service_upload_egui'
], (gwVoucherDao, gwEguiUploadService) => {
  var eguiObj13585 = gwVoucherDao.getGuiByVoucherId(13585)
  var xmlString13585 = gwEguiUploadService.getXmlString(eguiObj13585)
  log.debug({ title: 'eguiObj13585', details: eguiObj13585 })
  log.debug({ title: 'xmlString13585', details: xmlString13585 })
  var eguiObj13584 = gwVoucherDao.getGuiByVoucherId(13584)
  var xmlString13584 = gwEguiUploadService.getXmlString(eguiObj13584)
  log.debug({ title: 'eguiObj13584', details: eguiObj13584 })
  log.debug({ title: 'xmlString13584', details: xmlString13584 })
  var eguiObj13583 = gwVoucherDao.getGuiByVoucherId(13583)
  var xmlString13583 = gwEguiUploadService.getXmlString(eguiObj13583)
  log.debug({ title: 'eguiObj13583', details: eguiObj13583 })
  log.debug({ title: 'xmlString13583', details: xmlString13583 })
  var eguiObj13581 = gwVoucherDao.getGuiByVoucherId(13581)
  var xmlString13581 = gwEguiUploadService.getXmlString(eguiObj13581)
  log.debug({ title: 'eguiObj13581', details: eguiObj13581 })
  log.debug({ title: 'xmlString13581', details: xmlString13581 })
  log.debug({ title: 'Execution end' })
})
