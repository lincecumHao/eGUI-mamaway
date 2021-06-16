define(['N/runtime','N/record','../gw_common_utility/gw_common_invoice_utility'], function (runtime, record, invoiceutility) {
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
	var _subsidiary = _current_record.getValue({
		  fieldId: 'subsidiary',
	})		
	
	var _auth = false;
	var _user_obj    = runtime.getCurrentUser()
	var _company_ary = invoiceutility.getBusinessEntitByUserId(_user_obj.id, _subsidiary)
	if (_company_ary!=null) {
    	for (var i=0; i<_company_ary.length; i++) {
    		var _company = _company_ary[i];
			if (parseInt(_subsidiary) == parseInt(_company.subsidiary)) {
				_auth = true;break;
			}    		 
    	}
    } 
   
    log.debug('_lock_transaction', '_lock_transaction:' + _lock_transaction)
	log.debug('_auth', '_auth:' + _auth)
	
    if (
      context.type == context.UserEventType.VIEW &&
	  _auth == true &&
      _lock_transaction == false
    ) {
      frm.addButton({
        id: 'custpage_invoice_egui_edit_btn',
        label: '開立發票',
        functionName: 'onButtonClickForEGUI()',
      })
    }

    frm.clientScriptModulePath = './gw_invoice_open_voucher_event.js'
  }

  exports.beforeLoad = beforeLoad
  return exports
})
