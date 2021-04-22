define(['N/record', 'N/url'], function (record, url) {
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

   * @NScriptType ClientScript
   */
  var exports = {}
  var lockedFields = {
    body: [
      'custbody_gw_allowance_num_end',
      'custbody_gw_allowance_num_start',
      'custbody_gw_gui_num_end',
      'custbody_gw_gui_num_start',
      'custbody_gw_tax_id_number',
      'custbody_gw_tcm_extra_memo',
      'custbody_gw_lock_transaction',
      'custbody_gw_gui_address',
      'custbody_gw_gui_title',
      'custbody_gw_no_egui',
      'custbody_gw_creditmemo_deduction_list',
    ],
    sublist: {
      item: [
        'quantity', // 數量（QUANTITY）
        'rate', // 單位價格（UNIT PRICE）
        'amount', // 未稅金額（AMOUNT）
        'taxcode', // 稅金代碼（TAX CODE）
        'taxrate1', // 稅率（TAX RATE）
        'tax1amt', // 稅金金額（TAX AMT）
        'grossamt', // 含稅金額（GROSS AMT）
        'custcol_gw_item_memo', // 發票項目備註（發票項目備註）
        'custcoltcm_get_x_free_qty', // @贈(量)
        'custcol_tcm_item_cm', // 折讓隨單開立
        'custcol_tcm_line_cm_untaxprice', // @折讓未稅單價
        'custcol_tcm_line_cm_taxprice', // @折讓含稅單價
        'custcol_tcm_cm_untaxamount', // 折讓未稅
        'custcoltcm_item_discount_percent', // 折讓(%)
        'custcol_tcm_cm_taxamount', // 折讓含稅
        'custcol_tcm_cm_tranid', // 合約折讓單單號
        'custcol_tcm_othercharge_arcredit', // 管理費隨單開立
        'custcol_tcm_othercharge_untax', // @管理費未稅單價
        'custcol_tcm_othercharge_tax', // @管理費含稅單價
        'custcol_tcm_line_taxprice', // 含稅單價
        'custcol_tcm_othercgarge_untaxamount', // 管理費未稅
        'custcol_tcm_othercharge_percent', // 管理費(%)
        'custcol_tcm_othercgarge_taxamount', // 管理費含稅
        'custcol_tcm_othercharge_tranid', // 管理費折讓單
      ],
    },
  }

  /**
   * pageInit event handler; executed when the page completes loading or when the form is reset.
   *
   * @gov XXX
   *
   * @param {Object} context
   * @param {string} context.mode - The access mode of the current record.
   * @param {CurrentRecord} context.currentRecord - The record in context
   */
  function pageInit(context) {
    // TODO
    if (context.mode === 'edit') {
      if (isRecordLocked(context.currentRecord)) {
        // redirectToViewMode(context.currentRecord)
        lockFields(context.currentRecord)
        // lockSublistFields(context.currentRecord)
      }
    }
  }

  function redirectToViewMode(currentTransRecord) {
    alert('This record is locked!')
    var recordType = currentTransRecord.type
    var recordId = currentTransRecord.id
    var viewUrl = url.resolveRecord({
      recordId: recordId,
      recordType: recordType,
      isEditMode: false,
    })
    window.location.replace(viewUrl)
  }

  function lockFields(currentTransRecord) {
    var lockedFieldIds = lockedFields.body
    lockedFieldIds.forEach(function (fieldId) {
      var field = currentTransRecord.getField({
        fieldId: fieldId,
      })
      if (field) field.isDisabled = true
    })
  }

  function lockSublistFields(currentTransRecord) {
    var sublistLockedFields = lockedFields.sublist
    Object.keys(sublistLockedFields).forEach(function (sublistId) {
      var currentSublist = currentTransRecord.getSublist({
        sublistId: sublistId,
      })
      console.log('lockSublistFields sublistId')
      var lockedFieldIds = sublistLockedFields[sublistId]
      lockedFieldIds.forEach(function (fieldId) {
        console.log('lockSublistFields fieldId', fieldId)
        var column = currentSublist.getColumn({
          fieldId: fieldId,
        })
        if (column) column.isDisabled = true
      })
    })
  }

  function isRecordLocked(record) {
    var lock_validate_field = 'custbody_gw_lock_transaction'
    var value = record.getValue({
      fieldId: lock_validate_field,
    })
    console.log('isRecordLocked value', value)
    return value
  }

  /**
   * saveRecord event handler; executed after the submit button is pressed but before the form is
   * submitted.
   *
   * @gov XXX
   *
   * @param {Object} context
   * @param {CurrentRecord} context.currentRecord - The record in context
   *
   * @return {boolean} true if the record is valid; false to stop form submission.
   */
  function saveRecord(context) {
    // TODO
    return true
  }

  /**
   * <code>lineInit</code> event handler
   *
   * @gov XXX
   *
   * @param context
   *    {Object}
   * @param context.currentRecord
   *    {record} The current record the user is manipulating in the UI
   * @param context.sublistId
   *    {string} The internal ID of the sublist.
   *
   * @return {void}
   *
   * @static
   * @function lineInit
   */
  function lineInit(context) {
    // TODO
    console.log('lineInit sublist id', context.sublistId)
    lockSublistFields(context.currentRecord)
  }

  function lockRecordWrapper(func) {
    return function () {
      var context = arguments[0]
      console.log('lockRecordWrapper')
      console.log('lockRecordWrapper mode', context.mode)
      console.log('lockRecordWrapper edit mode', context.mode === 'edit')
      console.log(
        'lockRecordWrapper isRecordLocked',
        isRecordLocked(context.currentRecord)
      )
      if (isRecordLocked(context.currentRecord)) {
        return func.apply(this, arguments)
      }
    }
  }

  exports.pageInit = lockRecordWrapper(pageInit)
  exports.saveRecord = saveRecord
  exports.lineInit = lockRecordWrapper(lineInit)
  return exports
})
