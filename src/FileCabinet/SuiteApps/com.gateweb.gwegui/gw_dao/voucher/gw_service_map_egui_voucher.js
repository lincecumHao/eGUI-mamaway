define([
  '../../library/gw_mapping_util',
  './gw_dao_voucher_main_fields',
  './gw_dao_voucher_detail_fields',
  '../../library/ramda.min',
], (gwMapUtil, mainFields, detailFields, ramda) => {
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
  class EguiVoucherMapper {
    transform(eguiObj) {
      log.debug({ title: 'Egui Map to Voucher eguiObj', details: eguiObj })
      var voucherRecordObj = gwMapUtil.mapFrom(eguiObj, mainFields)
      gwMapUtil.mapFrom(eguiObj, mainFields)
      voucherRecordObj.lines = ramda.map((line) => {
        return gwMapUtil.mapFrom(line, detailFields)
      }, eguiObj.lines)
      return voucherRecordObj
    }
  }

  return new EguiVoucherMapper()
})
