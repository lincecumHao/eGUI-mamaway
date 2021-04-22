define([
  '../../../gateweb_tax/gw_tax/gw_lib/gw_service_ap_doc_apply_period',
], function (apDocApplyPeriod) {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2020 Gateweb
   * @author Walter Jow <se06@gateweb.com.tw>
   *
   * @NApiVersion 2.0
   * @NModuleScope Public

   */
  var exports = {}

  var _GATEWEB_MODEL = 'GATEWEB'

  function getTETUObject(internalId) {
    var _ar_main_json_ary = apDocApplyPeriod.getArMainData(internalId)

    //銷項發票
    var _total_sales_amount = 0 //未稅金額
    var _total_sales_tax_amount = 0 //稅額
    var _total_free_amount = 0 //免稅金額
    var _total_zero_amount_pass_customs = 0 //零稅金額=>經海關
    var _total_zero_amount_not_pass_customs = 0 //零稅金額=>非經海關

    //退貨及折讓
    var _total_return_sales_amount = 0 //未稅金額
    var _total_return_sales_tax_amount = 0 //稅額
    var _total_return_free_amount = 0 //免稅金額
    var _total_return_zero_amount_pass_customs = 0 //零稅金額=>經海關
    var _total_return_zero_amount_not_pass_customs = 0 //零稅金額=>非經海關

    for (var i = 0; i < _ar_main_json_ary.length; i++) {
      var _main_obj = _ar_main_json_ary[i]

      //上傳成功的33, 35才處理
      if (
        (_main_obj.custrecord_gw_voucher_upload_status != 'C' &&
          _main_obj.custrecord_gw_voucher_status != 'VOUCHER_SUCCESS') ||
        (_main_obj.custrecord_gw_voucher_format_code != '33' &&
          _main_obj.custrecord_gw_voucher_format_code != '35')
      )
        continue

      var _gw_upload_access_model = _main_obj.custrecord_gw_upload_access_model

      //處理發票+折讓單
      if (_main_obj.custrecord_gw_sales_amount != 0) {
        //應稅部分
        var _ns_sales_amount = Math.round(_main_obj.custrecord_gw_sales_amount)
        var _ns_tax_amount = 0
        if (_gw_upload_access_model == _GATEWEB_MODEL) {
          //以財政部計算公式為準
          _ns_tax_amount = Math.round(
            0.05 * _main_obj.custrecord_gw_sales_amount
          )
        } else {
          _ns_tax_amount = Math.round(_main_obj.custrecord_gw_tax_amount)
        }
        if (_main_obj.custrecord_gw_voucher_type === 'EGUI') {
          _total_sales_amount += _ns_sales_amount
          _total_sales_tax_amount += _ns_tax_amount
        } else {
          _total_return_sales_amount += _ns_sales_amount
          _total_return_sales_tax_amount += _ns_tax_amount
        }
      }
      if (_main_obj.custrecord_gw_zero_sales_amount != 0) {
        //零稅部分
        var _ns_zero_amount = Math.round(
          _main_obj.custrecord_gw_zero_sales_amount
        )
        //custrecord_gw_clearance_mark
        if (_main_obj.custrecord_gw_clearance_mark == '1') {
          //經海關 Customs
          if (_main_obj.custrecord_gw_voucher_type === 'EGUI') {
            _total_zero_amount_pass_customs += _ns_zero_amount
          } else {
            _total_return_zero_amount_pass_customs += _ns_zero_amount
          }
        } else if (_main_obj.custrecord_gw_clearance_mark == '2') {
          //不經海關
          if (_main_obj.custrecord_gw_voucher_type === 'EGUI') {
            _total_zero_amount_not_pass_customs += _ns_zero_amount
          } else {
            _total_return_zero_amount_not_pass_customs += _ns_zero_amount
          }
        }
      }
      if (_main_obj.custrecord_gw_free_sales_amount != 0) {
        //免稅部分
        var _ns_free_amount = Math.round(
          _main_obj.custrecord_gw_free_sales_amount
        )
        if (_main_obj.custrecord_gw_voucher_type === 'EGUI') {
          _total_free_amount += _ns_free_amount
        } else {
          _total_return_free_amount += _ns_free_amount
        }
      }
    }

    var _json_obj = {
      10: _total_sales_amount,
      13: _total_return_sales_amount,
      14: _total_sales_amount - _total_return_sales_amount,
      16: _total_sales_tax_amount,
      19: _total_return_sales_tax_amount,
      20: _total_sales_tax_amount - _total_return_sales_tax_amount,
      22: _total_zero_amount_not_pass_customs,
      23: _total_zero_amount_pass_customs,
      24:
        _total_return_zero_amount_pass_customs +
        _total_return_zero_amount_not_pass_customs,
      25:
        _total_zero_amount_pass_customs +
        _total_zero_amount_not_pass_customs -
        (_total_return_zero_amount_pass_customs +
          _total_return_zero_amount_not_pass_customs),
      27: _total_free_amount,
      30: _total_return_free_amount,
      31: _total_free_amount - _total_return_free_amount,
    }

    return _json_obj
  }

  exports.getTETUObject = getTETUObject

  return exports
})
