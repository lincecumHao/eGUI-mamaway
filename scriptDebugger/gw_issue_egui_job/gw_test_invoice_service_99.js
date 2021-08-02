require([
  'SuiteApps/com.gateweb.gwegui/gw_dao/voucher/gw_dao_voucher',
  'SuiteApps/com.gateweb.gwegui/gw_issue_egui_job/gw_invoice_service',
  'SuiteApps/com.gateweb.gwegui/gw_issue_egui_job/gw_egui_service',
  'SuiteApps/com.gateweb.gwegui/gw_issue_egui_job/services/upload/gw_service_upload_egui'
], (gwVoucherDao, gwInvoiceService, gwEguiService, gwEguiUploadService) => {
  var invoiceSearchResult = gwInvoiceService.getInvoiceSearchResultDebugger(
    3053518
  )
  var voucherId = 35602
  log.debug({ title: 'invoiceSearchResult', details: invoiceSearchResult })
  var invObj = gwInvoiceService.composeInvObj(invoiceSearchResult)
  log.debug({ title: 'invObj', details: invObj })
  var eguiService = new gwEguiService(invObj)
  log.debug({ title: 'eguiObj', details: eguiService.getEgui() })
  // var voucherId = eguiService.issueEgui()
  // log.debug({ title: 'voucherId', details: voucherId })
  // if (voucherId && eguiService.getEgui().isNotUploadEGui === 'F') {
  //   var uploadEguiResult = eguiService.uploadEgui(voucherId)
  // }
  var eguiObj = gwVoucherDao.getGuiByVoucherId(voucherId)
  log.debug({ title: 'eguiObj From Voucher', details: eguiObj })
  var xmlString = gwEguiUploadService.getXmlString(eguiObj)
  log.debug({ title: 'xmlString', details: xmlString })
  log.debug({ title: 'Execution end' })
})
