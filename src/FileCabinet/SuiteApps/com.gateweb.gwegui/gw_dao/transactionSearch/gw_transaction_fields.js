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
  var searchId = 'customsearch_gw_transaction_search'
  var fieldConfig = {
    internalId: {
      id: 'internalId',
      sourceField: '',
      outputField: 'tranInternalId'
    },
    mainline: {
      id: 'mainline',
      sourceField: '',
      outputField: 'mainline'
    },
    trandate: {
      id: 'trandate',
      sourceField: '',
      outputField: 'tranDate'
    },
    subsidiary: {
      id: 'subsidiary',
      sourceField: '',
      outputField: 'subsidiary'
    },
    type: {
      id: 'type',
      sourceField: '',
      outputField: 'tranType'
    },
    entity: {
      id: 'entity',
      sourceField: '',
      outputField: 'customer'
    },
    tranid: {
      id: 'tranid',
      sourceField: '',
      outputField: 'tranName'
    },
    transactionnumber: {
      id: 'transactionnumber',
      sourceField: '',
      outputField: 'tranNum'
    },
    memomain: {
      id: 'memomain',
      sourceField: '',
      outputField: 'memo'
    },
    memo: {
      id: 'memo',
      sourceField: '',
      outputField: 'itemName'
    },
    amount: {
      id: 'amount',
      sourceField: '',
      outputField: 'nsTotalAmt'
    },
    fxamount: {
      id: 'fxamount',
      sourceField: '',
      outputField: 'nsTotalAmtForeign'
    },
    grossamount: {
      id: 'grossamount',
      sourceField: '',
      outputField: 'nsGrossAmt'
    },
    netamountnotax: {
      id: 'netamountnotax',
      sourceField: '',
      outputField: 'nsNetAmtNoTax'
    },
    netamount: {
      id: 'netamount',
      sourceField: '',
      outputField: 'nsNetAmt'
    },
    taxamount: {
      id: 'taxamount',
      sourceField: '',
      outputField: 'nsTaxAmt'
    },
    taxtotal: {
      id: 'taxtotal',
      sourceField: '',
      outputField: 'nsTaxTotal'
    },
    total: {
      id: 'total',
      sourceField: '',
      outputField: 'nsTotal'
    },
    department: {
      id: 'department',
      sourceField: '',
      outputField: 'department'
    },
    createdby: {
      id: 'createdby',
      sourceField: '',
      outputField: 'createdby'
    },
    createdfrom: {
      id: 'createdfrom',
      sourceField: '',
      outputField: 'createdfrom'
    },
    class: {
      id: 'class',
      sourceField: '',
      outputField: 'classification'
    },
    location: {
      id: 'location',
      sourceField: '',
      outputField: 'location'
    },
    itemtype: {
      id: 'itemtype',
      sourceField: '',
      outputField: 'itemType'
    },
    linesequencenumber: {
      id: 'linesequencenumber',
      sourceField: '',
      outputField: 'lineSeq'
    },
    line: {
      id: 'line',
      sourceField: '',
      outputField: 'line'
    },
    item: {
      id: 'item',
      sourceField: '',
      outputField: 'item'
    },
    unitabbreviation: {
      id: 'unitabbreviation',
      sourceField: '',
      outputField: 'unit'
    },
    quantity: {
      id: 'quantity',
      sourceField: '',
      outputField: 'quantity'
    },
    taxcode: {
      id: 'taxcode',
      sourceField: '',
      outputField: 'taxCode'
    },
    rate: {
      id: 'rate',
      sourceField: '',
      outputField: 'unitPrice'
    },
    fxrate: {
      id: 'fxrate',
      sourceField: '',
      outputField: 'unitPrice'
    },
    custcol_gw_item_unit_amt_inc_tax: {
      id: 'custcol_gw_item_unit_amt_inc_tax',
      sourceField: '',
      outputField: 'itemRateAfterTax'
    },
    custcol_gw_item_memo: {
      id: 'custcol_gw_item_memo',
      sourceField: '',
      outputField: 'guiItemMemo'
    },
    custbody_gw_gui_date: {
      id: 'custbody_gw_gui_date',
      sourceField: '',
      outputField: 'guiDate'
    },
    custbody_gw_gui_tax_file_date: {
      id: 'custbody_gw_gui_tax_file_date',
      sourceField: '',
      outputField: 'guiTaxFileDate'
    },
    custbody_gw_lock_transaction: {
      id: 'custbody_gw_lock_transaction',
      sourceField: '',
      outputField: 'isTransactionLocked'
    },
    custbody_gw_gui_not_upload: {
      id: 'custbody_gw_gui_not_upload',
      sourceField: '',
      outputField: 'isEGuiUpload'
    },
    custbody_gw_is_issue_egui: {
      id: 'custbody_gw_is_issue_egui',
      sourceField: '',
      outputField: 'isIssueEgui'
    },
    custbody_gw_allowance_num_start: {
      id: 'custbody_gw_allowance_num_start',
      sourceField: '',
      outputField: 'allowanceNumStart'
    },
    custbody_gw_allowance_num_end: {
      id: 'custbody_gw_allowance_num_end',
      sourceField: '',
      outputField: 'allowanceNumEnd'
    },
    custbody_gw_customs_export_no: {
      id: 'custbody_gw_customs_export_no',
      sourceField: '',
      outputField: 'customExportNum'
    },
    custbody_gw_customs_export_category: {
      id: 'custbody_gw_customs_export_category',
      sourceField: '',
      outputField: 'customExportCategory'
    },
    custbody_gw_gui_address: {
      id: 'custbody_gw_gui_address',
      sourceField: '',
      outputField: 'customerAddress'
    },
    custbody_gw_gui_title: {
      id: 'custbody_gw_gui_title',
      sourceField: '',
      outputField: 'customerName'
    },
    custbody_gw_gui_num_start: {
      id: 'custbody_gw_gui_num_start',
      sourceField: '',
      outputField: 'eguiNumStart'
    },
    custbody_gw_gui_num_end: {
      id: 'custbody_gw_gui_num_end',
      sourceField: '',
      outputField: 'eguiNumEnd'
    },
    custbody_gw_tax_id_number: {
      id: 'custbody_gw_tax_id_number',
      sourceField: '',
      outputField: 'customerTaxId'
    },
    custbody_gw_customs_export_date: {
      id: 'custbody_gw_customs_export_date',
      sourceField: '',
      outputField: 'customExportDate'
    },
    custbody_gw_egui_clearance_mark: {
      id: 'custbody_gw_egui_clearance_mark',
      sourceField: '',
      outputField: 'clearanceMark'
    },
    custbody_gw_applicable_zero_tax: {
      id: 'custbody_gw_applicable_zero_tax',
      sourceField: '',
      outputField: 'zeroTaxMark'
    },
    custbody_gw_gui_main_memo: {
      id: 'custbody_gw_gui_main_memo',
      sourceField: '',
      outputField: 'eguiMainMemo'
    },
    custbody_gw_gui_sales_amt_tax_exempt: {
      id: 'custbody_gw_gui_sales_amt_tax_exempt',
      sourceField: '',
      outputField: 'taxExemptSalesAmt'
    },
    custbody_gw_gui_sales_amt: {
      id: 'custbody_gw_gui_sales_amt',
      sourceField: '',
      outputField: 'salesAmt'
    },
    custbody_gw_gui_sales_amt_tax_zero: {
      id: 'custbody_gw_gui_sales_amt_tax_zero',
      sourceField: '',
      outputField: 'taxZeroSalesAmt'
    },
    custbody_gw_gui_tax_amt: {
      id: 'custbody_gw_gui_tax_amt',
      sourceField: '',
      outputField: 'taxAmt'
    },
    custbody_gw_gui_tax_rate: {
      id: 'custbody_gw_gui_tax_rate',
      sourceField: '',
      outputField: 'taxRate'
    },
    custbody_gw_gui_tax_type: {
      id: 'custbody_gw_gui_tax_type',
      sourceField: '',
      outputField: 'taxType'
    },
    custbody_gw_gui_total_amt: {
      id: 'custbody_gw_gui_total_amt',
      sourceField: '',
      outputField: 'totalAmt'
    },
    custbody_gw_creditmemo_deduction_list: {
      id: 'custbody_gw_creditmemo_deduction_list',
      sourceField: '',
      outputField: 'cmDeductList'
    },
    custbody_gw_gui_donation_code: {
      id: 'custbody_gw_gui_donation_code',
      sourceField: '',
      outputField: 'donationCode'
    },
    custbody_gw_gui_donation_mark: {
      id: 'custbody_gw_gui_donation_mark',
      sourceField: '',
      outputField: 'isDonate'
    },
    custbody_gw_gui_carrier_type: {
      id: 'custbody_gw_gui_carrier_type',
      sourceField: '',
      outputField: 'carrierType'
    },
    custbody_gw_gui_carrier_id_1: {
      id: 'custbody_gw_gui_carrier_id_1',
      sourceField: '',
      outputField: 'carrierId1'
    },
    custbody_gw_gui_carrier_id_2: {
      id: 'custbody_gw_gui_carrier_id_2',
      sourceField: '',
      outputField: 'carrierId2'
    },
    custbody_gw_gui_apply_period: {
      id: 'custbody_gw_gui_apply_period',
      sourceField: '',
      outputField: 'applyPeriod'
    },
    custbody_gw_gui_format: {
      id: 'custbody_gw_gui_format',
      sourceField: '',
      outputField: 'guiFormat'
    },
    custbody_gw_gui_class: {
      id: 'custbody_gw_gui_class',
      sourceField: '',
      outputField: 'guiClass'
    },
    custbody_gw_gui_department: {
      id: 'custbody_gw_gui_department',
      sourceField: '',
      outputField: 'guiDepartment'
    },
    statusref: {
      id: 'statusref',
      sourceField: '',
      outputField: 'tranStatus'
    },
    custbody_gw_seller_tax_id: {
      id: 'custbody_gw_seller_tax_id',
      sourceField: '',
      outputField: 'sellerTaxId'
    },
    custbody_gw_evidence_issue_status: {
      id: 'custbody_gw_evidence_issue_status',
      sourceField: '',
      outputField: 'gwIssueStatus'
    }
  }

  var bodyFieldConfig = {
    trandate: {
      id: 'trandate',
      sourceField: '',
      outputField: 'tranDate'
    },
    subsidiary: {
      id: 'subsidiary',
      sourceField: '',
      outputField: 'subsidiary'
    },
    type: {
      id: 'type',
      sourceField: '',
      outputField: 'tranType'
    },
    entity: {
      id: 'entity',
      sourceField: '',
      outputField: 'customer'
    },
    tranid: {
      id: 'tranid',
      sourceField: '',
      outputField: 'tranName'
    },
    transactionnumber: {
      id: 'transactionnumber',
      sourceField: '',
      outputField: 'tranNum'
    },
    memomain: {
      id: 'memomain',
      sourceField: '',
      outputField: 'memo'
    },
    memo: {
      id: 'memo',
      sourceField: '',
      outputField: 'itemName'
    },
    amount: {
      id: 'amount',
      sourceField: '',
      outputField: 'nsAmt'
    },
    fxamount: {
      id: 'fxamount',
      sourceField: '',
      outputField: 'nsAmtForeign'
    },
    grossamount: {
      id: 'grossamount',
      sourceField: '',
      outputField: 'nsGrossAmt'
    },
    netamountnotax: {
      id: 'netamountnotax',
      sourceField: '',
      outputField: 'nsNetAmtNoTax'
    },
    netamount: {
      id: 'netamount',
      sourceField: '',
      outputField: 'nsNetAmt'
    },
    taxamount: {
      id: 'taxamount',
      sourceField: '',
      outputField: 'nsTaxAmt'
    },
    taxtotal: {
      id: 'taxtotal',
      sourceField: '',
      outputField: 'nsTaxTotal'
    },
    total: {
      id: 'total',
      sourceField: '',
      outputField: 'nsTotal'
    },
    department: {
      id: 'department',
      sourceField: '',
      outputField: 'department'
    },
    createdby: {
      id: 'createdby',
      sourceField: '',
      outputField: 'createdby'
    },
    createdfrom: {
      id: 'createdfrom',
      sourceField: '',
      outputField: 'createdfrom'
    },
    class: {
      id: 'class',
      sourceField: '',
      outputField: 'classification'
    },
    location: {
      id: 'location',
      sourceField: '',
      outputField: 'location'
    },
    custbody_gw_gui_date: {
      id: 'custbody_gw_gui_date',
      sourceField: '',
      outputField: 'guiDate'
    },
    custbody_gw_gui_tax_file_date: {
      id: 'custbody_gw_gui_tax_file_date',
      sourceField: '',
      outputField: 'guiTaxFileDate'
    },
    custbody_gw_lock_transaction: {
      id: 'custbody_gw_lock_transaction',
      sourceField: '',
      outputField: 'isTransactionLocked'
    },
    custbody_gw_gui_not_upload: {
      id: 'custbody_gw_gui_not_upload',
      sourceField: '',
      outputField: 'isEGuiUpload'
    },
    custbody_gw_no_egui: {
      id: 'custbody_gw_no_egui',
      sourceField: '',
      outputField: 'isNotIssueEgui'
    },
    custbody_gw_is_issue_egui: {
      id: 'custbody_gw_is_issue_egui',
      sourceField: '',
      outputField: 'isIssueEgui'
    },
    custbody_gw_allowance_num_start: {
      id: 'custbody_gw_allowance_num_start',
      sourceField: '',
      outputField: 'allowanceNumStart'
    },
    custbody_gw_allowance_num_end: {
      id: 'custbody_gw_allowance_num_end',
      sourceField: '',
      outputField: 'allowanceNumEnd'
    },
    custbody_gw_customs_export_no: {
      id: 'custbody_gw_customs_export_no',
      sourceField: '',
      outputField: 'customExportNum'
    },
    custbody_gw_customs_export_category: {
      id: 'custbody_gw_customs_export_category',
      sourceField: '',
      outputField: 'customExportCategory'
    },
    custbody_gw_gui_address: {
      id: 'custbody_gw_gui_address',
      sourceField: '',
      outputField: 'customerAddress'
    },
    custbody_gw_gui_title: {
      id: 'custbody_gw_gui_title',
      sourceField: '',
      outputField: 'customerName'
    },
    custbody_gw_gui_num_start: {
      id: 'custbody_gw_gui_num_start',
      sourceField: '',
      outputField: 'eguiNumStart'
    },
    custbody_gw_gui_num_end: {
      id: 'custbody_gw_gui_num_end',
      sourceField: '',
      outputField: 'eguiNumEnd'
    },
    custbody_gw_tax_id_number: {
      id: 'custbody_gw_tax_id_number',
      sourceField: '',
      outputField: 'customerTaxId'
    },
    custbody_gw_customs_export_date: {
      id: 'custbody_gw_customs_export_date',
      sourceField: '',
      outputField: 'customExportDate'
    },
    custbody_gw_egui_clearance_mark: {
      id: 'custbody_gw_egui_clearance_mark',
      sourceField: '',
      outputField: 'clearanceMark'
    },
    custbody_gw_applicable_zero_tax: {
      id: 'custbody_gw_applicable_zero_tax',
      sourceField: '',
      outputField: 'zeroTaxMark'
    },
    custbody_gw_gui_main_memo: {
      id: 'custbody_gw_gui_main_memo',
      sourceField: '',
      outputField: 'eguiMainMemo'
    },
    custbody_gw_gui_sales_amt_tax_exempt: {
      id: 'custbody_gw_gui_sales_amt_tax_exempt',
      sourceField: '',
      outputField: 'taxExemptSalesAmt'
    },
    custbody_gw_gui_sales_amt: {
      id: 'custbody_gw_gui_sales_amt',
      sourceField: '',
      outputField: 'salesAmt'
    },
    custbody_gw_gui_sales_amt_tax_zero: {
      id: 'custbody_gw_gui_sales_amt_tax_zero',
      sourceField: '',
      outputField: 'taxZeroSalesAmt'
    },
    custbody_gw_gui_tax_amt: {
      id: 'custbody_gw_gui_tax_amt',
      sourceField: '',
      outputField: 'taxAmt'
    },
    custbody_gw_creditmemo_deduction_list: {
      id: 'custbody_gw_creditmemo_deduction_list',
      sourceField: '',
      outputField: 'cmDeductList'
    },
    custbody_gw_gui_donation_code: {
      id: 'custbody_gw_gui_donation_code',
      sourceField: '',
      outputField: 'donationCode'
    },
    custbody_gw_gui_donation_mark: {
      id: 'custbody_gw_gui_donation_mark',
      sourceField: '',
      outputField: 'isDonate'
    },
    custbody_gw_gui_carrier_type: {
      id: 'custbody_gw_gui_carrier_type',
      sourceField: '',
      outputField: 'carrierType'
    },
    custbody_gw_gui_carrier_id_1: {
      id: 'custbody_gw_gui_carrier_id_1',
      sourceField: '',
      outputField: 'carrierId1'
    },
    custbody_gw_gui_carrier_id_2: {
      id: 'custbody_gw_gui_carrier_id_2',
      sourceField: '',
      outputField: 'carrierId2'
    },
    custbody_gw_gui_apply_period: {
      id: 'custbody_gw_gui_apply_period',
      sourceField: '',
      outputField: 'applyPeriod'
    },
    custbody_gw_gui_format: {
      id: 'custbody_gw_gui_format',
      sourceField: '',
      outputField: 'guiFormat'
    },
    statusref: {
      id: 'statusref',
      sourceField: '',
      outputField: 'tranStatus'
    }
  }
  var lineFieldConfig = {
    subsidiary: {
      id: 'subsidiary',
      sourceField: '',
      outputField: 'subsidiary'
    },
    tranid: {
      id: 'tranid',
      sourceField: '',
      outputField: 'tranName'
    },
    transactionnumber: {
      id: 'transactionnumber',
      sourceField: '',
      outputField: 'tranNum'
    },
    memo: {
      id: 'memo',
      sourceField: '',
      outputField: 'itemName'
    },
    amount: {
      id: 'amount',
      sourceField: '',
      outputField: 'nsAmt'
    },
    fxamount: {
      id: 'fxamount',
      sourceField: '',
      outputField: 'nsAmtForeign'
    },
    grossamount: {
      id: 'grossamount',
      sourceField: '',
      outputField: 'nsGrossAmt'
    },
    netamountnotax: {
      id: 'netamountnotax',
      sourceField: '',
      outputField: 'nsNetAmtNoTax'
    },
    netamount: {
      id: 'netamount',
      sourceField: '',
      outputField: 'nsNetAmt'
    },
    taxamount: {
      id: 'taxamount',
      sourceField: '',
      outputField: 'nsTaxAmt'
    },
    taxtotal: {
      id: 'taxtotal',
      sourceField: '',
      outputField: 'nsTaxTotal'
    },
    total: {
      id: 'total',
      sourceField: '',
      outputField: 'nsTotal'
    },
    linesequencenumber: {
      id: 'linesequencenumber',
      sourceField: '',
      outputField: 'lineSeq'
    },
    line: {
      id: 'line',
      sourceField: '',
      outputField: 'line'
    },
    item: {
      id: 'item',
      sourceField: '',
      outputField: 'item'
    },
    unitabbreviation: {
      id: 'unitabbreviation',
      sourceField: '',
      outputField: 'unit'
    },
    itemtype: {
      id: 'itemtype',
      sourceField: '',
      outputField: 'itemType'
    },
    quantity: {
      id: 'quantity',
      sourceField: '',
      outputField: 'quantity'
    },
    custcol_gw_item_memo: {
      id: 'custcol_gw_item_memo',
      sourceField: '',
      outputField: 'itemMemo'
    },
    custcol_gw_item_unit_amt_inc_tax: {
      id: 'custcol_gw_item_unit_amt_inc_tax',
      sourceField: '',
      outputField: 'itemRateAfterTax'
    },
    rate: {
      id: 'rate',
      sourceField: '',
      outputField: 'unitPrice'
    },
    fxrate: {
      id: 'fxrate',
      sourceField: '',
      outputField: 'unitPriceForeign'
    },
    taxItem: {
      id: 'taxItem',
      sourceField: '',
      outputField: 'taxCode'
    }
  }

  var fieldOutputMapping = ramda.reduce(
    function (result, fieldId) {
      var fieldObj = fieldConfig[fieldId]
      result[fieldObj.id] = fieldObj.outputField
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

  var lineFieldOutputMapping = ramda.reduce(
    function (result, fieldId) {
      var fieldObj = lineFieldConfig[fieldId]
      result[fieldObj.id] = fieldObj.outputField
      return result
    },
    {},
    Object.keys(lineFieldConfig)
  )

  var bodyFieldOutputMapping = ramda.reduce(
    function (result, fieldId) {
      var fieldObj = bodyFieldConfig[fieldId]
      result[fieldObj.id] = fieldObj.outputField
      return result
    },
    {},
    Object.keys(bodyFieldConfig)
  )

  exports.fields = fieldConfig
  exports.lineFields = lineFieldConfig
  exports.bodyFields = bodyFieldConfig
  exports.allFieldIds = Object.keys(fieldConfig)
  exports.fieldOutputMapping = fieldOutputMapping
  exports.fieldIdMapping = fieldIdMapping

  exports.allLineFieldIds = Object.keys(lineFieldConfig)
  exports.lineFieldOutputMapping = lineFieldOutputMapping
  exports.bodyFieldOutputMapping = bodyFieldOutputMapping
  exports.searchId = searchId
  return exports
})
