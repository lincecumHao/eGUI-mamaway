define([
  'N/record',
  '../../../gateweb_tax/gw_tax/gw_lib/gw_service_ap_doc_apply_period',
  '../../../gateweb_tax/gw_tax/gw_lib/gw_service_city_options',
], function (record, apDocApplyPeriod, serviceCityOptions) {
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

  //零稅率T02(營業人資料id, 年月id)
  function getT02TextLines(business_entity_id, year_month_internal_id) {
    var _json_obj_ary = []
    //期別資料
    var _ar_main_json_ary = apDocApplyPeriod.getArMainData(
      year_month_internal_id
    )
    //營業人資料
    var _business_entity_obj = getBusinessEntityObj(business_entity_id)

    for (var i = 0; i < _ar_main_json_ary.length; i++) {
      var _main_obj = _ar_main_json_ary[i]
      //_main_obj.custrecord_gw_voucher_status        = 'VOUCHER_SUCCESS';
      //_main_obj.custrecord_gw_voucher_upload_status = 'C'
      //上傳成功的 35 及零稅率金額 !=0 才處理 custrecord_gw_tax_type=2
      if (
        _main_obj.custrecord_gw_voucher_upload_status == 'C' &&
        _main_obj.custrecord_gw_voucher_status == 'VOUCHER_SUCCESS' &&
        _main_obj.custrecord_gw_voucher_format_code == '35' &&
        (_main_obj.custrecord_gw_zero_sales_amount != 0 ||
          _main_obj.custrecord_gw_tax_type == '2')
      ) {
        //零稅部分
        if (_main_obj.custrecord_gw_zero_sales_amount != 0) {
          var _json_obj = {
            tax_no: _main_obj.custrecord_gw_seller,
            city: _business_entity_obj.city,
            tax_id: _business_entity_obj.tax_id,
            period_year_month: _main_obj.custrecord_gw_voucher_yearmonth,
            tradition_year_month: convertTraditionYearMonth(
              _main_obj.custrecord_gw_voucher_date
            ),
            voucher_number: getVoucherNumber(
              _main_obj.custrecord_gw_voucher_number
            ),
            buyer: getBuyer(_main_obj.custrecord_gw_buyer),
            applicable_zero_tax: getApplicableZeroTax(
              _main_obj.custrecord_gw_applicable_zero_tax.toString()
            ),
            clearance_mark: getClearanceMark(
              _main_obj.custrecord_gw_clearance_mark
            ),
            customs_export_category: getCustomsExportCategory(
              _main_obj.custrecord_gw_customs_export_category
            ),
            customs_export_no: getCustomsExportNo(
              _main_obj.custrecord_gw_customs_export_no
            ),
            zero_sales_amount: getZeroSalesAmount(
              _main_obj.custrecord_gw_zero_sales_amount.toString()
            ),
            customs_export_date: getCustomsExportDate(
              _main_obj.custrecord_gw_customs_export_date
            ),
          }

          var _text = ''
          Object.keys(_json_obj).forEach(function (key) {
            _text += _json_obj[key]
          })

          _json_obj_ary.push(_text)
        }
      }
    }

    return _json_obj_ary
  }

  function getBuyer(buyer) {
    return buyer == '0000000000' ? prependSpace('', 8) : buyer
  }

  function getApplicableZeroTax(applicable_zero_tax) {
    return applicable_zero_tax == '' ? prependSpace('', 1) : applicable_zero_tax
  }

  function getVoucherNumber(voucher_number) {
    return voucher_number == '' ? prependSpace('', 10) : voucher_number
  }

  function getClearanceMark(clearance_mark) {
    return clearance_mark == '' ? prependSpace('', 1) : clearance_mark
  }

  function getCustomsExportCategory(customs_export_category) {
    return customs_export_category == ''
      ? prependSpace('', 2)
      : customs_export_category
  }

  function getCustomsExportNo(customs_export_no) {
    return customs_export_no == '' ? prependSpace('', 14) : customs_export_no
  }

  function getCustomsExportDate(customs_export_date) {
    return customs_export_date == '' ? prependSpace('', 7) : customs_export_date
  }

  function getZeroSalesAmount(zero_sales_amount) {
    return prependZero(zero_sales_amount, 12)
  }

  function prependSpace(value, totalLength) {
    var padChar = ' '
    //return value.toString().padStart(totalLength, padChar);
    return padStartHelp(value, totalLength, padChar)
  }

  function prependZero(value, totalLength) {
    var padChar = '0'
    //return value.toString().padStart(totalLength, padChar);
    return padStartHelp(value, totalLength, padChar)
  }

  function padStartHelp(value, totalLength, padChar) {
    var _result_value = value
    if (value.length < totalLength) {
      for (var i = 0; i < totalLength - value.length; i++) {
        _result_value = padChar + _result_value
      }
    }
    return _result_value
  }

  function convertTraditionYearMonth(voucher_date) {
    var _tradition_year_month = '' //民國年月(11012)
    try {
      if (voucher_date.length != 0) {
        _tradition_year_month = (parseInt(voucher_date, 10) - 19110000)
          .toString()
          .substring(0, 5)
      }
    } catch (e) {
      log.error(e.name, e.message)
    }
    return _tradition_year_month
  }

  function getBusinessEntityObj(business_entity_id) {
    var _business_entity_obj
    try {
      //TODO customrecord_gw_business_entity
      var _business_entity_record = record.load({
        type: 'customrecord_gw_business_entity',
        id: business_entity_id,
        isDynamic: true,
      })
      //稅籍編號
      var _be_vat_number = _business_entity_record.getValue({
        fieldId: 'custrecord_gw_be_vat_number',
      })
      //營業城市(文字)
      var _business_address_city_text = _business_entity_record.getValue({
        fieldId: 'custrecord_gw_be_business_address_city',
      })
      var _business_address_city_value = getCityValue(
        _business_address_city_text
      )

      _business_entity_obj = {
        tax_id: _be_vat_number,
        city: _business_address_city_value,
      }
    } catch (e) {
      log.error(e.name, e.message)
    }
    return _business_entity_obj
  }

  function getCityValue(business_address_city_text) {
    var _business_address_city_value = ''
    try {
      var _json_obj = serviceCityOptions.getCityOptionByName(
        business_address_city_text
      )
      //json_obj={"value":"F","text":"新北市","id":"6"}
      _business_address_city_value = _json_obj.value
    } catch (e) {
      log.error(e.name, e.message)
    }
    return _business_address_city_value
  }

  exports.getT02TextLines = getT02TextLines

  return exports
})
