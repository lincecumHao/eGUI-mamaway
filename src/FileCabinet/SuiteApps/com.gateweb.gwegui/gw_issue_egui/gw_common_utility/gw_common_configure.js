/**
 * Configure file
 * configure.js
 * @NApiVersion 2.x
 * @NModuleScope Public
 */
define(['N/format'], function (format) {
  //page size
  var pageSize = 20

  function getGwPageSize() {
    return pageSize
  }

  //message
  var messageDurationSeconds = 30000 //error message duration secords
  function getGwMessageDurationSeconds() {
    return messageDurationSeconds
  }

  //////////////////////////////////////////////////////////////////////
  //設定檔
  var _gw_voucher_properties = 'customrecord_gw_voucher_properties'

  function getGwVoucherProperties() {
    return _gw_voucher_properties
  }

  //////////////////////////////////////////////////////////////////////
  //憑證格式代號
  var invoceCode = '35'

  function getGwVoucherFormatInvoiceCode() {
    return invoceCode
  }

  var allowanceCode = '33'

  function getGwVoucherFormatAllowanceCode() {
    return allowanceCode
  }

  //////////////////////////////////////////////////////////////////////
  var invoceControlFieldId = 'custbody_gw_lock_transaction' //Invoice 控制欄位
  function getInvoceControlFieldId() {
    return invoceControlFieldId
  }

  //you will set Checkbox value use “T”/”F” not true/false.
  var lock_value = true
  var unlock_value = false

  function lockInvoceControlFieldId() {
    return lock_value
  }

  function unLockInvoceControlFieldId() {
    return unlock_value
  }

  var credMemoControlFieldId = 'custbody_gw_lock_transaction' //Invoice 控制欄位
  function getCredMemoControlFieldId() {
    return credMemoControlFieldId
  }

  function lockCredMemoControlFieldId() {
    return lock_value
  }

  function unLockCredMemoControlFieldId() {
    return unlock_value
  }

  //////////////////////////////////////////////////////////////////////
  //稅別判斷
  /////////////////////////////////////////////////////////////////////////////////////////////
  //稅別代碼-紀錄Netsuite的稅別設定值
  var withTaxID = '8' //1=應稅 [5] 8(TCM) or 10(GW)
  var zeroTaxID = '12' //2=零稅率 [0]
  var freeTaxID = '11' //3=免稅 [0]
  var speicalTaxID = '210' //4=特種稅率 [1, 2, 5, 15, 25]
  var mixTaxID = '310' //9=混合稅率(B2C) [0]

  function getGwWithTaxID() {
    return withTaxID
  }

  function getGwZeroTaxID() {
    return zeroTaxID
  }

  function getGwFreeTaxID() {
    return freeTaxID
  }

  function getSpeicalTaxID() {
    return speicalTaxID
  }

  function getGwMixTaxID() {
    return mixTaxID
  }

  //tax type
  function getGwTaxTypeFromNSTaxCode(taxCode) {
    var _taxType = '1'

    if (taxCode == withTaxID) {
      //1=應稅 [5]
      _taxType = '1'
    }

    if (taxCode == zeroTaxID) {
      //2=零稅率 [0]
      _taxType = '2'
    }

    if (taxCode == freeTaxID) {
      //3=免稅 [0]
      _taxType = '3'
    }

    if (taxCode == speicalTaxID) {
      _taxType = '4'
    }

    if (taxCode == mixTaxID) {
      _taxType = '9'
    }

    return _taxType
  }

  function getGwTaxCodeNameByGWTaxCode(taxCode) {
    var _taxType = '1'

    if (taxCode == '1') {
      //1=應稅 [5]
      _taxType = '應稅'
    }

    if (taxCode == '2') {
      //2=零稅率 [0]
      _taxType = '零稅'
    }

    if (taxCode == '3') {
      //3=免稅 [0]
      _taxType = '免稅'
    }

    if (taxCode == '4') {
      _taxType = '特種稅'
    }

    if (taxCode == '9') {
      _taxType = '混合稅'
    }

    return _taxType
  }

  //保持用account因為Invoice及creditmemo沒有account.name的欄位
  var searchAccountName = 'account' //account or account.name
  //var searchAccountName = 'account.name'; //account or account.name
  function getGwSearchAccountName() {
    return searchAccountName
  }

  var invoiceMainEditDefaultAccount = 123 //Accounts Receivable 要檢視設定
  var creditMemoMainEditDefaultAccount = 123 //Accounts Receivable 要檢視設定
  //var invoiceMainEditDefaultAccount    = 'Accounts Receivable'	; //Accounts Receivable 要檢視設定
  //var creditMemoMainEditDefaultAccount = 'Accounts Receivable'	; //Accounts Receivable 要檢視設定
  function getGwInvoiceMainEditDefaultAccount() {
    return invoiceMainEditDefaultAccount
  }

  function getGwCreditMemoMainEditDefaultAccount() {
    return creditMemoMainEditDefaultAccount
  }

  var invoiceEditDefaultAccount = 54 //4000 Sales 要檢視設定
  var creditMemoEditDefaultAccount = 54 //4000 Sales 要檢視設定
  //var invoiceEditDefaultAccount     = '4000 Sales'; //4000 Sales 要檢視設定
  //var creditMemoEditDefaultAccount  = '4000 Sales'; //4000 Sales 要檢視設定
  function getGwInvoiceEditDefaultAccount() {
    return invoiceEditDefaultAccount
  }

  function getGwCreditMemoEditDefaultAccount() {
    return creditMemoEditDefaultAccount
  }

  function getGwInvoiceUIEditDeployId() {
    return invoiceEditDeployId
  }

  var invoiceEditScriptId = 'customscript_gw_invoice_ui_edit'
  var invoiceEditDeployId = 'customdeploy_gw_invoice_ui_e'

  function getGwInvoiceUIEditScriptId() {
    return invoiceEditScriptId
  }

  function getGwInvoiceUIEditDeployId() {
    return invoiceEditDeployId
  }

  /////////////////////////////////////////////////////////////////////////////////////////////
  //gw_invoice_ui_edit
  var numericToFixed = 4 //小數點位數
  var invoiceActionScriptId = 'invoiceActionScriptId'
  var invoiceActionDeploymentId = 'invoiceActionDeploymentId'
  var salesAccountValue = invoiceEditDefaultAccount //4000 Sales (銷貨收入的accountnumber)
  var gwVoucherMainSearchId = 'customsearch_gw_voucher_main_search' //Voucher Main
  var gwInvoiceDetailSearchId = 'customsearch_gw_invoice_detail_search' //Invoice Detail Search
  var gwCreditmemoDetailSearchId = 'customsearch_gw_creditmemo_detail_search' //Credit Memo Detail Search

  function getGwNumericToFixed() {
    return numericToFixed
  }

  function getGwInvoiceActionScriptId() {
    return invoiceActionScriptId
  }

  function getGwInvoiceActionDeploymentId() {
    return invoiceActionDeploymentId
  }

  function getGwSalesAccountValue() {
    return salesAccountValue
  }

  function getGwVoucherMainSearchId() {
    return gwVoucherMainSearchId
  }

  function getGwInvoiceDetailSearchId() {
    return gwInvoiceDetailSearchId
  }

  function getGwCreditmemoDetailSearchId() {
    return gwCreditmemoDetailSearchId
  }

  /////////////////////////////////////////////////////////////////////////////////////////////
  //紀錄AssignLog Information
  var assignLogActionScriptId = 'customscript_gw_assignlog_ui_edit'
  var assignLogActionDeploymentId = 'customdeploy_gw_assignlog_ui_edit'
  var assignLogImportScriptId = 'customscript_gw_assignlog_ui_import'
  var assignLogImportDeploymentId = 'customdeploy_gw_assignlog_ui_import'

  var assignLogManualScriptId = 'customscript_gw_assignlog_manualedit'
  var assignLogManualDeploymentId = 'customdeploy_gw_assignlog_ui_manualedit'

  var assignLogTrackRecordId = 'customrecord_gw_assignlog_track'
  var assignLogRecordId = 'customrecord_gw_assignlog'
  var assignLogSearchId = 'customsearch_gw_assignlog_search'

  function getGwAssignLogActionScriptId() {
    return assignLogActionScriptId
  }

  function getGwAssignLogActionDeploymentId() {
    return assignLogActionDeploymentId
  }

  function getGwAssignLogImportScriptId() {
    return assignLogImportScriptId
  }

  function getGwAssignLogImportDeploymentId() {
    return assignLogImportDeploymentId
  }

  function getGwAssignLogRecordId() {
    return assignLogRecordId
  }

  function getGwAssignLogTrackRecordId() {
    return assignLogTrackRecordId
  }

  function getGwAssignLogSearchId() {
    return assignLogSearchId
  }

  function getGwAssignLogManualScriptId() {
    return assignLogManualScriptId
  }

  function getGwAssignLogManualDeploymentId() {
    return assignLogManualDeploymentId
  }

  /////////////////////////////////////////////////////////////////////////////////////////////
  //Voucher Record List
  var voucherApplyListRecord = 'customrecord_gw_voucher_apply_list'
  var voucherMainRecord = 'customrecord_gw_voucher_main'
  var voucherDetailsRecord = 'customrecord_gw_voucher_details'

  var depositVoucherRecord = 'customrecord_gw_deposit_voucher_record'

  function getGwVoucherApplyListRecord() {
    return voucherApplyListRecord
  }

  function getGwVoucherMainRecord() {
    return voucherMainRecord
  }

  function getGwVoucherDetailsRecord() {
    return voucherDetailsRecord
  }

  function getGwDepositVoucherRecord() {
    return depositVoucherRecord
  }

  /////////////////////////////////////////////////////////////////////////////////////////////
  //紀錄Mig XML資訊
  var gwMigXmlPath = '../gw_mig_xml/'
  var gwMigA0101XmlPath = gwMigXmlPath + 'gw_a0101.xml'
  var gwMigA0401XmlPath = gwMigXmlPath + 'gw_a0401.xml'
  var gwMigC0401XmlPath = gwMigXmlPath + 'gw_c0401.xml'
  var gwMigB0101XmlPath = gwMigXmlPath + 'gw_b0101.xml'
  var gwMigB0401XmlPath = gwMigXmlPath + 'gw_b0401.xml'
  var gwMigD0401XmlPath = gwMigXmlPath + 'gw_d0401.xml' //C0401的折讓單
  //E0402 20210401
  var gwMigE0402XmlPath = gwMigXmlPath + 'gw_e0402.xml'
  var version = 'v1' //GateWeb API Version

  function getGwMigA0101XmlPath() {
    return gwMigA0101XmlPath
  }

  function getGwMigA0401XmlPath() {
    return gwMigA0401XmlPath
  }

  function getGwMigC0401XmlPath() {
    return gwMigC0401XmlPath
  }

  function getGwMigB0101XmlPath() {
    return gwMigB0101XmlPath
  }

  function getGwMigB0401XmlPath() {
    return gwMigB0401XmlPath
  }

  function getGwMigD0401XmlPath() {
    return gwMigD0401XmlPath
  }

  function getGwMigE0402XmlPath() {
    return gwMigE0402XmlPath
  }

  function getGwMigVersion() {
    return version
  }

  /////////////////////////////////////////////////////////////////////////////////////////////
  //紀錄連線資訊
  var gwUrlString = 'https://test3.gwis.com.tw'
  var gwCompanyKey = 'dde9541a-03f3-48c3-85a1-7142d0edb924'
  var gwUserName = 'walter'
  var gwPwd = 'walter1111' //'walter1111'

  function getGwUrlString() {
    return gwUrlString
  }

  function getGwCompanyKey() {
    return gwCompanyKey
  }

  function getGwUserName() {
    return gwUserName
  }

  function getGwPwd() {
    return gwPwd
  }

  /////////////////////////////////////////////////////////////////////////////////////////////
  //紀錄EGUI及Allowance的ScriptID,DeployID
  var gw_voucher_genxml_sl_action_scriptId =
    'customscript_gw_voucher_genxml_sl_action'
  var gw_voucher_genxml_sl_action_deploymentId =
    'customdeploy_gw_voucher_genxml_sl_action'

  var gw_egui_scriptId = 'customscript_gw_egui_ui_list'
  var gw_egui_deploymentId = 'customdeploy_gw_egui_ui_list'
  var gw_allowance_scriptId = 'customscript_gw_allowance_ui_list'
  var gw_allowance_deploymentId = 'customdeploy_gw_allowance_ui_list'

  function getGwVoucherGenxmlScriptId() {
    return gw_voucher_genxml_sl_action_scriptId
  }

  function getGwVoucherGenxmlDeploymentId() {
    return gw_voucher_genxml_sl_action_deploymentId
  }

  function getGwEguiScriptId() {
    return gw_egui_scriptId
  }

  function getGwEguiDeploymentId() {
    return gw_egui_deploymentId
  }

  function getGwAllowanceScriptId() {
    return gw_allowance_scriptId
  }

  function getGwAllowanceDeploymentId() {
    return gw_allowance_deploymentId
  }

  function init() {}

  function setup() {}

  return {
    init: init,
    getGwPageSize: getGwPageSize,
    getGwDepositVoucherRecord: getGwDepositVoucherRecord,
    getGwVoucherProperties: getGwVoucherProperties,
    getGwAssignLogManualScriptId: getGwAssignLogManualScriptId,
    getGwAssignLogManualDeploymentId: getGwAssignLogManualDeploymentId,
    getGwAssignLogTrackRecordId: getGwAssignLogTrackRecordId,
    getGwSearchAccountName: getGwSearchAccountName,
    getGwTaxCodeNameByGWTaxCode: getGwTaxCodeNameByGWTaxCode,
    lockInvoceControlFieldId: lockInvoceControlFieldId,
    getGwVoucherFormatInvoiceCode: getGwVoucherFormatInvoiceCode,
    getGwVoucherFormatAllowanceCode: getGwVoucherFormatAllowanceCode,
    unLockInvoceControlFieldId: unLockInvoceControlFieldId,
    lockCredMemoControlFieldId: lockCredMemoControlFieldId,
    unLockCredMemoControlFieldId: unLockCredMemoControlFieldId,
    getGwCreditMemoEditDefaultAccount: getGwCreditMemoEditDefaultAccount,
    getGwInvoiceMainEditDefaultAccount: getGwInvoiceMainEditDefaultAccount,
    getGwCreditMemoMainEditDefaultAccount: getGwCreditMemoMainEditDefaultAccount,
    getGwEguiScriptId: getGwEguiScriptId,
    getGwVoucherGenxmlScriptId: getGwVoucherGenxmlScriptId,
    getGwVoucherGenxmlDeploymentId: getGwVoucherGenxmlDeploymentId,
    getGwEguiDeploymentId: getGwEguiDeploymentId,
    getGwAllowanceScriptId: getGwAllowanceScriptId,
    getGwAllowanceDeploymentId: getGwAllowanceDeploymentId,
    getGwTaxTypeFromNSTaxCode: getGwTaxTypeFromNSTaxCode,
    getGwMessageDurationSeconds: getGwMessageDurationSeconds,
    getGwInvoiceEditDefaultAccount: getGwInvoiceEditDefaultAccount,
    getGwInvoiceUIEditScriptId: getGwInvoiceUIEditScriptId,
    getGwInvoiceUIEditDeployId: getGwInvoiceUIEditDeployId,
    getGwNumericToFixed: getGwNumericToFixed,
    getGwInvoiceActionScriptId: getGwInvoiceActionScriptId,
    getGwInvoiceActionDeploymentId: getGwInvoiceActionDeploymentId,
    getGwVoucherMainSearchId: getGwVoucherMainSearchId,
    getGwSalesAccountValue: getGwSalesAccountValue,
    getGwInvoiceDetailSearchId: getGwInvoiceDetailSearchId,
    getGwCreditmemoDetailSearchId: getGwCreditmemoDetailSearchId,
    getGwWithTaxID: getGwWithTaxID,
    getGwZeroTaxID: getGwZeroTaxID,
    getGwFreeTaxID: getGwFreeTaxID,
    getSpeicalTaxID: getSpeicalTaxID,
    getGwMixTaxID: getGwMixTaxID,
    getGwAssignLogActionScriptId: getGwAssignLogActionScriptId,
    getGwAssignLogActionDeploymentId: getGwAssignLogActionDeploymentId,
    getGwAssignLogImportScriptId: getGwAssignLogImportScriptId,
    getGwAssignLogImportDeploymentId: getGwAssignLogImportDeploymentId,
    getGwAssignLogRecordId: getGwAssignLogRecordId,
    getGwAssignLogSearchId: getGwAssignLogSearchId,
    getGwVoucherApplyListRecord: getGwVoucherApplyListRecord,
    getGwVoucherMainRecord: getGwVoucherMainRecord,
    getGwVoucherDetailsRecord: getGwVoucherDetailsRecord,
    getGwMigA0101XmlPath: getGwMigA0101XmlPath,
    getGwMigA0401XmlPath: getGwMigA0401XmlPath,
    getGwMigC0401XmlPath: getGwMigC0401XmlPath,
    getGwMigB0101XmlPath: getGwMigB0101XmlPath,
    getGwMigB0401XmlPath: getGwMigB0401XmlPath,
    getGwMigD0401XmlPath: getGwMigD0401XmlPath,
    getGwMigE0402XmlPath: getGwMigE0402XmlPath,
    getGwMigVersion: getGwMigVersion,
    getGwUrlString: getGwUrlString,
    getGwCompanyKey: getGwCompanyKey,
    getGwUserName: getGwUserName,
    getGwPwd: getGwPwd,
    getInvoceControlFieldId: getInvoceControlFieldId,
    getCredMemoControlFieldId: getCredMemoControlFieldId,
    setup: setup,
  }
})
