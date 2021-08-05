/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope Public
 */

define([
  'N/runtime',
  'N/ui/serverWidget',  
  'N/redirect',
  'N/file',
  'N/search',
  '../gw_common_utility/gw_common_invoice_utility',
  '../gw_common_utility/gw_common_string_utility',   
  '../gw_common_utility/gw_common_configure'
], function (
  runtime,
  serverWidget, 
  redirect,
  file,
  search,
  invoiceutility,
  stringutility,   
  gwconfigure
) {
  //Record
  var _voucher_apply_list_record_id = gwconfigure.getGwVoucherApplyListRecord()
  var _voucher_main_record_id = gwconfigure.getGwVoucherMainRecord()
  var _gw_voucher_properties = gwconfigure.getGwVoucherProperties() //設定檔
  
  function verifyColumn(line_value) {       
	var _line_values = line_value.split(',')  
	var _is_error = false
	var _error_msg = ''
		
	if (_line_values.length !=14) {
		_error_msg = '資料欄位長度不正確,需要14個欄位'
	} else {
		//賣方公司統編	買方公司統編	客戶代碼	格式代號	開立日期	發票號碼	稅別	稅率	銷售金額(未稅)	免稅銷售金額	零稅銷售金額	已折金額(應稅):未稅	已折金額(零稅)	已折金額(免稅)
		var _seller_ban                 = _line_values[0]
		var _buyer_ban                  = _line_values[1]
		var _customer_id                = _line_values[2]
		var _format_code_str            = _line_values[3] //31-05
		var _voucher_date               = _line_values[4]
		var _egui_number                = _line_values[5]
		var _tax_type                   = _line_values[6]
		var _tax_rate                   = _line_values[7]
		var _sales_amount               = _line_values[8]
		var _free_sales_amount          = _line_values[9]
		var _zero_sales_amount          = _line_values[10]
		var _sales_discount_amount      = _line_values[11]
		var _free_sales_discount_amount = _line_values[12]
		var _zero_discount_amount       = _line_values[13]
	  
	    //統編8碼
	    if (_seller_ban.length != 8) _error_msg += '賣方統編-長度需為8碼,'      
	    if (_buyer_ban.length  != 8) _error_msg += '買方統編-長度需為8碼,'        
	    	 
	    if (/^[1239]$/.test(_tax_type)==false)	_error_msg += '稅別錯誤-需為[1,2,3,9],' 
	   	if (/^[05]$/.test(_tax_rate)==false)	_error_msg += '稅率錯誤-需為[0,5],' 
	 
	   	if (/^[19]$/.test(_tax_type)==true && _tax_rate !='5') _error_msg += '稅率錯誤-需為[5],' 
	   	if (/^[23]$/.test(_tax_type)==true && _tax_rate !='0') _error_msg += '稅率錯誤-需為[0],' 
	     
	   	if (checkInvoiceNUmberFormat(_egui_number)==false) _error_msg += '發票號碼-格式錯誤(英文2碼,數字8碼),'  
	   	//重複發票號碼檢查	
		if(checkInvoiceNUmberDuplicate(_seller_ban, _egui_number)==true) _error_msg += '發票號碼-重複,'	
				   
	   	if(checkDateFormat(_voucher_date)==false) _error_msg += '開立日期-格式錯誤(需為yyyy/MM/dd),'
	   	  
	   	var _format_code_str_ary = ['31-01','31-05','32-02','32-03','35-06','35-07'];
	   	//格式代號 
		if (_format_code_str_ary.indexOf(_format_code_str) == -1)_error_msg += '格式代號錯誤,'  
			
	   	//客戶代碼存在-先不檢查	
		if (isNaN(_customer_id)==true) _error_msg += '客戶代碼-需為數字,'    
				
	    if (isNaN(_sales_amount)==true) _error_msg += '銷售金額(未稅)-需為數字,'    
	   	if (isNaN(_free_sales_amount)==true) _error_msg += '免稅銷售金額-需為數字,'  
	   	if (isNaN(_zero_sales_amount)==true) _error_msg += '零稅銷售金額-需為數字,'  
	  	if (isNaN(_sales_discount_amount)==true) _error_msg += '已折金額(應稅):未稅-需為數字,'  
	  	if (isNaN(_free_sales_discount_amount)==true) _error_msg += '已折金額(零稅)-需為數字,'  
	    if (isNaN(_zero_discount_amount)==true) _error_msg += '已折金額(免稅)-需為數字,'   
	}
	
	if(_error_msg.length != 0)_is_error=true
	
    var _msg_object = { hasError: _is_error, message: _error_msg }
    return _msg_object
  }
  
  function getGWTempUploadFileFolderId(group_type, voucher_property_id) {
    var _result_id = '-1'
    try {
      var _mySearch = search.create({
        type: _gw_voucher_properties,
        columns: [
          search.createColumn({ name: 'custrecord_gw_voucher_property_id' }), //TAX_WITH_TAX
          search.createColumn({ name: 'custrecord_gw_voucher_property_value' }), //1
          search.createColumn({ name: 'custrecord_gw_voucher_property_note' }), //應稅
          search.createColumn({ name: 'custrecord_gw_netsuite_id_value' }), //8
          search.createColumn({ name: 'custrecord_gw_netsuite_id_text' }), //VAT_TW TAX 5%-TW
        ],
      })

      var _filterArray = []
      _filterArray.push(['custrecord_gw_voucher_group_type', 'is', group_type])
      _filterArray.push('and')
      _filterArray.push([
        'custrecord_gw_voucher_property_id',
        'is',
        voucher_property_id,
      ])

      _mySearch.filterExpression = _filterArray
      _mySearch.run().each(function (result) {
        var internalid = result.id

        _result_id = result.getValue({
          name: 'custrecord_gw_netsuite_id_value',
        })

        return true
      })
    } catch (e) {
      log.error(e.name, e.message)
    }

    return _result_id
  }
  
  //TODO 檢查發票號碼重複
  var _file_invoice_number_ary = []
  function checkInvoiceNUmberDuplicate (business_no, invoice_number) { 
	  var _result = false
	 	  
	  if (_file_invoice_number_ary.indexOf(invoice_number) != -1) {
		  _result = true
	  } else{
		  _file_invoice_number_ary.push(invoice_number)
		  
	     _result = invoiceutility.checkInvoiceNumberDuplicate(business_no, invoice_number)
	  }
	  return _result
  }
  
  function checkInvoiceNUmberFormat (invoice_number) { 
	  return /^[A-Z]+[A-Z]+\d{8}$/.test(invoice_number)
  }
  
  function checkDateFormat (date_str) { 
	  var _result = true
	  var _date = Date.parse(date_str);
	  if(isNaN(_date)) {
		 _result = false		
	  }
	  return _result
  }
  
  function writeMessageToSublist(sublist_obj, seq_index, line_value, message) { 
	  var _line_values = line_value.split(',')  
	  //賣方公司統編	買方公司統編	客戶代碼	格式代號	開立日期	發票號碼	稅別	稅率	銷售金額(未稅)	免稅銷售金額	零稅銷售金額	已折金額(應稅):未稅	已折金額(零稅)	已折金額(免稅)
	  var _seller_ban                 = _line_values.length != 14 ? "":_line_values[0]
	  var _buyer_ban                  = _line_values.length != 14 ? "":_line_values[1]
	  var _customer_id                = _line_values.length != 14 ? "":_line_values[2]
	  var _format_code_str            = _line_values.length != 14 ? "":_line_values[3] //31-05
	  var _voucher_date               = _line_values.length != 14 ? "":_line_values[4]
	  var _egui_number                = _line_values.length != 14 ? "":_line_values[5]
	  var _tax_type                   = _line_values.length != 14 ? "":_line_values[6]
	  var _tax_rate                   = _line_values.length != 14 ? "":_line_values[7]
	  var _sales_amount               = _line_values.length != 14 ? "":_line_values[8]
	  var _free_sales_amount          = _line_values.length != 14 ? "":_line_values[9]
	  var _zero_sales_amount          = _line_values.length != 14 ? "":_line_values[10]
	  var _sales_discount_amount      = _line_values.length != 14 ? "":_line_values[11]
	  var _free_sales_discount_amount = _line_values.length != 14 ? "":_line_values[12]
	  var _zero_discount_amount       = _line_values.length != 14 ? "":_line_values[13]
	   
	  sublist_obj.setSublistValue({
          id: 'sublist_seq',
          line: seq_index,
          value: seq_index+1,
      })
      sublist_obj.setSublistValue({
          id: 'field_seller_ban',
          line: seq_index,
          value: _seller_ban,
      })
      sublist_obj.setSublistValue({
          id: 'field_buyer_ban',
          line: seq_index,
          value: _buyer_ban,
      })
      sublist_obj.setSublistValue({
          id: 'field_customer_id',
          line: seq_index,
          value: _customer_id,
      })
      sublist_obj.setSublistValue({
          id: 'field_customer_id',
          line: seq_index,
          value: _customer_id,
      })
      sublist_obj.setSublistValue({
          id: 'field_format_code',
          line: seq_index,
          value: _format_code_str,
      })
      sublist_obj.setSublistValue({
          id: 'field_voucher_date',
          line: seq_index,
          value: _voucher_date,
      })
      sublist_obj.setSublistValue({
          id: 'field_voucher_number',
          line: seq_index,
          value: _egui_number,
      })
      sublist_obj.setSublistValue({
          id: 'field_tax_type',
          line: seq_index,
          value: _tax_type,
      })
      sublist_obj.setSublistValue({
          id: 'field_sales_amount',
          line: seq_index,
          value: _sales_amount,
      })
      sublist_obj.setSublistValue({
          id: 'field_free_sales_amount',
          line: seq_index,
          value: _free_sales_amount,
      })
      sublist_obj.setSublistValue({
          id: 'field_zero_sales_amount',
          line: seq_index,
          value: _zero_sales_amount,
      })
      sublist_obj.setSublistValue({
          id: 'field_discount_sales_amount',
          line: seq_index,
          value: _sales_discount_amount,
      })
      sublist_obj.setSublistValue({
          id: 'field_discount_free_sales_amount',
          line: seq_index,
          value: _free_sales_discount_amount,
      })
      sublist_obj.setSublistValue({
          id: 'field_discount_zero_sales_amount',
          line: seq_index,
          value: _zero_discount_amount,
      }) 
      sublist_obj.setSublistValue({
          id: 'result_message',
          line: seq_index,
          value: message,
      })  
  }
   
  function savedFileMessage (sublist_obj, saved_temp_file_result, saved_temp_file_id, saved_temp_count) { 
	   if (saved_temp_file_result !=null && saved_temp_file_result != '') {
		   var _message = '' 
		   if (saved_temp_file_result=='successful') {
			   _message = '匯入資料成功-筆數共('+saved_temp_count+')筆'			  			    
		   } else if (saved_temp_file_result=='error') {
			   _message = '匯入資料-失敗' 
		   } 
		   sublist_obj.setSublistValue({
		          id: 'result_message',
		          line: 0,
		          value: _message,
		   })  
	   }
  }

  function onRequest(context) {
	//successful or error  
	var _saved_temp_file_result = context.request.parameters.saved_temp_file_result 
	//file id
	var _saved_temp_file_id     = context.request.parameters.saved_temp_file_id 
	//處理筆數
	var _saved_temp_count       = context.request.parameters.saved_temp_count 
	log.debug('saved_temp_file_result', _saved_temp_file_result)
	log.debug('saved_temp_file_id', _saved_temp_file_id)
	log.debug('saved_temp_count', _saved_temp_count)
	 
    var form = serverWidget.createForm({
      title: '歷史發票匯入作業',
    })

    //excel file
    var _file = form.addField({
        id: 'upload_excel_files',
        type: serverWidget.FieldType.FILE, 
        label: '選取 CSV 檔(附檔名 => xxxxx.csv)',
    }) 
    
    _file.updateLayoutType({
      layoutType: serverWidget.FieldLayoutType.OUTSIDE,
    })
  
    var _sublist = form.addSublist({
      id: 'sublist',
      type: serverWidget.SublistType.LIST,
      label: '錯誤資料清單',
    })
    _sublist.addField({
      id: 'sublist_seq',
      type: serverWidget.FieldType.TEXT,
      label: '序號',
    })
    _sublist.addField({
      id: 'field_seller_ban',
      type: serverWidget.FieldType.TEXT,
      label: '賣方公司統編',
    })
    _sublist.addField({
      id: 'field_buyer_ban',
      type: serverWidget.FieldType.TEXT,
      label: '買方公司統編',
    })
    _sublist.addField({
      id: 'field_customer_id',
      type: serverWidget.FieldType.TEXT,
      label: '客戶代碼',
    })
    _sublist.addField({
      id: 'field_format_code',
      type: serverWidget.FieldType.TEXT,
      label: '格式代號',
    })
    _sublist.addField({
      id: 'field_voucher_date',
      type: serverWidget.FieldType.TEXT,
      label: '開立日期',
    })
    _sublist.addField({
      id: 'field_voucher_number',
      type: serverWidget.FieldType.TEXT,
      label: '發票號碼',
    })
    _sublist.addField({
      id: 'field_tax_type',
      type: serverWidget.FieldType.TEXT,
      label: '稅別',
    })
    _sublist.addField({
      id: 'field_sales_amount',
      type: serverWidget.FieldType.TEXT,
      label: '銷售金額(未稅)',
    })
    _sublist.addField({
      id: 'field_free_sales_amount',
      type: serverWidget.FieldType.TEXT,
      label: '免稅銷售金額',
    })
    _sublist.addField({
      id: 'field_zero_sales_amount',
      type: serverWidget.FieldType.TEXT,
      label: '零稅銷售金額',
    })    
    _sublist.addField({
      id: 'field_discount_sales_amount',
      type: serverWidget.FieldType.TEXT,
      label: '已折金額(應稅):未稅',
    })
    _sublist.addField({
      id: 'field_discount_free_sales_amount',
      type: serverWidget.FieldType.TEXT,
      label: '已折金額(零稅)',
    })
    _sublist.addField({
      id: 'field_discount_zero_sales_amount',
      type: serverWidget.FieldType.TEXT,
      label: '已折金額(免稅)',
    })        
    _sublist.addField({
      id: 'result_message',
      type: serverWidget.FieldType.TEXT,
      label: '處理結果',
    })

    savedFileMessage (_sublist, _saved_temp_file_result, _saved_temp_file_id, _saved_temp_count)
    
    form.addSubmitButton({
      label: '存檔',
    })
    
    context.response.writePage(form)

    if (context.request.method === 'POST') {   
      //start access file
      var _file_obj = context.request.files.upload_excel_files            
      if (_file_obj == null) return
    
      var _iterator = _file_obj.lines.iterator()	  
      // Skip the first line, which is the CSV header line
      _iterator.each(function () {
         return false
      })
             
      //verify column value
      var _sublist_index = 0
      var _csv_has_error = false
      _iterator.each(function (line) { 		     
	      var _msg_object = verifyColumn(line.value) 
	      
	      if (_msg_object.hasError==true) {
	    	  _csv_has_error = true
	    	  //write error message to sublist	    	  
	    	  writeMessageToSublist(_sublist, _sublist_index, line.value, _msg_object.message) 
	    	  _sublist_index++
	      }
	      return true
	  })   
	    
	  if (_csv_has_error==false) {
		 //都正確才執行=>forward
		 //4194
		 var _folder_id = getGWTempUploadFileFolderId('UPLOAD_FILE', 'GWTempUploadFileFolder')		 
		 log.debug('saved _folder_id', _folder_id) 
		 if (_folder_id != '-1') {
			 _file_obj.folder = _folder_id	 
	         var _file_id = _file_obj.save()
	         log.debug('saved file_id', _file_id) 
	         
	         var _params = {'temp_file_id' : _file_id}
			 redirect.toSuitelet({
		         scriptId: 'customscript_gw_manual_egui_import_actio',
		         deploymentId: 'customdeploy_gw_manual_egui_import_actio',
		         parameters : _params
		     })
		 }
	  }   
      //end access file
    }
  }

  return {
    onRequest: onRequest,
  }
})
