define(['N/runtime', 'N/currentRecord', 'N/url', '../gw_common_utility/gw_common_invoice_utility'], function (runtime, currentRecord, url, invoiceutility) {
  /**
   * @NApiVersion 2.0
   * @NScriptType ClientScript
   * @NModuleScope Public
   */
  var exports = {}

  var _eguiEditScriptId = 'customscript_gw_invoice_ui_edit'
  var _eguiEditDeploymentId = 'customdeploy_gw_invoice_ui_e'

  var _current_record = currentRecord.get()

  function pageInit(context) {
    // TODO
  }

  function onButtonClickForEGUI() {
    var _internalId = _current_record.id
    if (_internalId != 0) {
      try {
	    var _user_obj        = runtime.getCurrentUser()
	    var _user_subsidiary = _user_obj.subsidiary
    	var _selected_business_no = getBusinessNoBySubsidiary(_user_subsidiary)
    	
        var _invoice_hiddent_listid = '-1,' + _internalId
        var _creditmemo_hiddent_listid = ''
        var _params = {
          custpage_businessno :_selected_business_no,
          invoice_hiddent_listid: _invoice_hiddent_listid,
          creditmemo_hiddent_listid: _creditmemo_hiddent_listid,
        }

        window.location = url.resolveScript({
          scriptId: _eguiEditScriptId,
          deploymentId: _eguiEditDeploymentId,
          params: _params,
          returnExternalUrl: false,
        })
      } catch (e) {
        console.log(e.name + ':' + e.message)
      }
    }
  }

  function onButtonClickForAllowance() {
    var _internalId = _current_record.id
    if (_internalId != 0) {
      try {
    	var _user_obj        = runtime.getCurrentUser()
  	    var _user_subsidiary = _user_obj.subsidiary
      	var _selected_business_no = getBusinessNoBySubsidiary(_user_subsidiary)
      	
        var _invoice_hiddent_listid = ''
        var _creditmemo_hiddent_listid = '-1,' + _internalId
        var _params = {
          custpage_businessno :_selected_business_no,
          invoice_hiddent_listid: _invoice_hiddent_listid,
          creditmemo_hiddent_listid: _creditmemo_hiddent_listid,
        }

        window.location = url.resolveScript({
          scriptId: _eguiEditScriptId,
          deploymentId: _eguiEditDeploymentId,
          params: _params,
          returnExternalUrl: false,
        })
      } catch (e) {
        console.log(e.name + ':' + e.message)
      }
    }
  }
  
  function getBusinessNoBySubsidiary(subsidiary) {
    var _business_no = ''
	var _company_ary = invoiceutility.getSellerInfoBySubsidiary(subsidiary)
    if (_company_ary!=null) {
    	for (var i=0; i<_company_ary.length; i++) {
    		var _company = _company_ary[i];
    		
    		_business_no = _company.tax_id_number 
    	}
    } 
    
    return _business_no;
  }

  exports.onButtonClickForEGUI = onButtonClickForEGUI
  exports.onButtonClickForAllowance = onButtonClickForAllowance
  exports.pageInit = pageInit

  return exports
})
