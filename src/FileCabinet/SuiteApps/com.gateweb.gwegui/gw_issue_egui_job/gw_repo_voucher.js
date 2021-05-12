define([
  '../library/ramda.min',
  './gw_transform_util',
  '../gw_dao/voucher/gw_dao_voucher_main',
  '../gw_dao/voucher/gw_dao_voucher_main_fields',
  '../gw_dao/voucher/gw_dao_voucher_detail_fields',
], (ramda, gwObjectMapper, gwVoucherDao, mainFields, detailFields) => {
  /**
     * Module Description...
     *
     * @type {Object} module-name
     *
     * @copyright 2021 Gateweb
     * @author Sean Lin <sean.hyl@gmail.com>
     *
     * @NApiVersion 2.1
     * @NModuleScope Public

     */

  function transEGuiToVoucherMain(eguiObj) {
    return gwObjectMapper.mapFrom(eguiObj, mainFields)
  }

  function transEguiDetailToVoucherDetail(eguiObjLines) {
    return ramda.map((line) => {
      return gwObjectMapper.mapFrom(line, detailFields)
    }, eguiObjLines)
  }

  function getDateStr(dateStr) {
    var date = new Date(dateStr)
    return (
      date.getFullYear().toString() +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      date.getDate().toString().padStart(2, '0')
    )
  }

  function mergeVoucherRecordObj(voucherMain, voucherDetail) {
    var mainObj = JSON.parse(JSON.stringify(voucherMain))
    mainObj['name'] = 'VoucherMainRecord'
    mainObj['custrecord_gw_voucher_date'] = getDateStr(
      mainObj['custrecord_gw_voucher_date']
    )
    mainObj['custrecord_gw_voucher_sales_tax_apply'] =
      mainObj['custrecord_gw_voucher_sales_tax_apply'] === 'T'
    mainObj['custrecord_gw_tax_rate'] =
      parseFloat(mainObj['custrecord_gw_tax_rate']) * 100
    mainObj['lines'] = ramda.map((detail) => {
      detail['name'] = 'VoucherDetailRecord'
      detail['custrecord_gw_dtl_voucher_type'] =
        mainObj['custrecord_gw_voucher_type']
      detail['custrecord_gw_dtl_item_tax_rate'] =
        parseFloat(detail['custrecord_gw_dtl_item_tax_rate']) * 100
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
    return mainObj
  }

  class VoucherRepo {
    transEgui(eguiObj) {
      return mergeVoucherRecordObj(
        transEGuiToVoucherMain(eguiObj),
        transEguiDetailToVoucherDetail(eguiObj.lines)
      )
    }

    saveToRecord(eguiObj) {
      // TODO 1: voucher number?
      // TODO 2: Voucher detail Tax Code need to fix
      // TODO 3: Voucher Main tax rate need to be integer
      // TODO 4: Buyer info
      return gwVoucherDao.createDocument(this.transEgui(eguiObj))
    }
  }

  return new VoucherRepo()
})
