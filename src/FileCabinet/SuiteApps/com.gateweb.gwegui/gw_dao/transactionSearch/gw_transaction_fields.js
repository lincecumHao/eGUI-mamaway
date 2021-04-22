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
    mainline: {
      id: 'mainline',
      sourceField: '',
      targetField: 'mainline',
    },
    trandate: {
      id: 'trandate',
      sourceField: '',
      targetField: 'tranDate',
    },
    subsidiary: {
      id: 'subsidiary',
      sourceField: '',
      targetField: 'subsidiary',
    },
    type: {
      id: 'type',
      sourceField: '',
      targetField: 'tranType',
    },
    entity: {
      id: 'entity',
      sourceField: '',
      targetField: 'customer',
    },
    tranid: {
      id: 'tranid',
      sourceField: '',
      targetField: 'tranName',
    },
    transactionnumber: {
      id: 'transactionnumber',
      sourceField: '',
      targetField: 'tranNum',
    },
    memomain: {
      id: 'memomain',
      sourceField: '',
      targetField: 'memo',
    },
    amount: {
      id: 'amount',
      sourceField: '',
      targetField: '',
    },
    fxamount: {
      id: 'fxamount',
      sourceField: '',
      targetField: 'nsTotalAmt',
    },
    department: {
      id: 'department',
      sourceField: '',
      targetField: 'department',
    },
    createdby: {
      id: 'createdby',
      sourceField: '',
      targetField: 'createdby',
    },
    createdfrom: {
      id: 'createdfrom',
      sourceField: '',
      targetField: 'createdfrom',
    },
    class: {
      id: 'class',
      sourceField: '',
      targetField: 'classification',
    },
    location: {
      id: 'location',
      sourceField: '',
      targetField: 'location',
    },
    custbody_gw_lock_transaction: {
      id: 'custbody_gw_lock_transaction',
      sourceField: '',
      targetField: 'isTransactionLocked',
    },
    custbody_gw_no_egui: {
      id: 'custbody_gw_no_egui',
      sourceField: '',
      targetField: 'isIssueEgui',
    },
    custbody_gw_allowance_num_end: {
      id: 'custbody_gw_allowance_num_end',
      sourceField: '',
      targetField: 'allowanceNumEnd',
    },
    custbody_gw_customs_export_no: {
      id: 'custbody_gw_customs_export_no',
      sourceField: '',
      targetField: 'customExportNum',
    },
    custbody_gw_allowance_num_start: {
      id: 'custbody_gw_allowance_num_start',
      sourceField: '',
      targetField: 'allowanceNumStart',
    },
    custbody_gw_customs_export_category: {
      id: 'custbody_gw_customs_export_category',
      sourceField: '',
      targetField: 'customExportCategory',
    },
    custbody_gw_gui_address: {
      id: 'custbody_gw_gui_address',
      sourceField: '',
      targetField: 'customerAddress',
    },
    custbody_gw_gui_title: {
      id: 'custbody_gw_gui_title',
      sourceField: '',
      targetField: 'customerName',
    },
    custbody_gw_gui_num_end: {
      id: 'custbody_gw_gui_num_end',
      sourceField: '',
      targetField: 'eguiNumEnd',
    },
    custbody_gw_gui_num_start: {
      id: 'custbody_gw_gui_num_start',
      sourceField: '',
      targetField: 'eguiNumStart',
    },
    custbody_gw_tax_id_number: {
      id: 'custbody_gw_tax_id_number',
      sourceField: '',
      targetField: 'customerTaxId',
    },
    custbody_gw_customs_export_date: {
      id: 'custbody_gw_customs_export_date',
      sourceField: '',
      targetField: 'customExportDate',
    },
    custbody_gw_egui_clearance_mark: {
      id: 'custbody_gw_egui_clearance_mark',
      sourceField: '',
      targetField: 'clearanceMark',
    },
    custbody_gw_applicable_zero_tax: {
      id: 'custbody_gw_applicable_zero_tax',
      sourceField: '',
      targetField: 'zeroTaxMark',
    },
    custbody_gw_extra_memo: {
      id: 'custbody_gw_extra_memo',
      sourceField: '',
      targetField: 'extraMemo',
    },
    statusref: {
      id: 'statusref',
      sourceField: '',
      targetField: 'tranStatus',
    },
    id: {
      id: 'id',
      sourceField: '',
      targetField: 'tranInternalId',
    },
  }

  var lineFieldConfig = {
    subsidiary: {
      id: 'subsidiary',
      sourceField: '',
      targetField: 'subsidiary',
    },
    tranid: {
      id: 'tranid',
      sourceField: '',
      targetField: 'tranName',
    },
    transactionnumber: {
      id: 'transactionnumber',
      sourceField: '',
      targetField: 'tranNum',
    },
    memo: {
      id: 'memo',
      sourceField: '',
      targetField: 'itemName',
    },
    fxamount: {
      id: 'fxamount',
      sourceField: '',
      targetField: 'salesAmt',
    },
    linesequencenumber: {
      id: 'linesequencenumber',
      sourceField: '',
      targetField: 'lineSeq',
    },
    line: {
      id: 'line',
      sourceField: '',
      targetField: 'line',
    },
    item: {
      id: 'item',
      sourceField: '',
      targetField: 'item',
    },
    unitabbreviation: {
      id: 'unitabbreviation',
      sourceField: '',
      targetField: 'unit',
    },
    itemtype: {
      id: 'itemtype',
      sourceField: '',
      targetField: 'itemType',
    },
    quantity: {
      id: 'quantity',
      sourceField: '',
      targetField: 'quantity',
    },
    custcol_gw_item_memo: {
      id: 'custcol_gw_item_memo',
      sourceField: '',
      targetField: 'itemMemo',
    },
    fxrate: {
      id: 'fxrate',
      sourceField: '',
      targetField: 'unitPrice',
    },
    taxItem: {
      id: 'taxItem',
      sourceField: '',
      targetField: 'taxCode',
    },
    id: {
      id: 'id',
      sourceField: '',
      targetField: 'tranInternalId',
    },
  }

  var fieldOutputMapping = ramda.reduce(
    function (result, fieldId) {
      var fieldObj = fieldConfig[fieldId]
      result[fieldObj.id] = fieldObj.targetField
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
      result[fieldObj.id] = fieldObj.targetField
      return result
    },
    {},
    Object.keys(lineFieldConfig)
  )

  exports.fields = fieldConfig
  exports.allFieldIds = Object.keys(fieldConfig)
  exports.fieldOutputMapping = fieldOutputMapping
  exports.fieldIdMapping = fieldIdMapping

  exports.lineFields = lineFieldConfig
  exports.allLineFieldIds = Object.keys(lineFieldConfig)
  exports.lineFieldOutputMapping = lineFieldOutputMapping

  return exports
})
