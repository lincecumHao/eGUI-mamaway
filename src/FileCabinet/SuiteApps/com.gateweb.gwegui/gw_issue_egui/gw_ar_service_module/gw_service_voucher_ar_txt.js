define([
  '../../../gateweb_tax/gw_tax/gw_lib/gw_service_ap_doc_apply_period',
  './gw_service_tax_ar_txt',
], function (apDocApplyPeriod, gwServiceTaxApTxt) {
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

  function convertYearMonthToTraditionalYearMonth(year_month) {
    var _tradition_year_month = ''

    if (typeof year_month !== 'undefined') {
      var _year = year_month.substr(0, 4)
      _year = _year - 1911

      var _month = year_month.substr(4, 2)
      _tradition_year_month = _year + '' + _month
    }

    return _tradition_year_month
  }

  ////////////////////////////////////////////////////////////////////////////////
  function getTxtArLine(internal_id, business_vat) {
    log.debug(
      'getTxtArLine',
      'internal_id=' + internal_id + ' ,business_vat=' + business_vat
    )
    var _txtObjAry = []
    var _jsonObjAry = apDocApplyPeriod.getArData(internal_id)
    log.debug('_jsonObjAry', _jsonObjAry)
    if (typeof _jsonObjAry !== 'undefined') {
      gwServiceTaxApTxt.setBuId(business_vat)
      _txtObjAry = gwServiceTaxApTxt.genAllTxtLines(_jsonObjAry)
    }

    return _txtObjAry
  }

  exports.getTxtArLine = getTxtArLine

  return exports
})
