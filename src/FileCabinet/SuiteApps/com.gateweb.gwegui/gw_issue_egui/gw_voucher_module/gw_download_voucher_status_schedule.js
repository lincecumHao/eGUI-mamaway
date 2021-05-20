/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 * @NModuleScope Public
 */
define([
  'N/runtime',
  'N/config',
  'N/search',
  'N/record',
  '../../gw_library/gw_api/gw_api',
  '../gw_common_utility/gw_common_date_utility',
  '../gw_common_utility/gw_common_string_utility',
  '../gw_common_utility/gw_common_invoice_utility',
  '../gw_common_utility/gw_common_configure',
  '../services/email/gw_service_egui_email',
], function (
  runtime,
  config,
  search,
  record,
  gwapi,
  dateutility,
  stringutility,
  invoiceutility,
  gwconfigure,
  gwEmailService
) {
  var _voucher_main_record = gwconfigure.getGwVoucherMainRecord()
  var _gw_voucher_main_search_id = gwconfigure.getGwVoucherMainSearchId()
  var _gw_voucher_properties = gwconfigure.getGwVoucherProperties() //設定檔
  var _deposit_voucher_record = gwconfigure.getGwDepositVoucherRecord()
  var _invoce_control_field_id = gwconfigure.getInvoceControlFieldId()
  var _credmemo_control_field_id = gwconfigure.getCredMemoControlFieldId()
  var _taxObjAry = []
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //處理NS Invoice資料-START
  //1.取得Invoice ID Apply List
  function getVoucherUploadedList() {
    var _jsonObjAry = []
    try {
      var _voucher_upload_status = 'P'
      var _mySearch = search.load({
        id: _gw_voucher_main_search_id,
      })

      var _filterArray = []
      _filterArray.push([
        'custrecord_gw_voucher_upload_status',
        search.Operator.IS,
        _voucher_upload_status,
      ])
      _mySearch.filterExpression = _filterArray

      var _invoice_ids_Ary = []
      var _creditmemo_ids_Ary = []
      var _original_voucher_number_Ary = []
      //20201028 modify
      var _customer_deposit_ids_Ary = []
      var _sales_order_deposit_ids_Ary = []

      var _pre_invoice_ids_Ary = []
      var _pre_creditmemo_ids_Ary = []
      //20201028 modify
      var _pre_customer_deposit_ids_Ary = []
      var _pre_sales_order_deposit_ids_Ary = []

      var _pre_original_voucher_number_Ary = []
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //1.整理資料
      var _obj
      var _checkId = ''
      var _pre_file_name = ''
      var _pre_sales_amount = 0

      var _pre_deposit_sales_amount = 0
      var _pre_deposit_free_sales_amount = 0
      var _pre_deposit_zero_sales_amount = 0
      _mySearch.run().each(function (result) {
        var _result = JSON.parse(JSON.stringify(result))
        log.debug('JSON.stringify(result)', JSON.stringify(result))

        var _applyId = _result.id //948
        var _mig_type = _result.values.custrecord_gw_mig_type //B2BS, B2BE, B2C
        var _voucher_number = _result.values.custrecord_gw_voucher_number
        var _voucher_type = _result.values.custrecord_gw_voucher_type //EGUI , ALLOWANCE
        var _voucher_status = _result.values.custrecord_gw_voucher_status //VOUCHER_SUCCESS , CANCEL_SUCCESS
        var _sales_amount = _result.values.custrecord_gw_sales_amount //未稅金額

        var _ns_document_type =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_ns_document_type'
          ] //INVOICE, CREDITMEMO
        var _ns_document_apply_id =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_ns_document_apply_id'
          ] //Netsuite internalId

        var _original_gui_internal_id =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_original_gui_internal_id'
          ] //ZZ10094357
        var _original_item_code =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_dtl_item_tax_code'
          ]
        var _original_item_amount =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_item_amount'
          ] //1200
        var _original_voucher_information =
          Math.round(_original_gui_internal_id) +
          '-' +
          Math.abs(_original_item_amount) +
          '-' +
          _original_item_code

        var _applyType = 'APPLY'
        if (_voucher_status.indexOf('CANCEL') != -1) _applyType = 'CANCEL'

        var _upload_mig_type = invoiceutility.getMigType(
          _applyType,
          _voucher_type,
          _mig_type
        ) //C0401, A0101..etc
        var _file_name =
          _upload_mig_type + '-' + _voucher_number + '-' + _applyId + '.xml'
        var _documentID = _ns_document_type + '-' + _ns_document_apply_id //INVOICE-948, CREDITMEMO-1230

        if (_ns_document_type == 'INVOICE') {
          var _array_str = _invoice_ids_Ary.toString()
          if (_array_str.indexOf(_documentID) == -1) {
            _invoice_ids_Ary.push(_documentID)
          }
        } else if (_ns_document_type == 'CUSTOMER_DEPOSIT') {
          var _array_str = _customer_deposit_ids_Ary.toString()
          if (_array_str.indexOf(_documentID) == -1) {
            _customer_deposit_ids_Ary.push(_documentID)
          }
        } else if (_ns_document_type == 'SALES_ORDER') {
          var _array_str = _sales_order_deposit_ids_Ary.toString()
          if (_array_str.indexOf(_documentID) == -1) {
            _sales_order_deposit_ids_Ary.push(_documentID)
          }
        } else if (_ns_document_type == 'CREDITMEMO') {
          var _array_str = _creditmemo_ids_Ary.toString()
          if (_array_str.indexOf(_documentID) == -1) {
            _creditmemo_ids_Ary.push(_documentID)
          }
          //只有折讓單才紀錄
          _original_voucher_number_Ary.push(_original_voucher_information) //1230-590(amount)
        }

        if (_checkId != _applyId) {
          if (_jsonObjAry.length != 0) {
            var _pre_obj = JSON.parse(
              JSON.stringify(_jsonObjAry[_jsonObjAry.length - 1])
            )

            _pre_obj.file_name = _pre_file_name
            _pre_obj.sales_amount = _pre_sales_amount
            _pre_obj.deposit_sales_amount = _pre_deposit_sales_amount
            _pre_obj.deposit_zero_amount = _pre_deposit_zero_sales_amount
            _pre_obj.deposit_free_amount = _pre_deposit_free_sales_amount

            _pre_obj.invoiceAry = JSON.parse(
              JSON.stringify(_pre_invoice_ids_Ary)
            )
            _pre_obj.creditmemoAry = JSON.parse(
              JSON.stringify(_pre_creditmemo_ids_Ary)
            )
            _pre_obj.customerdepositAry = JSON.parse(
              JSON.stringify(_pre_customer_deposit_ids_Ary)
            )
            _pre_obj.salesorderAry = JSON.parse(
              JSON.stringify(_pre_sales_order_deposit_ids_Ary)
            )
            _pre_obj.originalVoucherAry = JSON.parse(
              JSON.stringify(_pre_original_voucher_number_Ary)
            )

            _jsonObjAry[_jsonObjAry.length - 1] = _pre_obj

            _pre_deposit_sales_amount = 0
            _pre_deposit_free_sales_amount = 0
            _pre_deposit_zero_sales_amount = 0

            _pre_invoice_ids_Ary = []
            _pre_creditmemo_ids_Ary = []
            _pre_original_voucher_number_Ary = []
            _pre_customer_deposit_ids_Ary = []
            _pre_sales_order_deposit_ids_Ary = []
            _invoice_ids_Ary = []
            _creditmemo_ids_Ary = []
            _original_voucher_number_Ary = []
            _customer_deposit_ids_Ary = []
            _sales_order_deposit_ids_Ary = []

            if (
              _ns_document_type == 'INVOICE' ||
              _ns_document_type == 'SALES_ORDER'
            ) {
              var _array_str = _invoice_ids_Ary.toString()
              if (_array_str.indexOf(_documentID) == -1) {
                _invoice_ids_Ary.push(_documentID)
              }
            } else if (_ns_document_type == 'CUSTOMER_DEPOSIT') {
              var _array_str = _customer_deposit_ids_Ary.toString()
              if (_array_str.indexOf(_documentID) == -1) {
                _customer_deposit_ids_Ary.push(_documentID)
              }
            } else if (_ns_document_type == 'SALES_ORDER') {
              var _array_str = _sales_order_deposit_ids_Ary.toString()
              if (_array_str.indexOf(_documentID) == -1) {
                _sales_order_deposit_ids_Ary.push(_documentID)
              }
            } else if (_ns_document_type == 'CREDITMEMO') {
              var _array_str = _creditmemo_ids_Ary.toString()
              if (_array_str.indexOf(_documentID) == -1) {
                _creditmemo_ids_Ary.push(_documentID)
              }
              //只有折讓單才紀錄
              _original_voucher_number_Ary.push(_original_voucher_information) //1230-590(amount)
            }
          }

          _obj = {
            applyId: _applyId,
            upload_mig_type: _upload_mig_type, //C0401, A0101...etc
            voucher_number: _voucher_number,
            voucher_type: _voucher_type,
            ns_document_type: _ns_document_type,
            voucher_status: _voucher_status,
            file_name: _file_name,
            sales_amount: _sales_amount,
            deposit_sales_amount: 0,
            deposit_zero_amount: 0,
            deposit_free_amount: 0,
            invoiceAry: _invoice_ids_Ary,
            creditmemoAry: _creditmemo_ids_Ary,
            customerdepositAry: _customer_deposit_ids_Ary,
            salesorderAry: _sales_order_deposit_ids_Ary,
            originalVoucherAry: _original_voucher_number_Ary,
          }
          _jsonObjAry.push(_obj)
        }

        if (_ns_document_type == 'INVOICE') {
          var _array_str = _pre_invoice_ids_Ary.toString()
          if (_array_str.indexOf(_documentID) == -1) {
            _pre_invoice_ids_Ary.push(_documentID)
          }
        } else if (_ns_document_type == 'CUSTOMER_DEPOSIT') {
          var _array_str = _pre_customer_deposit_ids_Ary.toString()
          if (_array_str.indexOf(_documentID) == -1) {
            _pre_customer_deposit_ids_Ary.push(_documentID)
          }
        } else if (_ns_document_type == 'SALES_ORDER') {
          var _array_str = _pre_sales_order_deposit_ids_Ary.toString()
          if (_array_str.indexOf(_documentID) == -1) {
            _pre_sales_order_deposit_ids_Ary.push(_documentID)
          }
        } else if (_ns_document_type == 'CREDITMEMO') {
          var _array_str = _pre_creditmemo_ids_Ary.toString()
          if (_array_str.indexOf(_documentID) == -1) {
            _pre_creditmemo_ids_Ary.push(_documentID)
          }
          _pre_original_voucher_number_Ary.push(_original_voucher_information)
        }

        _checkId = _applyId
        _pre_file_name = _file_name
        _pre_sales_amount = _sales_amount

        var _taxObj = getTaxInformation(_original_item_code)
        var _tax_type = _taxObj.voucher_property_value
        if (_ns_document_type == 'CUSTOMER_DEPOSIT') {
          if (_tax_type == '1') {
            _pre_deposit_sales_amount += _original_item_amount
          } else if (_tax_type == '2') {
            _pre_deposit_zero_sales_amount += _original_item_amount
          } else if (_tax_type == '3') {
            _pre_deposit_free_sales_amount += _original_item_amount
          }
        }

        return true
      })
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    } catch (e) {
      log.error(e.name, e.message)
    }
    log.debug('_jsonObjAry', JSON.stringify(_jsonObjAry))
    return _jsonObjAry
  }

  //更新Main的Status
  function updateVoucherStatus(
    voucher_type,
    _voucher_status,
    internalId,
    statusId,
    errorCode,
    errorDescription
  ) {
    try {
      log.debug(
        'updateVoucherStatus 1',
        'internalId=' +
          internalId +
          ' voucher_type=' +
          voucher_type +
          ' ,_voucher_status=' +
          _voucher_status
      )
      log.debug(
        'updateVoucherStatus 2',
        'statusId=' +
          statusId +
          ' errorCode=' +
          errorCode +
          ' ,errorDescription=' +
          errorDescription
      )

      var values = {}
      values['custrecord_gw_voucher_upload_status'] = statusId
      if (stringutility.trim(statusId) == 'E') {
        values['custrecord_gw_uploadstatus_messag'] =
          errorCode + ':' + errorDescription
      }
      //作廢時紀錄
      if (stringutility.trim(_voucher_status).indexOf('CANCEL') != -1) {
        if (stringutility.trim(statusId) == 'C') {
          values['custrecord_gw_voucher_status'] = 'CANCEL_SUCCESS'
        } else if (stringutility.trim(statusId) == 'E') {
          values['custrecord_gw_voucher_status'] = 'CANCEL_ERROR'
        }
      }

      try {
        record.submitFields({
          type: _voucher_main_record,
          id: parseInt(internalId),
          values: values,
          options: {
            enableSourcing: false,
            ignoreMandatoryFields: true,
          },
        })

        log.debug('_voucher_main_record save ', ' done')
      } catch (e) {
        log.error(e.name, e.message)
      }
    } catch (e) {
      log.error(e.name, e.message)
    }
  }

  //Unlock Transaction Check Box
  function unlockTransactionCheckStatus(transaction_ids_Ary) {
    try {
      log.debug(
        'unlockTransactionCheckStatus',
        ' transaction_ids_Ary =' + JSON.stringify(transaction_ids_Ary)
      )
      //回寫NS Invoice的發票資料
      var _gw_gui_num_start_field = 'custbody_gw_gui_num_start'
      var _gw_gui_num_end_field = 'custbody_gw_gui_num_end'
      var _gw_allowance_num_start_field = 'custbody_gw_allowance_num_start'
      var _gw_allowance_num_end_field = 'custbody_gw_allowance_num_end'

      if (
        typeof transaction_ids_Ary !== 'undefined' &&
        transaction_ids_Ary.length != 0
      ) {
        var _recordTypeID = record.Type.INVOICE

        for (var i = 0; i < transaction_ids_Ary.length; i++) {
          var _documentID = transaction_ids_Ary[i] //INVOICE-1102

          var _documentID_Ary = _documentID.split('-')

          var _ns_document_type = _documentID_Ary[0]
          var _internalid = _documentID_Ary[1]

          var values = {}
          if (_ns_document_type == 'INVOICE') {
            _recordTypeID = record.Type.INVOICE
            values[_invoce_control_field_id] = false
          } else if (_ns_document_type == 'CREDITMEMO') {
            _recordTypeID = record.Type.CREDIT_MEMO
            values[_credmemo_control_field_id] = false
          } else if (_ns_document_type == 'CUSTOMER_DEPOSIT') {
            _recordTypeID = record.Type.CUSTOMER_DEPOSIT
            values[_invoce_control_field_id] = false
          }

          values[_gw_gui_num_start_field] = ''
          values[_gw_gui_num_end_field] = ''
          values[_gw_allowance_num_start_field] = ''
          values[_gw_allowance_num_end_field] = ''
          log.debug(
            'unlockTransactionCheckStatus',
            'update values =' + JSON.stringify(values)
          )
          try {
            record.submitFields({
              type: _recordTypeID,
              id: parseInt(_internalid),
              values: values,
              options: {
                enableSourcing: false,
                ignoreMandatoryFields: true,
              },
            })
          } catch (e) {
            log.debug(e.name, e.message)
          }
        }
      }
    } catch (e) {
      log.error(e.name, e.message)
    }
  }

  function checkDepositVoucherRecordAndReturnAmount(
    voucher_main_id,
    deposit_sales_amount,
    deposit_zero_amount,
    deposit_free_amount
  ) {
    try {
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //1.Search
      var _mySearch = search.create({
        type: _deposit_voucher_record,
        columns: [
          search.createColumn({ name: 'custrecord_gw_deposit_egui_tax_type' }),
          search.createColumn({ name: 'custrecord_gw_deposit_egui_amount' }),
          search.createColumn({
            name: 'custrecord_gw_deposit_egui_tax_amount',
          }),
          search.createColumn({
            name: 'custrecord_gw_deposit_egui_total_amount',
          }),
          search.createColumn({
            name: 'custrecord_gw_deposit_dedcuted_amount',
          }),
        ],
      })

      var _filterArray = []
      _filterArray.push([
        'custrecord_gw_deposit_voucher_main_id',
        search.Operator.EQUALTO,
        parseInt(voucher_main_id),
      ])
      _mySearch.filterExpression = _filterArray

      _mySearch.run().each(function (result) {
        var _internalid = result.id

        var _deposit_egui_tax_type = result.getValue({
          name: 'custrecord_gw_deposit_egui_tax_type',
        })
        var _deposit_egui_amount = result.getValue({
          name: 'custrecord_gw_deposit_egui_amount',
        })
        var _deposit_egui_tax_amount = result.getValue({
          name: 'custrecord_gw_deposit_egui_tax_amount',
        })
        var _deposit_dedcuted_amount = result.getValue({
          name: 'custrecord_gw_deposit_dedcuted_amount',
        })

        var _return_amount = stringutility.convertToFloat(
          _deposit_dedcuted_amount
        )
        if (_deposit_egui_tax_type == '1') {
          _return_amount -= deposit_sales_amount
        } else if (_deposit_egui_tax_type == '2') {
          //零稅
          _return_amount -= deposit_zero_amount
        } else if (_deposit_egui_tax_type == '3') {
          //免稅
          _return_amount -= deposit_free_amount
        }

        var values = {}
        values['custrecord_gw_deposit_dedcuted_amount'] = _return_amount
        var _id = record.submitFields({
          type: _deposit_voucher_record,
          id: _internalid,
          values: values,
          options: {
            enableSourcing: false,
            ignoreMandatoryFields: true,
          },
        })

        return true
      })
    } catch (e) {
      log.error(e.name, e.message)
    }
  }

  function updateDepositVoucherRecordStatus(
    voucher_main_id,
    _voucher_status,
    _status
  ) {
    try {
      //1.Search
      var _mySearch = search.create({
        type: _deposit_voucher_record,
        columns: [
          search.createColumn({ name: 'custrecord_gw_deposit_voucher_status' }),
          search.createColumn({
            name: 'custrecord_gw_deposit_voucher_main_id',
          }),
        ],
      })

      var _filterArray = []
      _filterArray.push([
        'custrecord_gw_deposit_voucher_main_id',
        search.Operator.EQUALTO,
        parseInt(voucher_main_id),
      ])
      _mySearch.filterExpression = _filterArray

      if (_voucher_status.indexOf('CANCEL') != -1 && _status == 'C')
        _status = 'D' //上D

      _mySearch.run().each(function (result) {
        var _internalid = result.id

        var values = {}
        values['custrecord_gw_deposit_voucher_status'] = _status
        var _id = record.submitFields({
          type: _deposit_voucher_record,
          id: _internalid,
          values: values,
          options: {
            enableSourcing: false,
            ignoreMandatoryFields: true,
          },
        })

        return true
      })
    } catch (e) {
      log.error(e.name, e.message)
    }
  }

  //返還折讓金額
  function returnEGUIDiscountAmount(internalId, return_amount, tax_code) {
    try {
      var _record = record.load({
        type: _voucher_main_record,
        id: parseInt(internalId),
        isDynamic: true,
      })

      if (tax_code == '1') {
        //應稅
        var _discount_sales_amount = _record.getValue({
          fieldId: 'custrecord_gw_discount_sales_amount',
        })
        _discount_sales_amount = _discount_sales_amount - return_amount
        _record.setValue({
          fieldId: 'custrecord_gw_discount_sales_amount',
          value: _discount_sales_amount,
        })
      } else if (tax_code == '2') {
        //零稅
        var _discount_zero_amount = _record.getValue({
          fieldId: 'custrecord_gw_discount_zero_amount',
        })
        _discount_zero_amount = _discount_zero_amount - return_amount
        _record.setValue({
          fieldId: 'custrecord_gw_discount_zero_amount',
          value: _discount_zero_amount,
        })
      } else if (tax_code == '3') {
        //免稅
        var _discount_free_amount = _record.getValue({
          fieldId: 'custrecord_gw_discount_free_amount',
        })
        _discount_free_amount = _discount_free_amount - return_amount
        _record.setValue({
          fieldId: 'custrecord_gw_discount_free_amount',
          value: _discount_free_amount,
        })
      }

      var _discount_count = _record.getValue({
        fieldId: 'custrecord_gw_discount_count',
      })
      var _discount_amount = _record.getValue({
        fieldId: 'custrecord_gw_discount_amount',
      })

      _discount_count = _discount_count - 1
      _discount_amount = _discount_amount - return_amount

      _record.setValue({
        fieldId: 'custrecord_gw_discount_count',
        value: _discount_count,
      })
      _record.setValue({
        fieldId: 'custrecord_gw_discount_amount',
        value: _discount_amount,
      })

      try {
        _record.save()
      } catch (e) {
        log.error(e.name, e.message)
      }
    } catch (e) {
      log.error(e.name, e.message)
    }
  }

  function checkVoucherUploadStatus(jsonObjAry) {
    try {
      if (jsonObjAry != null) {
        for (var i = 0; i < jsonObjAry.length; i++) {
          var _voucherJsonObj = jsonObjAry[i]

          var _applyId = _voucherJsonObj.applyId
          var _upload_mig_type = _voucherJsonObj.upload_mig_type
          var _voucher_number = _voucherJsonObj.voucher_number
          var _voucher_type = _voucherJsonObj.voucher_type //EGUI , ALLOWANCE
          var _voucher_status = _voucherJsonObj.voucher_status //VOUCHER_SUCCESS , CANCEL_SUCCESS
          var _file_name = _voucherJsonObj.file_name
          var _invoice_ids_Ary = _voucherJsonObj.invoiceAry
          var _creditmemo_ids_Ary = _voucherJsonObj.creditmemoAry
          var _customer_deposit_ids_Ary = _voucherJsonObj.customerdepositAry
          var _sales_order_ids_Ary = _voucherJsonObj.salesorderAry
          var _ns_document_type = _voucherJsonObj.ns_document_type //INVOICE , CREDITMEMO, SALES_ORDER, CUSTOMER_DEPOSIT

          var _deposit_sales_amount = _voucherJsonObj.deposit_sales_amount
          var _deposit_zero_amount = _voucherJsonObj.deposit_zero_amount
          var _deposit_free_amount = _voucherJsonObj.deposit_free_amount

          //處理回傳值
          var _response = gwapi.getGuiStatus(_file_name)
          log.debug('_response', JSON.stringify(_response))
          var _code = _response.code
          var _body = _response.body

          var _status = _body.status
          var _step = _body.step
          var _errorCode = _body.errorCode
          var _errorDescription = _body.errorDescription
          log.debug('_errorDescription', _errorDescription)
          if (_status == 'C' || _status == 'E') {
            //更新發票狀態
            log.debug('status', _status)
            updateVoucherStatus(
              _voucher_type,
              _voucher_status,
              _applyId,
              _status,
              _errorCode,
              _errorDescription
            )

            //更新XML Upload Log-20201125
            updateXmlLogStatus(_applyId, _status, _errorCode, _errorDescription)

            //更新LOCK及相關號碼為空白
            //UnLock Invoice and CreditMemo 作廢成功才做-Cancel this job
            if (_voucher_status.indexOf('CANCEL') != -1 && _status == 'C') {
              //20201107 walter cancel (審核同意時做)
              //unlockTransactionCheckStatus(_invoice_ids_Ary);
              //unlockTransactionCheckStatus(_customer_deposit_ids_Ary);
              //unlockTransactionCheckStatus(_creditmemo_ids_Ary);
            }
            ///////////////////////////////////////////////////////////////////////////////////////////////////////
            if ((_ns_document_type = 'CUSTOMER_DEPOSIT')) {
              //更新 GW_Deposit_Voucher_Record 的Status (C/E)
              updateDepositVoucherRecordStatus(
                _applyId,
                _voucher_status,
                _status
              )
            }
            if (
              _ns_document_type == 'INVOICE' &&
              _voucher_status.indexOf('CANCEL') != -1 &&
              _status == 'C'
            ) {
              //發票作廢成功=>返還金額
              //金額在開立時就預扣了
              checkDepositVoucherRecordAndReturnAmount(
                _applyId,
                _deposit_sales_amount,
                _deposit_zero_amount,
                _deposit_free_amount
              )
            }
            ///////////////////////////////////////////////////////////////////////////////////////////////////////

            //折讓單作廢金額須返還
            if (
              _status == 'C' &&
              (_upload_mig_type == 'B0201' || _upload_mig_type == 'D0501')
            ) {
              //id-itemamount
              var _original_voucher_ary = _voucherJsonObj.originalVoucherAry
              if (_original_voucher_ary != null) {
                for (var i = 0; i < _original_voucher_ary.length; i++) {
                  var _str = _original_voucher_ary[i]
                  var _strAry = _str.split('-')
                  var _main_internal_id = _strAry[0]
                  var _return_amount = _strAry[1]
                  var _ns_tax_code = _strAry[2]

                  var _taxObj = getTaxInformation(_ns_tax_code)
                  //返還折讓單金額
                  returnEGUIDiscountAmount(
                    _main_internal_id,
                    _return_amount,
                    _taxObj.voucher_property_value
                  )
                }
              }
            }
			///////////////////////////////////////////////////////////////////////////////////////////
			if (_upload_mig_type=='C0401' && (_status == 'C' || _status == 'E')) {//發票 
			    var _email_sublect = '發票開立通知'
				if (_status == 'C') {
					_email_sublect += '-開立成功'
				} else if (_status == 'E') {
					_email_sublect += '-開立失敗'
				}
				
				log.debug('email result :', 'start mail')
				var result = gwEmailService.sendByVoucherId(_email_sublect, parseInt(_applyId))
				log.debug('email result :', result)			
			} 
			///////////////////////////////////////////////////////////////////////////////////////////
          }
        }
      }
    } catch (e) {
      log.error(e.name, e.message)
    }
  }

  //處理NS Invoice資料-END
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function updateXmlLogStatus(
    main_internal_id,
    statusId,
    errorCode,
    errorDescription
  ) {
    try {
      var _mySearch = search.create({
        type: 'customrecord_gw_xml_upload_log',
        columns: [
          search.createColumn({
            name: 'custrecord_gw_upload_voucher_apply_id',
          }),
          search.createColumn({ name: 'custrecord_gw_upload_voucher_number' }),
        ],
      })

      var _filterArray = []
      _filterArray.push([
        'custrecord_gw_upload_voucher_apply_id',
        search.Operator.EQUALTO,
        parseInt(main_internal_id),
      ])
      _filterArray.push('and')
      _filterArray.push([
        'custrecord_gw_download_voucher_status',
        search.Operator.ISEMPTY,
        '',
      ])
      _mySearch.filterExpression = _filterArray

      _mySearch.run().each(function (result) {
        var internalId = result.id
        log.debug(
          'customrecord_gw_xml_upload_log.internalId',
          'internalId=' + internalId
        )
        var values = {}
        values['custrecord_gw_download_voucher_status'] = statusId
        if (stringutility.trim(statusId) == 'E') {
          values['custrecord_gw_download_voucher_message'] =
            errorCode + ':' + errorDescription
        }
        var _download_voucher_date = dateutility.getCompanyLocatDate()
        var _download_voucher_time = dateutility.getCompanyLocatTime()
        values['custrecord_gw_download_voucher_date'] = _download_voucher_date
        values['custrecord_gw_download_voucher_time'] = _download_voucher_time
        try {
          record.submitFields({
            type: 'customrecord_gw_xml_upload_log',
            id: parseInt(internalId),
            values: values,
            options: {
              enableSourcing: false,
              ignoreMandatoryFields: true,
            },
          })
        } catch (e) {
          log.error(e.name, e.message)
        }

        return true
      })
    } catch (e) {
      log.error(e.name, e.message)
    }
  }

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
      log.error(e.name, e.message)
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
      log.error(e.name, e.message)
    }

    return _taxObj
  }

  //處理發票資料-END
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function executeScript(context) {
    try {
      loadAllTaxInformation()

      var _jsonObjAry = getVoucherUploadedList()

      checkVoucherUploadStatus(_jsonObjAry)
    } catch (e) {
      log.error(e.name, e.message)
    }
  }

  return {
    execute: executeScript,
  }
})
