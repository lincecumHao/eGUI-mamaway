require([
  'N/runtime',
  'SuiteApps/com.gateweb.gwegui/gw_dao/voucher/gw_dao_voucher',
  'SuiteApps/com.gateweb.gwegui/gw_issue_egui_job/services/upload/gw_service_upload_egui',
], function (runtime, gwVoucherDao, gwEguiUploadService) {
  runtime.getCurrentSession().set({
    name: 'refresh',
    value: JSON.stringify(['customrecord_gw_business_entity']),
  })
  const voucherId = 1302
  var eguiObj = gwVoucherDao.searchVoucherByIds([voucherId])[0]
  log.debug({ title: 'eguiService uploadEgui eguiObj', details: eguiObj })
  var filename = `${eguiObj.migTypeOption.migType}-${eguiObj.documentNumber}-${voucherId}.xml`
  var xmlString = gwEguiUploadService.getXmlString(eguiObj)
  log.debug({ title: 'xmlString', details: xmlString })
  log.debug({ title: 'Execution end' })
})
