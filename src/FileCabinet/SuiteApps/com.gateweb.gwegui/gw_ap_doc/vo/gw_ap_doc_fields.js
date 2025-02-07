define([], function () {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2020 Gateweb
   * @author Sean Lin <seanlin816@gmail.com>
   *
   * @NApiVersion 2.0
   * @NModuleScope Public

   */
  var exports = {}
  var fields = {
    docType: {
      name: 'docType',
      id: 'custrecord_gw_ap_doc_type',
      chtName: '憑證格式代碼'
    },
    guiNum: {
      name: 'guiNum',
      id: 'custrecord_gw_ap_doc_gui_num',
      maxLength: 10,
      chtName: '發票號碼'
    },
    commonNumber: {
      name: 'commonNumber',
      id: 'custrecord_gw_ap_doc_comm_num',
      maxLength: 16,
      chtName: '其他憑證號碼'
    },
    guiStatus: {
      name: 'guiStatus',
      id: 'custrecord_gw_ap_doc_status',
      maxLength: 5,
      chtName: '狀態'
    },
    guiDate: {
      name: 'guiDate',
      id: 'custrecord_gw_ap_doc_issue_date',
      maxLength: 10,
      chtName: '憑證開立日期'
    },
    buyer: {
      name: 'buyer',
      id: 'custrecord_gw_ap_doc_buyer',
      chtName: '買方'
    },
    buyerTaxId: {
      name: 'buyerTaxId',
      id: 'custrecord_gw_ap_doc_buyer_tax_id',
      chtName: '買方統編'
    },
    buyerName: {
      name: 'buyerName',
      id: 'custrecord_gw_ap_doc_buyer_name',
      maxLength: 60,
      chtName: '買方公司名稱'
    },
    sellerTaxId: {
      name: 'sellerTaxId',
      id: 'custrecord_gw_ap_doc_seller_tax_id',
      maxLength: 8,
      chtName: '賣方統編'
    },
    sellerName: {
      name: 'sellerName',
      id: 'custrecord_gw_ap_doc_seller_name',
      maxLength: 60,
      chtName: '賣方公司名稱'
    },
    salesAmt: {
      name: 'salesAmt',
      id: 'custrecord_gw_ap_doc_sales_amt',
      maxLength: 12,
      chtName: '應稅銷售額'
    },
    taxAmt: {
      name: 'taxAmt',
      id: 'custrecord_gw_ap_doc_tax_amt',
      maxLength: 10,
      chtName: '稅額'
    },
    totalAmt: {
      name: 'totalAmt',
      id: 'custrecord_gw_ap_doc_total_amt',
      maxLength: 12,
      chtName: '總計'
    },
    taxType: {
      name: 'TaxType',
      id: 'custrecord_gw_ap_doc_tax_type',
      chtName: '課稅別'
    },
    taxExemptedSalesAmt: {
      name: 'taxExemptedSalesAmt',
      id: 'custrecord_gw_ap_doc_exempt_amt',
      maxLength: 12,
      chtName: '免稅銷售額'
    },
    zeroTaxSalesAmt: {
      name: 'zeroTaxSalesAmt',
      id: 'custrecord_gw_ap_doc_ztr_amt',
      maxLength: 12,
      chtName: '零稅率銷售額'
    },
    deductionCode: {
      name: 'deductionCode',
      id: 'custrecord_gw_ap_doc_deduct_code',
      chtName: '進項扣抵代號'
    },
    consolidationMark: {
      name: 'ConsolidationMark',
      id: 'custrecord_gw_ap_doc_co_mark',
      chtName: '匯總或分攤註記'
    },
    consolidationQty: {
      name: 'consolidationQty',
      id: 'custrecord_gw_ap_doc_co_qty',
      maxLength: 4,
      chtName: '匯總數量'
    },
    customClearanceMark: {
      name: 'customClearanceMark',
      id: 'custrecord_gw_ap_doc_custom_mark',
      chtName: '通關註記'
    },
    currency: {
      name: 'currency',
      id: 'custrecord_gw_ap_doc_currency',
      maxLength: 3,
      chtName: '幣別'
    },
    zeroTaxMark: {
      name: 'zeroTaxMark',
      id: 'custrecord_gw_ap_doc_zero_tax_mark',
      chtName: '零稅率銷售額'
    },
    outputDate: {
      name: 'outputDate',
      id: 'custrecord_gw_ap_doc_close_date',
      maxLength: 10,
      chtName: '外銷結匯日期'
    },
    businessUnit: {
      name: 'businessUnit',
      id: 'custrecord_gw_ap_doc_business_unit',
      maxLength: 30,
      chtName: '業務單位'
    },
    relatedNumber: {
      name: 'relatedNumber',
      id: 'custrecord_gw_ap_doc_related_number',
      maxLength: 30,
      chtName: '傳票單據號碼'
    },
    applyPeriod: {
      name: 'applyPeriod',
      id: 'custrecord_gw_ap_doc_acct_period',
      maxLength: 6,
      chtName: '憑證期別'
    },
    applyMonth: {
      name: 'applyMonth',
      id: 'custrecord_gw_ap_doc_apply_month'
    },
    source: {
      name: 'source',
      id: 'custrecord_gw_ap_doc_source',
      maxLength: 30,
      chtName: '資料來源'
    },
    uniqueId: {
      name: 'uniqueId',
      id: 'custrecord_gw_ap_doc_unique_id',
      maxLength: 20,
      chtName: '資料識別碼'
    },
    transaction: {
      name: 'transaction',
      id: 'custrecord_gw_apt_doc_tran_id'
    },
    applyPeriodSelect: {
      name: 'applyPeriodSelect',
      id: 'custrecord_gw_ap_doc_apply_period',
      chtName: '申報期別'
    },
    applyMonthSelect: {
      name: 'applyMonthSelect',
      id: 'custrecord_gw_ap_doc_apply_month'
    },
    filingSalesTax: {
      name: 'filingSalesTax',
      id: 'custrecord_gw_ap_doc_apply',
      chtName: '申報營業稅'
    }
  }

  function getFieldById(internalId) {
    var fieldKey = Object.keys(fields).filter(function (fieldName) {
      return fields[fieldName].id === internalId
    })[0]

    if (fieldKey) return fields[fieldKey]
    return null
  }

  var fieldTypes = {}

  exports.fields = fields
  exports.fieldNames = Object.keys(fields)
  exports.getFieldById = getFieldById
  return exports
})

// test: {
//   name: 'Test',
//   id: 'custpage_gw_cert_test',
//   type: 'TEXT',
//   label: '測試用',
// },
// Seller: {
//   name: 'Seller',
//   id: 'custpage_gw_cert_vendor',
//   type: 'SELECT',
//   source: 'VENDOR',
//   label: '買家',
// },
//
// AccountDocumentId: {
//   name: 'AccountDocumentId',
//   id: 'custpage_gw_cert_acct_doc_id',
//   type: 'TEXT',
//   label: 'Account Document Id',
// },
//
