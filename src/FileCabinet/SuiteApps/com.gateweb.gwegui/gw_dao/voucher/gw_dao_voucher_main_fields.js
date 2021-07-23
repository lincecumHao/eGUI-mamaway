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
  var sublists = {
    detail: 'recmachcustrecord_gw_voucher_main_internal_id'
  }

  var fieldConfig = {
    name: {
      id: 'name',
      sourceField: '',
      outputField: 'name'
    },
    custrecord_gw_voucher_type: {
      id: 'custrecord_gw_voucher_type',
      sourceField: 'documentType',
      outputField: 'documentType'
    },
    custrecord_gw_voucher_number: {
      id: 'custrecord_gw_voucher_number',
      sourceField: 'documentNumber',
      outputField: 'documentNumber'
    },
    custrecord_gw_voucher_date: {
      id: 'custrecord_gw_voucher_date',
      sourceField: 'documentDate',
      outputField: 'documentDate'
    },
    custrecord_gw_voucher_time: {
      id: 'custrecord_gw_voucher_time',
      sourceField: 'documentTime',
      outputField: 'documentTime'
    },
    custrecord_gw_voucher_yearmonth: {
      id: 'custrecord_gw_voucher_yearmonth',
      sourceField: 'documentPeriod',
      outputField: 'documentPeriod'
    },
    custrecord_voucher_sale_tax_apply_period: {
      id: 'custrecord_voucher_sale_tax_apply_period',
      sourceField: 'taxApplyPeriod.id',
      outputField: 'taxApplyPeriod'
    },
    custrecord_gw_voucher_sales_tax_apply: {
      id: 'custrecord_gw_voucher_sales_tax_apply',
      sourceField: 'isIssueEgui',
      outputField: 'isApplyTax'
    },
    custrecord_gw_seller: {
      id: 'custrecord_gw_seller',
      sourceField: 'sellerTaxId',
      outputField: 'sellerTaxId'
    },
    custrecord_gw_seller_name: {
      id: 'custrecord_gw_seller_name',
      sourceField: 'sellerName',
      outputField: 'sellerName'
    },
    custrecord_gw_seller_address: {
      id: 'custrecord_gw_seller_address',
      sourceField: 'sellerAddress',
      outputField: 'sellerAddress'
    },
    custrecord_gw_buyer: {
      id: 'custrecord_gw_buyer',
      sourceField: 'buyerTaxId',
      outputField: 'buyerTaxId'
    },
    custrecord_gw_buyer_name: {
      id: 'custrecord_gw_buyer_name',
      sourceField: 'buyerName',
      outputField: 'buyerName'
    },
    custrecord_gw_buyer_email: {
      id: 'custrecord_gw_buyer_email',
      sourceField: 'buyerEmail',
      outputField: 'buyerEmail'
    },
    custrecord_gw_buyer_address: {
      id: 'custrecord_gw_buyer_address',
      sourceField: 'buyerAddress',
      outputField: 'buyerAddress'
    },
    custrecord_gw_invoice_type: {
      id: 'custrecord_gw_invoice_type',
      sourceField: 'guiType.value',
      outputField: 'guiType'
    },
    custrecord_gw_mig_type: {
      id: 'custrecord_gw_mig_type',
      sourceField: 'migType.businessTranType',
      outputField: 'migType'
    },
    custrecord_gw_voucher_format_code: {
      id: 'custrecord_gw_voucher_format_code',
      sourceField: 'docFormat.value',
      outputField: 'docFormat'
    },
    custrecord_gw_sales_amount: {
      id: 'custrecord_gw_sales_amount',
      dataType: 'int',
      sourceField: 'salesAmt',
      outputField: 'salesAmt'
    },
    custrecord_gw_free_sales_amount: {
      id: 'custrecord_gw_free_sales_amount',
      dataType: 'int',
      sourceField: 'taxExemptedSalesAmt',
      outputField: 'taxExemptedSalesAmt'
    },
    custrecord_gw_zero_sales_amount: {
      id: 'custrecord_gw_zero_sales_amount',
      dataType: 'int',
      sourceField: 'zeroTaxSalesAmt',
      outputField: 'zeroTaxSalesAmt'
    },
    custrecord_gw_tax_amount: {
      id: 'custrecord_gw_tax_amount',
      dataType: 'int',
      sourceField: 'taxAmt',
      outputField: 'taxAmt'
    },
    custrecord_gw_total_amount: {
      id: 'custrecord_gw_total_amount',
      dataType: 'int',
      sourceField: 'totalAmt',
      outputField: 'totalAmt'
    },
    custrecord_gw_tax_type: {
      id: 'custrecord_gw_tax_type',
      sourceField: 'taxType.id',
      outputField: 'taxType'
    },
    custrecord_gw_tax_rate: {
      id: 'custrecord_gw_tax_rate',
      sourceField: 'taxRate',
      outputField: 'taxRate'
    },
    custrecord_gw_upload_access_model: {
      id: 'custrecord_gw_upload_access_model',
      sourceField: 'taxCalculationMethod.value',
      outputField: 'taxCalculationMethod'
    },
    custrecord_gw_random_number: {
      id: 'custrecord_gw_random_number',
      sourceField: 'randomNumber',
      outputField: 'randomNumber'
    },
    custrecord_gw_main_remark: {
      id: 'custrecord_gw_main_remark',
      sourceField: 'guiMemo',
      outputField: 'guiMemo'
    },
    custrecord_gw_voucher_classification: {
      id: 'custrecord_gw_voucher_classification',
      sourceField: 'classId',
      outputField: 'classId'
    },
    custrecord_gw_voucher_dept_code: {
      id: 'custrecord_gw_voucher_dept_code',
      sourceField: 'departmentId',
      outputField: 'departmentId'
    },
    custrecord_gw_voucher_dept_name: {
      id: 'custrecord_gw_voucher_dept_name',
      sourceField: 'departmentName',
      outputField: 'departmentName'
    },
    custrecord_gw_is_manual_voucher: {
      id: 'custrecord_gw_is_manual_voucher',
      sourceField: '',
      outputField: 'isManualGui'
    },
    custrecord_gw_carrier_type: {
      id: 'custrecord_gw_carrier_type',
      sourceField: 'carrierType.value',
      outputField: 'carrierType'
    },
    custrecord_gw_carrierid1: {
      id: 'custrecord_gw_carrierid1',
      sourceField: 'carrierId1',
      outputField: 'carrierId1'
    },
    custrecord_gw_carrierid2: {
      id: 'custrecord_gw_carrierid2',
      sourceField: 'carrierId1',
      outputField: 'carrierId2'
    },
    custrecord_gw_npoban: {
      id: 'custrecord_gw_npoban',
      sourceField: 'donationCode',
      outputField: 'donationCode'
    },
    custrecord_gw_clearance_mark: {
      id: 'custrecord_gw_clearance_mark',
      sourceField: 'customClearanceMark',
      outputField: 'customClearanceMark'
    },
    custrecord_gw_voucher_status: {
      id: 'custrecord_gw_voucher_status',
      sourceField: 'documentStatus',
      outputField: 'documentStatus'
    },
    custrecord_gw_voucher_upload_status: {
      id: 'custrecord_gw_voucher_upload_status',
      sourceField: 'documentUploadStatus',
      outputField: 'documentUploadStatus'
    },
    custrecord_gw_accept_status: {
      id: 'custrecord_gw_accept_status',
      sourceField: '',
      outputField: 'documentAcceptStatus'
    },
    custrecord_gw_confirm_status: {
      id: 'custrecord_gw_confirm_status',
      sourceField: '',
      outputField: 'documentConfirmStatus'
    },
    custrecord_gw_uploadstatus_messag: {
      id: 'custrecord_gw_uploadstatus_messag',
      sourceField: '',
      outputField: 'uploadResultMsg'
    },
    custrecord_gw_print_mark: {
      id: 'custrecord_gw_print_mark',
      sourceField: 'printMark',
      outputField: 'printMark'
    },
    custrecord_gw_is_printed_pdf: {
      id: 'custrecord_gw_is_printed_pdf',
      sourceField: '',
      outputField: 'isPdfGenerated'
    },
    custrecord_gw_is_printed_paper: {
      id: 'custrecord_gw_is_printed_paper',
      sourceField: '',
      outputField: 'isPrinted'
    },
    custrecord_gw_lock_transaction: {
      id: 'custrecord_gw_lock_transaction',
      sourceField: '',
      outputField: 'isTransactionLocked'
    },
    custrecord_gw_is_completed_detail: {
      id: 'custrecord_gw_is_completed_detail',
      sourceField: '',
      outputField: 'isDetailCompleted'
    },
    custrecord_gw_discount_sales_amount: {
      id: 'custrecord_gw_discount_sales_amount',
      dataType: 'int',
      sourceField: '',
      outputField: 'discountSalesAmt'
    },
    custrecord_gw_discount_free_amount: {
      id: 'custrecord_gw_discount_free_amount',
      dataType: 'int',
      sourceField: '',
      outputField: 'discountExemptSalesAmt'
    },
    custrecord_gw_discount_zero_amount: {
      id: 'custrecord_gw_discount_zero_amount',
      dataType: 'int',
      sourceField: '',
      outputField: 'discountZeroTaxSalesAmt'
    },
    custrecord_gw_discount_amount: {
      id: 'custrecord_gw_discount_amount',
      dataType: 'int',
      sourceField: '',
      outputField: 'discountTotalAmt'
    },
    custrecord_gw_discount_count: {
      id: 'custrecord_gw_discount_count',
      dataType: 'int',
      sourceField: '',
      outputField: 'discountCount'
    },
    custrecord_gw_original_buyer_id: {
      id: 'custrecord_gw_original_buyer_id',
      sourceField: '',
      outputField: 'allowanceEguiBuyer'
    },
    custrecord_gw_voucher_main_apply_user_id: {
      id: 'custrecord_gw_voucher_main_apply_user_id',
      sourceField: '',
      outputField: 'documentIssuedBy'
    },
    custrecord_gw_applicable_zero_tax: {
      id: 'custrecord_gw_applicable_zero_tax',
      sourceField: '',
      outputField: 'zeroTaxOption'
    },
    custrecord_gw_customs_export_category: {
      id: 'custrecord_gw_customs_export_category',
      sourceField: '',
      outputField: 'customsExportCategory'
    },
    custrecord_gw_customs_export_no: {
      id: 'custrecord_gw_customs_export_no',
      sourceField: '',
      outputField: 'customsExportNumber'
    },
    custrecord_gw_customs_export_date: {
      id: 'custrecord_gw_customs_export_date',
      sourceField: '',
      outputField: 'customsExportDate'
    },
    custrecord_gw_need_upload_egui_mig: {
      id: 'custrecord_gw_need_upload_egui_mig',
      sourceField: 'needUploadMig',
      outputField: 'needUploadMig'
    },
    custrecord_gw_ns_transaction: {
      id: 'custrecord_gw_ns_transaction',
      sourceField: 'transactions',
      outputField: 'transactions'
    },
    custrecord_gw_dm_mig_type: {
      id: 'custrecord_gw_dm_mig_type',
      sourceField: 'migType.id',
      outputField: 'migTypeOption'
    },
    custrecord_gw_dm_seller_profile: {
      id: 'custrecord_gw_dm_seller_profile',
      sourceField: 'sellerProfile',
      outputField: 'sellerProfile'
    }
  }

  var fieldInputMapping = ramda.reduce(
    function (result, fieldId) {
      var fieldObj = fieldConfig[fieldId]
      if (fieldObj.sourceField) {
        result[fieldObj.id] = fieldObj.sourceField
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
  exports.fieldInputMapping = fieldInputMapping
  exports.voucherStatus = voucherStatus
  exports.uploadStatus = uploadStatus
  exports.sublists = sublists
  return exports
})
