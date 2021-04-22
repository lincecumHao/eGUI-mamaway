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
    detail: 'recmachcustrecord_gw_edd_main_number',
  }
  var fieldConfig = {
    name: {
      id: 'name',
      sourceField: '',
      outputField: 'name',
    },
    custrecord_gw_ed_type: {
      id: 'custrecord_gw_ed_type',
      sourceField: 'guiType.value',
      outputField: 'documentType',
    },
    custrecord_gw_ed_number: {
      id: 'custrecord_gw_ed_number',
      sourceField: '',
      outputField: 'documentNumber',
    },
    custrecord_gw_ed_date: {
      id: 'custrecord_gw_ed_date',
      sourceField: 'documentDate', // documentDate.text or documentDate
      outputField: 'documentDate',
    },
    custrecord_gw_ed_time: {
      id: 'custrecord_gw_ed_time',
      sourceField: 'documentTime',
      outputField: 'documentTime',
    },
    // TODO: Add transformation field
    custrecord_gw_ed_period: {
      id: 'custrecord_gw_ed_period',
      sourceField: 'documentPeriod',
      outputField: 'documentPeriod',
    },
    // TODO: Add transformation field
    custrecord_gw_ed_tax_apply_period: {
      id: 'custrecord_gw_ed_tax_apply_period',
      sourceField: 'taxApplyPeriod.id',
      outputField: 'taxApplyPeriod',
    },
    // TODO: Add transformation field
    custrecord_gw_ed_tax_applied: {
      id: 'custrecord_gw_ed_tax_applied',
      sourceField: 'isApplyTax.value',
      outputField: 'isApplyTax',
    },
    custrecord_gw_ed_seller_tax_id: {
      id: 'custrecord_gw_ed_seller_tax_id',
      sourceField: 'sellerTaxId',
      outputField: 'sellerTaxId',
    },
    custrecord_gw_ed_seller_name: {
      id: 'custrecord_gw_ed_seller_name',
      sourceField: 'sellerName',
      outputField: 'sellerName',
    },
    custrecord_gw_ed_seller_address: {
      id: 'custrecord_gw_ed_seller_address',
      sourceField: 'sellerAddress',
      outputField: 'sellerAddress',
    },
    custrecord_gw_ed_buyer_tax_id: {
      id: 'custrecord_gw_ed_buyer_tax_id',
      sourceField: 'buyerTaxId',
      outputField: 'buyerTaxId',
    },
    custrecord_gw_ed_buyer_name: {
      id: 'custrecord_gw_ed_buyer_name',
      sourceField: 'buyerName',
      outputField: 'buyerName',
    },
    custrecord_gw_ed_buyer_email: {
      id: 'custrecord_gw_ed_buyer_email',
      sourceField: 'buyerEmail',
      outputField: 'buyerEmail',
    },
    custrecord_gw_ed_buyer_address: {
      id: 'custrecord_gw_ed_buyer_address',
      sourceField: 'buyerAddress',
      outputField: 'buyerAddress',
    },
    custrecord_gw_ed_gui_type: {
      id: 'custrecord_gw_ed_gui_type',
      sourceField: 'guiType.id',
      outputField: 'guiType',
    },
    custrecord_gw_ed_mig_type: {
      id: 'custrecord_gw_ed_mig_type',
      sourceField: 'migType.id',
      outputField: 'migType',
    },
    custrecord_gw_ed_format_code: {
      id: 'custrecord_gw_ed_format_code',
      sourceField: 'docFormat.id',
      outputField: 'docFormat',
    },
    custrecord_gw_ed_sales_amt: {
      id: 'custrecord_gw_ed_sales_amt',
      dataType: 'int',
      sourceField: 'totalSalesAmtSumByLine',
      outputField: 'salesAmt',
    },
    custrecord_gw_ed_exempt_sales_amt: {
      id: 'custrecord_gw_ed_exempt_sales_amt',
      dataType: 'int',
      sourceField: 'totalTaxExemptedSalesAmtSumByLine',
      outputField: 'taxExemptedSalesAmt',
    },
    custrecord_gw_ed_zero_sales_amount: {
      id: 'custrecord_gw_ed_zero_sales_amount',
      dataType: 'int',
      sourceField: 'totalTaxZeroSalesAmtSumByLine',
      outputField: 'zeroTaxSalesAmt',
    },
    custrecord_gw_ed_tax_amount: {
      id: 'custrecord_gw_ed_tax_amount',
      dataType: 'int',
      sourceField: 'nsTotalTaxAmt',
      outputField: 'taxAmount',
    },
    custrecord_gw_ed_total_amount: {
      id: 'custrecord_gw_ed_total_amount',
      dataType: 'int',
      sourceField: 'totalAmtSumByLine',
      outputField: 'totalAmount',
    },
    custrecord_gw_ed_tax_type: {
      id: 'custrecord_gw_ed_tax_type',
      sourceField: 'taxType.id',
      outputField: 'taxType',
    },
    custrecord_gw_ed_tax_rate: {
      id: 'custrecord_gw_ed_tax_rate',
      sourceField: 'taxRate',
      outputField: 'taxRate',
    },
    custrecord_gw_ed_tax_calculation_method: {
      id: 'custrecord_gw_ed_tax_calculation_method',
      sourceField: '',
      outputField: 'taxCalculationMethod',
    },
    custrecord_gw_ed_random_number: {
      id: 'custrecord_gw_ed_random_number',
      sourceField: '',
      outputField: 'randomNumber',
    },
    custrecord_gw_ed_main_remark: {
      id: 'custrecord_gw_ed_main_remark',
      sourceField: 'memo',
      outputField: 'mainRemark',
    },
    custrecord_gw_ed_classification: {
      id: 'custrecord_gw_ed_classification',
      sourceField: 'classification',
      outputField: 'classification',
    },
    custrecord_gw_ed_dept: {
      id: 'custrecord_gw_ed_dept',
      sourceField: 'department',
      outputField: 'department',
    },
    custrecord_gw_ed_is_manual: {
      id: 'custrecord_gw_ed_is_manual',
      sourceField: '',
      outputField: 'isManualGui',
    },
    custrecord_gw_ed_carrier_type: {
      id: 'custrecord_gw_ed_carrier_type',
      sourceField: 'carrierType.id',
      outputField: 'carrierType',
    },
    custrecord_gw_ed_carrierid_1: {
      id: 'custrecord_gw_ed_carrierid_1',
      sourceField: 'carrierId1',
      outputField: 'carrierId1',
    },
    custrecord_gw_ed_carrierid_2: {
      id: 'custrecord_gw_ed_carrierid_2',
      sourceField: 'carrierId1',
      outputField: 'carrierId2',
    },
    custrecord_gw_ed_is_doc_donated: {
      id: 'custrecord_gw_ed_is_doc_donated',
      sourceField: 'isDonate.value',
      outputField: 'isDonate',
    },
    custrecord_gw_ed_donate_code: {
      id: 'custrecord_gw_ed_donate_code',
      sourceField: 'donationCode',
      outputField: 'donationCode',
    },
    custrecord_gw_ed_clearance_mark: {
      id: 'custrecord_gw_ed_clearance_mark',
      sourceField: 'customClearanceMark',
      outputField: 'clearanceMark',
    },
    custrecord_gw_ed_is_upload: {
      id: 'custrecord_gw_ed_is_upload',
      sourceField: 'isUploadRequired.value',
      outputField: 'isUploadRequired',
    },
    custrecord_gw_ed_process_status: {
      id: 'custrecord_gw_ed_process_status',
      sourceField: '',
      outputField: 'documentProcessStatus',
    },
    custrecord_gw_ed_status: {
      id: 'custrecord_gw_ed_status',
      sourceField: '',
      outputField: 'documentStatus',
    },
    custrecord_gw_ed_upload_result_msg: {
      id: 'custrecord_gw_ed_upload_result_msg',
      sourceField: '',
      outputField: 'uploadResultMsg',
    },
    custrecord_gw_ed_print_mark: {
      id: 'custrecord_gw_ed_print_mark',
      sourceField: '',
      outputField: 'printMark',
    },
    custrecord_gw_ed_is_pdf_generated: {
      id: 'custrecord_gw_ed_is_pdf_generated',
      sourceField: '',
      outputField: 'isPdfGenerated',
    },
    custrecord_gw_ed_is_printed: {
      id: 'custrecord_gw_ed_is_printed',
      sourceField: '',
      outputField: 'isPrinted',
    },
    custrecord_gw_ed_is_tran_lock: {
      id: 'custrecord_gw_ed_is_tran_lock',
      sourceField: '',
      outputField: 'isTransactionLocked',
    },
    custrecord_gw_ed_disc_sales_amt: {
      id: 'custrecord_gw_ed_disc_sales_amt',
      dataType: 'int',
      sourceField: '',
      outputField: 'discountSalesAmt',
    },
    custrecord_gw_ed_disc_exempt_sales_amt: {
      id: 'custrecord_gw_ed_disc_exempt_sales_amt',
      dataType: 'int',
      sourceField: '',
      outputField: 'discountExemptSalesAmt',
    },
    custrecord_gw_ed_disc_zero_sales_amt: {
      id: 'custrecord_gw_ed_disc_zero_sales_amt',
      dataType: 'int',
      sourceField: '',
      outputField: 'discountZeroTaxSalesAmt',
    },
    custrecord_gw_ed_disc_total_amt: {
      id: 'custrecord_gw_ed_disc_total_amt',
      dataType: 'int',
      sourceField: '',
      outputField: 'discountTotalAmt',
    },
    custrecord_gw_ed_disc_count: {
      id: 'custrecord_gw_ed_disc_count',
      dataType: 'int',
      sourceField: '',
      outputField: 'discountCount',
    },
    custrecord_gw_ed_allowance_owner: {
      id: 'custrecord_gw_ed_allowance_owner',
      sourceField: '',
      outputField: 'allowanceOwner',
    },
    custrecord_gw_ed_egui_buyer: {
      id: 'custrecord_gw_ed_egui_buyer',
      sourceField: '',
      outputField: 'allowanceEguiBuyer',
    },
    custrecord_gw_ed_issued_by: {
      id: 'custrecord_gw_ed_issued_by',
      sourceField: '',
      outputField: 'documentIssuedBy',
    },
    custrecord_gw_ed_zero_tax_option: {
      id: 'custrecord_gw_ed_zero_tax_option',
      sourceField: '',
      outputField: 'zeroTaxOption',
    },
    custrecord_gw_ed_customs_export_category: {
      id: 'custrecord_gw_ed_customs_export_category',
      sourceField: '',
      outputField: 'customsExportCategory',
    },
    custrecord_gw_ed_customs_export_no: {
      id: 'custrecord_gw_ed_customs_export_no',
      sourceField: '',
      outputField: 'customsExportNumber',
    },
    custrecord_gw_ed_customs_export_date: {
      id: 'custrecord_gw_ed_customs_export_date',
      sourceField: '',
      outputField: 'customsExportDate',
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
  var fieldIdMapping = ramda.reduce(
    function (result, fieldId) {
      result[fieldId] = fieldId
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
  exports.fieldIdMapping = fieldIdMapping
  exports.fieldInputMapping = fieldInputMapping
  exports.sublists = sublists
  return exports
})
