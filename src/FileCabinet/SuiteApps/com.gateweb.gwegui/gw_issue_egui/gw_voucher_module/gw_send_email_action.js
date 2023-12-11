/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope Public
 */
define([  
  'N/runtime',  
  'N/redirect',  
  'N/search',  
  '../gw_common_utility/gw_common_invoice_utility',  
  '../services/email/gw_service_egui_email',  
  '../gw_common_utility/gw_common_configure',
], function ( 
  runtime,  
  redirect,  
  search,
  invoiceutility,  
  gwEmailService,  
  gwconfigure
) {  
  var _voucher_main_record_id = gwconfigure.getGwVoucherMainRecord()
  var _remaining_usage_limit = 50
  var _limit_count = 1000
      
  function forwardToNextSuitelet (next_script_id, next_deployment_id, message, task_count) { 
	  var _email_task_title = '重傳E-Mail結果'
	  var _email_task_message = message+'-['+task_count+']筆'
	  var _params = {
		            'email_task_title' : _email_task_title,   
		            'email_task_message' : _email_task_message   
	                }
	  redirect.toSuitelet({
	      scriptId: next_script_id,
	      deploymentId: next_deployment_id,
	      parameters : _params
	  })
  }
  
  function searchDocumentAndSendMail(selected_hiddent_listid) { 
	var _forward_to_self = false 
	var _done_count = 0
	var _last_hiddent_listid = '-1'
    try {
         var _id_ary = selected_hiddent_listid.split(',')
         
         var _my_search = search.create({
	         type: _voucher_main_record_id,
	         columns: [
	        	 search.createColumn({name: 'custrecord_gw_mig_type'}),
	        	 search.createColumn({name: 'custrecord_gw_voucher_type'}),   //EGUI, ALLOWANCE
	             search.createColumn({name: 'custrecord_gw_voucher_status'}), //VOUCHER_SUCCESS, CANCEL_SUCCESS
	             search.createColumn({name: 'custrecord_gw_voucher_upload_status'}), //A,P,C,E
	             search.createColumn({name: 'custrecord_gw_voucher_number', sort: search.Sort.ASC})
	         ],
         })
         
         var _filterArray = []
         _filterArray.push(['internalId', search.Operator.ANYOF, _id_ary])
         _my_search.filterExpression = _filterArray
 
         _my_search.run().each(function (result) {
	    	  var _remaining_usage = runtime.getCurrentScript().getRemainingUsage()
	    	  
	    	  if (_forward_to_self == false) {
	    		  if (_remaining_usage <= _remaining_usage_limit) {			    	  
			    	  _forward_to_self = true		    	 
			      } else {		      
			    	  sendMail(result) 
			    	  _done_count++
			      }	    		  
	    	  } else {
	    		  _last_hiddent_listid+=','+result.id
	    	  } 	      
	          return true
	     })
	     
    } catch (e) {
    	log.error(e.name, e.message)  
    } 
    
    var _obj = {
    	'done_count':_done_count,
    	'forward_to_self':_forward_to_self,
    	'last_hiddent_listid':_last_hiddent_listid 
    }
    
    return _obj
  }
  
  function sendMail(result) {  
    try {   
         var _internal_id = result.id
        
         var _gw_mig_type = result.getValue({name: 'custrecord_gw_mig_type'})
         var _gw_voucher_type = result.getValue({name: 'custrecord_gw_voucher_type'})
         var _gw_voucher_status = result.getValue({name: 'custrecord_gw_voucher_status'})
          
         var _apply_type = ''
         if (_gw_voucher_status.indexOf('CANCEL') !=-1) {
             _apply_type = 'CANCEL'
         } else {
        	 _apply_type = 'VOUCHER'
         }
        
         var _upload_mig_type = invoiceutility.getMigType(_apply_type, _gw_voucher_type, _gw_mig_type) 
        
         var _email_sublect = ''
         if (_upload_mig_type=='C0401') { //發票開立
             _email_sublect = '電子發票開立通知'
         } else if (_upload_mig_type=='C0501') {//發票作廢
             _email_sublect = '電子發票作廢通知'
         } else if (_upload_mig_type=='D0401') {//折讓單開立
             _email_sublect = '折讓單開立通知'
         } else if (_upload_mig_type=='D0501') {//折讓單作廢
             _email_sublect = '折讓單作廢通知'
         }
         
         log.debug('EmailService send_email_task', 'internal_id='+_internal_id+', email_sublect='+_email_sublect)      
           
         gwEmailService.sendByVoucherId(_email_sublect, _internal_id)
        	   
    } catch (e) {
    	log.error(e.name, e.message)  
    }     
  }
  
  function onRequest(context) { 
	var _selected_task = context.request.parameters.selected_task  //EGUI , ALLOWANCE
    var _selected_hiddent_listid = context.request.parameters.selected_hiddent_listid  
    log.debug('send_email_task', 'selected_task='+_selected_task+', selected_hiddent_listid='+_selected_hiddent_listid)      
    
    var _search_customscript_id = ''
    var _search_customdeploy_id = ''
    if (_selected_task=='EGUI') {
    	_search_customscript_id = 'customscript_gw_egui_cancel_ui_list'
    	_search_customdeploy_id = 'customdeploy_gw_egui_cancel_ui_list'
    } else {
    	_search_customscript_id = 'customscript_gw_allowance_cancel_ui_list'
       	_search_customdeploy_id = 'customdeploy_gw_allowance_cancel_ui_list'
    }
    try {
    	 var _task_result_obj = searchDocumentAndSendMail(_selected_hiddent_listid) 
    	 
    	 var _done_count          = _task_result_obj.done_count
    	 var _forward_to_self     = _task_result_obj.forward_to_self
    	 var _last_hiddent_listid = _task_result_obj.last_hiddent_listid
    	 
		 if (_forward_to_self == true) {
			 //沒做完
			 var _params = {
					        'selected_task' : _selected_task,
					        'selected_hiddent_listid' : _last_hiddent_listid
				           }
			 redirect.toSuitelet({
		         scriptId: 'customscript_gw_send_email_action',
		         deploymentId: 'customdeploy_gw_send_email_action',
		         parameters : _params
		     }) 
		 } else { 
	         //作完回原畫面 
	         forwardToNextSuitelet(_search_customscript_id, 
	        		               _search_customdeploy_id, 
	        		               '重傳成功', _done_count)
		 }
    } catch (e) {
         log.error(e.name, e.message)  
         
         forwardToNextSuitelet(_search_customscript_id, 
        		               _search_customdeploy_id, 
        		               '重傳時發生錯誤', -1)
    }
  } //End onRequest

  return {
    onRequest: onRequest,
  }
})
