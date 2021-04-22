/**
 * @NApiVersion 2.0
 * @NScriptType ClientScript
 * @NModuleScope Public
 */
define([
  'N/ui/dialog',
  'N/search',
  'N/currentRecord',
  'N/record',
  'N/format',
  '../gw_common_utility/gw_common_validate_utility',
  '../gw_common_utility/gw_common_date_utility',
  '../gw_common_utility/gw_common_string_utility',
  '../gw_common_utility/gw_common_configure',
  '../gw_common_utility/gw_common_invoice_utility',
  '../gw_common_utility/gw_common_gwmessage_utility',
], function (
  dialog,
  search,
  currentRecord,
  record,
  format,
  validate,
  dateutility,
  stringutility,
  gwconfigure,
  invoiceutility,
  gwmessage
) {
  var _invoceFormatCode = gwconfigure.getGwVoucherFormatInvoiceCode() //35
  var _creditMemoFormatCode = gwconfigure.getGwVoucherFormatAllowanceCode()

  var _assignLogActionScriptId = gwconfigure.getGwAssignLogActionScriptId()
  var _assignLogActionDeploymentId = gwconfigure.getGwAssignLogActionDeploymentId()
  var _assignLogRecordId = gwconfigure.getGwAssignLogRecordId()

  //Record List
  var _voucher_apply_list_record = gwconfigure.getGwVoucherApplyListRecord()
  var _voucher_main_record = gwconfigure.getGwVoucherMainRecord()
  var _voucher_details_record = gwconfigure.getGwVoucherDetailsRecord()

  //稅別代碼
  var _withTaxID = gwconfigure.getGwWithTaxID() //1=應稅 [5]
  var _zeroTaxID = gwconfigure.getGwZeroTaxID() //2=零稅率 [0]
  var _freeTaxID = gwconfigure.getGwFreeTaxID() //3=免稅 [0]
  var _speicalTaxID = gwconfigure.getSpeicalTaxID() //4=特種稅率 [1, 2, 5, 15, 25]
  var _mixTaxID = gwconfigure.getGwMixTaxID() //9=混合稅率(B2C) [0]
  var _numericToFixed = gwconfigure.getGwNumericToFixed() //小數點位數

  var _invoce_control_field_id = gwconfigure.getInvoceControlFieldId()
  var _credmemo_control_field_id = gwconfigure.getCredMemoControlFieldId()

  //Page Parameters
  var _invoice_hiddent_listid = 'custpage_invoice_hiddent_listid'
  var _creditmemo_hiddent_listid = 'custpage_creditmemo_hiddent_listid'

  var _defaultAssignLogType = 'TYPE_1'

  var _default_upload_status = 'A' //A->P->C,E

  var _current_record = currentRecord.get()

  function fieldChanged(context) {
    if (window.onbeforeunload) {
      //avoid change warning
      window.onbeforeunload = function () {
        null
      }
    }

    var _changeFieldId = context.fieldId
    console.log('_changeFieldId=' + _changeFieldId)

    if (_changeFieldId == 'custpage_customer_id') {
      changeCustomerInformation(_changeFieldId)
    } else if (_changeFieldId == 'custpage_tax_type') {
      changeTaxType(_changeFieldId)
    } else if (_changeFieldId == 'custpage_invoice_type') {
      changeInvoiceType(_changeFieldId)
    } else if (_changeFieldId == 'custpage_mig_type') {
      changeMigType(_changeFieldId)
    } else if (_changeFieldId == 'custpage_allowance_deduction_period') {
      var _allowance_deduction_period = _current_record.getValue({
        fieldId: _changeFieldId,
      })
      var _deduction_egui_number = _current_record.getField({
        fieldId: 'custpage_deduction_egui_number',
      })
      if (_allowance_deduction_period === 'user_selected') {
        _deduction_egui_number.isDisplay = true //顯示
      } else {
        _deduction_egui_number.isDisplay = false //不顯示
      }
    }
  }

  //發票資料格式
  function changeMigType(changeFieldId) {
    //課稅別
    var _custpage_mig_type = _current_record.getValue({
      fieldId: changeFieldId,
    })
    //custpage_tax_rate
    var _npo_ban = _current_record.getField({ fieldId: 'custpage_npo_ban' })
    if (_custpage_mig_type === 'B2BS' || _custpage_mig_type === 'B2BE') {
      _npo_ban.isDisplay = false //不顯示捐贈碼
    } else {
      _npo_ban.isDisplay = true //顯示捐贈碼
    }
  }

  function changeInvoiceType(changeFieldId) {
    var _custpage_tax_type = 'custpage_tax_type'

    //課稅別
    var _custpage_invoice_type = _current_record.getValue({
      fieldId: changeFieldId,
    })

    //清除custpage_tax_rate
    var _changeSelectField = _current_record.getField({
      fieldId: changeFieldId,
    })

    var _changeTaxTypeField = _current_record.getField({
      fieldId: _custpage_tax_type,
    })
    _changeTaxTypeField.removeSelectOption({
      //應稅(一般稅率)
      value: '1',
    })
    _changeTaxTypeField.removeSelectOption({
      //零稅率
      value: '2',
    })
    _changeTaxTypeField.removeSelectOption({
      //免稅
      value: '3',
    })
    _changeTaxTypeField.removeSelectOption({
      //特種稅
      value: '4',
    })
    _changeTaxTypeField.removeSelectOption({
      //混合稅率
      value: '9',
    })

    if (_custpage_invoice_type == '07') {
      //一般稅發票
      _changeTaxTypeField.insertSelectOption({
        value: '1',
        text: '應稅(一般稅率)',
      })
      _changeTaxTypeField.insertSelectOption({
        value: '2',
        text: '零稅率',
      })
      _changeTaxTypeField.insertSelectOption({
        value: '3',
        text: '免稅',
      })
      _changeTaxTypeField.insertSelectOption({
        value: '9',
        text: '混合稅',
      })
    } else if (_custpage_invoice_type == '08') {
      //特種稅發票
      _changeTaxTypeField.insertSelectOption({
        value: '4',
        text: '特種稅',
      })
    }

    changeTaxType(_custpage_tax_type)
  }

  function changeTaxType(changeFieldId) {
    //課稅別
    var _custpage_tax_type = _current_record.getValue({
      fieldId: changeFieldId,
    })
    //custpage_tax_rate
    var _customs_clearance_mark_field = _current_record.getField({
      fieldId: 'custpage_customs_clearance_mark',
    })
    _customs_clearance_mark_field.isDisplay = false //顯示通關註記

    //清除custpage_tax_rate
    var _changeSelectField = _current_record.getField({
      fieldId: changeFieldId,
    })

    var _changeTaxRateField = _current_record.getField({
      fieldId: 'custpage_tax_rate',
    })
    _changeTaxRateField.removeSelectOption({
      value: '0',
    })
    _changeTaxRateField.removeSelectOption({
      value: '2',
    })
    _changeTaxRateField.removeSelectOption({
      value: '5',
    })
    _changeTaxRateField.removeSelectOption({
      value: '15',
    })

    if (_custpage_tax_type == '1') {
      //應稅(一般稅率)
      _changeTaxRateField.insertSelectOption({
        value: '5',
        text: '5',
      })
    } else if (_custpage_tax_type == '2') {
      // 零稅率
      _customs_clearance_mark_field.isDisplay = true //顯示通關註記
      _changeTaxRateField.insertSelectOption({
        value: '0',
        text: '0',
      })
    } else if (_custpage_tax_type == '3') {
      //免稅
      _changeTaxRateField.insertSelectOption({
        value: '0',
        text: '0',
      })
    } else if (_custpage_tax_type == '4') {
      //特種稅
      _changeTaxRateField.insertSelectOption({
        value: '2',
        text: '2',
      })
      _changeTaxRateField.insertSelectOption({
        value: '5',
        text: '5',
      })
      _changeTaxRateField.insertSelectOption({
        value: '15',
        text: '15',
      })
    } else if (_custpage_tax_type == '9') {
      //混合稅率
      _changeTaxRateField.insertSelectOption({
        value: '5',
        text: '5',
      })
    }
  }

  function changeCustomerInformation(changeFieldId) {
    //客戶代碼
    var _custpage_customer_id = _current_record.getValue({
      fieldId: changeFieldId,
    })

    var _entityid = ''
    var _customer_buyer_name = ''
    var _customer_buyer_email = ''
    var _customer_buyer_identifier = ''
    var _customer_address = ''

    if (_custpage_customer_id !== '') {
      var _customerRecord = record.load({
        type: record.Type.CUSTOMER,
        id: _custpage_customer_id,
        isDynamic: true,
      })
      _entityid = _customerRecord.getValue({
        fieldId: 'entityid',
      })
      _customer_buyer_name = _customerRecord.getValue({
        fieldId: 'companyname',
      })
      _customer_buyer_email = _customerRecord.getValue({
        fieldId: 'email',
      })
      _customer_buyer_identifier = _customerRecord.getValue({
        fieldId: 'vatregnumber',
      })
      _customer_address = _customerRecord.getValue({
        fieldId: 'defaultaddress',
      })
    }
    _current_record.setValue({
      fieldId: 'custpage_buyer_identifier',
      value: _customer_buyer_identifier,
      ignoreFieldChange: true,
    })
    _current_record.setValue({
      fieldId: 'custpage_buyer_name',
      value: _customer_buyer_name,
      ignoreFieldChange: true,
    })
    _current_record.setValue({
      fieldId: 'custpage_buyer_email',
      value: _customer_buyer_email,
      ignoreFieldChange: true,
    })
    _current_record.setValue({
      fieldId: 'custpage_buyer_address',
      value: _customer_address,
      ignoreFieldChange: true,
    })
  }

  function sublistChanged(context) {
    var changedSubListId = context.sublistId
    console.log('changedSubListId=' + changedSubListId)
    var changeLineId = _current_record.getCurrentSublistIndex({
      sublistId: changedSubListId,
    })
    console.log('changeLineId=' + changeLineId)

    var _item_name = _current_record.getCurrentSublistValue({
      sublistId: changedSubListId,
      fieldId: 'custpage_item_name',
    })
    _current_record.setCurrentSublistValue({
      sublistId: changedSubListId,
      fieldId: 'custpage_item_name',
      value: _item_name,
      ignoreFieldChange: true,
    })
    console.log('_item_name=' + _item_name)
  }

  //欄位檢查
  function validateForm(assignlogScriptId, assignlogDeploymentId) {
    var _errorMsg = ''

    try {
      //B2BS, B2BE, B2C
      var _mig_type = _current_record.getValue({ fieldId: 'custpage_mig_type' })
      //1.請輸入商品名稱:中文30字以內, 英文60字以內
      //2.請填寫客戶公司名稱
      var _custpage_company_name = _current_record.getValue({
        fieldId: 'custpage_company_name',
      })
      if (_custpage_company_name.length == 0) {
        _errorMsg += '請填寫客戶公司名稱,'
      } else if (stringutility.checkByteLength(_custpage_company_name) > 60) {
        _errorMsg += '公司名稱長度不可超過30個中文字或60個英文字,'
      }
      //3.載具格式錯誤, 請輸入載具類別, 輸入統編不得使用自然人(CQ0001)載具!
      var _custpage_customer_id = _current_record.getValue({
        fieldId: 'custpage_customer_id',
      })
      var _carrier_type = _current_record.getValue({
        fieldId: 'custpage_carrier_type',
      })
      if (_custpage_customer_id != '00000000' && _carrier_type === 'CQ0001') {
        _errorMsg += '輸入統編不得使用自然人(CQ0001)載具,'
      }
      //4.載具號碼錯誤! 手機條碼 自然人載具錯誤!
      var _carrier_id = _current_record.getValue({
        fieldId: 'custpage_carrier_id',
      })
      if (_carrier_type === 'CQ0001') {
        //自然人憑證
        if (!validate.checkCarrier(_carrier_type, _carrier_id)) {
          _errorMsg += '請輸入正確自然人憑證格式,'
        }
      } else if (_carrier_type === '3J0002') {
        //手機條碼
        if (!validate.checkCarrier(_carrier_type, _carrier_id)) {
          _errorMsg += '請輸入正確手機條碼格式,'
        }
      }
      //5.Email格式錯誤!
      var _buyer_email = _current_record.getValue({
        fieldId: 'custpage_buyer_email',
      })
      /**
       if (_buyer_email.length == 0) {
			   _errorMsg += '請輸入Email,';
		   } else {
			   //TODO Check Format
			   if (!validate.checkEmail(_buyer_email)) {
				   _errorMsg += '請輸入正確Email格式,';
			   } 
		   }
       */
      if (_buyer_email.length != 0) {
        //TODO Check Format
        if (!validate.checkEmail(_buyer_email)) {
          _errorMsg += '請輸入正確Email格式,'
        }
      }

      //5.捐贈碼Npoban: '請輸入3-7碼數字'-Done
      var _npo_ban = _current_record.getValue({
        fieldId: 'custpage_npo_ban',
      })
      if (_mig_type === 'B2C') {
        if (
          _npo_ban.length != 0 &&
          (_npo_ban.length < 3 || _npo_ban.length > 7)
        ) {
          _errorMsg += '捐贈碼請輸入3-7碼數字,'
        } else if (isNaN(_npo_ban)) {
          _errorMsg += '捐贈碼請輸入3-7碼數字,'
          _errorMsg += '捐贈碼請輸入3-7碼數字,'
        }
      } else {
        if (_npo_ban.length != 0) {
          _errorMsg += '捐贈碼不可輸入,'
        }
      }

      //6.*請選擇通關方式(零稅必填!)-Done
      var _tax_type = _current_record.getValue({
        fieldId: 'custpage_tax_type',
      })
      if (_tax_type === '2') {
        //零稅率
        var _customs_clearance_mark = _current_record.getValue({
          fieldId: 'custpage_customs_clearance_mark',
        })
        if (_customs_clearance_mark.length == 0) {
          _errorMsg += '請選擇通關方式(零稅必填!),'
        }
      }

      //7.檢查發票日期
      var _select_voucher_date = _current_record.getValue({
        fieldId: 'custpage_select_voucher_date',
      })
      if (stringutility.trim(_select_voucher_date) == '') {
        //檢查發票日期
        _errorMsg += '請選擇發票日期,'
      }

      //8.檢查手開發票號碼
      var _manual_voucher_number = _current_record.getValue({
        fieldId: 'custpage_manual_voucher_number',
      })
      if (stringutility.trim(_manual_voucher_number) != '') {
        //檢查發票號碼格式
        if (validate.validateEGUINumber(_manual_voucher_number) == false) {
          _errorMsg += '手開發票號碼格式錯誤,'
        } else {
          //檢查手開發票
          var _ban = _current_record.getValue({
            fieldId: 'custpage_company_ban',
          })
          var _track = _manual_voucher_number.substr(0, 2)
          var _inv_number = _manual_voucher_number.substr(
            2,
            _manual_voucher_number.length
          )
          alert(
            '_ban=' +
              _ban +
              ' ,_track=' +
              _track +
              ' ,_inv_number=' +
              _inv_number
          )
          if (
            invoiceutility.checkInvoiceNumberExistRange(
              _ban,
              _track,
              _inv_number
            ) == false
          ) {
            _errorMsg += '手開發票字軌號碼區間錯誤,'
          } else {
            if (
              invoiceutility.checkInvoiceNumberDuplicate(
                _ban,
                _manual_voucher_number
              ) == true
            ) {
              _errorMsg += '手開發票號碼重覆,'
            }
          }
        }
      }

      //9.檢查折讓單扣抵發票號碼
      var _deduction_egui_number = _current_record.getValue({
        fieldId: 'custpage_deduction_egui_number',
      })
      if (stringutility.trim(_deduction_egui_number) != '') {
        //檢查發票號碼格式
        var _deduction_egui_number_ary = _deduction_egui_number.split(',')
        for (var i = 0; i < _deduction_egui_number_ary.length; i++) {
          var _number = _deduction_egui_number_ary[i]
          if (validate.validateEGUINumber(_number) == false) {
            _errorMsg += _number + ':折讓單扣抵發票號碼格式錯誤,'
          }
        }
      }

      //檢查明細(名稱:256+明細備註:40)
      _errorMsg += checkDetailItems(_manual_voucher_number)
    } catch (e) {
      console.log(e.name + ':' + e.message)
    }
    return _errorMsg
  }

  function checkDetailItems(_manual_voucher_number) {
    var _errorMsg = ''
    //Involic SubList
    var _invoiceSublistId = 'invoicesublistid'
    var _creditMemoSublistId = 'creditmemosublistid'

    var _index_tax_code = ''
    var _check_tax_code_flag = true
    var _invoice_item_count = _current_record.getLineCount({
      sublistId: _invoiceSublistId,
    })
    if (typeof _invoice_item_count !== 'undefined') {
      for (var i = 0; i < _invoice_item_count; i++) {
        var _invoice_id = _current_record.getSublistValue({
          sublistId: _invoiceSublistId,
          fieldId: 'customer_search_invoice_id',
          line: i,
        })
        var _invoice_seq = _current_record.getSublistValue({
          sublistId: _invoiceSublistId,
          fieldId: 'customer_search_invoice_seq',
          line: i,
        })
        var _tax_code = _current_record.getSublistValue({
          sublistId: _invoiceSublistId,
          fieldId: 'customer_search_invoice_tax_code',
          line: i,
        })
        if (_index_tax_code == '') _index_tax_code = _tax_code
        if (_index_tax_code != _tax_code) _check_tax_code_flag = false

        var _tax_rate = _current_record.getSublistValue({
          sublistId: _invoiceSublistId,
          fieldId: 'customer_search_invoice_tax_rate',
          line: i,
        })
        var _item_name = _current_record.getSublistValue({
          sublistId: _invoiceSublistId,
          fieldId: 'custpage_item_name',
          line: i,
        })
        var _unit_price = _current_record.getSublistValue({
          sublistId: _invoiceSublistId,
          fieldId: 'custpage_unit_price',
          line: i,
        })
        var _item_quantity = _current_record.getSublistValue({
          sublistId: _invoiceSublistId,
          fieldId: 'custpage_item_quantity',
          line: i,
        })
        var _item_amount = _current_record.getSublistValue({
          sublistId: _invoiceSublistId,
          fieldId: 'custpage_item_amount',
          line: i,
        })
        var _item_remark = _current_record.getSublistValue({
          sublistId: _invoiceSublistId,
          fieldId: 'custpage_item_remark',
          line: i,
        })
        //Set value
        if (stringutility.checkByteLength(_item_name) > 256) {
          _errorMsg += _invoice_id + ':Invoice商品名稱需小於256字元,'
        } else if (stringutility.checkByteLength(_item_name) == 0) {
          _errorMsg += _invoice_id + ':Invoice商品名稱不可空白,'
        }
        if (stringutility.checkByteLength(_item_remark) > 40) {
          _errorMsg += _invoice_id + ':Invoice明細備註需小於40字元,'
        }
      }
    }

    //CreditMemo SubList
    var _creditmemo_item_count = _current_record.getLineCount({
      sublistId: _creditMemoSublistId,
    })
    if (typeof _creditmemo_item_count !== 'undefined') {
      for (var i = 0; i < _creditmemo_item_count; i++) {
        var _creditmemo_id = _current_record.getSublistValue({
          sublistId: _creditMemoSublistId,
          fieldId: 'customer_search_creditmemo_id',
          line: i,
        })
        var _creditmemo_seq = _current_record.getSublistValue({
          sublistId: _creditMemoSublistId,
          fieldId: 'customer_search_creditmemo_seq',
          line: i,
        })
        var _creditmemo_seq = _current_record.getSublistValue({
          sublistId: _creditMemoSublistId,
          fieldId: 'customer_search_creditmemo_seq',
          line: i,
        })
        var _creditmemo_tax_code = _current_record.getSublistValue({
          sublistId: _creditMemoSublistId,
          fieldId: 'customer_search_creditmemo_tax_code',
          line: i,
        })
        if (_index_tax_code == '') _index_tax_code = _creditmemo_tax_code
        if (_index_tax_code != _creditmemo_tax_code)
          _check_tax_code_flag = false

        var _creditmemo_tax_rate = _current_record.getSublistValue({
          sublistId: _creditMemoSublistId,
          fieldId: 'customer_search_creditmemo_tax_rate',
          line: i,
        })
        var _unit_price = _current_record.getSublistValue({
          sublistId: _creditMemoSublistId,
          fieldId: 'custpage_unit_price',
          line: i,
        })
        var _item_quantity = _current_record.getSublistValue({
          sublistId: _creditMemoSublistId,
          fieldId: 'custpage_item_quantity',
          line: i,
        })
        var _item_amount = _current_record.getSublistValue({
          sublistId: _creditMemoSublistId,
          fieldId: 'custpage_item_amount',
          line: i,
        })
        var _item_remark = _current_record.getSublistValue({
          sublistId: _creditMemoSublistId,
          fieldId: 'custpage_item_remark',
          line: i,
        })
        if (stringutility.checkByteLength(_item_name) > 256) {
          _errorMsg += _creditmemo_id + ':CreditMemo商品名稱需小於256字元,'
        } else if (stringutility.checkByteLength(_item_name) > 256) {
          _errorMsg += _creditmemo_id + ':CreditMemo商品名稱不可空白,'
        }
        if (stringutility.checkByteLength(_item_remark) > 40) {
          _errorMsg += _creditmemo_id + ':CreditMemo明細備註需小於40字元,'
        }
      }
    }

    if (
      stringutility.trim(_manual_voucher_number) != '' &&
      _invoice_item_count + _creditmemo_item_count > 999
    ) {
      _errorMsg += _manual_voucher_number + ':筆數不可超過999筆,'
    }
    if (
      stringutility.trim(_manual_voucher_number) != '' &&
      _check_tax_code_flag == false
    ) {
      _errorMsg += _manual_voucher_number + ':不可開立不同稅別,'
    }

    return _errorMsg
  }

  //Init Company Information TODO
  function pageInit() {
    _current_record.setValue({
      fieldId: 'custpage_print_type',
      value: '熱感式印表機',
      ignoreFieldChange: true,
    })

    //判斷憑證開立方式
    var _voucherOpenType = 'MERGE-'
    var _invoice_listid = _current_record.getValue({
      fieldId: _invoice_hiddent_listid,
    })
    var _creditmemo_listid = _current_record.getValue({
      fieldId: _creditmemo_hiddent_listid,
    })
    var _invoiceAry = []
    var _creditMemoAry = []

    if (typeof _invoice_listid !== 'undefined') {
      _invoiceAry = _invoice_listid.split(',')
    }
    if (typeof _creditmemo_listid !== 'undefined') {
      _creditMemoAry = _creditmemo_listid.split(',')
    }

    //_voucherOpenType = 'MERGE-';
    var _total_amount = _current_record.getValue({
      fieldId: 'custpage_total_amount',
    })

    if (_invoiceAry.length > 1 && _creditMemoAry.length > 1) {
      _voucherOpenType = _voucherOpenType + 'ALL'
      showCreditMemoForm(
        false,
        _invoiceAry.length,
        _creditMemoAry.length,
        _total_amount
      )
    } else if (_invoiceAry.length > 1 && _creditMemoAry.length <= 1) {
      _voucherOpenType = _voucherOpenType + 'INVOICE'
    } else if (_creditMemoAry.length > 1 && _invoiceAry.length <= 1) {
      _voucherOpenType = _voucherOpenType + 'CREDITMEMO'
      showCreditMemoForm(
        true,
        _invoiceAry.length,
        _creditMemoAry.length,
        _total_amount
      )
    } else {
      _voucherOpenType = _voucherOpenType + 'NONE'
    }
    _current_record.setValue({
      fieldId: 'custpage_voucher_open_type',
      value: _voucherOpenType,
      ignoreFieldChange: true,
    })

    var _customs_clearance_mark_field = _current_record.getField({
      fieldId: 'custpage_customs_clearance_mark',
    })
    _customs_clearance_mark_field.isDisplay = false

    var _npo_ban = _current_record.getField({ fieldId: 'custpage_npo_ban' })
    _npo_ban.isDisplay = false

    var _deduction_egui_number = _current_record.getField({
      fieldId: 'custpage_deduction_egui_number',
    })
    _deduction_egui_number.isDisplay = false //預設不顯示
  }

  function showCreditMemoForm(
    mandatoryFlag,
    invoice_length,
    creditmemo_length,
    total_amount
  ) {
    try {
      var _buyer_identifier = _current_record.getValue({
        fieldId: 'custpage_buyer_identifier',
      })
      if (
        mandatoryFlag === true ||
        (stringutility.convertToFloat(total_amount) < 0 &&
          invoice_length + creditmemo_length - 2 <= 999)
      ) {
        var _carrier_type = _current_record.getField({
          fieldId: 'custpage_carrier_type',
        })
        _carrier_type.isDisplay = false
        var _carrier_id = _current_record.getField({
          fieldId: 'custpage_carrier_id',
        })
        _carrier_id.isDisplay = false
        var _npo_ban = _current_record.getField({ fieldId: 'custpage_npo_ban' })
        _carrier_id.isDisplay = false
        var _customs_clearance_mark_field = _current_record.getField({
          fieldId: 'custpage_customs_clearance_mark',
        })
        _customs_clearance_mark_field.isDisplay = false

        var _manual_voucher_number = _current_record.getField({
          fieldId: 'custpage_manual_voucher_number',
        })
        _manual_voucher_number.isDisplay = false
        var _dept_code = _current_record.getField({
          fieldId: 'custpage_dept_code',
        })
        _dept_code.isDisplay = false
        var _classification = _current_record.getField({
          fieldId: 'custpage_classification',
        })
        _classification.isDisplay = false
      }
    } catch (e) {
      console.log(e.name + ':' + e.message)
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //開立發票區塊-START
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //處理憑證資料
  function submitDocument(assignlogScriptId, assignlogDeploymentId) {
    //1.驗證資料
    var _errorMsg = validateForm(assignlogScriptId, assignlogDeploymentId)
    if (_errorMsg.length != 0) {
      var _title = '憑證管理'
      gwmessage.showErrorMessage(_title, _errorMsg)
      return
    }
    //disabled button
    document.getElementById('custpage_create_voucher_button').remove()

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //發票日期
    var _select_voucher_date = _current_record.getValue({
      fieldId: 'custpage_select_voucher_date',
    })
    //手開發票號碼
    var _manual_voucher_number = _current_record.getValue({
      fieldId: 'custpage_manual_voucher_number',
    })
    //alert('_manual_voucher_number='+_manual_voucher_number);
    //折讓單扣抵發票號碼
    var _deduction_egui_number = _current_record.getValue({
      fieldId: 'custpage_deduction_egui_number',
    })
    //alert('_deduction_egui_number='+_deduction_egui_number);
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //開立方式
    var _assignLogType = _current_record.getValue({
      fieldId: 'custpage_allowance_log_type',
    })
    if (stringutility.trim(_manual_voucher_number) != '') {
      _assignLogType = 'TYPE_2' //不上傳
    }

    //MERGE-INVOICE, MERGE-CREDITMEMO, MERGE-ALL(INVOICE+CREDITMEMO), SINGLE(各別開)
    var _voucherOpenType = _current_record.getValue({
      fieldId: 'custpage_voucher_open_type',
    })
    //_voucherOpenType='SINGLE';

    //折讓單折扣開立期別[this_period=>本期開始, early_period=>前期開始]
    var _allowanceDecutionPeriod = _current_record.getValue({
      fieldId: 'custpage_allowance_deduction_period',
    })

    //2.取得頁面填寫資料(GUI或Allowance)	=>Mig Type
    var _mig_type = _current_record.getValue({ fieldId: 'custpage_mig_type' }) //B2BS, B2BE, B2C
    var _egui_mig_type = getInvoiceMigType(_mig_type)
    var _allowance_mig_type = getAllowanceMigType(_mig_type)

    //總金額(僅供參考)
    var _total_amount = _current_record.getValue({
      fieldId: 'custpage_total_amount',
    })
    //處理年月
    //var _year_month = dateutility.getTaxYearMonth();
    var _formattedDate = format.format({
      value: _select_voucher_date,
      type: format.Type.DATETIME,
      timezone: format.Timezone.ASIA_TAIPEI,
    })

    var _year_month = dateutility.getTaxYearMonthByDate(_formattedDate)
    var _voucher_date = dateutility.getConvertDateByDate(_formattedDate)
    //alert('_year_month='+_year_month+' _voucher_date='+_voucher_date);
    //1.依稅(TaxCode)分流稅別資料(INVOICE+CREDITMEMO)混在一起
    var _jsonDocumemtLists = splitDocumentDetail(_mig_type)
    //alert('_jsonDocumemtLists='+JSON.stringify(_jsonDocumemtLists));

    //依不同稅別分別開立發票(紀錄未稅金額)
    var _amount_TaxType_1 = _jsonDocumemtLists.amount_TaxType_1 //1=應稅     [5]
    var _amount_TaxType_2 = _jsonDocumemtLists.amount_TaxType_2 //2=零稅率   [0]
    var _amount_TaxType_3 = _jsonDocumemtLists.amount_TaxType_3 //3=免稅     [0]
    var _amount_TaxType_4 = _jsonDocumemtLists.amount_TaxType_4 //4=特種稅率 [1, 2, 5, 15, 25]
    var _amount_TaxType_9 = _jsonDocumemtLists.amount_TaxType_9 //9=混合稅率(Only B2C) [all]
    var _amount_TaxType_sum =
      _amount_TaxType_1 +
      _amount_TaxType_2 +
      _amount_TaxType_3 +
      _amount_TaxType_4 +
      _amount_TaxType_9

    //依不同稅別分別開立發票(紀錄Item明細)
    var _eDocument_TaxType_1_Ary = _jsonDocumemtLists.eDocument_TaxType_1_Ary //1=應稅     [5]
    var _eDocument_TaxType_2_Ary = _jsonDocumemtLists.eDocument_TaxType_2_Ary //2=零稅率   [0]
    var _eDocument_TaxType_3_Ary = _jsonDocumemtLists.eDocument_TaxType_3_Ary //3=免稅     [0]
    var _eDocument_TaxType_4_Ary = _jsonDocumemtLists.eDocument_TaxType_4_Ary //4=特種稅率 [1, 2, 5, 15, 25]
    var _eDocument_TaxType_9_Ary = _jsonDocumemtLists.eDocument_TaxType_9_Ary //9=混合稅率(only B2C) [all]

    //2.取得頁面Main填寫資料(GUI或Allowance)
    var _applyMainObj = getApplyMainObject(_year_month)

    //alert('ApplyMainObj='+JSON.stringify(_applyMainObj));

    var _discount_toatl_amount = _applyMainObj.discountamount //折扣總金額
    //分配到各稅別的折扣金額
    var _discount_amount_SplitTaxType_1 = 0 //1=應稅     [5]
    var _discount_amount_SplitTaxType_2 = 0 //2=零稅率   [0]
    var _discount_amount_SplitTaxType_3 = 0 //3=免稅     [0]
    var _discount_amount_SplitTaxType_4 = 0 //4=特種稅率 [1, 2, 5, 15, 25]
    var _discount_amount_SplitTaxType_9 = 0 //9=混合稅率(only B2C) [all]
    //分配到各稅別的折扣金額
    if (_discount_toatl_amount != 0 && _amount_TaxType_sum != 0) {
      _discount_amount_SplitTaxType_1 = (
        (_discount_toatl_amount * _amount_TaxType_1) /
        _amount_TaxType_sum
      ).toFixed(_numericToFixed)
      _discount_amount_SplitTaxType_2 = (
        (_discount_toatl_amount * _amount_TaxType_2) /
        _amount_TaxType_sum
      ).toFixed(_numericToFixed)
      _discount_amount_SplitTaxType_3 = (
        (_discount_toatl_amount * _amount_TaxType_3) /
        _amount_TaxType_sum
      ).toFixed(_numericToFixed)
      _discount_amount_SplitTaxType_4 = (
        (_discount_toatl_amount * _amount_TaxType_4) /
        _amount_TaxType_sum
      ).toFixed(_numericToFixed)
      _discount_amount_SplitTaxType_9 = (
        (_discount_toatl_amount * _amount_TaxType_9) /
        _amount_TaxType_sum
      ).toFixed(_numericToFixed)
    }

    //3.判斷處理方式 accessType=INVOICE[只處理Invoice], accessType=CREDITMEMO[只處理CreditMemo], accessType=ALL[Invoice+CreditMemo];
    //3.1.取得DiscountItem List and Amount
    var _invoice_selected_listid = _current_record.getValue({
      fieldId: _invoice_hiddent_listid,
    })
    var _creditmemo_selected_listid = _current_record.getValue({
      fieldId: _creditmemo_hiddent_listid,
    })

    //紀錄折扣項目及金額
    var _discountItemAry = _jsonDocumemtLists.discountItemAry

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //依照金額判斷開立方式==>整理資料每999筆1包
    var _creditmemo_error_message = ''
    var _organisedAry_TaxType_1 = organisingDocument(
      _applyMainObj,
      _eDocument_TaxType_1_Ary,
      _discount_toatl_amount,
      _discount_amount_SplitTaxType_1,
      _discountItemAry
    )
    var _guiAry_TaxType_1 = _organisedAry_TaxType_1.EGUI
    var _creditMemoAry_TaxType_1 = _organisedAry_TaxType_1.CREDITMEMO

    //折讓單總金額不含稅
    var _creditTotalAmount_TaxType_1 =
      _organisedAry_TaxType_1.CREDITMEMO_TOTAL_AMOUNT
    var _creditMemoAmountFlag_TaxType_1 = true
    if (_creditTotalAmount_TaxType_1 != 0) {
      var _taxType1 = '1'
      _creditMemoAmountFlag_TaxType_1 = checkCreditMemoAmount(
        _assignLogType,
        _applyMainObj.buyer_identifier,
        _applyMainObj.company_ban,
        _applyMainObj.dept_code,
        _applyMainObj.classification,
        _year_month,
        _allowanceDecutionPeriod,
        _deduction_egui_number,
        _applyMainObj.invoice_type,
        _taxType1,
        _creditTotalAmount_TaxType_1
      )
      if (_creditMemoAmountFlag_TaxType_1 == false)
        _creditmemo_error_message += '(應稅)發票可折金額不足,'
    }

    var _organisedAry_TaxType_2 = organisingDocument(
      _applyMainObj,
      _eDocument_TaxType_2_Ary,
      _discount_toatl_amount,
      _discount_amount_SplitTaxType_2,
      _discountItemAry
    )
    var _guiAry_TaxType_2 = _organisedAry_TaxType_2.EGUI
    var _creditMemoAry_TaxType_2 = _organisedAry_TaxType_2.CREDITMEMO
    //折讓單總金額不含稅
    var _creditTotalAmount_TaxType_2 =
      _organisedAry_TaxType_2.CREDITMEMO_TOTAL_AMOUNT
    var _creditMemoAmountFlag_TaxType_2 = true
    if (_creditTotalAmount_TaxType_2 != 0) {
      var _taxType2 = '2'
      _creditMemoAmountFlag_TaxType_2 = checkCreditMemoAmount(
        _assignLogType,
        _applyMainObj.buyer_identifier,
        _applyMainObj.company_ban,
        _applyMainObj.dept_code,
        _applyMainObj.classification,
        _year_month,
        _allowanceDecutionPeriod,
        _deduction_egui_number,
        _applyMainObj.invoice_type,
        _taxType2,
        _creditTotalAmount_TaxType_2
      )
      if (_creditMemoAmountFlag_TaxType_2 == false)
        _creditmemo_error_message += '(零稅率)發票可折金額不足,'
    }

    var _organisedAry_TaxType_3 = organisingDocument(
      _applyMainObj,
      _eDocument_TaxType_3_Ary,
      _discount_toatl_amount,
      _discount_amount_SplitTaxType_3,
      _discountItemAry
    )
    var _guiAry_TaxType_3 = _organisedAry_TaxType_3.EGUI
    var _creditMemoAry_TaxType_3 = _organisedAry_TaxType_3.CREDITMEMO
    //折讓單總金額不含稅
    var _creditTotalAmount_TaxType_3 =
      _organisedAry_TaxType_3.CREDITMEMO_TOTAL_AMOUNT
    var _creditMemoAmountFlag_TaxType_3 = true
    if (_creditTotalAmount_TaxType_3 != 0) {
      var _taxType3 = '3'
      _creditMemoAmountFlag_TaxType_3 = checkCreditMemoAmount(
        _assignLogType,
        _applyMainObj.buyer_identifier,
        _applyMainObj.company_ban,
        _applyMainObj.dept_code,
        _applyMainObj.classification,
        _year_month,
        _allowanceDecutionPeriod,
        _deduction_egui_number,
        _applyMainObj.invoice_type,
        _taxType3,
        _creditTotalAmount_TaxType_3
      )
      if (_creditMemoAmountFlag_TaxType_3 == false)
        _creditmemo_error_message += '(免稅)發票可折金額不足,'
    }

    var _organisedAry_TaxType_4 = organisingDocument(
      _applyMainObj,
      _eDocument_TaxType_4_Ary,
      _discount_toatl_amount,
      _discount_amount_SplitTaxType_4,
      _discountItemAry
    )
    var _guiAry_TaxType_4 = _organisedAry_TaxType_4.EGUI
    var _creditMemoAry_TaxType_4 = _organisedAry_TaxType_4.CREDITMEMO
    //折讓單總金額不含稅
    var _creditTotalAmount_TaxType_4 =
      _organisedAry_TaxType_4.CREDITMEMO_TOTAL_AMOUNT
    var _creditMemoAmountFlag_TaxType_4 = true
    if (_creditTotalAmount_TaxType_4 != 0) {
      var _taxType4 = '4'
      _creditMemoAmountFlag_TaxType_4 = checkCreditMemoAmount(
        _assignLogType,
        _applyMainObj.buyer_identifier,
        _applyMainObj.company_ban,
        _applyMainObj.dept_code,
        _applyMainObj.classification,
        _year_month,
        _allowanceDecutionPeriod,
        _deduction_egui_number,
        _applyMainObj.invoice_type,
        _taxType4,
        _creditTotalAmount_TaxType_4
      )
      if (_creditMemoAmountFlag_TaxType_4 == false)
        _creditmemo_error_message += '(特種稅率)發票可折金額不足,'
    }

    var _organisedAry_TaxType_9 = organisingDocument(
      _applyMainObj,
      _eDocument_TaxType_9_Ary,
      _discount_toatl_amount,
      _discount_amount_SplitTaxType_9,
      _discountItemAry
    )
    var _guiAry_TaxType_9 = _organisedAry_TaxType_9.EGUI
    var _creditMemoAry_TaxType_9 = _organisedAry_TaxType_9.CREDITMEMO
    //折讓單總金額不含稅
    var _creditTotalAmount_TaxType_9 =
      _organisedAry_TaxType_9.CREDITMEMO_TOTAL_AMOUNT
    var _creditMemoAmountFlag_TaxType_9 = true
    if (_creditTotalAmount_TaxType_9 != 0) {
      var _taxType9 = '9'
      _creditMemoAmountFlag_TaxType_9 = checkCreditMemoAmount(
        _assignLogType,
        _applyMainObj.buyer_identifier,
        _applyMainObj.company_ban,
        _applyMainObj.dept_code,
        _applyMainObj.classification,
        _year_month,
        _allowanceDecutionPeriod,
        _deduction_egui_number,
        _applyMainObj.invoice_type,
        _taxType9,
        _creditTotalAmount_TaxType_9
      )
      if (_creditMemoAmountFlag_TaxType_9 == false)
        _creditmemo_error_message += '(混合稅率)發票可折金額不足,'
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //計算發票筆數
    var _requireCount =
      _guiAry_TaxType_1.length +
      _guiAry_TaxType_2.length +
      _guiAry_TaxType_3.length +
      _guiAry_TaxType_4.length +
      _guiAry_TaxType_9.length

    //檢查字軌張數
    var _checkInvoiceCountFlag = true
    var _checkManualInvoiceNumberFlag = true
    var _checkManualInvoiceNumberRangeErrorFlag = true
    if (_requireCount > 0 && stringutility.trim(_manual_voucher_number) == '') {
      _checkInvoiceCountFlag = checkAssignLogUseCount(
        _applyMainObj.invoice_type,
        _applyMainObj.company_ban,
        _applyMainObj.dept_code,
        _applyMainObj.classification,
        _year_month,
        _requireCount
      )
    }

    var _check_length = 0 //紀錄開立張數總計
    if (
      _checkInvoiceCountFlag == false ||
      _creditmemo_error_message.length != 0
    ) {
      //刪除之前建立的List資料
      //alert('字軌數不足,請重新匯入!');
      var _title = '憑證管理'
      var _message = '憑證錯誤:'
      if (_checkInvoiceCountFlag == false) {
        _message += '字軌可開立張數不足,請重新匯入!'
      }
      if (_creditmemo_error_message.length != 0) {
        _message += _creditmemo_error_message
      }
      gwmessage.showErrorMessage(_title, _message)
    } else if (_checkManualInvoiceNumberFlag == false) {
      var _title = '憑證管理'
      var _message = '手開發票號碼格式或長度錯誤:'
      gwmessage.showErrorMessage(_title, _message)
    } else if (_checkManualInvoiceNumberRangeErrorFlag == false) {
      var _title = '憑證管理'
      var _message = '手開發票號碼重覆或使用區間錯誤:'
      gwmessage.showErrorMessage(_title, _message)
    } else {
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //處理要開發票的部分(999筆1包)-START
      var _applyId = saveVoucherApplyListRecord(
        _voucherOpenType,
        _assignLogType,
        _applyMainObj,
        _invoice_selected_listid,
        _creditmemo_selected_listid
      )

      var _eGuiCount = 0
      var _allowanceCount = 0
      if (_eDocument_TaxType_1_Ary.length != 0) {
        //1.開發票
        var _guiNumberAry = []
        var _allowanceNumberAry = []
        if (_guiAry_TaxType_1.length != 0) {
          //只開eGUI
          _guiNumberAry = _guiNumberAry.concat(
            createEGUIDocument(
              _voucherOpenType,
              _assignLogType,
              _year_month,
              _applyId,
              _egui_mig_type,
              _guiAry_TaxType_1,
              _manual_voucher_number,
              _voucher_date
            )
          )
        }
        //2.開折讓單
        if (_creditMemoAry_TaxType_1.length != 0) {
          //只開Allowance
          _allowanceNumberAry = _allowanceNumberAry.concat(
            createAllowanceDocument(
              _voucherOpenType,
              _assignLogType,
              _year_month,
              _applyId,
              _allowance_mig_type,
              _creditMemoAry_TaxType_1,
              _voucher_date,
              _deduction_egui_number
            )
          )
        }
        //更新筆數
        _eGuiCount += _guiNumberAry.length
        _allowanceCount += _allowanceNumberAry.length
      }
      if (_eDocument_TaxType_2_Ary.length != 0) {
        //開發票
        var _guiNumberAry = []
        var _allowanceNumberAry = []
        if (_guiAry_TaxType_2.length != 0) {
          //只開eGUI
          _guiNumberAry = _guiNumberAry.concat(
            createEGUIDocument(
              _voucherOpenType,
              _assignLogType,
              _year_month,
              _applyId,
              _egui_mig_type,
              _guiAry_TaxType_2,
              _manual_voucher_number,
              _voucher_date
            )
          )
        }
        //開折讓單TODO
        if (_creditMemoAry_TaxType_2.length != 0) {
          //只開Allowance
          _allowanceNumberAry = _allowanceNumberAry.concat(
            createAllowanceDocument(
              _voucherOpenType,
              _assignLogType,
              _year_month,
              _applyId,
              _allowance_mig_type,
              _creditMemoAry_TaxType_2,
              _voucher_date,
              _deduction_egui_number
            )
          )
        }
        //更新筆數
        _eGuiCount += _guiNumberAry.length
        _allowanceCount += _allowanceNumberAry.length
      }
      if (_eDocument_TaxType_3_Ary.length != 0) {
        //開發票
        var _guiNumberAry = []
        var _allowanceNumberAry = []
        if (_guiAry_TaxType_3.length != 0) {
          //只開eGUI
          _guiNumberAry = _guiNumberAry.concat(
            createEGUIDocument(
              _voucherOpenType,
              _assignLogType,
              _year_month,
              _applyId,
              _egui_mig_type,
              _guiAry_TaxType_3,
              _manual_voucher_number,
              _voucher_date
            )
          )
        }
        //開折讓單TODO
        if (_creditMemoAry_TaxType_3.length != 0) {
          //只開Allowance
          _allowanceNumberAry = _allowanceNumberAry.concat(
            createAllowanceDocument(
              _voucherOpenType,
              _assignLogType,
              _year_month,
              _applyId,
              _allowance_mig_type,
              _creditMemoAry_TaxType_3,
              _voucher_date,
              _deduction_egui_number
            )
          )
        }
        //更新筆數
        _eGuiCount += _guiNumberAry.length
        _allowanceCount += _allowanceNumberAry.length
      }
      if (_eDocument_TaxType_4_Ary.length != 0) {
        //開發票
        var _guiNumberAry = []
        var _allowanceNumberAry = []
        if (_guiAry_TaxType_4.length != 0) {
          //只開eGUI
          _guiNumberAry = _guiNumberAry.concat(
            createEGUIDocument(
              _voucherOpenType,
              _assignLogType,
              _year_month,
              _applyId,
              _egui_mig_type,
              _guiAry_TaxType_4,
              _manual_voucher_number,
              _voucher_date
            )
          )
        }
        //開折讓單TODO
        if (_creditMemoAry_TaxType_4.length != 0) {
          //只開Allowance
          _allowanceNumberAry = _allowanceNumberAry.concat(
            createAllowanceDocument(
              _voucherOpenType,
              _assignLogType,
              _year_month,
              _applyId,
              _allowance_mig_type,
              _creditMemoAry_TaxType_4,
              _voucher_date,
              _deduction_egui_number
            )
          )
        }
        //更新筆數
        _eGuiCount += _guiNumberAry.length
        _allowanceCount += _allowanceNumberAry.length
      }
      if (_eDocument_TaxType_9_Ary.length != 0) {
        //開發票
        var _guiNumberAry = []
        var _allowanceNumberAry = []
        if (_guiAry_TaxType_9.length != 0) {
          //只開eGUI
          _guiNumberAry = _guiNumberAry.concat(
            createEGUIDocument(
              _voucherOpenType,
              _assignLogType,
              _year_month,
              _applyId,
              _egui_mig_type,
              _guiAry_TaxType_9,
              _manual_voucher_number,
              _voucher_date
            )
          )
        }
        //開折讓單TODO
        if (_creditMemoAry_TaxType_9.length != 0) {
          //只開Allowance
          _allowanceNumberAry = _allowanceNumberAry.concat(
            createAllowanceDocument(
              _voucherOpenType,
              _assignLogType,
              _year_month,
              _applyId,
              _allowance_mig_type,
              _creditMemoAry_TaxType_9,
              _voucher_date,
              _deduction_egui_number
            )
          )
        }
        //更新筆數
        _eGuiCount += _guiNumberAry.length
        _allowanceCount += _allowanceNumberAry.length
      }
      //處理要開發票的部分(999筆1包)-END

      //更新開立張數
      updateVoucherApplyListRecord(_applyId, _eGuiCount, _allowanceCount)

      //更新流程紀錄 flow_status='1'
      if (_eGuiCount + _allowanceCount != 0)
        updateInvoiceAndCreditMemoFlowStatus(
          _invoice_hiddent_listid,
          _creditmemo_hiddent_listid
        )
      //做完更新資料-END

      var _title = '憑證管理'
      var _message = '開立完成!'
      log.debug(_title, _message)
      gwmessage.showInformationMessage(_title, _message)
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  }

  function updateVoucherApplyListRecord(applyID, guiCount, allowanceCount) {
    var _voucherApplyListRecord = record.load({
      type: _voucher_apply_list_record,
      id: parseInt(applyID),
      isDynamic: true,
    })

    _voucherApplyListRecord.setValue({
      fieldId: 'custrecord_gw_gui_created_count',
      value: guiCount,
    })
    _voucherApplyListRecord.setValue({
      fieldId: 'custrecord_gw_allowance_created_count',
      value: allowanceCount,
    })

    try {
      _voucherApplyListRecord.save()
    } catch (e) {
      console.log(e.name + ':' + e.message)
    }
  }

  function getInvoiceMigType(migType) {
    var _mig = ''
    if (migType === 'B2BS') {
      //B2B存證
      //_mig = 'A0401';
      _mig = 'C0401'
    } else if (migType === 'B2BE') {
      //B2B交換
      _mig = 'A0101'
    } else if (migType === 'B2C') {
      _mig = 'C0401'
    }
    return _mig
  }

  function getAllowanceMigType(migType) {
    var _mig = ''
    if (migType === 'B2BS') {
      //B2B存證
      //_mig = 'B0401';
      _mig = 'D0401'
    } else if (migType === 'B2BE') {
      //B2B交換
      _mig = 'B0101'
    } else if (migType === 'B2C') {
      _mig = 'D0401'
    }
    return _mig
  }

  function getApplyMainObject(year_month) {
    var _applyId = 0
    //2.取得頁面填寫資料(GUI或Allowance)
    var _company_ban = _current_record.getValue({
      fieldId: 'custpage_company_ban',
    })
    var _company_name = _current_record.getValue({
      fieldId: 'custpage_company_name',
    })
    var _company_address = _current_record.getValue({
      fieldId: 'custpage_company_address',
    })
    var _invoice_type = _current_record.getValue({
      fieldId: 'custpage_invoice_type',
    })
    var _print_type = _current_record.getValue({
      fieldId: 'custpage_print_type',
    })
    var _mig_type = _current_record.getValue({ fieldId: 'custpage_mig_type' })
    var _main_remark = _current_record.getValue({
      fieldId: 'custpage_main_remark',
    })
    var _customer_id = _current_record.getValue({
      fieldId: 'custpage_customer_id',
    })
    var _buyer_identifier = _current_record.getValue({
      fieldId: 'custpage_buyer_identifier',
    })
    var _buyer_name = _current_record.getValue({
      fieldId: 'custpage_buyer_name',
    })
    if (stringutility.trim(_buyer_name) == '') _buyer_name = _buyer_identifier
    var _buyer_email = _current_record.getValue({
      fieldId: 'custpage_buyer_email',
    })
    var _buyer_address = _current_record.getValue({
      fieldId: 'custpage_buyer_address',
    })
    var _carrier_type = _current_record.getValue({
      fieldId: 'custpage_carrier_type',
    })
    var _carrier_id = _current_record.getValue({
      fieldId: 'custpage_carrier_id',
    })
    var _npo_ban = _current_record.getValue({ fieldId: 'custpage_npo_ban' })
    var _customs_clearance_mark = _current_record.getValue({
      fieldId: 'custpage_customs_clearance_mark',
    })
    var _dept_code = _current_record.getValue({ fieldId: 'custpage_dept_code' })
    var _classification = _current_record.getValue({
      fieldId: 'custpage_classification',
    })
    var _tax_type = _current_record.getValue({ fieldId: 'custpage_tax_type' })
    var _tax_rate = _current_record.getValue({ fieldId: 'custpage_tax_rate' })
    var _discountamount = _current_record.getValue({
      fieldId: 'custpage_sales_discount_amount',
    })
    var _tax_amount = _current_record.getValue({
      fieldId: 'custpage_tax_amount',
    })
    var _sales_amount = _current_record.getValue({
      fieldId: 'custpage_sales_amount',
    })
    var _total_amount = _current_record.getValue({
      fieldId: 'custpage_total_amount',
    })
    var _gui_yearmonth_type = _current_record.getValue({
      fieldId: 'custpage_allowance_deduction_period',
    })
    var _voucher_extra_memo = _current_record.getValue({
      fieldId: 'custpage_voucher_extra_memo',
    })

    if (stringutility.trim(_tax_type) != '2') {
      _customs_clearance_mark = '' //零稅才必填
    }

    //手開發票號碼
    var _manual_voucher_number = _current_record.getValue({
      fieldId: 'custpage_manual_voucher_number',
    })

    var _format_code = _invoceFormatCode //35
    //手開發票格式代號 31-01
    var _egui_format_code = _current_record.getValue({
      fieldId: 'custpage_egui_format_code',
    })
    if (stringutility.trim(_manual_voucher_number) != '') {
      var _format_code_ary = _egui_format_code.split('-')
      _format_code = _format_code_ary[0]
      _invoice_type = _format_code_ary[1]
    }

    //this_period:當期, early_period:前期
    var _applyMainObj = {
      applyID: _applyId.toString(),
      company_ban: _company_ban,
      company_name: _company_name,
      company_address: _company_address,
      invoice_type: _invoice_type,
      print_type: _print_type,
      mig_type: _mig_type,
      main_remark: _main_remark,
      customer_id: _customer_id,
      buyer_identifier: _buyer_identifier,
      buyer_name: _buyer_name,
      buyer_email: _buyer_email,
      buyer_address: _buyer_address,
      carrier_type: _carrier_type,
      carrier_id: _carrier_id,
      npo_ban: _npo_ban,
      customs_clearance_mark: _customs_clearance_mark,
      gui_yearmonth_type: _gui_yearmonth_type,
      dept_code: _dept_code,
      classification: _classification,
      extraMemo: _voucher_extra_memo,
      year_month: year_month,
      tax_type: _tax_type,
      tax_rate: _tax_rate,
      discountamount: _discountamount,
      tax_amount: _tax_amount,
      sales_amount: 0,
      free_sales_amount: 0,
      zero_sales_amount: 0,
      total_amount: _total_amount,
      egui_format_code: _format_code,
      voucher_open_type: 'SINGLE', //先設 default value
    }

    return _applyMainObj
  }

  function saveVoucherApplyListRecord(
    openType,
    assignLogType,
    applyMainObj,
    invoice_hiddent_listid,
    creditmemo_hiddent_listid
  ) {
    var _applyId = 0
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //this_period:當期, early_period:前期
    var _voucher_apply_atatus = 'P'
    var _closed_voucher = 'N'

    var _voucherApplyRecord = record.create({
      type: _voucher_apply_list_record,
      isDynamic: true,
    })

    _voucherApplyRecord.setValue({ fieldId: 'name', value: 'VoucherApply' })
    _voucherApplyRecord.setValue({
      fieldId: 'custrecord_gw_voucher_apply_type',
      value: 'APPLY',
    }) //APPLY (開立) / VOID (作廢)
    _voucherApplyRecord.setValue({
      fieldId: 'custrecord_gw_voucher_open_type',
      value: openType,
    })
    _voucherApplyRecord.setValue({
      fieldId: 'custrecord_gw_voucher_apply_date',
      value: dateutility.getNetSuiteLocalDate(),
    })
    _voucherApplyRecord.setValue({
      fieldId: 'custrecord_gw_voucher_apply_time',
      value: dateutility.getCompanyLocatTime(),
    })
    _voucherApplyRecord.setValue({
      fieldId: 'custrecord_gw_voucher_apply_yearmonth',
      value: applyMainObj.year_month,
    })
    _voucherApplyRecord.setValue({
      fieldId: 'custrecord_gw_voucher_apply_seller',
      value: applyMainObj.company_ban,
    })
    _voucherApplyRecord.setValue({
      fieldId: 'custrecord_gw_voucher_apply_seller_name',
      value: applyMainObj.company_name,
    })
    _voucherApplyRecord.setValue({
      fieldId: 'custrecord_gw_voucher_apply_buyer',
      value: applyMainObj.buyer_identifier,
    })
    _voucherApplyRecord.setValue({
      fieldId: 'custrecord_gw_voucher_apply_buyer_name',
      value: applyMainObj.buyer_name,
    })
    _voucherApplyRecord.setValue({
      fieldId: 'custrecord_gw_voucher_apply_dept_code',
      value: applyMainObj.dept_code,
    })
    _voucherApplyRecord.setValue({
      fieldId: 'custrecord_gw_voucher_apply_dept_name',
      value: applyMainObj.dept_code,
    })
    _voucherApplyRecord.setValue({
      fieldId: 'custrecord_gw_voucher_apply_class',
      value: applyMainObj.classification,
    })
    _voucherApplyRecord.setValue({
      fieldId: 'custrecord_gw_voucher_apply_invoice_type',
      value: applyMainObj.invoice_type,
    })
    _voucherApplyRecord.setValue({
      fieldId: 'custrecord_gw_voucher_apply_mig_type',
      value: applyMainObj.mig_type,
    })
    _voucherApplyRecord.setValue({
      fieldId: 'custrecord_gw_gui_yearmonth_type',
      value: applyMainObj.gui_yearmonth_type,
    })
    _voucherApplyRecord.setValue({
      fieldId: 'custrecord_gw_voucher_apply_status',
      value: _voucher_apply_atatus,
    })

    //作廢時使用
    //_voucherApplyRecord.setValue({fieldId:'custrecord_gw_voucher_void_comment',value:dateutility.getCompanyLocatDate()});
    //_voucherApplyRecord.setValue({fieldId:'custrecord_gw_voucher_approve_comment',value:dateutility.getCompanyLocatTime()});
    //_voucherApplyRecord.setValue({fieldId:'custrecord_gw_voucher_flow_status',value:_yearMonth});
    //_voucherApplyRecord.setValue({fieldId:'custrecord_gw_source_apply_internal_id',value:_yearMonth});

    _voucherApplyRecord.setValue({
      fieldId: 'custrecord_gw_closed_voucher',
      value: _closed_voucher,
    })
    _voucherApplyRecord.setValue({
      fieldId: 'custrecord_gw_voucher_discountamount',
      value: applyMainObj.discountamount,
    })
    _voucherApplyRecord.setValue({
      fieldId: 'custrecord_gw_voucher_apply_sales_amount',
      value: applyMainObj.sales_amount,
    })
    _voucherApplyRecord.setValue({
      fieldId: 'custrecord_gw_voucher_apply_tax_amount',
      value: applyMainObj.tax_amount,
    })
    _voucherApplyRecord.setValue({
      fieldId: 'custrecord_gw_voucher_apply_tax_type',
      value: applyMainObj.tax_type,
    })
    _voucherApplyRecord.setValue({
      fieldId: 'custrecord_gw_voucher_apply_tax_rate',
      value: applyMainObj.tax_rate,
    })
    _voucherApplyRecord.setValue({
      fieldId: 'custrecord_gw_voucher_apply_total_amount',
      value: applyMainObj.total_amount,
    })
    _voucherApplyRecord.setValue({
      fieldId: 'custrecord_gw_invoice_apply_list',
      value: invoice_hiddent_listid,
    })
    _voucherApplyRecord.setValue({
      fieldId: 'custrecord_gw_creditmemo_apply_list',
      value: creditmemo_hiddent_listid,
    })
    if (assignLogType === _defaultAssignLogType) {
      _voucherApplyRecord.setValue({
        fieldId: 'custrecord_gw_need_upload_mig',
        value: 'Y',
      })
    } else {
      _voucherApplyRecord.setValue({
        fieldId: 'custrecord_gw_need_upload_mig',
        value: 'N',
      })
    }

    try {
      _applyId = _voucherApplyRecord.save()
      applyMainObj.applyID = _applyId
    } catch (e) {
      console.log(e.name + ':' + e.message)
    }

    return _applyId
  }

  //整理資料每999筆1包
  /**
   * eGuiMainObj         : 表頭資料
   * itemAry             : Item 資料
   * discountTotalAmount : 折讓總金額
   * discountAmount      : 分稅別折讓金額
   */
  function organisingDocument(
    eGuiMainObj,
    itemAry,
    discountTotalAmount,
    discountAmount,
    discountItems
  ) {
    //取得發票號碼
    var _voucher_type = 'EGUI'
    var _ns_document_type = 'INVOICE'

    var _salesAmountSum = 0
    var _freeSalesAmountSum = 0
    var _zeroSalesAmountSum = 0
    var _taxAmountSum = 0
    var _totalAmountSum = 0
    var _creditMemoTotalAmountSum = 0

    var _guiAry = []
    var _creditMemoAry = []

    var _itemDetails = []
    //1.先處理Discount項目
    if (discountItems.length != 0) {
      for (var i = 0; i < discountItems.length; i++) {
        var _discountObj = discountItems[i]

        var _discountitem = _discountObj.discountitem
        var _discountitemname = _discountObj.discountitemname
        var _discounttotal = _discountObj.discounttotal
        if (discountAmount != 0) {
          _discounttotal = (
            (stringutility.convertToFloat(discountAmount) *
              stringutility.convertToFloat(_discounttotal)) /
            stringutility.convertToFloat(discountTotalAmount)
          ).toFixed(_numericToFixed)
        }

        if (typeof itemAry !== 'undefined' && itemAry.length != 0) {
          var _obj = itemAry[0] //取一筆當代表
          var _itemDiscountObj = JSON.parse(JSON.stringify(_obj))

          //_itemDiscountObj.invoice_seq   = _discountObj.invoice_id+'_'+i;
          _itemDiscountObj.invoice_seq = '9999_' + i
          _itemDiscountObj.item_name = _discountitemname
          _itemDiscountObj.item_quantity = '1'
          _itemDiscountObj.unit_price = _discounttotal
          _itemDiscountObj.item_amount = _discounttotal
          _itemDiscountObj.item_remark = _discountitem

          itemAry.push(_itemDiscountObj)
        }
      }
    }

    //2.處理資料=>每999筆開一張發票或折讓單
    var _positive = false
    var _negative = false
    if (typeof itemAry !== 'undefined') {
      for (var i = 0; i < itemAry.length; i++) {
        var _obj = itemAry[i]

        _itemDetails.push(_obj)

        if (stringutility.convertToFloat(_obj.item_amount) >= 0) {
          _positive = true
        } else {
          _negative = true
        }

        if (
          stringutility.convertToInt(_obj.tax_code) ==
          stringutility.convertToInt(_withTaxID)
        ) {
          //witn tax
          _salesAmountSum += stringutility.convertToFloat(_obj.item_amount)
        } else if (
          stringutility.convertToInt(_obj.tax_code) ==
          stringutility.convertToInt(_zeroTaxID)
        ) {
          //zero
          _zeroSalesAmountSum += stringutility.convertToFloat(_obj.item_amount)
        } else if (
          stringutility.convertToInt(_obj.tax_code) ==
          stringutility.convertToInt(_freeTaxID)
        ) {
          //free
          _freeSalesAmountSum += stringutility.convertToFloat(_obj.item_amount)
        } else {
          _salesAmountSum += stringutility.convertToFloat(_obj.item_amount)
        }

        _taxAmountSum +=
          (stringutility.convertToFloat(_obj.item_amount) *
            stringutility.convertToFloat(_obj.tax_rate)) /
          100
        _totalAmountSum =
          _salesAmountSum +
          _zeroSalesAmountSum +
          _freeSalesAmountSum +
          _taxAmountSum

        if (i == itemAry.length - 1 || _itemDetails.length == 999) {
          //每999筆開一張發票
          var _main = JSON.parse(JSON.stringify(eGuiMainObj))
          var _details = JSON.parse(JSON.stringify(_itemDetails))

          _main.tax_type = _obj.tax_type
          _main.dept_code = _obj.deptcode
          _main.classification = _obj.classification
          _main.tax_rate = _obj.tax_rate
          _main.zero_sales_amount = _zeroSalesAmountSum.toFixed(_numericToFixed)
          _main.free_sales_amount = _freeSalesAmountSum.toFixed(_numericToFixed)
          _main.sales_amount = _salesAmountSum.toFixed(_numericToFixed)
          _main.tax_amount = _taxAmountSum.toFixed(_numericToFixed)
          _main.total_amount = _totalAmountSum.toFixed(_numericToFixed)

          if (_positive == true && _negative == true) {
            _main.voucher_open_type = 'MIX'
          } else if (_positive == true && _negative == false) {
            _main.voucher_open_type = 'SINGLE'
          } else if (_positive == false && _negative == true) {
            _main.voucher_open_type = 'SINGLE'
          }

          var _itemAry = {
            main: _main,
            details: _details,
          }
          if (_totalAmountSum > 0) {
            //開發票
            _guiAry.push(_itemAry)
          } else if (_totalAmountSum < 0) {
            //開折讓單
            _creditMemoAry.push(_itemAry)
            //紀錄累積折讓金額(未稅)
            _creditMemoTotalAmountSum +=
              _salesAmountSum + _zeroSalesAmountSum + _freeSalesAmountSum
          } else {
            alert('金額為0無須開立!')
          }

          _itemDetails.length = 0 // remove all item
          _salesAmountSum = 0
          _zeroSalesAmountSum = 0
          _freeSalesAmountSum = 0
          _taxAmountSum = 0
          _totalAmountSum = 0
          _positive = false
          _negative = false
        }
      }
    }

    var _resultObj = {
      CREDITMEMO_TOTAL_AMOUNT: _creditMemoTotalAmountSum,
      EGUI: _guiAry,
      CREDITMEMO: _creditMemoAry,
    }
    //alert('OrganisingDocument='+JSON.stringify(_resultObj));

    return _resultObj
  }

  //開立發票
  /**
   * applyId     : 申請單號
   * mig_type    : MigType A0401..
   * taxCode     : 稅別
   * eGuiMainObj : 表頭資料
   * itemAry     : Item 資料
   */
  function createEGUIDocument(
    openType,
    assignLogType,
    year_month,
    applyId,
    mig_type,
    documentAry,
    manual_voucher_number,
    voucher_date
  ) {
    //取得發票號碼 TODO
    var _guiNumberAry = []
    var _mainRecordId = 0
    var _voucher_type = 'EGUI'

    var _row = 0
    var _groupID = 0
    var _status = 'VOUCHER_SUCCESS' //2:開立成功, 3:作廢成功
    //var _upload_status='P'; //A->P->C,E

    //var _documentDate      = dateutility.getCompanyLocatDate();
    var _documentDate = voucher_date
    var _documentTime = dateutility.getCompanyLocatTime()

    var _salesAmountSum = 0
    var _taxAmountSum = 0
    var _totalAmountSum = 0

    if (typeof documentAry !== 'undefined') {
      for (var i = 0; i < documentAry.length; i++) {
        var _documentObj = documentAry[i]
        var _main = _documentObj.main
        var _details = _documentObj.details

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //取得發票號碼 TODO
        //統編[24549210]+部門代碼[2]+期數[10908]
        var _invoiceNumber = ''
        if (stringutility.trim(manual_voucher_number) != '') {
          _invoiceNumber = manual_voucher_number
        } else {
          _invoiceNumber = invoiceutility.getAssignLogNumber(
            _main.invoice_type,
            _main.company_ban,
            _main.dept_code,
            _main.classification,
            year_month,
            assignLogType
          )
        }

        if (_invoiceNumber.length == 0) {
          var _title = '字軌管理'
          var _message = '無本期(' + year_month + ')字軌請匯入!'
          gwmessage.showErrorMessage(_title, _message)

          break
        } else {
          _guiNumberAry.push(_invoiceNumber)
          ////////////////////////////////////////////////////////////////////////////////////////////////////////////
          var _voucherMainRecord = record.create({
            type: _voucher_main_record,
            isDynamic: true,
          })

          _voucherMainRecord.setValue({
            fieldId: 'name',
            value: 'VoucherMainRecord',
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_apply_internal_id',
            value: applyId.toString(),
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_voucher_type',
            value: _voucher_type,
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_voucher_number',
            value: _invoiceNumber,
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_voucher_date',
            value: _documentDate,
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_voucher_time',
            value: _documentTime,
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_voucher_yearmonth',
            value: year_month,
          })

          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_seller',
            value: _main.company_ban,
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_seller_name',
            value: _main.company_name,
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_seller_address',
            value: stringutility.trim(_main.company_address),
          })

          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_buyer',
            value: _main.buyer_identifier,
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_buyer_name',
            value: _main.buyer_name,
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_buyer_address',
            value: stringutility.trim(_main.buyer_address),
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_buyer_email',
            value: stringutility.trim(_main.buyer_email),
          })
          //_voucherMainRecord.setValue({fieldId:'custrecord_gw_buyer_dept_code',value:_main.dept_code});	//暫時不用
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_voucher_dept_code',
            value: stringutility.trim(_main.dept_code),
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_voucher_dept_name',
            value: stringutility.trim(_main.dept_code),
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_voucher_classification',
            value: stringutility.trim(_main.classification),
          })

          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_invoice_type',
            value: stringutility.trim(_main.invoice_type),
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_mig_type',
            value: stringutility.trim(_main.mig_type),
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_voucher_format_code',
            value: stringutility.trim(_main.egui_format_code),
          })

          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_carrier_type',
            value: stringutility.trim(_main.carrier_type),
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_carrierid1',
            value: stringutility.trim(_main.carrier_id),
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_carrierid2',
            value: stringutility.trim(_main.carrier_id),
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_npoban',
            value: stringutility.trim(_main.npo_ban),
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_clearance_mark',
            value: stringutility.trim(_main.customs_clearance_mark),
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_main_remark',
            value: stringutility.trim(_main.main_remark),
          })

          var _print_mark = 'N'
          if (mig_type == 'C0401' || mig_type == 'B2C') {
            //TODO 要產生隨機碼
            _print_mark = 'Y'
            var _random_number = Math.round(
              invoiceutility.getRandomNum(1000, 9999)
            )
            _voucherMainRecord.setValue({
              fieldId: 'custrecord_gw_random_number',
              value: _random_number,
            })
          }
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_print_mark',
            value: _print_mark,
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_is_printed',
            value: 'N',
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_lock_transaction',
            value: true,
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_discount_amount',
            value: 0,
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_discount_count',
            value: '0',
          })
          //_voucherMainRecord.setValue({fieldId:'custrecord_gw_voucher_owner',value:'1'}); //折讓單專用欄位(1:買方, 2賣方)
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_voucher_status',
            value: _status,
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_voucher_upload_status',
            value: _default_upload_status,
          })

          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_sales_amount',
            value: stringutility.convertToFloat(_main.sales_amount),
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_free_sales_amount',
            value: stringutility.convertToFloat(_main.free_sales_amount),
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_zero_sales_amount',
            value: stringutility.convertToFloat(_main.zero_sales_amount),
          })

          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_tax_amount',
            value: _main.tax_amount,
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_tax_type',
            value: _main.tax_type,
          })
          var _main_tax_rate =
            stringutility.convertToFloat(_main.tax_rate) / 100
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_tax_rate',
            value: _main_tax_rate,
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_total_amount',
            value: _main.total_amount,
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_voucher_extra_memo',
            value: _main.extraMemo,
          })

          if (assignLogType === _defaultAssignLogType) {
            _voucherMainRecord.setValue({
              fieldId: 'custrecord_gw_need_upload_egui_mig',
              value: 'Y',
            })
          } else {
            _voucherMainRecord.setValue({
              fieldId: 'custrecord_gw_need_upload_egui_mig',
              value: 'N',
            })
          }

          try {
            _mainRecordId = _voucherMainRecord.save()
          } catch (e) {
            console.log(e.name + ':' + e.message)
          }

          if (typeof _details !== 'undefined') {
            for (var j = 0; j < _details.length; j++) {
              var _obj = _details[j]

              var _voucherDetailRecord = record.create({
                type: _voucher_details_record,
                isDynamic: true,
              })
              _voucherDetailRecord.setValue({
                fieldId: 'name',
                value: 'VoucherDetailRecord',
              })
              _voucherDetailRecord.setValue({
                fieldId: 'custrecord_gw_dtl_apply_internal_id',
                value: applyId.toString(),
              })
              _voucherDetailRecord.setValue({
                fieldId: 'custrecord_gw_voucher_main_internal_id',
                value: _mainRecordId.toString(),
              })
              _voucherDetailRecord.setValue({
                fieldId: 'custrecord_gw_dtl_voucher_type',
                value: _voucher_type,
              })

              _voucherDetailRecord.setValue({
                fieldId: 'custrecord_gw_item_description',
                value: stringutility.trim(_obj.item_name),
              })

              _voucherDetailRecord.setValue({
                fieldId: 'custrecord_gw_unit_price',
                value: stringutility.trim(_obj.unit_price),
              })

              _voucherDetailRecord.setValue({
                fieldId: 'custrecord_gw_item_unit',
                value: stringutility.trim(_obj.item_unit),
              })
              _voucherDetailRecord.setValue({
                fieldId: 'custrecord_gw_item_quantity',
                value: stringutility.trim(_obj.item_quantity),
              })

              _voucherDetailRecord.setValue({
                fieldId: 'custrecord_gw_item_amount',
                value: stringutility.trim(_obj.item_amount),
              })

              _voucherDetailRecord.setValue({
                fieldId: 'custrecord_gw_dtl_item_tax_code',
                value: stringutility.trim(_obj.tax_code),
              })
              _voucherDetailRecord.setValue({
                fieldId: 'custrecord_gw_dtl_item_tax_rate',
                value: stringutility.trim(_obj.tax_rate),
              })

              _row++
              _voucherDetailRecord.setValue({
                fieldId: 'custrecord_gw_item_seq',
                value: _row.toString(),
              })
              _voucherDetailRecord.setValue({
                fieldId: 'custrecord_gw_item_remark',
                value: stringutility.trim(_obj.item_remark),
              })

              _voucherDetailRecord.setValue({
                fieldId: 'custrecord_gw_dtl_voucher_number',
                value: _invoiceNumber,
              })
              _voucherDetailRecord.setValue({
                fieldId: 'custrecord_gw_dtl_voucher_date',
                value: _documentDate,
              })
              _voucherDetailRecord.setValue({
                fieldId: 'custrecord_gw_dtl_voucher_time',
                value: _documentTime,
              })
              _voucherDetailRecord.setValue({
                fieldId: 'custrecord_gw_dtl_voucher_yearmonth',
                value: year_month,
              })

              _voucherDetailRecord.setValue({
                fieldId: 'custrecord_gw_dtl_voucher_status',
                value: _status,
              })
              _voucherDetailRecord.setValue({
                fieldId: 'custrecord_gw_dtl_voucher_upload_status',
                value: _default_upload_status,
              })
              _voucherDetailRecord.setValue({
                fieldId: 'custrecord_gw_ns_document_type',
                value: _obj.document_type,
              })

              _voucherDetailRecord.setValue({
                fieldId: 'custrecord_gw_ns_document_apply_id',
                value: _obj.invoice_id,
              })
              _voucherDetailRecord.setValue({
                fieldId: 'custrecord_gw_ns_document_number',
                value: _obj.invoice_number,
              })
              _voucherDetailRecord.setValue({
                fieldId: 'custrecord_gw_ns_document_item_id',
                value: _obj.invoice_seq,
              })
              _voucherDetailRecord.setValue({
                fieldId: 'custrecord_gw_ns_document_items_seq',
                value: _obj.invoice_seq,
              })
              _voucherDetailRecord.setValue({
                fieldId: 'custrecord_gw_ns_item_discount_amount',
                value: '0',
              })
              _voucherDetailRecord.setValue({
                fieldId: 'custrecord_gw_ns_item_discount_count',
                value: '0',
              })

              try {
                var callId = _voucherDetailRecord.save()
              } catch (e) {
                console.log(e.name + ':' + e.message)
              }
            }

            try {
              var values = {}
              values['custrecord_gw_is_completed_detail'] = true
              var _id = record.submitFields({
                type: _voucher_main_record,
                id: _mainRecordId,
                values: values,
                options: {
                  enableSourcing: false,
                  ignoreMandatoryFields: true,
                },
              })
            } catch (e) {
              console.log(e.name + ':' + e.message)
            }
          }
          //End Details
        }
      }
    }
    return _guiNumberAry
  }

  //開立折讓單
  /**
   * voucherOpenType : 開立方式[MERGE, ]
   * applyId         : 申請單號
   * mig_type        : MigType A0401..
   * taxCode         : 稅別
   * eGuiMainObj     : 表頭資料
   * itemAry         : Item 資料
   */
  function createAllowanceDocument(
    voucherOpenType,
    assignLogType,
    year_month,
    applyId,
    mig_type,
    documentAry,
    voucher_date,
    deduction_egui_number
  ) {
    //取得發票號碼 TODO
    var _allowanceNumberAry = []
    var _mainRecordId = 0
    var _voucher_type = 'ALLOWANCE'

    var _row = 0
    var _groupID = 0
    var _status = 'VOUCHER_SUCCESS' //2:開立成功, 3:作廢成功

    //var _documentDate      = dateutility.getCompanyLocatDate();
    var _documentDate = voucher_date
    var _documentTime = dateutility.getCompanyLocatTime()

    var _salesAmountSum = 0
    var _taxAmountSum = 0
    var _totalAmountSum = 0
    var _net_value = -1

    if (typeof documentAry !== 'undefined') {
      for (var i = 0; i < documentAry.length; i++) {
        var _documentObj = documentAry[i]
        var _main = _documentObj.main
        var _details = _documentObj.details //999筆1包
        //alert('_main='+JSON.stringify(_main));
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //統編[24549210]+部門代碼[2]+期數[10908]
        var _deductionAmount = Math.abs(
          stringutility.convertToFloat(_main.sales_amount) +
            stringutility.convertToFloat(_main.zero_sales_amount) +
            stringutility.convertToFloat(_main.free_sales_amount)
        ) //要放正值進入扣抵
        //alert('_deductionAmount='+_deductionAmount);
        var _eGUIItems = geteGUIDeductionItems(
          assignLogType,
          _main.buyer_identifier,
          _main.company_ban,
          _main.dept_code,
          _main.classification,
          _main.year_month,
          _main.gui_yearmonth_type,
          deduction_egui_number,
          _main.invoice_type,
          _main.tax_type,
          _deductionAmount
        )
        var checkResult = _eGUIItems.checkResult

        if (_eGUIItems.checkResult == false) {
          var _title = '字軌管理'
          var _message = '折讓單可扣抵發票金額不足!'
          gwmessage.showErrorMessage(_title, _message)

          break
        } else {
          //1.取得折讓單號
          var _today = dateutility.getCompanyLocatDate()
          var _allowanceNumber = invoiceutility.getAllowanceNumber(_today)
          _allowanceNumberAry.push(_allowanceNumber)

          ////////////////////////////////////////////////////////////////////////////////////////////////////////////
          var _voucherMainRecord = record.create({
            type: _voucher_main_record,
            isDynamic: true,
          })

          _voucherMainRecord.setValue({
            fieldId: 'name',
            value: 'VoucherMainRecord',
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_apply_internal_id',
            value: applyId.toString(),
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_voucher_type',
            value: _voucher_type,
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_voucher_number',
            value: _allowanceNumber,
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_voucher_date',
            value: _documentDate,
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_voucher_time',
            value: _documentTime,
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_voucher_yearmonth',
            value: year_month,
          })

          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_seller',
            value: _main.company_ban,
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_seller_name',
            value: _main.company_name,
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_seller_address',
            value: stringutility.trim(_main.company_address),
          })

          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_buyer',
            value: _main.buyer_identifier,
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_buyer_name',
            value: _main.buyer_name,
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_buyer_address',
            value: stringutility.trim(_main.buyer_address),
          })
          //_voucherMainRecord.setValue({fieldId:'custrecord_gw_buyer_dept_code',value:_main.dept_code});	//暫時不用
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_voucher_dept_code',
            value: stringutility.trim(_main.dept_code),
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_voucher_dept_name',
            value: stringutility.trim(_main.dept_code),
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_voucher_classification',
            value: stringutility.trim(_main.classification),
          })

          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_invoice_type',
            value: stringutility.trim(_main.invoice_type),
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_mig_type',
            value: stringutility.trim(_main.mig_type),
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_voucher_format_code',
            value: stringutility.trim(_creditMemoFormatCode),
          })

          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_carrier_type',
            value: stringutility.trim(_main.carrier_type),
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_carrierid1',
            value: stringutility.trim(_main.carrier_id),
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_carrierid2',
            value: stringutility.trim(_main.carrier_id),
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_npoban',
            value: stringutility.trim(_main.npo_ban),
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_clearance_mark',
            value: stringutility.trim(_main.customs_clearance_mark),
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_main_remark',
            value: stringutility.trim(_main.main_remark),
          })

          if (mig_type == 'C0401') {
            //TODO 要產生隨機碼
            var _random_number = Math.round(
              invoiceutility.getRandomNum(1000, 9999)
            )
            _voucherMainRecord.setValue({
              fieldId: 'custrecord_gw_random_number',
              value: _random_number,
            })
          }
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_is_printed',
            value: 'N',
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_lock_transaction',
            value: true,
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_discount_amount',
            value: 0,
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_discount_count',
            value: '0',
          })
          //_voucherMainRecord.setValue({fieldId:'custrecord_gw_voucher_owner',value:'1'}); //折讓單專用欄位(1:買方, 2賣方)
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_voucher_status',
            value: _status,
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_voucher_upload_status',
            value: _default_upload_status,
          })

          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_sales_amount',
            value:
              _net_value * stringutility.convertToFloat(_main.sales_amount),
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_free_sales_amount',
            value:
              _net_value *
              stringutility.convertToFloat(_main.free_sales_amount),
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_zero_sales_amount',
            value:
              _net_value *
              stringutility.convertToFloat(_main.zero_sales_amount),
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_tax_amount',
            value: _net_value * stringutility.convertToFloat(_main.tax_amount),
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_tax_type',
            value: _main.tax_type,
          })
          var _main_tax_rate =
            stringutility.convertToFloat(_main.tax_rate) / 100
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_tax_rate',
            value: _main_tax_rate,
          })
          _voucherMainRecord.setValue({
            fieldId: 'custrecord_gw_total_amount',
            value:
              _net_value * stringutility.convertToFloat(_main.total_amount),
          })

          if (assignLogType === _defaultAssignLogType) {
            _voucherMainRecord.setValue({
              fieldId: 'custrecord_gw_need_upload_egui_mig',
              value: 'Y',
            })
          } else {
            _voucherMainRecord.setValue({
              fieldId: 'custrecord_gw_need_upload_egui_mig',
              value: 'N',
            })
          }

          try {
            _mainRecordId = _voucherMainRecord.save()
          } catch (e) {
            console.log(e.name + ':' + e.message)
          }
          //處理detail 分發票開立 [MIX or SINGLE]
          var _item_voucher_open_type = _main.voucher_open_type

          if (_item_voucher_open_type === 'SINGLE') {
            //各自開立
            var _eGUIDetails = _eGUIItems.eGUIResult
            if (typeof _details !== 'undefined') {
              for (var j = 0; j < _details.length; j++) {
                var _obj = _details[j]

                var _deductionAmount = stringutility.convertToFloat(
                  _obj.item_amount
                )

                //取得折讓扣抵發票清單
                var _deductionItems = getDeductionInvoiceInformation(
                  _deductionAmount,
                  _eGUIDetails
                )
                //alert('取得折讓扣抵發票清單='+JSON.stringify(_deductionItems));
                if (typeof _deductionItems !== 'undefined') {
                  for (var x = 0; x < _deductionItems.length; x++) {
                    var _voucherObj = _deductionItems[x]

                    var _voucherDetailRecord = record.create({
                      type: _voucher_details_record,
                      isDynamic: true,
                    })

                    _voucherDetailRecord.setValue({
                      fieldId: 'name',
                      value: 'VoucherDetailRecord',
                    })
                    _voucherDetailRecord.setValue({
                      fieldId: 'custrecord_gw_dtl_apply_internal_id',
                      value: applyId.toString(),
                    })
                    _voucherDetailRecord.setValue({
                      fieldId: 'custrecord_gw_voucher_main_internal_id',
                      value: _mainRecordId.toString(),
                    })
                    _voucherDetailRecord.setValue({
                      fieldId: 'custrecord_gw_dtl_voucher_type',
                      value: _voucher_type,
                    })
                    _voucherDetailRecord.setValue({
                      fieldId: 'custrecord_gw_item_description',
                      value: stringutility.trim(_obj.item_name),
                    })
                    _voucherDetailRecord.setValue({
                      fieldId: 'custrecord_gw_unit_price',
                      value: stringutility.trim(_obj.unit_price),
                    })
                    _voucherDetailRecord.setValue({
                      fieldId: 'custrecord_gw_item_quantity',
                      value:
                        _net_value *
                        stringutility.convertToFloat(_obj.item_quantity),
                    })

                    _voucherDetailRecord.setValue({
                      fieldId: 'custrecord_gw_original_gui_internal_id',
                      value: _voucherObj.internalid,
                    })
                    _voucherDetailRecord.setValue({
                      fieldId: 'custrecord_gw_original_gui_number',
                      value: _voucherObj.voucher_number,
                    })
                    _voucherDetailRecord.setValue({
                      fieldId: 'custrecord_gw_original_gui_date',
                      value: _voucherObj.voucher_date,
                    })
                    _voucherDetailRecord.setValue({
                      fieldId: 'custrecord_gw_original_gui_yearmonth',
                      value: _voucherObj.voucher_yearmonth,
                    })

                    _voucherDetailRecord.setValue({
                      fieldId: 'custrecord_gw_item_amount',
                      value:
                        _net_value *
                        stringutility.convertToFloat(_obj.item_amount),
                    })
                    _voucherDetailRecord.setValue({
                      fieldId: 'custrecord_gw_dtl_item_tax_code',
                      value: stringutility.trim(_obj.tax_code),
                    })
                    _voucherDetailRecord.setValue({
                      fieldId: 'custrecord_gw_dtl_item_tax_rate',
                      value: stringutility.trim(_obj.tax_rate),
                    })

                    _row++
                    _voucherDetailRecord.setValue({
                      fieldId: 'custrecord_gw_item_seq',
                      value: _row.toString(),
                    })
                    _voucherDetailRecord.setValue({
                      fieldId: 'custrecord_gw_item_remark',
                      value: stringutility.trim(_obj.item_remark),
                    })
                    _voucherDetailRecord.setValue({
                      fieldId: 'custrecord_gw_dtl_voucher_number',
                      value: _allowanceNumber,
                    })
                    _voucherDetailRecord.setValue({
                      fieldId: 'custrecord_gw_dtl_voucher_date',
                      value: _documentDate,
                    })
                    _voucherDetailRecord.setValue({
                      fieldId: 'custrecord_gw_dtl_voucher_time',
                      value: _documentTime,
                    })
                    _voucherDetailRecord.setValue({
                      fieldId: 'custrecord_gw_dtl_voucher_yearmonth',
                      value: year_month,
                    })
                    _voucherDetailRecord.setValue({
                      fieldId: 'custrecord_gw_dtl_voucher_status',
                      value: _status,
                    })
                    _voucherDetailRecord.setValue({
                      fieldId: 'custrecord_gw_dtl_voucher_upload_status',
                      value: _default_upload_status,
                    })

                    _voucherDetailRecord.setValue({
                      fieldId: 'custrecord_gw_ns_document_type',
                      value: _obj.document_type,
                    })
                    _voucherDetailRecord.setValue({
                      fieldId: 'custrecord_gw_ns_document_apply_id',
                      value: _obj.invoice_id,
                    })
                    _voucherDetailRecord.setValue({
                      fieldId: 'custrecord_gw_ns_document_number',
                      value: _obj.invoice_number,
                    })
                    _voucherDetailRecord.setValue({
                      fieldId: 'custrecord_gw_ns_document_number',
                      value: _obj.invoice_number,
                    })
                    _voucherDetailRecord.setValue({
                      fieldId: 'custrecord_gw_ns_document_item_id',
                      value: _obj.invoice_seq,
                    })
                    _voucherDetailRecord.setValue({
                      fieldId: 'custrecord_gw_ns_document_items_seq',
                      value: _obj.invoice_seq,
                    })

                    _voucherDetailRecord.setValue({
                      fieldId: 'custrecord_gw_ns_item_discount_amount',
                      value: '0',
                    })
                    _voucherDetailRecord.setValue({
                      fieldId: 'custrecord_gw_ns_item_discount_count',
                      value: '0',
                    })

                    try {
                      var callId = _voucherDetailRecord.save()
                    } catch (e) {
                      console.log(e.name + ':' + e.message)
                    }
                  }
                }
              }

              //回寫Invoice_Main折扣金額及筆數
              if (typeof _eGUIDetails !== 'undefined') {
                for (var j = 0; j < _eGUIDetails.length; j++) {
                  var _obj = _eGUIDetails[j]

                  var _internalid = _obj.internalid
                  var _eGUIRecord = record.load({
                    type: _voucher_main_record,
                    id: _internalid,
                    isDynamic: true,
                  })
                  _eGUIRecord.setValue({
                    fieldId: 'custrecord_gw_discount_amount',
                    value: _obj.discount_amount,
                  })
                  _eGUIRecord.setValue({
                    fieldId: 'custrecord_gw_discount_count',
                    value: _obj.discount_count,
                  })
                  try {
                    var callId = _eGUIRecord.save()
                  } catch (e) {
                    console.log(e.name + ':' + e.message)
                  }
                }
              }
            }

            try {
              var values = {}
              values['custrecord_gw_is_completed_detail'] = true
              var _id = record.submitFields({
                type: _voucher_main_record,
                id: _mainRecordId,
                values: values,
                options: {
                  enableSourcing: false,
                  ignoreMandatoryFields: true,
                },
              })
            } catch (e) {
              console.log(e.name + ':' + e.message)
            }
          } else {
            //合併開立(彙開)
            var _eGUIDetails = _eGUIItems.eGUIResult
            if (typeof _eGUIDetails !== 'undefined') {
              for (var j = 0; j < _eGUIDetails.length; j++) {
                var _obj = _eGUIDetails[j]

                var _item_description = '彙開'
                var _item_quantity = '1'
                var _item_remark = ''

                var _voucherDetailRecord = record.create({
                  type: _voucher_details_record,
                  isDynamic: true,
                })
                _voucherDetailRecord.setValue({
                  fieldId: 'name',
                  value: 'VoucherDetailRecord',
                })
                _voucherDetailRecord.setValue({
                  fieldId: 'custrecord_gw_dtl_apply_internal_id',
                  value: applyId.toString(),
                })
                _voucherDetailRecord.setValue({
                  fieldId: 'custrecord_gw_voucher_main_internal_id',
                  value: _mainRecordId.toString(),
                })
                _voucherDetailRecord.setValue({
                  fieldId: 'custrecord_gw_dtl_voucher_type',
                  value: _voucher_type,
                })
                _voucherDetailRecord.setValue({
                  fieldId: 'custrecord_gw_item_description',
                  value: _item_description,
                })
                _voucherDetailRecord.setValue({
                  fieldId: 'custrecord_gw_unit_price',
                  value: stringutility.trim(_obj.deduction_amount),
                })
                _voucherDetailRecord.setValue({
                  fieldId: 'custrecord_gw_item_quantity',
                  value: _item_quantity,
                })
                _voucherDetailRecord.setValue({
                  fieldId: 'custrecord_gw_original_gui_internal_id',
                  value: _obj.internalid,
                })
                _voucherDetailRecord.setValue({
                  fieldId: 'custrecord_gw_original_gui_number',
                  value: _obj.voucher_number,
                })
                _voucherDetailRecord.setValue({
                  fieldId: 'custrecord_gw_original_gui_date',
                  value: _obj.voucher_date,
                })
                _voucherDetailRecord.setValue({
                  fieldId: 'custrecord_gw_original_gui_yearmonth',
                  value: _obj.voucher_yearmonth,
                })
                _voucherDetailRecord.setValue({
                  fieldId: 'custrecord_gw_item_amount',
                  value: stringutility.trim(_obj.deduction_amount),
                })
                //_voucherDetailRecord.setValue({fieldId:'custrecord_gw_dtl_item_tax_code',value:stringutility.trim(_obj.tax_code)});
                _voucherDetailRecord.setValue({
                  fieldId: 'custrecord_gw_dtl_item_tax_rate',
                  value: stringutility.trim(_main.tax_rate),
                })

                _row++
                _voucherDetailRecord.setValue({
                  fieldId: 'custrecord_gw_item_seq',
                  value: _row.toString(),
                })
                _voucherDetailRecord.setValue({
                  fieldId: 'custrecord_gw_item_remark',
                  value: _item_remark,
                })

                _voucherDetailRecord.setValue({
                  fieldId: 'custrecord_gw_dtl_voucher_number',
                  value: _allowanceNumber,
                })
                _voucherDetailRecord.setValue({
                  fieldId: 'custrecord_gw_dtl_voucher_date',
                  value: _documentDate,
                })
                _voucherDetailRecord.setValue({
                  fieldId: 'custrecord_gw_dtl_voucher_time',
                  value: _documentTime,
                })
                _voucherDetailRecord.setValue({
                  fieldId: 'custrecord_gw_dtl_voucher_yearmonth',
                  value: year_month,
                })

                _voucherDetailRecord.setValue({
                  fieldId: 'custrecord_gw_dtl_voucher_status',
                  value: _status,
                })
                _voucherDetailRecord.setValue({
                  fieldId: 'custrecord_gw_dtl_voucher_upload_status',
                  value: _default_upload_status,
                })

                _voucherDetailRecord.setValue({
                  fieldId: 'custrecord_gw_ns_document_type',
                  value: _obj.document_type,
                })
                _voucherDetailRecord.setValue({
                  fieldId: 'custrecord_gw_ns_document_apply_id',
                  value: _obj.invoice_id,
                })
                _voucherDetailRecord.setValue({
                  fieldId: 'custrecord_gw_ns_document_number',
                  value: _obj.invoice_number,
                })
                _voucherDetailRecord.setValue({
                  fieldId: 'custrecord_gw_ns_document_number',
                  value: _obj.invoice_number,
                })
                _voucherDetailRecord.setValue({
                  fieldId: 'custrecord_gw_ns_document_item_id',
                  value: _obj.invoice_seq,
                })
                _voucherDetailRecord.setValue({
                  fieldId: 'custrecord_gw_ns_document_items_seq',
                  value: _obj.invoice_seq,
                })

                _voucherDetailRecord.setValue({
                  fieldId: 'custrecord_gw_ns_item_discount_amount',
                  value: '0',
                })
                _voucherDetailRecord.setValue({
                  fieldId: 'custrecord_gw_ns_item_discount_count',
                  value: '0',
                })

                try {
                  var callId = _voucherDetailRecord.save()
                } catch (e) {
                  console.log(e.name + ':' + e.message)
                }

                //找到發票更新discount及count
                var _internalid = _obj.internalid
                var _eGUIRecord = record.load({
                  type: _voucher_main_record,
                  id: _internalid,
                  isDynamic: true,
                })
                _eGUIRecord.setValue({
                  fieldId: 'custrecord_gw_discount_amount',
                  value: _obj.discount_amount,
                })
                _eGUIRecord.setValue({
                  fieldId: 'custrecord_gw_discount_count',
                  value: _obj.discount_count,
                })
                try {
                  var callId = _eGUIRecord.save()
                } catch (e) {
                  console.log(e.name + ':' + e.message)
                }
              }
            }

            try {
              var values = {}
              values['custrecord_gw_is_completed_detail'] = true
              var _id = record.submitFields({
                type: _voucher_main_record,
                id: _mainRecordId,
                values: values,
                options: {
                  enableSourcing: false,
                  ignoreMandatoryFields: true,
                },
              })
            } catch (e) {
              console.log(e.name + ':' + e.message)
            }
          }
          //alert('開立折讓單-END');
          //End Details
        }
      }
    }

    return _allowanceNumberAry
  }

  //取得折讓單扣抵發票資料
  function getDeductionInvoiceInformation(deductionAmount, eGUIDetails) {
    var _invoiceObjAry = []
    if (typeof eGUIDetails !== 'undefined') {
      for (var i = 0; i < eGUIDetails.length; i++) {
        var _obj = eGUIDetails[i]

        var _sales_amount = Math.abs(_obj.voucher_sales_amount) //voucher_sales_amount=>已含應+免+零稅
        if (deductionAmount >= stringutility.convertToFloat(_sales_amount)) {
          _obj.voucher_sales_amount = '0'
          deductionAmount =
            deductionAmount - stringutility.convertToFloat(_sales_amount)
        } else {
          _obj.voucher_sales_amount =
            stringutility.convertToFloat(_sales_amount) - deductionAmount
          deductionAmount = 0
        }
        _invoiceObjAry.push(_obj)

        if (deductionAmount == 0) break
      }
    }
    return _invoiceObjAry
  }

  //整理折扣項目
  function arrangeDiscountItemAry(
    discountItem,
    discountItemName,
    discountAmount,
    discountHistoryAry
  ) {
    var _exist = false
    if (discountHistoryAry.length != 0) {
      for (var i = 0; i < discountHistoryAry.length; i++) {
        var _obj = discountHistoryAry[i]
        if (discountItem === _obj.discountitem) {
          _obj.discounttotal =
            stringutility.convertToFloat(_obj.discounttotal) +
            stringutility.convertToFloat(discountAmount)
          _exist = true
          break
        }
      }
    }
    if (_exist === false) {
      var _obj = {
        discountitem: discountItem,
        discountitemname: discountItemName,
        discounttotal: discountAmount,
      }
      discountHistoryAry.push(_obj)
    }
  }

  //將資料依稅別分流
  function splitDocumentDetail(migType) {
    //判斷處理方式
    //accessType=INVOICE[只處理Invoice]
    //accessType=CREDITMEMO[只處理CreditMemo]
    //accessType=ALL[Invoice+CreditMemo]
    var _accessType = ''

    var _invoiceSublistId = 'invoicesublistid'
    var _creditMemoSublistId = 'creditmemosublistid'

    var _amount_TaxType_1 = 0 //1=應稅 [5]
    var _amount_TaxType_2 = 0 //2=零稅率 [0]
    var _amount_TaxType_3 = 0 //3=免稅 [0]
    var _amount_TaxType_4 = 0 //4=特種稅率 [1, 2, 5, 15, 25]
    var _amount_TaxType_9 = 0 //9=混合稅率(B2C) [0]

    var _eDocument_TaxType_1_Ary = [] //1=應稅 [5]
    var _eDocument_TaxType_2_Ary = [] //2=零稅率 [0]
    var _eDocument_TaxType_3_Ary = [] //3=免稅 [0]
    var _eDocument_TaxType_4_Ary = [] //4=特種稅率 [1, 2, 5, 15, 25]
    var _eDocument_TaxType_9_Ary = [] //9=混合稅率(B2C) [0]

    var _discountItemAry = [] //折扣項目
    var _invoice_type = _current_record.getValue({
      fieldId: 'custpage_invoice_type',
    }) //07, 08
    var _buyer_identifier = _current_record.getValue({
      fieldId: 'custpage_buyer_identifier',
    })
    var _invoice_item_count = _current_record.getLineCount({
      sublistId: _invoiceSublistId,
    })
    if (typeof _invoice_item_count !== 'undefined') {
      _accessType = 'INVOICE' //accessType=INVOICE[只處理Invoice]
      for (var i = 0; i < _invoice_item_count; i++) {
        var _invoice_id = _current_record.getSublistValue({
          sublistId: _invoiceSublistId,
          fieldId: 'customer_search_invoice_id',
          line: i,
        })
        var _invoice_number = _current_record.getSublistValue({
          sublistId: _invoiceSublistId,
          fieldId: 'customer_search_invoice_number',
          line: i,
        })

        var _invoice_seq = _current_record.getSublistValue({
          sublistId: _invoiceSublistId,
          fieldId: 'customer_search_invoice_seq',
          line: i,
        })
        var _tax_code = _current_record.getSublistValue({
          sublistId: _invoiceSublistId,
          fieldId: 'customer_search_invoice_tax_code',
          line: i,
        })
        var _deptcode = _current_record.getSublistValue({
          sublistId: _invoiceSublistId,
          fieldId: 'customer_search_invoice_deptcode',
          line: i,
        })
        var _class = _current_record.getSublistValue({
          sublistId: _invoiceSublistId,
          fieldId: 'customer_search_invoice_class',
          line: i,
        })
        var _discount = _current_record.getSublistValue({
          sublistId: _invoiceSublistId,
          fieldId: 'customer_search_invoice_discount',
          line: i,
        })
        var _tax_rate = _current_record.getSublistValue({
          sublistId: _invoiceSublistId,
          fieldId: 'customer_search_invoice_tax_rate',
          line: i,
        })
        var _item_name = _current_record.getSublistValue({
          sublistId: _invoiceSublistId,
          fieldId: 'custpage_item_name',
          line: i,
        })
        var _unit_price = _current_record.getSublistValue({
          sublistId: _invoiceSublistId,
          fieldId: 'custpage_unit_price',
          line: i,
        })
        var _item_quantity = _current_record.getSublistValue({
          sublistId: _invoiceSublistId,
          fieldId: 'custpage_item_quantity',
          line: i,
        })
        var _item_unit = _current_record.getSublistValue({
          sublistId: _invoiceSublistId,
          fieldId: 'custpage_invoice_item_unit',
          line: i,
        })
        var _item_amount = _current_record.getSublistValue({
          sublistId: _invoiceSublistId,
          fieldId: 'custpage_item_amount',
          line: i,
        })
        var _item_remark = _current_record.getSublistValue({
          sublistId: _invoiceSublistId,
          fieldId: 'custpage_item_remark',
          line: i,
        })
        //忽略Discount
        if (stringutility.trim(_discount) === 'Discount') {
          arrangeDiscountItemAry(
            _invoice_id,
            _item_name,
            _item_amount,
            _discountItemAry
          )
          continue
        }
        //目前taxCode=10 [應稅] , taxCode=5 [免稅] ,
        //1=應稅 [5]
        //2=零稅率 [0]
        //3=免稅 [0]
        //4=特種稅率 [1, 2, 5, 15, 25]
        //9=混合稅率(B2C) [0]
        if (
          _invoice_type == '07' &&
          migType == 'B2C' &&
          _buyer_identifier == '0000000000'
        ) {
          //C0401 不分稅
          var _eDocument_TaxType_9_Obj = {
            invoice_id: _invoice_id,
            invoice_number: _invoice_number,
            invoice_seq: _invoice_seq,
            tax_type: '9',
            deptcode: stringutility.trim(_deptcode),
            classification: stringutility.trim(_class),
            discount: stringutility.trim(_discount),
            tax_code: _tax_code,
            tax_rate: _tax_rate,
            item_name: _item_name,
            unit_price: _unit_price,
            item_quantity: _item_quantity,
            item_unit: _item_unit,
            item_amount: _item_amount,
            document_type: 'INVOICE',
            item_remark: _item_remark,
          }
          _eDocument_TaxType_9_Ary.push(_eDocument_TaxType_9_Obj)
          _amount_TaxType_9 += stringutility.convertToFloat(_item_amount)
        } else if (_invoice_type == '08') {
          var _eDocument_TaxType_4_Obj = {
            invoice_id: _invoice_id,
            invoice_number: _invoice_number,
            invoice_seq: _invoice_seq,
            tax_type: '4',
            deptcode: stringutility.trim(_deptcode),
            classification: stringutility.trim(_class),
            discount: stringutility.trim(_discount),
            tax_code: _tax_code,
            tax_rate: _tax_rate,
            item_name: _item_name,
            unit_price: _unit_price,
            item_quantity: _item_quantity,
            item_unit: _item_unit,
            item_amount: _item_amount,
            document_type: 'INVOICE',
            item_remark: _item_remark,
          }
          _eDocument_TaxType_4_Ary.push(_eDocument_TaxType_4_Obj)
          _amount_TaxType_4 += stringutility.convertToFloat(_item_amount)
        } else if (_invoice_type == '07') {
          if (stringutility.convertToFloat(_tax_code) == _freeTaxID) {
            //3=免稅 [0]
            var _eDocument_TaxType_3_Obj = {
              invoice_id: _invoice_id,
              invoice_number: _invoice_number,
              invoice_seq: _invoice_seq,
              tax_type: '3',
              deptcode: stringutility.trim(_deptcode),
              classification: stringutility.trim(_class),
              discount: stringutility.trim(_discount),
              tax_code: _tax_code,
              tax_rate: _tax_rate,
              item_name: _item_name,
              unit_price: _unit_price,
              item_quantity: _item_quantity,
              item_unit: _item_unit,
              item_amount: _item_amount,
              document_type: 'INVOICE',
              item_remark: _item_remark,
            }
            _eDocument_TaxType_3_Ary.push(_eDocument_TaxType_3_Obj)
            _amount_TaxType_3 += stringutility.convertToFloat(_item_amount)
          } else if (stringutility.convertToFloat(_tax_code) == _zeroTaxID) {
            //2=零稅率 [0]
            //待確認
            var _eDocument_TaxType_2_Obj = {
              invoice_id: _invoice_id,
              invoice_number: _invoice_number,
              invoice_seq: _invoice_seq,
              tax_type: '2',
              deptcode: stringutility.trim(_deptcode),
              classification: stringutility.trim(_class),
              discount: stringutility.trim(_discount),
              tax_code: _tax_code,
              tax_rate: _tax_rate,
              item_name: _item_name,
              unit_price: _unit_price,
              item_quantity: _item_quantity,
              item_unit: _item_unit,
              item_amount: _item_amount,
              document_type: 'INVOICE',
              item_remark: _item_remark,
            }
            _eDocument_TaxType_2_Ary.push(_eDocument_TaxType_2_Obj)
            _amount_TaxType_2 += stringutility.convertToFloat(_item_amount)
          } else if (stringutility.convertToFloat(_tax_code) == _withTaxID) {
            //1=應稅 [5]
            var _eDocument_TaxType_1_Obj = {
              invoice_id: _invoice_id,
              invoice_number: _invoice_number,
              invoice_seq: _invoice_seq,
              tax_type: '1',
              deptcode: stringutility.trim(_deptcode),
              classification: stringutility.trim(_class),
              discount: stringutility.trim(_discount),
              tax_code: _tax_code,
              tax_rate: _tax_rate,
              item_name: _item_name,
              unit_price: _unit_price,
              item_quantity: _item_quantity,
              item_unit: _item_unit,
              item_amount: _item_amount,
              document_type: 'INVOICE',
              item_remark: _item_remark,
            }
            _eDocument_TaxType_1_Ary.push(_eDocument_TaxType_1_Obj)
            _amount_TaxType_1 += stringutility.convertToFloat(_item_amount)
          } else if (stringutility.convertToFloat(_tax_code) == _speicalTaxID) {
            //4=特種稅率 [1, 2, 5, 15, 25]
            //待確認
            var _eDocument_TaxType_4_Obj = {
              invoice_id: _invoice_id,
              invoice_number: _invoice_number,
              invoice_seq: _invoice_seq,
              tax_type: '4',
              deptcode: stringutility.trim(_deptcode),
              classification: stringutility.trim(_class),
              discount: stringutility.trim(_discount),
              tax_code: _tax_code,
              tax_rate: _tax_rate,
              item_name: _item_name,
              unit_price: _unit_price,
              item_quantity: _item_quantity,
              item_unit: _item_unit,
              item_amount: _item_amount,
              document_type: 'INVOICE',
              item_remark: _item_remark,
            }
            _eDocument_TaxType_4_Ary.push(_eDocument_TaxType_4_Obj)
            _amount_TaxType_4 += stringutility.convertToFloat(_item_amount)
          }
        }
      }
    }

    //CreditMemo SubList
    var _creditmemo_item_count = _current_record.getLineCount({
      sublistId: _creditMemoSublistId,
    })

    if (typeof _creditmemo_item_count !== 'undefined') {
      //判斷處理方式 accessType=INVOICE[只處理Invoice], accessType=CREDITMEMO[只處理CreditMemo], accessType=ALL[Invoice+CreditMemo];
      if (_accessType === 'INVOICE') {
        _accessType = 'ALL'
      } else {
        _accessType = 'CREDITMEMO'
      }

      for (var i = 0; i < _creditmemo_item_count; i++) {
        var _creditmemo_id = _current_record.getSublistValue({
          sublistId: _creditMemoSublistId,
          fieldId: 'customer_search_creditmemo_id',
          line: i,
        })
        var _creditmemo_number = _current_record.getSublistValue({
          sublistId: _creditMemoSublistId,
          fieldId: 'customer_search_creditmemo_number',
          line: i,
        })
        var _creditmemo_seq = _current_record.getSublistValue({
          sublistId: _creditMemoSublistId,
          fieldId: 'customer_search_creditmemo_seq',
          line: i,
        })
        var _tax_code = _current_record.getSublistValue({
          sublistId: _creditMemoSublistId,
          fieldId: 'customer_search_creditmemo_tax_code',
          line: i,
        })
        var _deptcode = _current_record.getSublistValue({
          sublistId: _creditMemoSublistId,
          fieldId: 'customer_search_creditmemo_deptcode',
          line: i,
        })
        var _class = _current_record.getSublistValue({
          sublistId: _creditMemoSublistId,
          fieldId: 'customer_search_creditmemo_class',
          line: i,
        })
        var _discount = _current_record.getSublistValue({
          sublistId: _creditMemoSublistId,
          fieldId: 'customer_search_creditmemo_discount',
          line: i,
        })
        var _tax_rate = _current_record.getSublistValue({
          sublistId: _creditMemoSublistId,
          fieldId: 'customer_search_creditmemo_tax_rate',
          line: i,
        })
        var _item_name = _current_record.getSublistValue({
          sublistId: _creditMemoSublistId,
          fieldId: 'custpage_item_name',
          line: i,
        })
        var _unit_price = _current_record.getSublistValue({
          sublistId: _creditMemoSublistId,
          fieldId: 'custpage_unit_price',
          line: i,
        })
        var _item_quantity = _current_record.getSublistValue({
          sublistId: _creditMemoSublistId,
          fieldId: 'custpage_item_quantity',
          line: i,
        })
        var _item_unit = _current_record.getSublistValue({
          sublistId: _creditMemoSublistId,
          fieldId: 'custpage_creditmemo_item_unit',
          line: i,
        })
        var _item_amount = _current_record.getSublistValue({
          sublistId: _creditMemoSublistId,
          fieldId: 'custpage_item_amount',
          line: i,
        })

        //忽略Discount
        if (stringutility.trim(_discount) === 'Discount') {
          arrangeDiscountItemAry(
            _creditmemo_id,
            _item_name,
            _item_amount,
            _discountItemAry
          )
          continue
        }

        var _item_remark = _current_record.getSublistValue({
          sublistId: _creditMemoSublistId,
          fieldId: 'custpage_item_remark',
          line: i,
        })

        //目前taxCode=10 [應稅] , taxCode=5 [免稅] ,
        //1=應稅 [5]
        //2=零稅率 [0]
        //3=免稅 [0]
        //4=特種稅率 [1, 2, 5, 15, 25]
        //9=混合稅率(B2C) [0]
        if (
          _invoice_type == '07' &&
          migType == 'B2C' &&
          _buyer_identifier == '0000000000'
        ) {
          //9=混合稅率(B2C) [0]
          //MigType=B2C
          var _eDocument_TaxType_9_Obj = {
            invoice_id: _creditmemo_id,
            invoice_number: _creditmemo_number,
            invoice_seq: _creditmemo_seq,
            tax_type: '9',
            deptcode: stringutility.trim(_deptcode),
            classification: stringutility.trim(_class),
            discount: stringutility.trim(_discount),
            tax_code: _tax_code,
            tax_rate: _tax_rate,
            item_name: _item_name,
            unit_price: _unit_price,
            item_quantity: _item_quantity,
            item_unit: _item_unit,
            item_amount: _item_amount,
            document_type: 'CREDITMEMO',
            item_remark: _item_remark,
          }
          _eDocument_TaxType_9_Ary.push(_eDocument_TaxType_9_Obj)
          _amount_TaxType_9 += stringutility.convertToFloat(_item_amount)
        } else if (_invoice_type == '08') {
          var _eDocument_TaxType_4_Obj = {
            invoice_id: _creditmemo_id,
            invoice_number: _creditmemo_number,
            invoice_seq: _creditmemo_seq,
            tax_type: '4',
            deptcode: stringutility.trim(_deptcode),
            classification: stringutility.trim(_class),
            discount: stringutility.trim(_discount),
            tax_code: _tax_code,
            tax_rate: _tax_rate,
            item_name: _item_name,
            unit_price: _unit_price,
            item_quantity: _item_quantity,
            item_unit: _item_unit,
            item_amount: _item_amount,
            document_type: 'CREDITMEMO',
            item_remark: _item_remark,
          }
          _eDocument_TaxType_4_Ary.push(_eDocument_TaxType_4_Obj)
          _amount_TaxType_4 += stringutility.convertToFloat(_item_amount)
        } else if (_invoice_type == '07') {
          if (stringutility.convertToFloat(_tax_code) == _freeTaxID) {
            //3=免稅 [0]
            var _eDocument_TaxType_3_Obj = {
              invoice_id: _creditmemo_id,
              invoice_number: _creditmemo_number,
              invoice_seq: _creditmemo_seq,
              tax_type: '3',
              deptcode: stringutility.trim(_deptcode),
              classification: stringutility.trim(_class),
              discount: stringutility.trim(_discount),
              tax_code: _tax_code,
              tax_rate: _tax_rate,
              item_name: _item_name,
              unit_price: _unit_price,
              item_quantity: _item_quantity,
              item_unit: _item_unit,
              item_amount: _item_amount,
              document_type: 'CREDITMEMO',
              item_remark: _item_remark,
            }
            _eDocument_TaxType_3_Ary.push(_eDocument_TaxType_3_Obj)
            _amount_TaxType_3 += stringutility.convertToFloat(_item_amount)
          } else if (stringutility.convertToFloat(_tax_code) == _zeroTaxID) {
            //2=零稅率 [0]
            //待確認
            var _eDocument_TaxType_2_Obj = {
              invoice_id: _creditmemo_id,
              invoice_number: _creditmemo_number,
              invoice_seq: _creditmemo_seq,
              tax_type: '2',
              deptcode: stringutility.trim(_deptcode),
              classification: stringutility.trim(_class),
              discount: stringutility.trim(_discount),
              tax_code: _tax_code,
              tax_rate: _tax_rate,
              item_name: _item_name,
              unit_price: _unit_price,
              item_quantity: _item_quantity,
              item_unit: _item_unit,
              item_amount: _item_amount,
              document_type: 'CREDITMEMO',
              item_remark: _item_remark,
            }
            _eDocument_TaxType_2_Ary.push(_eDocument_TaxType_2_Obj)
            _amount_TaxType_2 += stringutility.convertToFloat(_item_amount)
          } else if (stringutility.convertToFloat(_tax_code) == _withTaxID) {
            //1=應稅 [5]

            var _eDocument_TaxType_1_Obj = {
              invoice_id: _creditmemo_id,
              invoice_number: _creditmemo_number,
              invoice_seq: _creditmemo_seq,
              tax_type: '1',
              deptcode: stringutility.trim(_deptcode),
              classification: stringutility.trim(_class),
              discount: stringutility.trim(_discount),
              tax_code: _tax_code,
              tax_rate: _tax_rate,
              item_name: _item_name,
              unit_price: _unit_price,
              item_quantity: _item_quantity,
              item_unit: _item_unit,
              item_amount: _item_amount,
              document_type: 'CREDITMEMO',
              item_remark: _item_remark,
            }

            _eDocument_TaxType_1_Ary.push(_eDocument_TaxType_1_Obj)
            _amount_TaxType_1 += stringutility.convertToFloat(_item_amount)
          } else if (stringutility.convertToFloat(_tax_code) == _speicalTaxID) {
            //4=特種稅率 [1, 2, 5, 15, 25]
            //待確認
            var _eDocument_TaxType_4_Obj = {
              invoice_id: _creditmemo_id,
              invoice_number: _creditmemo_number,
              invoice_seq: _creditmemo_seq,
              tax_type: '4',
              deptcode: stringutility.trim(_deptcode),
              classification: stringutility.trim(_class),
              discount: stringutility.trim(_discount),
              tax_code: _tax_code,
              tax_rate: _tax_rate,
              item_name: _item_name,
              unit_price: _unit_price,
              item_quantity: _item_quantity,
              item_unit: _item_unit,
              item_amount: _item_amount,
              document_type: 'CREDITMEMO',
              item_remark: _item_remark,
            }
            _eDocument_TaxType_4_Ary.push(_eDocument_TaxType_4_Obj)
            _amount_TaxType_4 += stringutility.convertToFloat(_item_amount)
          }
        }
      } //End For
    }

    var _jsonDocumemtLists = {
      accessType: _accessType,
      discountItemAry: _discountItemAry,
      amount_TaxType_1: _amount_TaxType_1,
      amount_TaxType_2: _amount_TaxType_2,
      amount_TaxType_3: _amount_TaxType_3,
      amount_TaxType_4: _amount_TaxType_4,
      amount_TaxType_9: _amount_TaxType_9,
      eDocument_TaxType_1_Ary: _eDocument_TaxType_1_Ary, //1=應稅 [5]
      eDocument_TaxType_2_Ary: _eDocument_TaxType_2_Ary, //2=零稅率 [0]
      eDocument_TaxType_3_Ary: _eDocument_TaxType_3_Ary, //3=免稅 [0]
      eDocument_TaxType_4_Ary: _eDocument_TaxType_4_Ary, //4=特種稅率 [1, 2, 5, 15, 25]
      eDocument_TaxType_9_Ary: _eDocument_TaxType_9_Ary, //9=混合稅率(B2C) [0]
    }

    return _jsonDocumemtLists
  }

  //大數相加
  function add(str1, str2) {
    var arr1 = str1.split(''),
      arr2 = str2.split(''),
      extra = false,
      sum,
      res = ''
    while (arr1.length || arr2.length || extra) {
      sum = ~~arr1.pop() + ~~arr2.pop() + extra
      res = (sum % 10) + res
      extra = sum > 10
    }
    return res
  }

  //取得發票字軌可用數量
  function checkAssignLogUseCount(
    invoice_type,
    ban,
    dept_code,
    classification,
    year_month,
    requireCount
  ) {
    var _ok = false
    var _assignLogSearch = search.create({
      type: _assignLogRecordId,
      columns: [
        search.createColumn({
          name: 'custrecord_gw_assignlog_businessno',
          summary: search.Summary.GROUP,
        }),
        search.createColumn({
          name: 'custrecord_gw_assignlog_startno',
          summary: search.Summary.COUNT,
        }),
        search.createColumn({
          name: 'custrecord_gw_assignlog_usedcount',
          summary: search.Summary.SUM,
        }),
      ],
    })

    var _filterArray = []
    _filterArray.push(['custrecord_gw_assignlog_businessno', 'is', ban])
    _filterArray.push('and')
    _filterArray.push([
      'custrecord_gw_assignlog_invoicetype',
      'is',
      invoice_type,
    ])

    if (dept_code === '') {
      _filterArray.push('and')
      _filterArray.push(['custrecord_gw_assignlog_deptcode', 'isempty', ''])
    } else {
      _filterArray.push('and')
      _filterArray.push(['custrecord_gw_assignlog_deptcode', 'is', dept_code])
    }
    if (classification === '') {
      _filterArray.push('and')
      _filterArray.push([
        'custrecord_gw_assignlog_classification',
        'isempty',
        '',
      ])
    } else {
      _filterArray.push('and')
      _filterArray.push([
        'custrecord_gw_assignlog_classification',
        'is',
        classification,
      ])
    }
    _filterArray.push('and')
    _filterArray.push(['custrecord_gw_assignlog_yearmonth', 'is', year_month])
    _filterArray.push('and')
    _filterArray.push([
      ['custrecord_gw_assignlog_status', 'is', '11'],
      'or',
      ['custrecord_gw_assignlog_status', 'is', '12'],
    ])

    _assignLogSearch.filterExpression = _filterArray

    var _totalCount = 0
    var _noCount = 0
    _assignLogSearch.run().each(function (result) {
      var _businessno = result.getValue({
        name: 'custrecord_gw_assignlog_businessno',
        summary: search.Summary.GROUP,
      })
      _noCount += parseInt(
        result.getValue({
          name: 'custrecord_gw_assignlog_startno',
          summary: search.Summary.COUNT,
        })
      )

      var _usedCount = parseInt(
        result.getValue({
          name: 'custrecord_gw_assignlog_usedcount',
          summary: search.Summary.SUM,
        }),
        10
      )

      _totalCount += 50 - parseInt(_usedCount)

      return true
    })
    if (_totalCount >= parseInt(requireCount) && _noCount != 0) _ok = true

    return _ok
  }

  function checkAssignLogUseCount_BAK(
    invoice_type,
    ban,
    dept_code,
    classification,
    year_month,
    requireCount
  ) {
    var _ok = false
    var _assignLogSearch = search.create({
      type: _assignLogRecordId,
      columns: ['internalid', 'custrecord_gw_assignlog_usedcount'],
    })

    var _filterArray = []
    _filterArray.push(['custrecord_gw_assignlog_businessno', 'is', ban])
    _filterArray.push('and')
    _filterArray.push([
      'custrecord_gw_assignlog_invoicetype',
      'is',
      invoice_type,
    ])

    if (dept_code === '') {
      _filterArray.push('and')
      _filterArray.push(['custrecord_gw_assignlog_deptcode', 'isempty', ''])
    } else {
      _filterArray.push('and')
      _filterArray.push(['custrecord_gw_assignlog_deptcode', 'is', dept_code])
    }
    if (classification === '') {
      _filterArray.push('and')
      _filterArray.push([
        'custrecord_gw_assignlog_classification',
        'isempty',
        '',
      ])
    } else {
      _filterArray.push('and')
      _filterArray.push([
        'custrecord_gw_assignlog_classification',
        'is',
        classification,
      ])
    }
    _filterArray.push('and')
    _filterArray.push(['custrecord_gw_assignlog_yearmonth', 'is', year_month])
    _filterArray.push('and')
    _filterArray.push([
      ['custrecord_gw_assignlog_status', 'is', '11'],
      'or',
      ['custrecord_gw_assignlog_status', 'is', '12'],
    ])
    _assignLogSearch.filterExpression = _filterArray

    var _totalCount = 0
    _assignLogSearch.run().each(function (result) {
      var _usedCount = result.getValue({
        name: 'custrecord_gw_assignlog_usedcount',
      })
      _totalCount += 50 - parseInt(_usedCount)

      return true
    })
    if (_totalCount >= parseInt(requireCount)) _ok = true

    return _ok
  }

  //檢查發票可扣抵金額是否足夠
  /**
   * assignLogType : 是否上傳
   * ban  : 統編
   * dept_code : 部門代碼
   * classification : 類別
   * year_month: 期數
   * period : 期別(本期=>this_period, 前期=>early_period)
   * invoiceType : 發票類別(07, 08)
   * taxType : 稅別
   * deductionSalesAmount : 扣抵金額(未稅)
   */
  function checkCreditMemoAmount(
    assignLogType,
    buyer_identifier,
    ban,
    deptCode,
    classification,
    yearMonth,
    period,
    deduction_egui_number,
    invoiceType,
    taxType,
    deductionSalesAmount
  ) {
    var _ok = false
    var _search = search.create({
      type: _voucher_main_record,
      columns: [
        search.createColumn({
          name: 'custrecord_gw_seller',
          summary: search.Summary.GROUP,
        }),
        search.createColumn({
          name: 'custrecord_gw_sales_amount',
          summary: search.Summary.SUM,
        }),
        search.createColumn({
          name: 'custrecord_gw_free_sales_amount',
          summary: search.Summary.SUM,
        }),
        search.createColumn({
          name: 'custrecord_gw_zero_sales_amount',
          summary: search.Summary.SUM,
        }),
        search.createColumn({
          name: 'custrecord_gw_discount_amount',
          summary: search.Summary.SUM,
        }),
      ],
    })

    var _filterArray = []
    _filterArray.push([
      'custrecord_gw_voucher_upload_status',
      search.Operator.IS,
      'C',
    ])

    _filterArray.push('and')
    _filterArray.push([
      'custrecord_gw_voucher_type',
      search.Operator.IS,
      'EGUI',
    ])

    _filterArray.push('and')
    _filterArray.push([
      'custrecord_gw_buyer',
      search.Operator.IS,
      buyer_identifier,
    ])

    _filterArray.push('and')
    _filterArray.push(['custrecord_gw_seller', search.Operator.IS, ban])

    _filterArray.push('and')
    _filterArray.push([
      'custrecord_gw_invoice_type',
      search.Operator.IS,
      invoiceType,
    ])

    _filterArray.push('and')
    _filterArray.push(['custrecord_gw_tax_type', search.Operator.IS, taxType])

    if (deptCode === '') {
      _filterArray.push('and')
      _filterArray.push([
        'custrecord_gw_voucher_dept_code',
        search.Operator.ISEMPTY,
        '',
      ])
    } else {
      _filterArray.push('and')
      _filterArray.push([
        'custrecord_gw_voucher_dept_code',
        search.Operator.IS,
        deptCode,
      ])
    }
    if (classification === '') {
      _filterArray.push('and')
      _filterArray.push([
        'custrecord_gw_voucher_classification',
        search.Operator.ISEMPTY,
        '',
      ])
    } else {
      _filterArray.push('and')
      _filterArray.push([
        'custrecord_gw_voucher_classification',
        search.Operator.IS,
        classification,
      ])
    }
    if (period === 'this_period') {
      _filterArray.push('and')
      _filterArray.push([
        'custrecord_gw_voucher_yearmonth',
        search.Operator.IS,
        yearMonth,
      ])
    } else if (period === 'early_period') {
      _filterArray.push('and')
      _filterArray.push([
        'custrecord_gw_voucher_yearmonth',
        search.Operator.LESSTHAN,
        yearMonth,
      ])
    } else {
      //指定發票
      _filterArray.push('and')

      var deduction_egui_number_ary = deduction_egui_number.split(',')
      var _filter_ary = []
      for (var i = 0; i < deduction_egui_number_ary.length; i++) {
        var _number = deduction_egui_number_ary[i]

        var _sub_filter_ary = []
        _sub_filter_ary.push('custrecord_gw_voucher_number')
        _sub_filter_ary.push(search.Operator.IS)
        _sub_filter_ary.push(_number)

        if (i == 0) {
          _filter_ary.push(_sub_filter_ary)
        } else {
          _filter_ary.push('or')
          _filter_ary.push(_sub_filter_ary)
        }
      }
      _filterArray.push(_filter_ary)
    }
    _filterArray.push('and')
    _filterArray.push([
      'sum(formulanumeric:{custrecord_gw_sales_amount}+{custrecord_gw_free_sales_amount}+{custrecord_gw_zero_sales_amount}-{custrecord_gw_discount_amount})',
      search.Operator.NOTEQUALTO,
      0,
    ])

    if (assignLogType === _defaultAssignLogType) {
      //TYPE_1
      _filterArray.push('and')
      _filterArray.push([
        'custrecord_gw_need_upload_egui_mig',
        search.Operator.IS,
        'Y',
      ])
    } else {
      _filterArray.push('and')
      _filterArray.push([
        'custrecord_gw_need_upload_egui_mig',
        search.Operator.IS,
        'N',
      ])
    }
    _search.filterExpression = _filterArray
    //alert('_filterArray='+JSON.stringify(_filterArray));
    var _amountSum = 0
    _search.run().each(function (result) {
      var _seller = result.getValue({
        name: 'custrecord_gw_seller',
        summary: search.Summary.GROUP,
      })

      var _sales_amount = stringutility.convertToFloat(
        result.getValue({
          name: 'custrecord_gw_sales_amount',
          summary: search.Summary.SUM,
        }),
        10
      )

      var _free_sales_amount = stringutility.convertToFloat(
        result.getValue({
          name: 'custrecord_gw_free_sales_amount',
          summary: search.Summary.SUM,
        }),
        10
      )

      var _zero_sales_amount = stringutility.convertToFloat(
        result.getValue({
          name: 'custrecord_gw_zero_sales_amount',
          summary: search.Summary.SUM,
        }),
        10
      )

      var _discount_amount = stringutility.convertToFloat(
        result.getValue({
          name: 'custrecord_gw_discount_amount',
          summary: search.Summary.SUM,
        }),
        10
      )

      _amountSum +=
        _sales_amount +
        _free_sales_amount +
        _zero_sales_amount -
        _discount_amount

      return true
    })
    //alert('_amountSum='+_amountSum+' ,deductionSalesAmount='+deductionSalesAmount);
    //因為 deductionSalesAmount 為負數
    if (_amountSum + deductionSalesAmount >= 0) _ok = true

    return _ok
  }

  //檢查發票可扣抵金額
  /**
   * assignLogType : 是否上傳
   * ban  : 統編
   * dept_code : 部門代碼
   * classification : 類別
   * year_month: 期數
   * period : 期別(本期=>this_period, 前期=>early_period)
   * invoiceType : 發票類別(07, 08)
   * taxType : 稅別
   * deductionSalesAmount : 扣抵金額(未稅)
   */
  function geteGUIDeductionItems(
    assignLogType,
    buyer_identifier,
    ban,
    deptCode,
    classification,
    yearMonth,
    period,
    deduction_egui_number,
    invoiceType,
    taxType,
    deductionSalesAmount
  ) {
    var _ok = false
    var _objAry = []
    var _search = search.create({
      type: _voucher_main_record,
      columns: [
        search.createColumn({
          name: 'custrecord_gw_voucher_date',
          sort: search.Sort.DESC,
        }),
        search.createColumn({ name: 'custrecord_gw_voucher_number' }), //憑證號碼
        search.createColumn({ name: 'custrecord_gw_voucher_yearmonth' }), //憑證期別
        search.createColumn({ name: 'custrecord_gw_sales_amount' }), //未稅金額
        search.createColumn({ name: 'custrecord_gw_free_sales_amount' }), //未稅金額
        search.createColumn({ name: 'custrecord_gw_zero_sales_amount' }), //未稅金額
        search.createColumn({ name: 'custrecord_gw_discount_count' }), //扣抵次數
        search.createColumn({ name: 'custrecord_gw_discount_amount' }), //已扣抵未稅金額
      ],
    })

    var _filterArray = []
    _filterArray.push([
      'custrecord_gw_voucher_upload_status',
      search.Operator.IS,
      'C',
    ])

    _filterArray.push('and')
    _filterArray.push([
      'custrecord_gw_voucher_type',
      search.Operator.IS,
      'EGUI',
    ])

    _filterArray.push('and')
    _filterArray.push([
      'custrecord_gw_buyer',
      search.Operator.IS,
      buyer_identifier,
    ])

    _filterArray.push('and')
    _filterArray.push(['custrecord_gw_seller', search.Operator.IS, ban])

    _filterArray.push('and')
    _filterArray.push([
      'custrecord_gw_invoice_type',
      search.Operator.IS,
      invoiceType,
    ])

    _filterArray.push('and')
    _filterArray.push(['custrecord_gw_tax_type', search.Operator.IS, taxType])

    if (deptCode === '') {
      _filterArray.push('and')
      _filterArray.push([
        'custrecord_gw_voucher_dept_code',
        search.Operator.ISEMPTY,
        '',
      ])
    } else {
      _filterArray.push('and')
      _filterArray.push([
        'custrecord_gw_voucher_dept_code',
        search.Operator.IS,
        deptCode,
      ])
    }
    if (classification === '') {
      _filterArray.push('and')
      _filterArray.push([
        'custrecord_gw_voucher_classification',
        search.Operator.ISEMPTY,
        '',
      ])
    } else {
      _filterArray.push('and')
      _filterArray.push([
        'custrecord_gw_voucher_classification',
        search.Operator.IS,
        classification,
      ])
    }
    if (period === 'this_period') {
      _filterArray.push('and')
      _filterArray.push([
        'custrecord_gw_voucher_yearmonth',
        search.Operator.IS,
        yearMonth,
      ])
    } else if (period === 'early_period') {
      _filterArray.push('and')
      _filterArray.push([
        'custrecord_gw_voucher_yearmonth',
        search.Operator.LESSTHAN,
        yearMonth,
      ])
    } else {
      _filterArray.push('and')

      var deduction_egui_number_ary = deduction_egui_number.split(',')
      var _filter_ary = []
      for (var i = 0; i < deduction_egui_number_ary.length; i++) {
        var _number = deduction_egui_number_ary[i]

        var _sub_filter_ary = []
        _sub_filter_ary.push('custrecord_gw_voucher_number')
        _sub_filter_ary.push(search.Operator.IS)
        _sub_filter_ary.push(_number)

        if (i == 0) {
          _filter_ary.push(_sub_filter_ary)
        } else {
          _filter_ary.push('or')
          _filter_ary.push(_sub_filter_ary)
        }
      }
      _filterArray.push(_filter_ary)
      //_filterArray.push(['custrecord_gw_voucher_number',search.Operator.ANY, deduction_egui_number_ary]);
    }

    if (assignLogType === _defaultAssignLogType) {
      //TYPE_1
      _filterArray.push('and')
      _filterArray.push([
        'custrecord_gw_need_upload_egui_mig',
        search.Operator.IS,
        'Y',
      ])
    } else {
      _filterArray.push('and')
      _filterArray.push([
        'custrecord_gw_need_upload_egui_mig',
        search.Operator.IS,
        'N',
      ])
    }
    _search.filterExpression = _filterArray

    var _amountSum = 0
    var _count = 0

    var _result = _search.run().getRange({
      start: 0,
      end: 1000,
    })

    for (var i = 0; i < _result.length; i++) {
      var _internalid = _result[i].id
      //發票號碼
      var _voucher_number = _result[i].getValue({
        name: 'custrecord_gw_voucher_number',
      })
      var _voucher_date = _result[i].getValue({
        name: 'custrecord_gw_voucher_date',
      })
      var _voucher_yearmonth = _result[i].getValue({
        name: 'custrecord_gw_voucher_yearmonth',
      })
      var _discount_count = _result[i].getValue({
        name: 'custrecord_gw_discount_count',
      })
      //未稅金額
      var _sales_amount = _result[i].getValue({
        name: 'custrecord_gw_sales_amount',
      })
      //免稅金額
      var _free_sales_amount = _result[i].getValue({
        name: 'custrecord_gw_free_sales_amount',
      })
      //零稅金額
      var _zero_sales_amount = _result[i].getValue({
        name: 'custrecord_gw_zero_sales_amount',
      })
      //已折金額(未稅)
      var _discount_amount = _result[i].getValue({
        name: 'custrecord_gw_discount_amount',
      })
      ///////////////////////////////////////////////////////////////////////////////////
      //可扣抵餘額
      var _amount =
        stringutility.convertToFloat(_sales_amount) +
        stringutility.convertToFloat(_free_sales_amount) +
        stringutility.convertToFloat(_zero_sales_amount) -
        stringutility.convertToFloat(_discount_amount)

      _amountSum += _amount

      if (deductionSalesAmount >= _amount) {
        var _obj = {
          internalid: _internalid,
          voucher_number: _voucher_number,
          voucher_date: _voucher_date,
          voucher_yearmonth: _voucher_yearmonth,
          voucher_sales_amount:
            stringutility.convertToFloat(_sales_amount) +
            stringutility.convertToFloat(_free_sales_amount) +
            stringutility.convertToFloat(_zero_sales_amount), //發票金額(未稅)
          discount_count: stringutility.convertToFloat(_discount_count) + 1, //折讓次數累計
          deduction_amount: _amount, //本次折讓金額
          discount_amount:
            stringutility.convertToFloat(_sales_amount) +
            stringutility.convertToFloat(_free_sales_amount) +
            stringutility.convertToFloat(_zero_sales_amount), //折讓金額累計
        }
        //扣掉金額
        deductionSalesAmount -= _amount
        _objAry.push(_obj)
      } else if (deductionSalesAmount != 0) {
        _discount_count = stringutility.convertToFloat(_discount_count) + 1
        _discount_amount =
          deductionSalesAmount + stringutility.convertToFloat(_discount_amount)

        var _obj = {
          internalid: _internalid,
          voucher_number: _voucher_number,
          voucher_date: _voucher_date,
          voucher_yearmonth: _voucher_yearmonth,
          voucher_sales_amount:
            stringutility.convertToFloat(_sales_amount) +
            stringutility.convertToFloat(_free_sales_amount) +
            stringutility.convertToFloat(_zero_sales_amount),
          discount_count: _discount_count,
          deduction_amount: deductionSalesAmount,
          discount_amount: _discount_amount,
        }
        _objAry.push(_obj)
        break
      }
    }
    if (_amountSum >= deductionSalesAmount) _ok = true

    var _checkObj = {
      checkResult: _ok,
      eGUIResult: _objAry,
    }
    //alert('_checkObj='+JSON.stringify(_checkObj));
    return _checkObj
  }

  //取得折扣商品名稱及單價(傳入discountitem)
  function getDiscountItemInformation(itemId) {
    var _itemName = ''
    var _itemUnitPrice = '0'
    var _search = search
      .create({
        type: search.Type.DISCOUNT_ITEM,
        columns: [
          'internalid',
          'itemid',
          'price',
          'onlineprice',
          'description',
          'displayname',
        ],
        filters: ['internalid', 'is', parseInt(itemId)],
      })
      .run()
      .each(function (result) {
        _itemName = result.getValue({
          name: 'displayname',
        })
        _itemUnitPrice = result.getValue({
          //折扣
          name: 'price',
        })
        return true
      })
    var _jsonObj = { itemName: _itemName, itemUnitPrice: _itemUnitPrice }

    return _jsonObj
  }

  /**
   * type : 類別 (INVOICE, CREDITMEMO)
   * internalId : internalId
   * discountHistoryAry : 折扣紀錄
   */
  function getDiscountItemAmountObj(type, internalId, discountHistoryAry) {
    var _discountitem = ''
    var _discounttotal = 0

    if (type === 'INVOICE') {
      //載入Invoice基本資料
      var _record = record.load({
        type: search.Type.INVOICE,
        id: parseInt(internalId),
        isDynamic: true,
      })
      _discountitem = _record.getValue({
        fieldId: 'discountitem',
      })
      if (typeof _discountitem !== 'undefined') {
        _discounttotal = _record.getValue({
          fieldId: 'discounttotal',
        })
      }
    } else {
      //CREDITMEMO
      var _record = record.load({
        type: search.Type.CREDIT_MEMO,
        id: parseInt(internalId),
        isDynamic: true,
      })
      _discountitem = _record.getValue({
        fieldId: 'discountitem',
      })
      if (typeof _discountitem !== 'undefined') {
        _discounttotal = _record.getValue({
          fieldId: 'discounttotal',
        })
      }
    }

    if (typeof _discountitem !== 'undefined' && _discountitem !== '') {
      var _discounttotal = _record.getValue({
        fieldId: 'discounttotal',
      })

      var _exist = false
      if (discountHistoryAry.length != 0) {
        for (var i = 0; i < discountHistoryAry.length; i++) {
          var _obj = discountHistoryAry[i]
          if (_discountitem === _obj.discountitem) {
            _obj.discounttotal =
              stringutility.convertToFloat(_obj.discounttotal) +
              stringutility.convertToFloat(_discounttotal)
            _exist = true
            break
          }
        }
      }
      if (_exist === false) {
        var _discountObj = getDiscountItemInformation(_discountitem)
        var _discountJsonObj = {
          discountitem: _discountitem,
          discountitemname: _discountObj.itemName,
          discounttotal: _discounttotal,
        }
        discountHistoryAry.push(_discountJsonObj)
      }
    }

    return discountHistoryAry
  }

  //將異動結果回寫到Invoice.custbody_gw_voucher_flow_status = '1'
  function updateInvoiceAndCreditMemoFlowStatus(
    invoice_hiddent_listid,
    creditmemo_hiddent_listid
  ) {
    var _invoice_hiddent_listid = _current_record.getValue({
      fieldId: invoice_hiddent_listid,
    })

    var _invoce_control_field_value = gwconfigure.lockInvoceControlFieldId()
    if (typeof _invoice_hiddent_listid !== 'undefined') {
      var _idAry = _invoice_hiddent_listid.split(',')
      for (var i = 0; i < _idAry.length; i++) {
        var _internalId = _idAry[i]
        if (parseInt(_internalId) > 0) {
          /**
           var _record = record.load({
										type: record.Type.INVOICE, 
										id: parseInt(_internalId),
										isDynamic: true,
									 });
           */
          //_record.setValue({fieldId:_invoce_control_field_id,value:_invoce_control_field_value});

          try {
            //_record.save();
            var values = {}
            values[_invoce_control_field_id] = _invoce_control_field_value

            var _id = record.submitFields({
              type: record.Type.INVOICE,
              id: parseInt(_internalId),
              values: values,
              options: {
                enableSourcing: false,
                ignoreMandatoryFields: true,
              },
            })
          } catch (e) {
            console.log(e.name + ':' + e.message)
          }
        }
      }
    }

    var _creditmemo_hiddent_listid = _current_record.getValue({
      fieldId: creditmemo_hiddent_listid,
    })

    var _credit_control_field_value = gwconfigure.lockCredMemoControlFieldId()
    if (typeof _creditmemo_hiddent_listid !== 'undefined') {
      var _idAry = _creditmemo_hiddent_listid.split(',')
      for (var i = 0; i < _idAry.length; i++) {
        var _internalId = _idAry[i]
        if (parseInt(_internalId) > 0) {
          /**
           var _record = record.load({
											type: record.Type.CREDIT_MEMO, 
											id: parseInt(_internalId),
											isDynamic: true,
										 });

           _record.setValue({fieldId:_credmemo_control_field_id,value:_credit_control_field_value});
           */
          try {
            //_record.save();
            var values = {}
            values[_credmemo_control_field_id] = _credit_control_field_value

            var _id = record.submitFields({
              type: record.Type.CREDIT_MEMO,
              id: parseInt(_internalId),
              values: values,
              options: {
                enableSourcing: false,
                ignoreMandatoryFields: true,
              },
            })
          } catch (e) {
            console.log(e.name + ':' + e.message)
          }
        }
      }
    }
  }

  return {
    pageInit: pageInit,
    validateForm: validateForm,
    submitDocument: submitDocument,
    fieldChanged: fieldChanged,
    sublistChanged: sublistChanged,
  }
})
