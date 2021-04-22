define(['../../library/ramda.min'], function (ramda) {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2021 Gateweb
   * @author Sean Lin <sean.hyl@gmail.com>
   *
   * @NApiVersion 2.0
   * @NModuleScope Public

   */
  var exports = {}
  var fieldConfig = {
    custrecord_gw_edd_main_number: {
      id: 'custrecord_gw_edd_main_number',
      sourceField: '',
      outputField: 'documentNumber',
    },
    custrecord_gw_edd_item_desc: {
      id: 'custrecord_gw_edd_item_desc',
      sourceField: 'itemName',
      outputField: 'itemName',
    },

    custrecord_gw_edd_unit: {
      id: 'custrecord_gw_edd_unit',
      sourceField: 'unit',
      outputField: 'unit',
    },
    custrecord_gw_edd_unit_price: {
      id: 'custrecord_gw_edd_unit_price',
      sourceField: 'unitPrice',
      outputField: 'unitPrice',
    },
    custrecord_gw_edd_unit_tax_amt: {
      id: 'custrecord_gw_edd_unit_tax_amt',
      sourceField: 'lineUnitTaxAmtCalculated',
      outputField: 'lineUnitTaxAmtCalculated',
    },
    custrecord_gw_edd_unit_total_amt: {
      id: 'custrecord_gw_edd_unit_total_amt',
      sourceField: 'lineUnitTotalAmtCalculated',
      outputField: 'lineUnitTotalAmtCalculated',
    },
    custrecord_gw_edd_qty: {
      id: 'custrecord_gw_edd_qty',
      sourceField: 'quantity',
      outputField: 'quantity',
    },
    custrecord_gw_edd_tax_rate: {
      id: 'custrecord_gw_edd_item_tax_rate',
      sourceField: 'taxRate',
      outputField: 'taxRate',
    },
    custrecord_gw_edd_tax_type: {
      id: 'custrecord_gw_edd_tax_type',
      sourceField: 'taxType.value',
      outputField: 'taxType',
    },
    custrecord_gw_edd_sales_amt: {
      id: 'custrecord_gw_edd_sales_amt',
      sourceField: 'salesAmt',
      outputField: 'salesAmt',
    },
    custrecord_gw_edd_tax_amt: {
      id: 'custrecord_gw_edd_tax_amt',
      sourceField: 'lineTaxAmtCalculated',
      outputField: 'lineTaxAmtCalculated',
    },
    custrecord_gw_edd_total_amt: {
      id: 'custrecord_gw_edd_total_amt',
      sourceField: 'lineTotalAmtCalculated',
      outputField: 'lineTotalAmtCalculated',
    },
    custrecord_gw_edd_sequence: {
      id: 'custrecord_gw_edd_sequence',
      sourceField: 'lineSeq',
      outputField: 'lineSeq',
    },
    custrecord_gw_edd_remark: {
      id: 'custrecord_gw_edd_remark',
      sourceField: 'itemMemo',
      outputField: 'itemMemo',
    },
    custrecord_gw_edd_applied_gui: {
      id: 'custrecord_gw_edd_applied_gui',
      sourceField: 'appliedGui',
      outputField: 'appliedGui',
    },
    custrecord_gw_edd_ns_tran_type: {
      id: 'custrecord_gw_edd_ns_tran_type',
      sourceField: 'tranType.text',
      outputField: 'tranType',
    },
    custrecord_gw_edd_ns_tran: {
      id: 'custrecord_gw_edd_ns_tran',
      sourceField: 'tranInternalId',
      outputField: 'tranInternalId',
    },
    custrecord_gw_edd_ns_item: {
      id: 'custrecord_gw_edd_ns_item',
      sourceField: 'item.value',
      outputField: 'item',
    },
    custrecord_gw_edd_ns_disc_amt: {
      id: 'custrecord_gw_edd_ns_disc_amt',
      sourceField: '',
      outputField: '',
    },
    custrecord_gw_edd_ns_disc_count: {
      id: 'custrecord_gw_edd_ns_disc_count',
      sourceField: '',
      outputField: '',
    },
    custrecord_gw_edd_apply_period: {
      id: 'custrecord_gw_edd_apply_period',
      sourceField: '',
      outputField: '',
    },
  }

  var fieldInputMapping = ramda.reduce(
    function (result, fieldId) {
      var fieldObj = fieldConfig[fieldId]
      result[fieldId] = fieldObj.sourceField || ''
      return result
    },
    {},
    Object.keys(fieldConfig)
  )

  var fieldOutputMapping = ramda.reduce(
    function (result, fieldId) {
      var fieldObj = fieldConfig[fieldId]
      result[fieldObj.id] = fieldObj.outputField || ''
      return result
    },
    {},
    Object.keys(fieldConfig)
  )

  exports.fields = fieldConfig
  exports.allFieldIds = Object.keys(fieldConfig).map(function (key) {
    return key
  })
  exports.fieldOutputMapping = fieldOutputMapping
  exports.fieldInputMapping = fieldInputMapping
  return exports
})
