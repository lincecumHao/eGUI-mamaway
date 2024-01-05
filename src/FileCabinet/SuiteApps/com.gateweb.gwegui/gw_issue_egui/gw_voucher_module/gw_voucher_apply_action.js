/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope Public
 */
define([
  'N/ui/serverWidget',
  'N/transaction',
  'N/config',
  'N/record',
  'N/search',
  'N/redirect',
  '../gw_common_utility/gw_syncegui_to_document_utility',
  '../gw_common_utility/gw_common_date_utility',
  '../gw_common_utility/gw_common_invoice_utility',
  '../gw_common_utility/gw_common_string_utility',
  '../gw_common_utility/gw_common_configure',
], function (
  serverWidget,
  transaction,
  config,
  record,
  search,
  redirect,
  synceguidocument,
  dateutility,
  invoiceutility,
  stringutility,
  gwconfigure
) {
  var _voucher_apply_list_record = gwconfigure.getGwVoucherApplyListRecord()
  var _voucher_main_record = gwconfigure.getGwVoucherMainRecord()
  var _voucher_detail_record = gwconfigure.getGwVoucherDetailsRecord()
  var _invoce_control_field_id = gwconfigure.getInvoceControlFieldId()
  var _gw_voucher_properties = gwconfigure.getGwVoucherProperties() //設定檔
  
  //EGUI
  var _egui_gw_dm_mig_type = 1
  //ALLOWANCE
  var _allowance_gw_dm_mig_type = 4

  //放稅別資料
  var _taxObjAry = []

  function loadAllTaxInformation() {
    try {
      var _group_type = 'TAX_TYPE'
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
      _filterArray.push(['custrecord_gw_voucher_group_type', 'is', _group_type])
      _mySearch.filterExpression = _filterArray
      _mySearch.run().each(function (result) {
        var internalid = result.id

        var _voucher_property_id = result.getValue({
          name: 'custrecord_gw_voucher_property_id',
        })
        var _voucher_property_value = result.getValue({
          name: 'custrecord_gw_voucher_property_value',
        })
        var _voucher_property_note = result.getValue({
          name: 'custrecord_gw_voucher_property_note',
        })
        var _netsuite_id_value = result.getValue({
          name: 'custrecord_gw_netsuite_id_value',
        })
        var _netsuite_id_text = result.getValue({
          name: 'custrecord_gw_netsuite_id_text',
        })

        var _obj = {
          voucher_property_id: _voucher_property_id,
          voucher_property_value: _voucher_property_value,
          voucher_property_note: _voucher_property_note,
          netsuite_id_value: _netsuite_id_value,
          netsuite_id_text: _netsuite_id_text,
        }

        _taxObjAry.push(_obj)
        return true
      })
    } catch (e) {
      log.debug(e.name, e.message)
    }
  }

  //取得稅別資料
  function getTaxInformation(netsuiteId) {
    var _taxObj
    try {
      if (_taxObjAry != null) {
        for (var i = 0; i < _taxObjAry.length; i++) {
          var _obj = JSON.parse(JSON.stringify(_taxObjAry[i]))

          if (_obj.netsuite_id_value == netsuiteId) {
            _taxObj = _obj
            break
          }
        }
      }
    } catch (e) {
      log.debug(e.name, e.message)
    }

    return _taxObj
  }

  function processApproveFlow(pass_voucherflow_status, voucher_hiddent_listid) {
    try {
      var _idsAry = voucher_hiddent_listid.split(',')
      for (var i = 0; i < _idsAry.length; i++) {
        var _interalId = _idsAry[i]
        if (parseInt(_interalId) > 0) {
          var _record = record.load({
            type: _voucher_apply_list_record,
            id: parseInt(_interalId),
            isDynamic: true,
          })
          //取得原申請發票IDs (EGUI+Allowance)
          var _egui_apply_list = _record.getValue({
            fieldId: 'custrecord_gw_invoice_apply_list',
          })
          var _allowance_apply_list = _record.getValue({
            fieldId: 'custrecord_gw_creditmemo_apply_list',
          })

          //還原資料
          if (pass_voucherflow_status == 'CANCEL_REJECT') {
            //處理憑證
            //1:開立申請(VOUCHER_ISSUE),2:開立成功(VOUCHER_SUCCESS),
            //6:作廢申請(CANCEL_ISSUE) 7:作廢退回(CANCEL_REJECT) 9:作廢成功(CANCEL_SUCCESS)
            if (_egui_apply_list != '') {
              saveVoucharMainRecordStatus(
                _egui_apply_list,
                'C',
                'VOUCHER_SUCCESS'
              )
            }
            if (_allowance_apply_list != '') {
              saveVoucharMainRecordStatus(
                _allowance_apply_list,
                'C',
                'VOUCHER_SUCCESS'
              )
            }
          } else {
            //CANCEL_APPROVE
            loadAllTaxInformation() //載入稅別資料

            //處理憑證 CANCEL_APPROVE
            //1:開立申請(VOUCHER_ISSUE),2:開立成功(VOUCHER_SUCCESS),
            //6:作廢申請(CANCEL_ISSUE) 7:作廢退回(CANCEL_REJECT) 9:作廢成功(CANCEL_SUCCESS)
            if (_egui_apply_list != '') {
              pass_voucherflow_status = saveVoucharMainRecordStatusAndUnLockTransaction(
                _egui_apply_list,
                'A',
                pass_voucherflow_status
              )
            }
            if (_allowance_apply_list != '') {
              pass_voucherflow_status = saveVoucharMainRecordStatusAndUnLockTransaction(
                _allowance_apply_list,
                'A',
                pass_voucherflow_status
              )
            }
          }
          //1:開立申請(VOUCHER_ISSUE),2:開立成功(VOUCHER_SUCCESS),
          //6:作廢申請(CANCEL_ISSUE) 7:作廢退回(CANCEL_REJECT) 9:作廢同意(CANCEL_APPROVE) 9:作廢成功(CANCEL_SUCCESS)
          _record.setValue({
            fieldId: 'custrecord_gw_voucher_flow_status',
            value: pass_voucherflow_status,
          })
          _record.save()
        }
      }
       
    } catch (e) {
      log.error(e.name, e.message)
    }
  }

  //處理 Reject 回復原狀態
  function saveVoucharMainRecordStatus(
    voucher_apply_list,
    upload_status,
    voucher_status
  ) {
    try {
      var _idsAry = voucher_apply_list.split(',')
      for (var i = 0; i < _idsAry.length; i++) {
        var _internalId = parseInt(_idsAry[i])
        if (_internalId > 0) {
          var _record = record.load({
            type: _voucher_main_record,
            id: _internalId,
            isDynamic: true,
          })
          //EGUI
          var _voucher_type = _record.getValue({
            fieldId: 'custrecord_gw_voucher_type',
          })
          var _need_upload_egui_mig = _record.getValue({
            fieldId: 'custrecord_gw_need_upload_egui_mig',
          })
                   
          if (_need_upload_egui_mig=='NONE') {
			   //upload_status = 'D'; voucher_status='CANCEL_SUCCESS';
			   upload_status = 'C'; voucher_status='CANCEL_SUCCESS';
		  }
          
          var values = {}
          values['custrecord_gw_voucher_status'] = voucher_status //VOUCHER_SUCCESS
          values['custrecord_gw_voucher_upload_status'] = upload_status
          var _id = record.submitFields({
            type: _voucher_main_record,
            id: _internalId,
            values: values,
            options: {
              enableSourcing: false,
              ignoreMandatoryFields: true,
            },
          })
        }
      }
      
      synceguidocument.syncEguiUploadStatusToNSEvidenceStatus(voucher_status, upload_status, 'ALL', _idsAry)
      
    } catch (e) {
      log.error(e.name, e.message)
    }
  }

  //20201106 walter modify
  function saveVoucharMainRecordStatusAndUnLockTransaction(
    voucher_apply_list,
    upload_status,
    voucher_status
  ) {
    try {
      var _gw_gui_num_start_field = 'custbody_gw_gui_num_start'
      var _gw_gui_num_end_field = 'custbody_gw_gui_num_end'
      var _gw_allowance_num_start_field = 'custbody_gw_allowance_num_start'
      var _gw_allowance_num_end_field = 'custbody_gw_allowance_num_end'

      var _idsAry = voucher_apply_list.split(',')
      //1.Update Status
      for (var i = 0; i < _idsAry.length; i++) {
        var _internalId = parseInt(_idsAry[i])
        if (_internalId > 0) {
          var _record = record.load({
            type: _voucher_main_record,
            id: parseInt(_internalId),
            isDynamic: true,
          })

          //EGUI and ALLOWANCE
          var _voucher_type = _record.getValue({
            fieldId: 'custrecord_gw_voucher_type',
          })
          //上否上傳(NONE=不上傳)
          var _need_upload_egui_mig = _record.getValue({
            fieldId: 'custrecord_gw_need_upload_egui_mig',
          })
          /**
             //折讓單才做
             if (_voucher_type=='ALLOWANCE' && _need_upload_egui_mig=='NONE') {
						   upload_status = 'D'; voucher_status='CANCEL_SUCCESS';
					   }
             */
          //20210128 不上傳發票+折讓單才做
          if (_need_upload_egui_mig == 'NONE') {
            //upload_status = 'D'; voucher_status='CANCEL_SUCCESS';
            upload_status = 'C'
            voucher_status = 'CANCEL_SUCCESS'
          }

          var values = {}
          values['custrecord_gw_voucher_upload_status'] = upload_status //upload_status=A
          //作廢成功(CANCEL_APPROVE)
          values['custrecord_gw_voucher_status'] = voucher_status
          //20230324 NE-236
          if (_voucher_type=='EGUI'){
        	  values['custrecord_gw_dm_mig_type'] = _egui_gw_dm_mig_type 
          }else{
        	  values['custrecord_gw_dm_mig_type'] = _allowance_gw_dm_mig_type  
          } 
          log.debug('voucher_main_record values ',_voucher_type+' = '+ values.toString())
          var _id = record.submitFields({
            type: _voucher_main_record,
            id: _internalId,
            values: values,
            options: {
              enableSourcing: false,
              ignoreMandatoryFields: true,
            },
          })
        }
      }
      
      synceguidocument.syncEguiUploadStatusToNSEvidenceStatus(voucher_status, upload_status, 'ALL', _idsAry)

      //////////////////////////////////////////////////////////////////////////////////
      //2.作廢憑證資料
      var _mySearch = search.create({
        type: _voucher_detail_record,
        columns: [
          search.createColumn({ name: 'custrecord_gw_ns_document_type' }),
          search.createColumn({
            name: 'custrecord_gw_voucher_main_internal_id',
          }),
          search.createColumn({
            name: 'custrecord_gw_original_gui_internal_id',
          }),
          search.createColumn({ name: 'custrecord_gw_dtl_voucher_type' }),
          search.createColumn({ name: 'custrecord_gw_ns_document_apply_id' }),
          search.createColumn({ name: 'custrecord_gw_dtl_item_tax_code' }),
          search.createColumn({ name: 'custrecord_gw_item_amount' }),
        ],
      })

      var _filterArray = []
      //_filterArray.push(['custrecord_gw_ns_document_type', search.Operator.IS, voucher_type]);
      //_filterArray.push('and');
      _filterArray.push([
        'custrecord_gw_voucher_main_internal_id',
        search.Operator.ANYOF,
        _idsAry,
      ])
      _mySearch.filterExpression = _filterArray
      log.debug('detail filterArray ', JSON.stringify(_filterArray))

      var _history_ns_document_apply_id = []
      _mySearch.run().each(function (result) {
        var _voucher_main_internal_id = result.getValue({
          name: 'custrecord_gw_voucher_main_internal_id',
        })
        var _dtl_voucher_type = result.getValue({
          name: 'custrecord_gw_dtl_voucher_type',
        })
        var _ns_document_type = result.getValue({
          name: 'custrecord_gw_ns_document_type',
        })
        var _ns_document_apply_id = result.getValue({
          name: 'custrecord_gw_ns_document_apply_id',
        })

        ///////////////////////////////////////////////////////////////////////////////////////////////////
        //折讓單返還發票金額
        if (_dtl_voucher_type == 'ALLOWANCE') {
          var _original_gui_internal_id = result.getValue({
            name: 'custrecord_gw_original_gui_internal_id',
          })
          var _ns_item_tax_code = result.getValue({
            name: 'custrecord_gw_dtl_item_tax_code',
          })
          var _item_amount = result.getValue({
            name: 'custrecord_gw_item_amount',
          })

          //抓稅別資料
          var _taxObj = getTaxInformation(_ns_item_tax_code)

          var _record = record.load({
            type: _voucher_main_record,
            id: parseInt(_original_gui_internal_id),
            isDynamic: true,
          })

          var _discount_count = _record.getValue({
            fieldId: 'custrecord_gw_discount_count',
          })
          var _discount_sales_amount = _record.getValue({
            fieldId: 'custrecord_gw_discount_sales_amount',
          })
          var _discount_free_amount = _record.getValue({
            fieldId: 'custrecord_gw_discount_free_amount',
          })
          var _discount_zero_amount = _record.getValue({
            fieldId: 'custrecord_gw_discount_zero_amount',
          })
          var _discount_amount = _record.getValue({
            fieldId: 'custrecord_gw_discount_amount',
          })

          if (typeof _taxObj !== 'undefined') {
            _discount_count = (parseInt(_discount_count) - 1).toString()
            if (_taxObj.voucher_property_value == '1') {
              //應稅
              _discount_sales_amount = _discount_sales_amount - _item_amount
            } else if (_taxObj.voucher_property_value == '2') {
              //零稅
              _discount_zero_amount = _discount_zero_amount - _item_amount
            } else if (_taxObj.voucher_property_value == '3') {
              //免稅
              _discount_free_amount = _discount_free_amount - _item_amount
            }
            _discount_amount = _discount_amount - _item_amount
          }

          var values = {}
          values['custrecord_gw_discount_count'] = _discount_count
          values['custrecord_gw_discount_sales_amount'] = _discount_sales_amount
          values['custrecord_gw_discount_free_amount'] = _discount_free_amount
          values['custrecord_gw_discount_zero_amount'] = _discount_zero_amount
          values['custrecord_gw_discount_amount'] = _discount_amount

          var _id = record.submitFields({
            type: _voucher_main_record,
            id: parseInt(_original_gui_internal_id),
            values: values,
            options: {
              enableSourcing: false,
              ignoreMandatoryFields: true,
            },
          })
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////

        //3.直接作廢 Transaction-Voided 單據
        if (_ns_document_type != 'SALE_ORDER') {
          var _unLockRecordTypeID = transaction.Type.INVOICE
          if (_ns_document_type == 'INVOICE') {
            _unLockRecordTypeID = transaction.Type.INVOICE
          } else if (_ns_document_type == 'CREDITMEMO') {
            _unLockRecordTypeID = transaction.Type.CREDIT_MEMO
          } else if (_ns_document_type == 'CUSTOMER_DEPOSIT') {
            _unLockRecordTypeID = transaction.Type.CUSTOMER_DEPOSIT
          } else if (_ns_document_type == 'CASH_SALE') {
            _unLockRecordTypeID = transaction.Type.CASH_SALE
          }
          log.debug(
            'transaction ',
            '_unLockRecordTypeID=' +
              _unLockRecordTypeID +
			  ',_ns_document_type=' +
              _ns_document_type +
              ' ,_ns_document_apply_id=' +
              _ns_document_apply_id
          )

          var _history_ids = _history_ns_document_apply_id.toString()
          if (_history_ids.indexOf(_ns_document_apply_id) == -1) {
            var _void_id = transaction.void({
              type: _unLockRecordTypeID,
              id: parseInt(_ns_document_apply_id),
            })
          }
          _history_ns_document_apply_id.push(_ns_document_apply_id)
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////

        return true
      })
      //////////////////////////////////////////////////////////////////////////////////
    } catch (e) {
      log.error(e.name, e.message)
    }

    return voucher_status
  }
   
  function onRequest(context) {
    //審核結果
    var _pass_voucherflow_status =
      context.request.parameters.pass_voucherflow_status
    var _voucher_hiddent_listid =
      context.request.parameters.voucher_hiddent_listid
    log.debug('pass_voucherflow_status', _pass_voucherflow_status)
    log.debug('voucher_hiddent_listid', _voucher_hiddent_listid)
    try {
        //20230324 預先處理
        _egui_gw_dm_mig_type = invoiceutility.getVoucherMigType('EGUI')
        _allowance_gw_dm_mig_type = invoiceutility.getVoucherMigType('ALLOWANCE')
        log.debug('egui_gw_dm_mig_type', _egui_gw_dm_mig_type)
        log.debug('allowance_gw_dm_mig_type', _allowance_gw_dm_mig_type)
        //1.處理審核資料
        processApproveFlow(_pass_voucherflow_status, _voucher_hiddent_listid)
        log.debug('處理審核資料', 'DONE')
        //2.Forward To Apply Page
        log.debug('FORWARD TASK', 'START FORWARD TO APPLY')
        redirect.toSuitelet({
           scriptId: 'customscript_gw_voucher_apply_list',
           deploymentId: 'customdeploy_gw_voucher_apply_list',
        })
    } catch (e) {
      log.error(e.name, e.message)
    }
  } //End onRequest

  return {
    onRequest: onRequest,
  }
})
