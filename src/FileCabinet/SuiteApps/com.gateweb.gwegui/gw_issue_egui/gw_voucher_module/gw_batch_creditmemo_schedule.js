/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 * @NModuleScope Public
 * issue fghtyu456
 */
define([
  'N/runtime',
  'N/config',
  'N/search',
  'N/record',
  'N/format',
  '../gw_common_utility/gw_common_string_utility',
  '../gw_common_utility/gw_common_invoice_utility',
  '../gw_common_utility/gw_common_date_utility',
  '../gw_common_utility/gw_common_configure',
  '../../gw_dao/taxType/gw_dao_tax_type_21',
], function (
  runtime,
  config,
  search,
  record,
  format,
  stringutility,
  invoiceutility,
  dateutility,
  gwconfigure,
  taxyype21
) { 

  var _gw_creditmemo_detail_search_id = gwconfigure.getGwCreditmemoDetailSearchId()
  //稅差
  var tax_diff_balance = stringutility.convertToFloat(invoiceutility.getConfigureValue('TAX_GROUP', 'TAX_DIFF_BALANCE'))
  
  var _min_governence = 100
  var _final_remaining_usage = 0
  
  //1. 取得待處理的Credit_Memo資料 
  function executeScript(context) {
    log.debug('executeScript', '執行批次作業')  
    try {
		//1. search credit_memo
		var _my_search = search.load({
            id: _gw_creditmemo_detail_search_id,
        })
        var _filterArray = [] 
        _filterArray.push(['mainline', search.Operator.IS, false])
		_filterArray.push('and')
        _filterArray.push(['recordtype', search.Operator.IS, 'creditmemo']) 
        _filterArray.push('and')
        _filterArray.push(['taxline', search.Operator.IS, false]) //擋稅別科目
        _filterArray.push('and')
        _filterArray.push(['cogs', search.Operator.IS, false]) //擋庫存及成本科目
		_filterArray.push('and')
        _filterArray.push(['custbody_gw_is_issue_egui', search.Operator.IS, true]) //開立發票
		_filterArray.push('and')
        _filterArray.push(['custbody_gw_lock_transaction', search.Operator.IS, false]) //LOCK
		/////////////////////////////////////////////////////////////////////////////////////////////
		//Test 
		/**
		_filterArray.push('and') 
		_filterArray.push([
			['tranid', search.Operator.IS, 'CM00000000009434'],
			'or',
			['tranid', search.Operator.IS, 'CM00000000009435'],
		]) 		
		*/
		//_filterArray.push('and') 
		//_filterArray.push(['tranid', search.Operator.IS, 'CM00000000009433'])	
		/////////////////////////////////////////////////////////////////////////////////////////////
		_my_search.filterExpression = _filterArray
        log.debug('_filterArray', JSON.stringify(_filterArray))
				
		var _index_tranid = ''
		var _main_json_obj 
		_my_search.run().each(function (result) {
           var _result = JSON.parse(JSON.stringify(result))
           log.debug('Credit Memo Detail Search Result', JSON.stringify(result))
		   
		   var _tranid = _result.values.tranid //AZ10000016 documeny ID
		    
		   var _item_json_obj = setAllowanceDetailItem(_result)		   
		   if (_index_tranid != _tranid && _main_json_obj != null) {
			   var _allowance_obj = JSON.parse(JSON.stringify(_main_json_obj))
			   //處理折讓單
			   saveAllowanceRecord(_allowance_obj)
			   _main_json_obj = null
		   }
		   
		   _index_tranid = _tranid
		   _main_json_obj = setAllowanceMainObj(_main_json_obj, _result, _item_json_obj)
		  
		   return true
        })
		//處理折讓單-最後一筆
		if (_main_json_obj!=null)saveAllowanceRecord(_main_json_obj)		
		 
		
	} catch (e) {
      log.error(e.name, e.message)
    }  	
  }
  
  //處理Allowance Main Item TODO
  function setAllowanceMainObj(main_json_obj, result_obj, allowance_item_obj) {
	log.debug('setAllowanceMainObj', '處理Allowance Main')	 
    try {
		var _id = result_obj.id //CM 的 internalid = 840
		var _tranid = result_obj.values.tranid //CM00000000009437
		var _trandate = dateutility.getConvertDateByDate(result_obj.values.trandate) //2020-07-06
		 
		var _subsidiary = -1
		if (result_obj.values['subsidiary'].length != 0) {
		    _subsidiary = result_obj.values['subsidiary'][0].value //115 
		}
		var _business_entity = getSellerInfoBySubsidiary(_subsidiary)
		
		var _entity_value = '' //529
		var _entity_text = '' //11 se06_company公司
		if (result_obj.values.entity.length != 0) {
		  _entity_value = result_obj.values.entity[0].value //529
		  _entity_text = result_obj.values.entity[0].text   //11 se06_company公司
		}
	    var _customer_vatregnumber = result_obj.values.custbody_gw_tax_id_number //99999997
		var _email = result_obj.values['customer.email']
		var _buyer_address = result_obj.values.custbody_gw_gui_address
		var mig_type = 'B2C'
		
		var _item_salestaxcode_value
		var _tax_type = ''
		if (result_obj.values['taxItem.internalid'].length != 0) {
		    _item_salestaxcode_value = result_obj.values['taxItem.internalid'][0].value //5 
		    var _tax_obj = getTaxInformation(_item_salestaxcode_value)
		    if (typeof _tax_obj !== 'undefined') {
			   _tax_type = _tax_obj.voucher_property_value
		    }
		}
			
		var _main_tax_type = _tax_type
        //if (mig_type == 'B2C') _main_tax_type = '9'
		
		var _department_value = ''
		var _department_text = ''
		if (result_obj.values.department.length != 0) {
		  _department_value = result_obj.values['department'][0].value //1
		  _department_text = result_obj.values['department'][0].text //業務1部
		}

		var _class_value = ''
		var _class_text = ''
		if (result_obj.values.class.length != 0) {
		  _class_value = result_obj.values['class'][0].value //1
		  _class_text = result_obj.values['class'][0].text //業務1部
		}
	
		//////////////////////////////////////////////////////////////////////////////
		//處理零稅率資訊
		//海關出口單類別
		var _gw_customs_export_category_value = ''
		var _gw_customs_export_category_text = ''
		//適用零稅率規定
		var _gw_applicable_zero_tax_value = ''
		var _gw_applicable_zero_tax_text = ''
		//海關出口號碼
		var _gw_customs_export_no_value = ''
		var _gw_customs_export_no_text = ''
		//輸出或結匯日期
		var _gw_customs_export_date_value = ''
		var _gw_customs_export_date_text = ''
		//通關註記
		var _gw_egui_clearance_mark_value = ''
		var _gw_egui_clearance_mark_text = ''
		//海關出口號碼
		var _gw_customs_export_no = ''
		//輸出或結匯日期
		var _gw_customs_export_date = ''
		if (result_obj.values.custbody_gw_customs_export_category.length != 0) {
		  //海關出口單類別
		  _gw_customs_export_category_value =result_obj.values.custbody_gw_customs_export_category[0].value //3
		  _gw_customs_export_category_text =result_obj.values.custbody_gw_customs_export_category[0].text //D1-課稅區售與或退回保稅倉
		  var _temp_ary = _gw_customs_export_category_text.split('-')
		  _gw_customs_export_category_text = _temp_ary[0].substr(0, 2)
		}
		if (result_obj.values.custbody_gw_applicable_zero_tax.length != 0) {
		  //適用零稅率規定
		  _gw_applicable_zero_tax_value =result_obj.values.custbody_gw_applicable_zero_tax[0].value //5
		  _gw_applicable_zero_tax_text =result_obj.values.custbody_gw_applicable_zero_tax[0].text //5-國際間之運輸
		  var _temp_ary = _gw_applicable_zero_tax_text.split('-')
		  _gw_applicable_zero_tax_text = _temp_ary[0].substr(0, 1)
		}
		if (result_obj.values.custbody_gw_egui_clearance_mark.length != 0) {
		  //通關註記
		  _gw_egui_clearance_mark_value =result_obj.values.custbody_gw_egui_clearance_mark[0].value //5
		  _gw_egui_clearance_mark_text =result_obj.values.custbody_gw_egui_clearance_mark[0].text //5-國際間之運輸
		  var _temp_ary = _gw_egui_clearance_mark_text.split('-')
		  _gw_egui_clearance_mark_text = _temp_ary[0].substr(0, 1)
		}
		//海關出口號碼 : AA123456789012
		_gw_customs_export_no = result_obj.values.custbody_gw_customs_export_no
		//輸出或結匯日期 : 2021/01/22
		_gw_customs_export_date = convertExportDate(result_obj.values.custbody_gw_customs_export_date)
		log.debug('_gw_customs_export_date', _gw_customs_export_date)
		//////////////////////////////////////////////////////////////////////////////
		var _random_number = invoiceutility.getRandomNum(1000, 9999)
		var _voucher_number_start = result_obj.values.custbody_gw_gui_num_start
		var _voucher_number_end = result_obj.values.custbody_gw_gui_num_end
		
		var _tax_type          = allowance_item_obj.taxType
		var _sales_amount      = (_tax_type=='1')?allowance_item_obj.amount:0			
		var _zero_sales_amount = (_tax_type=='2')?allowance_item_obj.amount:0
		var _free_sales_amount = (_tax_type=='3')?allowance_item_obj.amount:0
		var _tax_amount = allowance_item_obj.itemTaxAmount
		var _tax_item_rate = allowance_item_obj.taxRate
		
		var _total_amount = allowance_item_obj.itemTotalAmount
			
		if (main_json_obj === "undefined" || main_json_obj==null) {			
			var _item_ary = []
			_item_ary.push(allowance_item_obj)
			
			//Allowance資料
			var _allowance_egui_number = invoiceutility.getAllowanceNumber(dateutility.getCompanyLocatDate())
            var _allowance_egui_time   = dateutility.getCompanyLocatTime()
            var _allowance_year_month  = dateutility.getTaxYearMonthByDate(result_obj.values.trandate)  
			
			main_json_obj = {
              applyId: _id,
              trandate: _trandate,
              sellerIdentifier: _business_entity.tax_id_number,
              sellerName: _business_entity._be_gui_title,
              sellerAddress: _business_entity.address,
              buyerId: _entity_value,
              buyerIdentifier: _customer_vatregnumber,
              buyerName: _entity_text,
              buyerEmail: _email,
              buyerAddress: _buyer_address,
              mig_type: mig_type,
              taxType: _main_tax_type,
              taxRate: stringutility.convertToFloat(_tax_item_rate) / 100,
              department: _department_value,
              classId: _class_value,
              applicable_zero_tax: _gw_applicable_zero_tax_text,
              customs_export_category: _gw_customs_export_category_text,
              customs_export_no: _gw_customs_export_no,
              customs_export_date: _gw_customs_export_date,
              randomNumber: _random_number,             
              sales_amount: _sales_amount,
              free_sales_amount: _zero_sales_amount,
              zero_sales_amount: _free_sales_amount,
              tax_amount: _tax_amount,
              tax_type: _tax_type,
              total_amount: _total_amount, 
			  voucher_number_start : _voucher_number_start,
			  voucher_number_end : _voucher_number_end,
              item_ary: _item_ary,
			  allowance_egui_number: _allowance_egui_number,
			  allowance_egui_time: _allowance_egui_time,
			  allowance_year_month: _allowance_year_month
            }
		} else {
			main_json_obj.sales_amount += _sales_amount
			main_json_obj.free_sales_amount += _free_sales_amount
			main_json_obj.zero_sales_amount += _zero_sales_amount
			main_json_obj.tax_amount += _tax_amount
			main_json_obj.total_amount += _total_amount
			 	
			main_json_obj.item_ary.push(allowance_item_obj)
		}
		
	    if (main_json_obj.sales_amount !=0 && main_json_obj.free_sales_amount!=0){
			main_json_obj.tax_type = '9'
		} else if (main_json_obj.sales_amount !=0 && main_json_obj.zero_sales_amount!=0){
			main_json_obj.tax_type = '9'
		}		 
		
	} catch (e) {
      log.error(e.name, e.message)
    }  
	log.debug('main_json_obj', JSON.stringify(main_json_obj))
	return main_json_obj
  }
  
  //處理Allowance Detail Item 
  function setAllowanceDetailItem(result_obj) {
	log.debug('setAllowanceDetailItem', '處理Allowance Item')	
    var _item_json_obj	
    try {
		 var _item_displayname = result_obj.values['item.displayname'] //新客戶折扣
		 var _item_salestaxcode_value = '' //5
		 var _item_salestaxcode_text = result_obj.values['taxItem.itemid'] //UNDEF-TW

		 var _tax_type = '1' //default=應稅=1, 零稅=2, 免稅=3
		 if (result_obj.values['taxItem.internalid'].length != 0) {
		     _item_salestaxcode_value = result_obj.values['taxItem.internalid'][0].value //5
			 var _tax_obj = getTaxInformation(_item_salestaxcode_value)
			 if (typeof _tax_obj !== 'undefined') {
				 _tax_type = _tax_obj.voucher_property_value
			 }
		 }
		 
		 var _tax_item_rate = result_obj.values['taxItem.rate'] //5.00%
         _tax_item_rate = _tax_item_rate.replace('%', '')
		 
		 var _quantity = result_obj.values.quantity
		 var _rate     = result_obj.values.fxrate //3047.61904762
		 //單位
         var _unitabbreviation = result_obj.values.unitabbreviation
		 var _amount = stringutility.convertToFloat(result_obj.values.amount)
		 //NS 的稅額
		 var _ns_item_tax_amount = stringutility.convertToFloat(result_obj.values.taxamount) //稅額總計 -5.00
		 //NS 的Item金額小計
		 var _ns_item_total_amount = stringutility.convertToFloat(result_obj.values.formulacurrency) //Item金額小計
		 var _gw_item_memo = result_obj.values.custcol_gw_item_memo //項目備註
		 var _ns_document_type = 'CREDITMEMO'		 
		 var _linesequencenumber = result_obj.values.linesequencenumber //1
		 
		 var _id = result_obj.id //CM 的 internalid = 840
		 var _tranid = result_obj.values.tranid //CM00000000009437
		 var _item_internalid_value = ''
		 if (result_obj.values['item.internalid'].length != 0) {
		     _item_internalid_value = result_obj.values['item.internalid'][0].value //115 
		 }
		 /**
		 _item_json_obj = {
              description: _item_displayname,
              taxType: _tax_type,
              taxCode: _item_salestaxcode_value,
              taxRate: _tax_item_rate,
              quantity: Math.abs(_quantity),
              unitPrice: _rate,
              itemUnit: _unitabbreviation,
              amount: Math.abs(_amount),
              itemTaxAmount: Math.abs(_ns_item_tax_amount),
              itemTotalAmount: Math.abs(_ns_item_total_amount),
              sequenceNumber: _linesequencenumber,
              itemRemark: '',
              nsDocumentType: _ns_document_type,
              nsDocumentApplyId: _id,
              nsDocumentNumber: _tranid,
              nsDocumentItemId: _item_internalid_value,
              nsDocumentItemSeq: _linesequencenumber,
            }
		 */
		 _item_json_obj = {
	              description: _item_displayname,
	              taxType: _tax_type,
	              taxCode: _item_salestaxcode_value,
	              taxRate: _tax_item_rate,
	              quantity: -1*(_quantity),
	              unitPrice: _rate,
	              itemUnit: _unitabbreviation,
	              amount: -1*(_amount),
	              itemTaxAmount: -1*(_ns_item_tax_amount),
	              itemTotalAmount: -1*(_ns_item_total_amount),
	              sequenceNumber: _linesequencenumber,
	              itemRemark: '',
	              nsDocumentType: _ns_document_type,
	              nsDocumentApplyId: _id,
	              nsDocumentNumber: _tranid,
	              nsDocumentItemId: _item_internalid_value,
	              nsDocumentItemSeq: _linesequencenumber,
	            }
		
	} catch (e) {
      log.error(e.name, e.message)
    }  
	log.debug('item_json_obj', JSON.stringify(_item_json_obj))
	return _item_json_obj
  }
  
  //2.檢查折讓單金額是否足夠
  function checkVoucherDiscountAmount(allowance_obj) {
    log.debug('checkVoucherDiscountAmount', JSON.stringify(allowance_obj))	
    var _egui_obj	
    try {
		 var _sellerIdentifier = allowance_obj.sellerIdentifier
		 var _buyerIdentifier = allowance_obj.buyerIdentifier
		 var _buyerId = allowance_obj.buyerId
		 
		 var _sales_amount = allowance_obj.sales_amount
		 var _free_sales_amount = allowance_obj.free_sales_amount
		 var _zero_sales_amount = allowance_obj.zero_sales_amount
		 
		 var _voucher_number_start = allowance_obj.voucher_number_start
		 var _voucher_number_end = allowance_obj.voucher_number_end
		 
		 if (_voucher_number_start.length !=0) {
		     //1. search voucher_main
			 var _my_search = search.create({
				type: 'customrecord_gw_voucher_main',
				columns: [
					search.createColumn({ name: 'internalid' }),
			        search.createColumn({ name: 'custrecord_gw_voucher_number' }),
			        search.createColumn({ name: 'custrecord_gw_voucher_date' }),
			        search.createColumn({ name: 'custrecord_gw_voucher_yearmonth' }),
			        search.createColumn({ name: 'custrecord_gw_discount_sales_amount' }),
			        search.createColumn({ name: 'custrecord_gw_discount_free_amount' }),
			        search.createColumn({ name: 'custrecord_gw_discount_zero_amount' }),
			        search.createColumn({ name: 'custrecord_gw_discount_count' }),
			        search.createColumn({ name: 'custrecord_gw_seller' }),
			        search.createColumn({ name: 'custrecord_gw_buyer' }),
			        search.createColumn({ name: 'custrecord_gw_original_buyer_id' }),
			        search.createColumn({ name: 'custrecord_gw_voucher_number' }),
			        search.createColumn({ name: 'custrecord_gw_sales_amount' }),
			        search.createColumn({ name: 'custrecord_gw_discount_sales_amount' }),
			        search.createColumn({ name: 'custrecord_gw_discount_free_amount' }),
			        search.createColumn({ name: 'custrecord_gw_zero_sales_amount' }),
			        search.createColumn({ name: 'custrecord_gw_discount_zero_amount' }),
			        search.createColumn({ name: 'custrecord_gw_discount_zero_amount' }),
			        search.createColumn({ name: 'custrecord_gw_discount_count' })   
				],
			 })
			 var _filterArray = []  
			 _filterArray.push(['custrecord_gw_seller', search.Operator.IS, _sellerIdentifier])
			 _filterArray.push('and')
			 _filterArray.push(['custrecord_gw_buyer', search.Operator.IS, _buyerIdentifier]) 
			 _filterArray.push('and')
			 _filterArray.push(['custrecord_gw_original_buyer_id', search.Operator.IS, _buyerId])  
			 _filterArray.push('and')
			 _filterArray.push(['custrecord_gw_voucher_number', search.Operator.IS, _voucher_number_start])  
			 _filterArray.push('and')		 
			 _filterArray.push(['custrecord_gw_voucher_upload_status', search.Operator.IS, 'C'])
			  
			 _my_search.filterExpression = _filterArray
			 log.debug('_filterArray', JSON.stringify(_filterArray))
			 
			 var _search_result = _my_search.run().getRange({
				start: 0,
				end: 1,
			 })
			 
			 var _data_error = false;
			 for (var i = 0; i < _search_result.length; i++) {
				  var _internal_id = _search_result[i].id	
				   
				  var _egui_number = _search_result[i].getValue({name: 'custrecord_gw_voucher_number'})
				  var _egui_date    = _search_result[i].getValue({name: 'custrecord_gw_voucher_date'})
				  var _egui_year_month = _search_result[i].getValue({name: 'custrecord_gw_voucher_yearmonth'})
				  
				  var _egui_sales_amount       = stringutility.convertToFloat(_search_result[i].getValue({name: 'custrecord_gw_sales_amount'}))
				  var _egui_free_sales_amount  = stringutility.convertToFloat(_search_result[i].getValue({name: 'custrecord_gw_free_sales_amount'}))
				  var _egui_zero_sales_amount  = stringutility.convertToFloat(_search_result[i].getValue({name: 'custrecord_gw_zero_sales_amount'}))
				  
				  var _egui_discount_sales_amount = _sales_amount+stringutility.convertToFloat(_search_result[i].getValue({name: 'custrecord_gw_discount_sales_amount'}))
				  var _egui_discount_free_amount  = _free_sales_amount+stringutility.convertToFloat(_search_result[i].getValue({name: 'custrecord_gw_discount_free_amount'}))
				  var _egui_discount_zero_amount  = _zero_sales_amount+stringutility.convertToFloat(_search_result[i].getValue({name: 'custrecord_gw_discount_zero_amount'}))
				  
				  var _egui_discount_count  = 1+stringutility.convertToFloat(_search_result[i].getValue({name: 'custrecord_gw_discount_count'}))
				  var _egui_discount_amount = _egui_discount_sales_amount+
											  _egui_discount_free_amount+
											  _egui_discount_zero_amount
											  
				  //判斷折讓條件是否成立
				  if (_egui_discount_sales_amount > _egui_sales_amount ||
					  _egui_discount_free_amount  > _egui_free_sales_amount ||
					  _egui_discount_zero_amount  > _egui_zero_sales_amount ) { 
                      _data_error = true;					  
				  }
							  
				  _egui_obj = {
						'internal_id' :_internal_id,
						'egui_number' :_egui_number,
						'egui_date' :_egui_date,
						'egui_year_month' :_egui_year_month,					
						'egui_discount_sales_amount' :_egui_discount_sales_amount,
						'egui_discount_free_amount' :_egui_discount_free_amount,
						'egui_discount_zero_amount' :_egui_discount_zero_amount,
						'egui_discount_count' :_egui_discount_count,
						'egui_discount_amount' :_egui_discount_amount,
						'data_error' :_data_error 
				  }	
			 } 
		 }
	} catch (e) {
      log.error(e.name, e.message)
    }  
	log.debug('_egui_obj', JSON.stringify(_egui_obj))	
	return _egui_obj
  }
  
  //3. 產生折讓單(Allowance資料)
  var _apply_internal_id = -1
  function saveAllowanceRecord(allowance_obj) {
    log.debug('saveAllowanceRecord', '產生折讓單(Allowance資料)')	  
 	
    try {		
	    //紀錄剩餘governence
		_final_remaining_usage = runtime.getCurrentScript().getRemainingUsage()
		
		if (_final_remaining_usage >= _min_governence) {
			//檢查條件
			var _egui_obj = checkVoucherDiscountAmount(allowance_obj)
			 
			//Save Data
			if (_apply_internal_id == -1) {
				//做一次就好
				_apply_internal_id = saveVoucherApplyListRecord(allowance_obj) //TODO
			}
			
			var _balance_amount_error = _egui_obj==null?true:_egui_obj.data_error
			
			var _main_record_id = saveVoucherMainRecord(_apply_internal_id, allowance_obj, _balance_amount_error)
			saveVoucherDetailRecord(_apply_internal_id, _main_record_id, allowance_obj, _egui_obj)
			
			if (_balance_amount_error==false) {
				updateEGUIDiscountFields(_egui_obj)  
			}
			//Lock CM
			updateCreditMemoFields(allowance_obj)
		}
	} catch (e) {
      log.error(e.name, e.message)
    }  	
  }
  
  function saveVoucherApplyListRecord(allowance_obj) {
	  log.debug('saveVoucherApplyListRecord', '產生折讓單(Apply資料)')	 
      var _apply_record_id = -1
	  try {	
	        var _voucher_apply_atatus = 'P'
			var _closed_voucher = 'N'

			var _voucher_apply_record = record.create({
			  type: 'customrecord_gw_voucher_apply_list',
			  isDynamic: true,
			})

			_voucher_apply_record.setValue({ fieldId: 'name', value: 'VoucherApply' })
			_voucher_apply_record.setValue({
			  fieldId: 'custrecord_gw_voucher_apply_type',
			  value: 'APPLY',
			}) //APPLY (開立) / VOID (作廢)
			_voucher_apply_record.setValue({
			  fieldId: 'custrecord_gw_voucher_open_type',
			  value: 'BATCH',
			})
			_voucher_apply_record.setValue({
			  fieldId: 'custrecord_gw_voucher_apply_date',
			  value: new Date(),
			})
			_voucher_apply_record.setValue({
			  fieldId: 'custrecord_gw_voucher_apply_time',
			  value: dateutility.getCompanyLocatTimeForClient(),
			})
			_voucher_apply_record.setValue({
			  fieldId: 'custrecord_gw_voucher_apply_invoice_type',
			  value: '07',
			})
			_voucher_apply_record.setValue({
			  fieldId: 'custrecord_gw_voucher_apply_mig_type',
			  value: 'B2C',
			}) 
			_voucher_apply_record.setValue({
			  fieldId: 'custrecord_gw_voucher_apply_status',
			  value: 'A',
			}) 
			_voucher_apply_record.setValue({
			  fieldId: 'custrecord_gw_closed_voucher',
			  value: 'Y',
			})  
			_voucher_apply_record.setValue({
			  fieldId: 'custrecord_gw_need_upload_mig',
			  value: 'NONE',
			})
			//20201109 walter mofify
			_voucher_apply_record.setValue({
			  fieldId: 'custrecord_gw_voucher_apply_userid',
			  value: 0,
			})

			try {
			     _apply_record_id = _voucher_apply_record.save() 
			} catch (e) {
			  console.log(e.name + ':' + e.message)
			}
	
	  
	  } catch (e) {
      log.error(e.name, e.message)
      }   
	  return _apply_record_id
  }
  
  //產生折讓單(Main資料)
  function saveVoucherMainRecord(apply_internal_id, allowance_obj, balance_amount_error) {
    log.debug('saveVoucherMainRecord', '產生折讓單(Main資料)')	 
    var _main_record_id = -1	    
    try {		
	      var _status = 'VOUCHER_SUCCESS'
		  var _voucher_main_record = record.create({
			type: 'customrecord_gw_voucher_main',
			isDynamic: true,
		  })

		  _voucher_main_record.setValue({
			fieldId: 'name',
			value: 'VoucherMainRecord',
		  }) 
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_apply_internal_id',
			value: apply_internal_id,
		  })
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_voucher_type',
			value: 'ALLOWANCE',
		  }) 
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_voucher_number',
			value: allowance_obj.allowance_egui_number,
		  })
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_voucher_date',
			value: allowance_obj.trandate,
		  })
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_voucher_time',
			value: allowance_obj.allowance_egui_time,
		  }) 
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_voucher_yearmonth',
			value: allowance_obj.allowance_year_month,
		  })		   
		  var _apply_period = getApplyPeriodOptions(allowance_obj.allowance_year_month)
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_voucher_sale_tax_apply_period',
			value: _apply_period,
		  }) 
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_seller',
			value: allowance_obj.sellerIdentifier,
		  })
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_seller_name',
			value: allowance_obj.sellerName,
		  })
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_seller_address',
			value: stringutility.trim(allowance_obj.sellerAddress),
		  }) 
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_original_buyer_id',
			value: allowance_obj.buyerId,
		  })
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_buyer',
			value: allowance_obj.buyerIdentifier,
		  })
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_buyer_name',
			value: allowance_obj.buyerName,
		  })
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_buyer_address',
			value: stringutility.trim(allowance_obj.buyerAddress),
		  })
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_buyer_email',
			value: stringutility.trim(allowance_obj.buyerEmail),
		  }) 
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_voucher_dept_code',
			value: stringutility.trim(allowance_obj.department),
		  })
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_voucher_dept_name',
			value: stringutility.trim(allowance_obj.department),
		  })
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_voucher_classification',
			value: stringutility.trim(allowance_obj.classId),
		  })
		  //零稅資料
		  if (stringutility.trim(allowance_obj.applicable_zero_tax) != '') {
			_voucher_main_record.setValue({
			  fieldId: 'custrecord_gw_applicable_zero_tax',
			  value: allowance_obj.applicable_zero_tax,
			})
		  }
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_customs_export_category',
			value: allowance_obj.customs_export_category,
		  })
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_customs_export_no',
			value: allowance_obj.customs_export_no,
		  })
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_customs_export_date',
			value: allowance_obj.customs_export_date,
		  })

		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_invoice_type',
			value: '07',
		  })
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_mig_type',
			value: 'B2C',
		  })
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_voucher_format_code',
			value: '33',
		  })  
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_is_printed',
			value: 'N',
		  })
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_discount_amount',
			value: 0,
		  })
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_discount_count',
			value: '0',
		  })
		  _voucher_main_record.setValue({
			  fieldId: 'custrecord_gw_voucher_owner',
			  value: '2',
		  }) //折讓單專用欄位(1:買方, 2賣方)
			
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_voucher_status',
			value: 'VOUCHER_SUCCESS',
		  })
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_voucher_upload_status',
			value: 'A',
		  })		  
		  //處理Amount
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_sales_amount',
			value: allowance_obj.sales_amount,
		  })
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_free_sales_amount',
			value: allowance_obj.free_sales_amount,
		  })
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_zero_sales_amount',
			value: allowance_obj.zero_sales_amount,
		  })
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_tax_amount',
			value: allowance_obj.tax_amount,
		  })
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_tax_type',
			value: allowance_obj.tax_type,
		  })
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_tax_rate',
			value: allowance_obj.taxRate,
		  })
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_total_amount',
			value: allowance_obj.total_amount,
		  })

		  //20210202 walter modify
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_need_upload_egui_mig',
			value: 'NONE',
		  })  
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_print_mark',
			value: 'Y',
		  })
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_lock_transaction',
			value: true,
		  })		  
		  var _tax_diff_error = invoiceutility.checkTaxDifference(
			  allowance_obj.sales_amount,
			  allowance_obj.taxRate,
			  allowance_obj.tax_amount,
			  tax_diff_balance
			)
          //檢查結果處理
		  if (balance_amount_error == true ) {
			   _voucher_main_record.setValue({
				  fieldId: 'custrecord_gw_need_upload_egui_mig',
				  value: 'NONE',
			   })
			   _voucher_main_record.setValue({
				  fieldId: 'custrecord_gw_voucher_upload_status',
				  value: 'E',
			   })
			   _voucher_main_record.setValue({
				  fieldId: 'custrecord_gw_uploadstatus_messag',
				  value: '折讓扣抵發票金額不足',
			   })
		  } else if (_tax_diff_error == true) {
			   //檢查稅差超過
			   _voucher_main_record.setValue({
				  fieldId: 'custrecord_gw_need_upload_egui_mig',
				  value: 'NONE',
			   })
			   _voucher_main_record.setValue({
				  fieldId: 'custrecord_gw_voucher_upload_status',
				  value: 'E',
			   })
			   _voucher_main_record.setValue({
				  fieldId: 'custrecord_gw_uploadstatus_messag',
				  value: '稅差超過(' + tax_diff_balance + ')元 ,請重新調整!',
			   }) 
		  }
		  //紀錄user_id
		  _voucher_main_record.setValue({
			fieldId: 'custrecord_gw_voucher_main_apply_user_id',
			value: 0,
		  })

		  try {
			   _main_record_id = _voucher_main_record.save()			
			   log.debug('main save', '_main_record_id=' + _main_record_id)
		  } catch (e) {
			log.error(e.name, e.message)
		  } 
		
	} catch (e) {
      log.error(e.name, e.message)
    }  
	
	return _main_record_id
  }
  
  //產生折讓單(Detail)
  function saveVoucherDetailRecord(apply_internal_id, main_record_id, allowance_obj, egui_obj) {
    log.debug('saveVoucherDetailRecord', '產生折讓單(Detail)')	 
    try {	
	     var _apply_period = getApplyPeriodOptions(allowance_obj.allowance_year_month)
		 
	     var _gw_ns_document_apply_id_ary = []
	     var _detail_item_ary = allowance_obj.item_ary
         if (typeof _detail_item_ary !== 'undefined') {
             for (var i = 0; i < _detail_item_ary.length; i++) {
                  var _detail_obj = _detail_item_ary[i]
				  
				  var _voucher_detail_record = record.create({
					  type: 'customrecord_gw_voucher_details',
					  isDynamic: true,
				  })
				  _voucher_detail_record.setValue({
					  fieldId: 'name',
					  value: 'VoucherDetailRecord',
				  })
				  _voucher_detail_record.setValue({
					  fieldId: 'custrecord_gw_dtl_apply_internal_id',
					  value: apply_internal_id,
				  })
				  _voucher_detail_record.setValue({
					  fieldId: 'custrecord_gw_voucher_main_internal_id',
					  value: main_record_id,
				  })
				  _voucher_detail_record.setValue({
					  fieldId: 'custrecord_gw_dtl_voucher_type',
					  value: 'ALLOWANCE',
				  }) 
				  _voucher_detail_record.setValue({
					  fieldId: 'custrecord_gw_item_description',
					  value: stringutility.trim(_detail_obj.description),
				  }) 
				  _voucher_detail_record.setValue({
					  fieldId: 'custrecord_gw_unit_price',
					  value: stringutility.trim(_detail_obj.unitPrice),
				  }) 
				  _voucher_detail_record.setValue({
					  fieldId: 'custrecord_gw_item_unit',
					  value: stringutility.trim(_detail_obj.itemUnit),
				  })
				  _voucher_detail_record.setValue({
					  fieldId: 'custrecord_gw_item_quantity',
					  value: stringutility.convertToFloat(_detail_obj.quantity),
				  })
				  _voucher_detail_record.setValue({
					  fieldId: 'custrecord_gw_item_amount',
					  value: stringutility.convertToFloat(_detail_obj.amount),
				  })
				  _voucher_detail_record.setValue({
					  fieldId: 'custrecord_gw_item_tax_amount',
					  value: stringutility.convertToFloat(_detail_obj.itemTaxAmount),
				  })
				  _voucher_detail_record.setValue({
					  fieldId: 'custrecord_gw_item_total_amount',
					  value: stringutility.convertToFloat(_detail_obj.itemTotalAmount),
				  }) 
				  _voucher_detail_record.setValue({
					  fieldId: 'custrecord_gw_dtl_item_tax_code',
					  value: stringutility.trim(_detail_obj.taxCode),
				  })
				  _voucher_detail_record.setValue({
					  fieldId: 'custrecord_gw_dtl_item_tax_rate',
					  value: stringutility.trim(_detail_obj.taxRate),
				  }) 
				  _voucher_detail_record.setValue({
					  fieldId: 'custrecord_gw_item_seq',
					  value: (i+1),
				  })
				  _voucher_detail_record.setValue({
					  fieldId: 'custrecord_gw_item_remark',
					  value: stringutility.trim(_detail_obj.itemRemark),
				  }) 
				  _voucher_detail_record.setValue({
					  fieldId: 'custrecord_gw_dtl_voucher_number',
					  value: allowance_obj.allowance_egui_number,
				  })				 
				  _voucher_detail_record.setValue({
					  fieldId: 'custrecord_gw_dtl_voucher_date',
					  value: allowance_obj.trandate,
				  })				  
				  _voucher_detail_record.setValue({
					  fieldId: 'custrecord_gw_dtl_voucher_time',
					  value: allowance_obj.allowance_egui_time,
				  })				 
				  _voucher_detail_record.setValue({
					  fieldId: 'custrecord_gw_dtl_voucher_yearmonth',
					  value: allowance_obj.allowance_year_month,
				  })

				  _voucher_detail_record.setValue({
					  fieldId: 'custrecord_gw_dtl_voucher_status',
					  value: 'VOUCHER_SUCCESS',
				  })
				  _voucher_detail_record.setValue({
					  fieldId: 'custrecord_gw_dtl_voucher_upload_status',
					  value: 'A',
				  }) 
				  _voucher_detail_record.setValue({
					  fieldId: 'custrecord_gw_ns_document_type',
					  value: 'CREDITMEMO',
				  })
                  _voucher_detail_record.setValue({
					  fieldId: 'custrecord_gw_ns_document_id',
					  value: _detail_obj.nsDocumentApplyId,
				  }) 				  
				  _voucher_detail_record.setValue({
					  fieldId: 'custrecord_gw_ns_document_apply_id',
					  value: _detail_obj.nsDocumentApplyId,
				  }) 
				  if (_gw_ns_document_apply_id_ary.toString().indexOf(_detail_obj.nsDocumentApplyId)==-1) {
                      _gw_ns_document_apply_id_ary.push(_detail_obj.nsDocumentApplyId)
			      } 
				  _voucher_detail_record.setValue({
					  fieldId: 'custrecord_gw_ns_document_number',
					  value: _detail_obj.nsDocumentNumber,
				  })  
				  _voucher_detail_record.setValue({
					  fieldId: 'custrecord_gw_ns_document_item_id',
					  value: _detail_obj.nsDocumentItemId,
				  })
			      _voucher_detail_record.setValue({
					  fieldId: 'custrecord_gw_ns_document_items_seq',
					  value: _detail_obj.nsDocumentItemSeq,
				  })
				  _voucher_detail_record.setValue({
					  fieldId: 'custrecord_gw_ns_item_discount_amount',
					  value: '0',
				  })
				  _voucher_detail_record.setValue({
					  fieldId: 'custrecord_gw_ns_item_discount_count',
					  value: '0',
				  })				  
				  _voucher_detail_record.setValue({
					  fieldId: 'custrecord_gw_dtl_voucher_apply_period',
					  value: _apply_period,
				  })
                  //紀錄發票資料  
				  if (egui_obj !=null) {
					  _voucher_detail_record.setValue({
						fieldId: 'custrecord_gw_original_gui_internal_id',
						value: egui_obj.internal_id,
					  })
					  _voucher_detail_record.setValue({
						fieldId: 'custrecord_gw_original_gui_number',
						value: egui_obj.egui_number,
					  })
					  _voucher_detail_record.setValue({
						fieldId: 'custrecord_gw_original_gui_date',
						value: egui_obj.egui_date,
					  })
					  _voucher_detail_record.setValue({
						fieldId: 'custrecord_gw_original_gui_yearmonth',
						value: egui_obj.egui_year_month,
					  })
                  }
				  try {
				       var _result_id = _voucher_detail_record.save()
				  } catch (e) {
				       log.error(e.name, e.message)
				  }  
		     }
			 
			 try {
				 var values = {}
				 values['custrecord_gw_is_completed_detail'] = true	 
				 values['custrecord_gw_ns_transaction'] = _gw_ns_document_apply_id_ary.toString()	 
				  
				 var _id = record.submitFields({
					 type: 'customrecord_gw_voucher_main',
					 id: main_record_id,
					 values: values,
					 options: {
						enableSourcing: false,
						ignoreMandatoryFields: true,
					 },
				 }) 		
				
			} catch (e) {
			   log.error(e.name, e.message)
			}  
	
		 }	
	} catch (e) {
      log.error(e.name, e.message)
    }  	
  }
  
  function updateEGUIDiscountFields(egui_obj) {
    log.debug('updateEGUIDiscountFields', '更新發票折讓單資料') 
    try {
		 var values = {}
		 values['custrecord_gw_discount_sales_amount'] = egui_obj.egui_discount_sales_amount
		 values['custrecord_gw_discount_free_amount'] = egui_obj.egui_discount_free_amount
		 values['custrecord_gw_discount_zero_amount'] = egui_obj.egui_discount_zero_amount
		 values['custrecord_gw_discount_amount'] = egui_obj.egui_discount_amount
		 values['custrecord_gw_discount_count'] = egui_obj.egui_discount_count
		  
		 var _id = record.submitFields({
		     type: 'customrecord_gw_voucher_main',
		     id: egui_obj.internal_id,
		     values: values,
		     options: {
			    enableSourcing: false,
			    ignoreMandatoryFields: true,
		     },
		 }) 		
		
	} catch (e) {
       log.error(e.name, e.message)
    }  
  }
  
  //更新CreditMemo相關欄位資料
  function updateCreditMemoFields(allowance_obj) {
    log.debug('updateCreditMemoFields', '更新CreditMemo相關欄位資料') 
    try {
		 var values = {}
		 values['custbody_gw_allowance_num_start'] = allowance_obj.allowance_egui_number
		 values['custbody_gw_allowance_num_end'] = allowance_obj.allowance_egui_number
		 values['custbody_gw_lock_transaction'] = true
		   
		 var _id = record.submitFields({
		     type: record.Type.CREDIT_MEMO,
		     id: allowance_obj.applyId,
		     values: values,
		     options: {
			    enableSourcing: false,
			    ignoreMandatoryFields: true,
		     },
		 }) 		
		
	} catch (e) {
       log.error(e.name, e.message)
    }  
  }
  
  //檢查Governance是否足夠
  function checkGovernance(used_governance) {
    log.debug('checkGovernance', 'check used_governance='+used_governance)
    var _useable = true 	
    try {
		 //剩餘governance數
		 var _used_remaining_usage = runtime.getCurrentScript().getRemainingUsage()
		 if (_used_remaining_usage <= used_governance) _useable = false 			
		
	} catch (e) {
       log.error(e.name, e.message)
    }  
	log.debug('check useable', _useable)
	return _useable
  }
  
  /////////////////////////////////////////////////////////////////////////////////////////////
  var _tax_obj_ary = []
  //1.取得稅別資料
  function loadAllTaxInformation() {
    try {
	  var _all_tax_types = taxyype21.getAll()
	  log.debug('get all_tax_types', JSON.stringify(_all_tax_types))
 
	  for (var i=0; i<_all_tax_types.length; i++) {
		   var _tax_json_obj = _all_tax_types[i]
		   var _ns_tax_json_obj = _tax_json_obj.taxCodes
		   log.debug('get _ns_tax_json_obj', JSON.stringify(_ns_tax_json_obj))
		   var _netsuite_id_value = ''
		   var _netsuite_id_text = ''
		   if (_ns_tax_json_obj.length != 0) {
              _netsuite_id_value = _ns_tax_json_obj.value //111;
              _netsuite_id_text = _ns_tax_json_obj.text //Jul 2020;
           }
		   
		   var _obj = {
			  voucher_property_id: _tax_json_obj.name, //TAX_WITH_TAX
			  voucher_property_value: _tax_json_obj.value, //1
			  voucher_property_note: _tax_json_obj.text, //應稅
			  netsuite_id_value: _netsuite_id_value, //8(NS internalID)
			  netsuite_id_text: _netsuite_id_text,   //VAT_TW TAX 5%-TW(NS Text)
		   }

		   _tax_obj_ary.push(_obj)
		   
	  } 
    } catch (e) {
      log.error(e.name, e.message)
    }
  }
  //取得稅別資料
  function getTaxInformation(netsuiteId) {
    var _tax_obj
    try {
      if (_tax_obj_ary != null) {
        for (var i = 0; i < _tax_obj_ary.length; i++) {
          var _obj = JSON.parse(JSON.stringify(_tax_obj_ary[i]))

          if (_obj.netsuite_id_value == netsuiteId) {
              _tax_obj = _obj
              break
          }
        }
      }
    } catch (e) {
      log.error(e.name, e.message)
    }

    return _tax_obj
  }
  
  //取得營業人資料 
  var _seller_comapny_ary = []
  function loadAllSellerInfo() { 
	  var _businessSearch = search
		      .create({
		        type: 'customrecord_gw_business_entity',
		        columns: ['custrecord_gw_be_tax_id_number', 'custrecord_gw_be_gui_title', 'custrecord_gw_be_ns_subsidiary', 'custrecord_gw_be_business_address'],
 		      })
		      .run()
		      .each(function (result) {
		        var _internalid = result.id
		
		        var _tax_id_number = result.getValue({
		          name: 'custrecord_gw_be_tax_id_number',
		        })
		        var _be_gui_title = result.getValue({
		          name: 'custrecord_gw_be_gui_title',
		        })
		        var _be_ns_subsidiary = result.getValue({
		          name: 'custrecord_gw_be_ns_subsidiary',
		        })
		        var _business_address = result.getValue({
		          name: 'custrecord_gw_be_business_address',
		        })
		        
		        var _obj = {
		        	'tax_id_number': _tax_id_number,
		        	'be_gui_title': _be_gui_title,
		        	'subsidiary': _be_ns_subsidiary,
		        	'address': _business_address
		        }
		        
		        _seller_comapny_ary.push(_obj);
		      
		        return true
		      })   
  }
  
  function getSellerInfoBySubsidiary(subsidiary) { 
	  var _company_obj
	  if (_seller_comapny_ary.length==0) {
		  loadAllSellerInfo();
	  }	
	  log.debug('get all seller_comapny_ary', JSON.stringify(_seller_comapny_ary))
	  for(var i=0;i <_seller_comapny_ary.length; i++) {
		  var _obj = _seller_comapny_ary[i];
		  if (_obj.subsidiary==subsidiary) {
			  _company_obj = _obj;
			  break;
		  }
	  }
	   
	  return _company_obj;
  }
  
  
  //轉換成民國年月日(2021/01/18)
  function convertExportDate(export_date) {
    var _tradition_date = '' //民國年月日(1101231)
    log.debug('export_date', export_date)
    try {
      if (export_date.toString().length != 0) {
        export_date = export_date.replace('/', '')
        export_date = export_date.replace('/', '')

        _tradition_date = parseInt(export_date - 19110000).toString()
      }
    } catch (e) {
      log.error(e.name, e.message)
    }

    return _tradition_date
  }
  
  //放期別資料
  var _apply_period_options_ary = []
  function getApplyPeriodOptions(year_month) {
    var _internal_id = -1
    try {
      var _exist_flag = false
      if (_apply_period_options_ary != null) {
        for (var i = 0; i < _apply_period_options_ary.length; i++) {
          var _obj = _apply_period_options_ary[i]

          if (parseInt(_obj.year_month) == parseInt(year_month)) {
            _exist_flag = true
            _internal_id = _obj.internal_id
            break
          }
        }
      }
      if (_exist_flag == false) {
        _internal_id = invoiceutility.getApplyPeriodOptionId(year_month)
        var _obj = {
          year_month: year_month,
          internal_id: _internal_id,
        }
        _apply_period_options_ary.push(_obj)
      }
    } catch (e) {
      log.error(e.name, e.message)
    }

    return _internal_id
  } 
  
  return {
    execute: executeScript,
  }
})
