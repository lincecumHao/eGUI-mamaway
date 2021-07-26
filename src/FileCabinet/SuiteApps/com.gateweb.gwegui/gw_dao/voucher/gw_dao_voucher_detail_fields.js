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
    custrecord_gw_dtl_voucher_type: {
      id: 'custrecord_gw_dtl_voucher_type',
      sourceField: '',
      outputField: 'documentType'
    },
    custrecord_gw_item_description: {
      id: 'custrecord_gw_item_description',
      sourceField: 'itemName',
      outputField: 'itemName'
    },
    custrecord_gw_item_unit: {
      id: 'custrecord_gw_item_unit',
      sourceField: 'unit',
      outputField: 'unit'
    },
    custrecord_gw_unit_price: {
      id: 'custrecord_gw_unit_price',
      sourceField: 'unitPrice',
      outputField: 'unitPrice'
    },
    custrecord_gw_edd_unit_tax_amt: {
      id: 'custrecord_gw_edd_unit_tax_amt',
      sourceField: 'itemUnitTaxAmt',
      outputField: 'itemUnitTaxAmt'
    },
    custrecord_gw_edd_unit_total_amt: {
      id: 'custrecord_gw_edd_unit_total_amt',
      sourceField: 'lineUnitTotalAmtCalculated',
      outputField: 'lineUnitTotalAmtCalculated'
    },
    custrecord_gw_item_quantity: {
      id: 'custrecord_gw_item_quantity',
      sourceField: 'quantity',
      outputField: 'quantity'
    },
    custrecord_gw_dtl_item_tax_rate: {
      id: 'custrecord_gw_dtl_item_tax_rate',
      sourceField: 'taxRate',
      outputField: 'taxRate'
    },
    custrecord_gw_dtl_item_tax_code: {
      id: 'custrecord_gw_dtl_item_tax_code',
      sourceField: 'taxCode.value',
      outputField: 'taxCode'
    },
    custrecord_gw_item_amount: {
      id: 'custrecord_gw_item_amount',
      sourceField: 'salesAmt',
      outputField: 'salesAmt'
    },
    custrecord_gw_item_tax_amount: {
      id: 'custrecord_gw_item_tax_amount',
      sourceField: 'taxAmt',
      outputField: 'taxAmt'
    },
    custrecord_gw_item_total_amount: {
      id: 'custrecord_gw_item_total_amount',
      sourceField: 'totalAmt',
      outputField: 'totalAmt'
    },
    custrecord_gw_item_seq: {
      id: 'custrecord_gw_item_seq',
      sourceField: 'lineSeq',
      outputField: 'lineSeq'
    },
    custrecord_gw_item_remark: {
      id: 'custrecord_gw_item_remark',
      sourceField: 'itemMemo',
      outputField: 'itemMemo'
    },
    custrecord_gw_original_gui_internal_id: {
      id: 'custrecord_gw_original_gui_internal_id',
      sourceField: '',
      outputField: ''
    },
    custrecord_gw_original_gui_number: {
      id: 'custrecord_gw_original_gui_number',
      sourceField: 'appliedGui',
      outputField: 'appliedGui'
    },
    custrecord_gw_original_gui_date: {
      id: 'custrecord_gw_original_gui_date',
      sourceField: '',
      outputField: ''
    },
    custrecord_gw_original_gui_yearmonth: {
      id: 'custrecord_gw_original_gui_yearmonth',
      sourceField: '',
      outputField: ''
    },
    custrecord_gw_dtl_voucher_number: {
      id: 'custrecord_gw_dtl_voucher_number',
      sourceField: '',
      outputField: ''
    },
    custrecord_gw_dtl_voucher_date: {
      id: 'custrecord_gw_dtl_voucher_date',
      sourceField: '',
      outputField: ''
    },
    custrecord_gw_dtl_voucher_time: {
      id: 'custrecord_gw_dtl_voucher_time',
      sourceField: '',
      outputField: ''
    },
    custrecord_gw_dtl_voucher_yearmonth: {
      id: 'custrecord_gw_dtl_voucher_yearmonth',
      sourceField: '',
      outputField: ''
    },
    custrecord_gw_dtl_voucher_status: {
      id: 'custrecord_gw_dtl_voucher_status',
      sourceField: '',
      outputField: ''
    },
    custrecord_gw_dtl_voucher_upload_status: {
      id: 'custrecord_gw_dtl_voucher_upload_status',
      sourceField: '',
      outputField: ''
    },
    custrecord_gw_ns_document_type: {
      id: 'custrecord_gw_ns_document_type',
      sourceField: 'tranType',
      outputField: 'tranType'
    },
    custrecord_gw_ns_document_id: {
      id: 'custrecord_gw_ns_document_id',
      sourceField: 'tranInternalId',
      outputField: 'tranId'
    },
    custrecord_gw_ns_document_number: {
      id: 'custrecord_gw_ns_document_number',
      sourceField: 'tranNum',
      outputField: 'tranNum'
    },
    custrecord_gw_ns_document_apply_id: {
      id: 'custrecord_gw_ns_document_apply_id',
      sourceField: 'tranInternalId',
      outputField: 'tranInternalId'
    },
    custrecord_gw_ns_document_item_id: {
      id: 'custrecord_gw_ns_document_item_id',
      sourceField: 'itemId',
      outputField: 'itemId'
    },
    custrecord_gw_ns_document_items_seq: {
      id: 'custrecord_gw_ns_document_items_seq',
      sourceField: 'nsLineSeq',
      outputField: 'nsLineSeq'
    },
    custrecord_gw_ns_item_discount_amount: {
      id: 'custrecord_gw_ns_item_discount_amount',
      sourceField: 'itemDiscountAmt',
      outputField: 'itemDiscountAmt'
    },
    custrecord_gw_ns_item_discount_count: {
      id: 'custrecord_gw_ns_item_discount_count',
      sourceField: 'itemDiscountCount',
      outputField: 'itemDiscountCount'
    },
    custrecord_gw_dtl_voucher_apply_period: {
      id: 'custrecord_gw_dtl_voucher_apply_period',
      sourceField: '',
      outputField: ''
    }
  }

  var fieldInputMapping = ramda.reduce(
    function (result, fieldId) {
      var fieldObj = fieldConfig[fieldId]
      if (fieldObj.sourceField) {
        result[fieldId] = fieldObj.sourceField
      }
      return result
    },
    {},
    Object.keys(fieldConfig)
  )

  var fieldOutputMapping = ramda.reduce(
    function (result, fieldId) {
      var fieldObj = fieldConfig[fieldId]
      if (fieldObj.outputField) {
        result[fieldObj.id] = fieldObj.outputField
      }
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
