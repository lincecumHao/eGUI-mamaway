define(['../../library/ramda.min'], function (ramda) {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2022 Gateweb
   * @author Sean Lin <seanlin@gateweb.com.tw>
   *
   * @NApiVersion 2.1
   * @NModuleScope Public

   */
  var exports = {}

  var fieldConfig = {
    docType: {
      sourceField: 'docType',
      outputField: 'custrecord_gw_ap_doc_type'
    },
    guiNum: {
      sourceField: 'guiNum',
      outputField: 'custrecord_gw_ap_doc_gui_num'
    },
    commonNumber: {
      sourceField: 'commonNumber',
      outputField: 'custrecord_gw_ap_doc_comm_num'
    },
    guiStatus: {
      sourceField: 'guiStatus',
      outputField: 'custrecord_gw_ap_doc_status'
    },
    guiDate: {
      sourceField: 'guiDate',
      outputField: 'custrecord_gw_ap_doc_issue_date'
    },
    buyer: {
      sourceField: 'buyer',
      outputField: 'custrecord_gw_ap_doc_buyer'
    },
    buyerTaxId: {
      sourceField: 'buyerTaxId',
      outputField: 'custrecord_gw_ap_doc_buyer_tax_id'
    },
    buyerName: {
      sourceField: 'buyerName',
      outputField: 'custrecord_gw_ap_doc_buyer_name'
    },
    sellerTaxId: {
      sourceField: 'sellerTaxId',
      outputField: 'custrecord_gw_ap_doc_seller_tax_id'
    },
    sellerName: {
      sourceField: 'sellerName',
      outputField: 'custrecord_gw_ap_doc_seller_name'
    },
    salesAmt: {
      sourceField: 'salesAmt',
      outputField: 'custrecord_gw_ap_doc_sales_amt'
    },
    taxAmt: {
      sourceField: 'taxAmt',
      outputField: 'custrecord_gw_ap_doc_tax_amt'
    },
    totalAmt: {
      sourceField: 'totalAmt',
      outputField: 'custrecord_gw_ap_doc_total_amt'
    },
    taxType: {
      sourceField: 'TaxType',
      outputField: 'custrecord_gw_ap_doc_tax_type'
    },
    taxExemptedSalesAmt: {
      sourceField: 'taxExemptedSalesAmt',
      outputField: 'custrecord_gw_ap_doc_exempt_amt'
    },
    zeroTaxSalesAmt: {
      sourceField: 'zeroTaxSalesAmt',
      outputField: 'custrecord_gw_ap_doc_ztr_amt'
    },
    deductionCode: {
      sourceField: 'deductionCode',
      outputField: 'custrecord_gw_ap_doc_deduct_code'
    },
    consolidationMark: {
      sourceField: 'ConsolidationMark',
      outputField: 'custrecord_gw_ap_doc_co_mark'
    },
    consolidationQty: {
      sourceField: 'consolidationQty',
      outputField: 'custrecord_gw_ap_doc_co_qty'
    },
    customClearanceMark: {
      sourceField: 'customClearanceMark',
      outputField: 'custrecord_gw_ap_doc_custom_mark'
    },
    currency: {
      sourceField: 'currency',
      outputField: 'custrecord_gw_ap_doc_currency'
    },
    zeroTaxMark: {
      sourceField: 'zeroTaxMark',
      outputField: 'custrecord_gw_ap_doc_zero_tax_mark'
    },
    outputDate: {
      sourceField: 'outputDate',
      outputField: 'custrecord_gw_ap_doc_close_date'
    },
    businessUnit: {
      sourceField: 'businessUnit',
      outputField: 'custrecord_gw_ap_doc_business_unit'
    },
    relatedNumber: {
      sourceField: 'relatedNumber',
      outputField: 'custrecord_gw_ap_doc_related_number'
    },
    applyPeriod: {
      sourceField: 'applyPeriod',
      outputField: 'custrecord_gw_ap_doc_acct_period'
    },
    source: {
      sourceField: 'source',
      outputField: 'custrecord_gw_ap_doc_source'
    },
    uniqueId: {
      sourceField: 'uniqueId',
      outputField: 'custrecord_gw_ap_doc_unique_id'
    },
    transaction: {
      sourceField: 'transaction',
      outputField: 'custrecord_gw_apt_doc_tran_id'
    },
    applyPeriodSelect: {
      sourceField: 'applyPeriodSelect',
      outputField: 'custrecord_gw_ap_doc_apply_period'
    },
    filingSalesTax: {
      sourceField: 'filingSalesTax',
      outputField: 'custrecord_gw_ap_doc_apply'
    }
  }

  var voucherType = {
    EGUI: 'EGUI',
    ALLOWANCE: 'ALLOWANCE'
  }
  var uploadStatus = {
    PENDING_UPLOAD: 'A',
    UPLOADING: 'P',
    ISSUE_SUCCESS: 'C',
    ISSUE_FAILED: 'E',
    RESPONDED_ERROR: 'G',
    NOT_UPLOAD: 'M',
    DELETED: 'D'
  }
  var voucherStatus = {
    VOUCHER_ISSUE: 'VOUCHER_ISSUE',
    VOUCHER_SUCCESS: 'VOUCHER_SUCCESS',
    VOUCHER_ERROR: 'VOUCHER_ERROR',
    CANCEL_ISSUE: 'CANCEL_ISSUE',
    CANCEL_APPROVE: 'CANCEL_APPROVE',
    CANCEL_REJECT: 'CANCEL_REJECT',
    CANCEL_UPLOAD: 'CANCEL_UPLOAD',
    CANCEL_SUCCESS: 'CANCEL_SUCCESS',
    CANCEL_ERROR: 'CANCEL_ERROR'
  }
  var migType = {
    B2C: 'B2C',
    B2BS: 'B2BS',
    B2BE: 'B2BE'
  }

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

  var fieldIdMapping = ramda.reduce(
    function (result, fieldId) {
      result[fieldId] = fieldId
      return result
    },
    {},
    Object.keys(fieldConfig)
  )

  var uploadStatus = {
    PENDING_UPLOAD: 'A',
    UPLOADING: 'P',
    ISSUE_SUCCESS: 'C',
    ISSUE_FAILED: 'E',
    RESPONDED_ERROR: 'G',
    NOT_UPLOAD: 'M',
    DELETED: 'D'
  }
  var voucherStatus = {
    VOUCHER_ISSUE: 'VOUCHER_ISSUE',
    VOUCHER_SUCCESS: 'VOUCHER_SUCCESS',
    VOUCHER_ERROR: 'VOUCHER_ERROR',
    CANCEL_ISSUE: 'CANCEL_ISSUE',
    CANCEL_APPROVE: 'CANCEL_APPROVE',
    CANCEL_REJECT: 'CANCEL_REJECT',
    CANCEL_UPLOAD: 'CANCEL_UPLOAD',
    CANCEL_SUCCESS: 'CANCEL_SUCCESS',
    CANCEL_ERROR: 'CANCEL_ERROR'
  }

  exports.fields = fieldConfig
  exports.allFieldIds = Object.keys(fieldConfig).map(function (key) {
    return key
  })
  exports.fieldOutputMapping = fieldOutputMapping
  exports.fieldIdMapping = fieldIdMapping
  exports.voucherStatus = voucherStatus
  exports.uploadStatus = uploadStatus
  return exports
})
