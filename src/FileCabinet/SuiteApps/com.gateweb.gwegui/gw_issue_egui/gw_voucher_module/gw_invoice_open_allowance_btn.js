define(['N/record'], function (record) {
  /**
   * @NApiVersion 2.1
   * @NScriptType UserEventScript
   * @NModuleScope Public
   */
  var exports = {}

  function beforeLoad(context) {
    var frm = context.form

    var _current_record = context.newRecord
    var _lock_transaction = _current_record.getValue({
      fieldId: 'custbody_gw_lock_transaction',
    })

    log.debug('_lock_transaction', '_lock_transaction:' + _lock_transaction)
    if (
      context.type == context.UserEventType.VIEW &&
      _lock_transaction == false
    ) {
      frm.addButton({
        id: 'custpage_invoice_egui_edit_btn',
        label: '開立折讓(電子發票)',
        functionName: 'onButtonClickForAllowance()',
      })
    }

    frm.clientScriptModulePath = './gw_invoice_open_voucher_event.js'
  }

  exports.beforeLoad = beforeLoad
  return exports
})
