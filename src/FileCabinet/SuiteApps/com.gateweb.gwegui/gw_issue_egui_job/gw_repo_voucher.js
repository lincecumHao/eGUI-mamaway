define([
  '../library/ramda.min',
  './gw_transform_util',
  '../gw_dao/voucher/gw_dao_voucher_main_fields',
  '../gw_dao/voucher/gw_dao_voucher_detail_fields',
], (ramda, gwObjectMapper, mainFields, detailFields) => {
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
  class VoucherRepo {
    transEGuiToVoucherMain(eguiObj) {
      var voucherMain = gwObjectMapper.mapFrom(eguiObj, mainFields)
      return voucherMain
    }

    transEguiDetailToVoucherDetail(eguiObjLines) {
      return ramda.map((line) => {
        var voucherDetail = gwObjectMapper.mapFrom(line, detailFields)
        return voucherDetail
      }, eguiObjLines)
    }
  }

  return VoucherRepo
})
