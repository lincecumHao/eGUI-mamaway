require([
  'SuiteApps/com.gateweb.gwegui/gw_dao/voucher/gw_dao_voucher',
  'SuiteApps/com.gateweb.gwegui/gw_issue_egui_job/gw_invoice_service',
  'SuiteApps/com.gateweb.gwegui/gw_issue_egui_job/gw_egui_service',
  'SuiteApps/com.gateweb.gwegui/gw_issue_egui_job/services/upload/gw_service_upload_egui',
  'SuiteApps/com.gateweb.gwegui/library/ramda.min',
  'SuiteApps/com.gateweb.gwegui/gw_dao/voucher/gw_service_map_egui_voucher'
], (
  gwVoucherDao,
  gwInvoiceService,
  gwEguiService,
  gwEguiUploadService,
  ramda,
  gwEguiVoucherMapper
) => {
  function getDateStr(dateStr) {
    var date = new Date(dateStr)
    return (
      date.getFullYear().toString() +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      date.getDate().toString().padStart(2, '0')
    )
  }
  function updateEguiVoucherRecordObj(voucherMain, voucherDetail) {
    var mainObj = JSON.parse(JSON.stringify(voucherMain))
    mainObj['name'] = mainObj['custrecord_gw_voucher_number']
    mainObj['custrecord_gw_voucher_date'] = getDateStr(
      mainObj['custrecord_gw_voucher_date']
    )
    mainObj['custrecord_gw_voucher_sales_tax_apply'] =
      mainObj['custrecord_gw_voucher_sales_tax_apply'] === 'T'
    mainObj['custrecord_gw_tax_rate'] =
      parseFloat(mainObj['custrecord_gw_tax_rate']) < 1
        ? parseFloat(mainObj['custrecord_gw_tax_rate']) * 100
        : parseFloat(mainObj['custrecord_gw_tax_rate'])
    mainObj['custrecord_gw_dm_seller_profile'] =
      mainObj['custrecord_gw_dm_seller_profile'].id
    mainObj['custrecord_gw_lock_transaction'] = true
    mainObj['custrecord_gw_is_completed_detail'] = true
    mainObj['custrecord_gw_voucher_status'] = 'VOUCHER_SUCCESS'
    mainObj['lines'] = ramda.map((detail) => {
      detail['name'] = 'VoucherDetailRecord'
      detail['custrecord_gw_dtl_voucher_type'] =
        mainObj['custrecord_gw_voucher_type']
      detail['custrecord_gw_dtl_item_tax_rate'] =
        parseFloat(detail['custrecord_gw_dtl_item_tax_rate']) < 1
          ? parseFloat(detail['custrecord_gw_dtl_item_tax_rate']) * 100
          : parseFloat(detail['custrecord_gw_dtl_item_tax_rate'])
      detail['custrecord_gw_dtl_voucher_apply_period'] =
        mainObj['custrecord_voucher_sale_tax_apply_period']
      // detail['custrecord_gw_dtl_voucher_number']
      detail['custrecord_gw_dtl_voucher_date'] =
        mainObj['custrecord_gw_voucher_date']
      detail['custrecord_gw_dtl_voucher_time'] =
        mainObj['custrecord_gw_voucher_time']
      detail['custrecord_gw_dtl_voucher_yearmonth'] =
        mainObj['custrecord_gw_voucher_yearmonth']
      return detail
    }, voucherDetail)
    log.debug({ title: 'mainObj lines', details: mainObj['lines'] })
    return mainObj
  }

  var invoiceSearchResult = gwInvoiceService.getInvoiceSearchResultDebugger(
    3094975
  )
  var voucherId = 35602
  log.debug({ title: 'invoiceSearchResult', details: invoiceSearchResult })
  var invObj = gwInvoiceService.composeInvObj(invoiceSearchResult)
  log.debug({ title: 'invObj', details: invObj })
  var eguiService = new gwEguiService(invObj)
  log.debug({ title: 'eguiObj', details: eguiService.getEgui() })
  var voucherRecordObj = gwEguiVoucherMapper.transform(eguiService.getEgui())
  voucherRecordObj = updateEguiVoucherRecordObj(
    voucherRecordObj,
    voucherRecordObj.lines
  )
  // var voucherId = eguiService.issueEgui()
  log.debug({ title: 'voucherRecordObj', details: voucherRecordObj })
  // if (voucherId && eguiService.getEgui().isNotUploadEGui === 'F') {
  //   var uploadEguiResult = eguiService.uploadEgui(voucherId)
  // }
  // var eguiObj = gwVoucherDao.getGuiByVoucherId(voucherId)
  // log.debug({ title: 'eguiObj From Voucher', details: eguiObj })
  // var xmlString = gwEguiUploadService.getXmlString(eguiObj)
  // log.debug({ title: 'xmlString', details: xmlString })
  log.debug({ title: 'Execution end' })
})
