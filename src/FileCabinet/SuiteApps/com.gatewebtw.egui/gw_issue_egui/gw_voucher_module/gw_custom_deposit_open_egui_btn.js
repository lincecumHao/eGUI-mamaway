define(['N/record'], function (record) {
  /**
   * @NApiVersion 2.1
   * @NScriptType UserEventScript
   * @NModuleScope Public
   */
  var exports = {}

  var _eguiEditScriptId = 'customscript_gw_deposit_egui_ui_edit'
  var _eguiEditDeploymentId = 'customdeploy_gw_deposit_egui_ui_edit'

  function beforeLoad(context) {
    var frm = context.form

    //var _lock_transaction = _current_record.getValue({fieldId: 'custbody_gw_lock_transaction'});
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
        id: 'custpage_customer_deposit_egui_edit_btn',
        label: '開立發票',
        functionName: 'onButtonClick()',
      })
    }

    frm.clientScriptModulePath = './gw_custom_deposit_open_egui_event.js'
  }

  exports.beforeLoad = beforeLoad
  return exports
})
