/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 * @NModuleScope Public
 */
define([
  'N/runtime',
  'N/search',
  'N/record',
  'N/xml',
  'N/https',
  'N/file',
  '../../gw_library/gw_api/gw_api',
  '../gw_common_utility/gw_common_date_utility',
  '../gw_common_utility/gw_common_string_utility',
  '../gw_common_utility/gw_common_invoice_utility',
  '../gw_common_utility/gw_common_migxml_utility',
  '../gw_common_utility/gw_common_configure',
], function (
  runtime,
  search,
  record,
  xml,
  https,
  file,
  gwapi,
  dateutility,
  stringutility,
  invoiceutility,
  migxmlutility,
  gwconfigure
) {
  var _default_upload_status = 'A'
  var _gw_voucher_main_search_id = gwconfigure.getGwVoucherMainSearchId()
  var _voucher_main_record = gwconfigure.getGwVoucherMainRecord()

  var _gw_mig_a0101_xml_path = gwconfigure.getGwMigA0101XmlPath()
  var _gw_mig_a0401_xml_path = gwconfigure.getGwMigA0401XmlPath()
  var _gw_mig_c0401_xml_path = gwconfigure.getGwMigC0401XmlPath()
  var _gw_mig_b0101_xml_path = gwconfigure.getGwMigB0101XmlPath()
  var _gw_mig_b0401_xml_path = gwconfigure.getGwMigB0401XmlPath()
  var _gw_mig_d0401_xml_path = gwconfigure.getGwMigD0401XmlPath() //C0401的折讓單
  var _version = gwconfigure.getGwMigVersion() //GateWeb API Version

  var _gw_url_string = gwconfigure.getGwUrlString()
  var _companyKey = gwconfigure.getGwCompanyKey()
  var _userName = gwconfigure.getGwUserName()
  var _pwd = gwconfigure.getGwPwd() //'walter1111'
  var _numericToFixed = gwconfigure.getGwNumericToFixed()

  var _NETSUITE_MODEL = 'NETSUITE'
  var _GATEWEB_MODEL = 'GATEWEB'

  function loadInvoiceMigXml(voucherType, migType) {
    var _xmlString
    try {
      var _file_path = ''
      if (voucherType === 'EGUI') {
        if (migType == 'B2BE') {
          _file_path = _gw_mig_a0101_xml_path
        } else if (migType == 'B2BS') {
          //_file_path = _gw_mig_a0401_xml_path;
          _file_path = _gw_mig_c0401_xml_path //A0401轉成C0401
        } else if (migType == 'B2C') {
          _file_path = _gw_mig_c0401_xml_path
        }
      } else if (voucherType === 'ALLOWANCE') {
        if (migType == 'B2BE') {
          //TODO
          _file_path = _gw_mig_b0101_xml_path
        } else if (migType == 'B2BS') {
          //_file_path = _gw_mig_b0401_xml_path;
          _file_path = _gw_mig_d0401_xml_path //B0401轉成D0401
        } else if (migType == 'B2C') {
          _file_path = _gw_mig_d0401_xml_path
        }
      }
      if (_file_path !== '') _xmlString = file.load(_file_path).getContents()
    } catch (e) {
      log.error(e.name, e.message)
    }
    return _xmlString
  }

  function setXmlMainAndAmountValue(
    _xmlDocument,
    selectedpath,
    parentNodeName,
    nodeName,
    nodeValue
  ) {
    try {
      var _migInvoiceNode = xml.XPath.select({
        node: _xmlDocument,
        xpath: selectedpath,
      })

      for (var i = 0; i < _migInvoiceNode.length; i++) {
        var _childNodes = _migInvoiceNode[i].childNodes

        for (var j = 0; j < _childNodes.length; j++) {
          var _childNode = _childNodes[j]
          var _childNodeName = _childNodes[j].nodeName
          //處理Main及Amount
          if (_childNodeName !== 'Details') {
            //處理Main及Amount
            converNode(_childNode, parentNodeName, nodeName, nodeValue, false)
          }
        }
      }
    } catch (e) {
      log.error(e.name, e.message)
    }
  }

  function setEGUIXmlDetailsItemValue(
    _xmlDocument,
    isFirst,
    description,
    quantity,
    unit,
    unitPrice,
    amount,
    sequenceNumber,
    itemremark
  ) {
    try {
      var _migInvoiceNode = xml.XPath.select({
        node: _xmlDocument,
        xpath: 'Invoice',
      })

      for (var i = 0; i < _migInvoiceNode.length; i++) {
        var _childNodes = _migInvoiceNode[i].childNodes

        for (var j = 0; j < _childNodes.length; j++) {
          var _childNode = _childNodes[j]
          var _childNodeName = _childNodes[j].nodeName
          //處理Details
          if (_childNodeName === 'Details') {
            if (isFirst === true) {
              converNode(
                _childNodes[j].firstChild,
                'ProductItem',
                'Description',
                description,
                false
              )
              converNode(
                _childNodes[j].firstChild,
                'ProductItem',
                'Quantity',
                quantity,
                false
              )
              converNode(
                _childNodes[j].firstChild,
                'ProductItem',
                'Unit',
                unit,
                false
              )
              converNode(
                _childNodes[j].firstChild,
                'ProductItem',
                'UnitPrice',
                unitPrice,
                false
              )
              converNode(
                _childNodes[j].firstChild,
                'ProductItem',
                'Amount',
                amount,
                false
              )
              converNode(
                _childNodes[j].firstChild,
                'ProductItem',
                'SequenceNumber',
                sequenceNumber,
                false
              )
              converNode(
                _childNodes[j].firstChild,
                'ProductItem',
                'Remark',
                itemremark,
                false
              )
            } else {
              var _productItemNode = _childNodes[j].lastChild
              //複製筆數
              var _copiedNode = _productItemNode.cloneNode({
                deep: true,
              })
              converNode(
                _copiedNode,
                'Description',
                'Description',
                description,
                true
              )
              converNode(_copiedNode, 'Quantity', 'Quantity', quantity, true)
              converNode(_copiedNode, 'Unit', 'Unit', unit, true)
              converNode(_copiedNode, 'UnitPrice', 'UnitPrice', unitPrice, true)
              converNode(_copiedNode, 'Amount', 'Amount', amount, true)
              converNode(
                _copiedNode,
                'SequenceNumber',
                'SequenceNumber',
                sequenceNumber,
                true
              )
              converNode(_copiedNode, 'Remark', 'Remark', itemremark, true)

              _childNodes[j].appendChild(_copiedNode)
            }
          }
        }
      }
    } catch (e) {
      log.error(e.name, e.message)
    }
  }

  function setAllowanceXmlDetailsItemValue(
    _xmlDocument,
    xmlpath,
    isFirst,
    description,
    quantity,
    unit,
    unitPrice,
    amount,
    sequenceNumber,
    itemremark,
    originalInvoiceNumber,
    originalInvoiceDate,
    taxType,
    taxAmount
  ) {
    try {
      var _migInvoiceNode = xml.XPath.select({
        node: _xmlDocument,
        xpath: xmlpath,
      })

      for (var i = 0; i < _migInvoiceNode.length; i++) {
        var _childNodes = _migInvoiceNode[i].childNodes

        for (var j = 0; j < _childNodes.length; j++) {
          var _childNode = _childNodes[j]
          var _childNodeName = _childNodes[j].nodeName
          //處理Details
          if (_childNodeName === 'Details') {
            if (isFirst === true) {
              converNode(
                _childNodes[j].firstChild,
                'ProductItem',
                'OriginalInvoiceNumber',
                originalInvoiceNumber,
                false
              )
              converNode(
                _childNodes[j].firstChild,
                'ProductItem',
                'OriginalInvoiceDate',
                originalInvoiceDate,
                false
              )
              converNode(
                _childNodes[j].firstChild,
                'ProductItem',
                'OriginalSequenceNumber',
                sequenceNumber,
                false
              )
              converNode(
                _childNodes[j].firstChild,
                'ProductItem',
                'OriginalDescription',
                description,
                false
              )
              converNode(
                _childNodes[j].firstChild,
                'ProductItem',
                'Quantity',
                quantity,
                false
              )
              converNode(
                _childNodes[j].firstChild,
                'ProductItem',
                'Unit',
                unit,
                false
              )
              converNode(
                _childNodes[j].firstChild,
                'ProductItem',
                'UnitPrice',
                unitPrice,
                false
              )
              converNode(
                _childNodes[j].firstChild,
                'ProductItem',
                'Amount',
                amount,
                false
              )
              converNode(
                _childNodes[j].firstChild,
                'ProductItem',
                'AllowanceSequenceNumber',
                sequenceNumber,
                false
              )
              converNode(
                _childNodes[j].firstChild,
                'ProductItem',
                'TaxType',
                taxType,
                false
              )
              converNode(
                _childNodes[j].firstChild,
                'ProductItem',
                'Tax',
                taxAmount,
                false
              )
              //converNode(_childNodes[j].firstChild, 'ProductItem', 'Remark', itemremark, false);
            } else {
              var _productItemNode = _childNodes[j].lastChild
              //複製筆數
              var _copiedNode = _productItemNode.cloneNode({
                deep: true,
              })
              converNode(
                _copiedNode,
                'OriginalInvoiceNumber',
                'OriginalInvoiceNumber',
                originalInvoiceNumber,
                true
              )
              converNode(
                _copiedNode,
                'OriginalInvoiceDate',
                'OriginalInvoiceDate',
                originalInvoiceDate,
                true
              )
              converNode(
                _copiedNode,
                'OriginalInvoiceDate',
                'OriginalSequenceNumber',
                sequenceNumber,
                true
              )
              converNode(
                _copiedNode,
                'OriginalDescription',
                'OriginalDescription',
                description,
                true
              )
              converNode(_copiedNode, 'Quantity', 'Quantity', quantity, true)
              converNode(_copiedNode, 'Unit', 'Unit', unit, true)
              converNode(_copiedNode, 'UnitPrice', 'UnitPrice', unitPrice, true)
              converNode(_copiedNode, 'Amount', 'Amount', amount, true)
              converNode(
                _copiedNode,
                'AllowanceSequenceNumber',
                'AllowanceSequenceNumber',
                sequenceNumber,
                true
              )
              converNode(_copiedNode, 'ProductItem', 'TaxType', taxType, true)
              converNode(_copiedNode, 'ProductItem', 'Tax', taxAmount, true)
              //converNode(_copiedNode, 'Remark', 'Remark', itemremark, true);

              _childNodes[j].appendChild(_copiedNode)
            }
          }
        }
      }
    } catch (e) {
      log.error(e.name, e.message)
    }
  }

  function converNode(
    node,
    parentNodeName,
    nodeName,
    nodeValue,
    isAccessDetail
  ) {
    try {
      var _hasChildren = node.hasChildNodes()
      if (_hasChildren) {
        var _childNodes = node.childNodes
        for (var i = 0; i < _childNodes.length; i++) {
          var _childNode = _childNodes[i]
          converNode(
            _childNode,
            parentNodeName,
            nodeName,
            nodeValue,
            isAccessDetail
          )
        }
      } else {
        var _nodeName = node.nodeName
        var _nodeText = node.textContent

        var _parentNodeName = node.parentNode.nodeName
        if (isAccessDetail === true) {
          if (_parentNodeName === nodeName) {
            node.textContent = nodeValue
          }
        } else {
          if (_parentNodeName === parentNodeName && _nodeName === nodeName) {
            node.textContent = nodeValue
          }
        }
      }
    } catch (e) {
      log.error(e.name, e.message)
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //處理上傳資料-START
  function sendXmlToGW(xmlString, fileName) {
    var _result
    try {
      log.debug('sendXmlToGW', xmlString)
      log.debug('sendXmlToGW', fileName)

      var _response = gwapi.uploadGuiXml(xmlString, fileName)
      var _code = _response.code // see https.ClientResponse.code
      var _message = _response.body // see https.ClientResponse.body

      _result = {
        codenumber: _code,
        message: _message,
      }
      //log.debug('convert result', JSON.parse(_result));
    } catch (e) {
      log.error(e.name, e.message)
    }
    return _result
  }

  //處理上傳資料-END
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //處理發票資料-START
  function getVoucherToDoList(access_model, voucher_type) {
    var _jsonObjAry = []

    try {
      //1. Load XML
      var _b2bs_xml = loadInvoiceMigXml(voucher_type, 'B2BS')
      var _b2be_xml = loadInvoiceMigXml(voucher_type, 'B2BE')
      var _b2c_xml = loadInvoiceMigXml(voucher_type, 'B2C')

      var _xmlDocument
      var _mySearch = search.load({
        id: _gw_voucher_main_search_id,
      })
      var _filterArray = []
      _filterArray.push(['custrecord_gw_voucher_type', 'is', voucher_type])
      _filterArray.push('and')
      _filterArray.push([
        'custrecord_gw_voucher_upload_status',
        'is',
        _default_upload_status,
      ]) //status=A
      _filterArray.push('and')
      _filterArray.push(['custrecord_gw_need_upload_egui_mig', 'isnot', 'NONE'])
      _filterArray.push('and')
      _filterArray.push(['custrecord_gw_is_completed_detail', 'is', true])
      _filterArray.push('and')
      _filterArray.push([
        'custrecord_gw_voucher_status',
        'is',
        'VOUCHER_SUCCESS',
      ])

      _mySearch.filterExpression = _filterArray

      var _indexId = ''
      var _isFirst = true
      var _pre_mig_type = ''
      var _pre_apply_id = 0
      var _pre_voucher_number = ''
      var _pre_buyer = ''
      var _pre_tax_type = ''

      var _pre_zero_sales_amount = 0
      var _select_path = 'Invoice'
      if (voucher_type !== 'EGUI') {
        _select_path = 'Allowance'
      }
      _mySearch.run().each(function (result) {
        var _result = JSON.parse(JSON.stringify(result))
        log.debug('JSON.stringify(result)', JSON.stringify(result))
        //1.Main Information
        var _id = _result.id //948
        var _mig_type = _result.values.custrecord_gw_mig_type //B2BS, B2BE, B2C
        var _voucher_number = _result.values.custrecord_gw_voucher_number
        var _voucher_date = _result.values.custrecord_gw_voucher_date
        var _voucher_time = _result.values.custrecord_gw_voucher_time
        var _voucher_yearmonth = _result.values.custrecord_gw_voucher_yearmonth
        var _seller = _result.values.custrecord_gw_seller
        var _seller_name = _result.values.custrecord_gw_seller_name
        var _seller_address = _result.values.custrecord_gw_seller_address
        var _buyer = _result.values.custrecord_gw_buyer
        var _buyer_name = _result.values.custrecord_gw_buyer_name
        var _buyer_address = _result.values.custrecord_gw_buyer_address
        var _buyer_dept_code = _result.values.custrecord_gw_buyer_dept_code
        var _invoice_type = _result.values.custrecord_gw_invoice_type
        var _carrier_type = _result.values.custrecord_gw_carrier_type
        var _carrierid1 = _result.values.custrecord_gw_carrierid1
        var _carrierid2 = _result.values.custrecord_gw_carrierid2
        var _npoban = _result.values.custrecord_gw_npoban
        var _clearance_mark = _result.values.custrecord_gw_clearance_mark
        var _main_remark = _result.values.custrecord_gw_main_remark
        var _random_number = _result.values.custrecord_gw_random_number
        var _need_upload_egui_mig =
          _result.values.custrecord_gw_need_upload_egui_mig
        var _tax_rate = _result.values.custrecord_gw_tax_rate //0.05
        var _tax_type = _result.values.custrecord_gw_tax_type
        var _print_mark = _result.values.custrecord_gw_print_mark

        //////////////////////////////////////////////////////////////////////////////////////
        //20201110 walter 紀錄了Netsuite原始資料內容
        //////////////////////////////////////////////////////////////////////////////////////
        var _sales_amount = _result.values.custrecord_gw_sales_amount
        var _free_sales_amount = _result.values.custrecord_gw_free_sales_amount
        var _zero_sales_amount = _result.values.custrecord_gw_zero_sales_amount

        var _tax_amount = _result.values.custrecord_gw_tax_amount
        var _total_amount = _result.values.custrecord_gw_total_amount
        //////////////////////////////////////////////////////////////////////////////////////

        //四捨五入
        if (stringutility.convertToFloat(_tax_rate) == 0) {
          //0.00
          _tax_rate = '0'
        }

        //20201110 walter modify
        if (access_model == _GATEWEB_MODEL) {
          _tax_amount = Math.round(
            stringutility.convertToFloat(_sales_amount) * 0.05
          ).toString()

          _total_amount = Math.round(
            stringutility.convertToFloat(_sales_amount) +
              stringutility.convertToFloat(_free_sales_amount) +
              stringutility.convertToFloat(_zero_sales_amount) +
              stringutility.convertToFloat(_tax_amount)
          ).toString()
        }

        //判斷B2C , C0401的相關欄位計算
        if (
          voucher_type === 'EGUI' &&
          _mig_type !== 'B2E' &&
          _buyer == '0000000000'
        ) {
          //Invoice & B2C & C0401
          //C0401(0000000000) 的發票，這裡要含稅金
          _sales_amount = Math.round(
            stringutility.convertToFloat(_sales_amount) +
              stringutility.convertToFloat(_tax_amount)
          ).toString()
          _tax_amount = '0' //B2C的發票，稅金為0
        } else if (voucher_type == 'ALLOWANCE') {
          _sales_amount = Math.round(
            stringutility.convertToFloat(_sales_amount)
          ).toString()
          //折讓單要放未稅金額
          _total_amount = (
            stringutility.convertToFloat(_sales_amount) +
            stringutility.convertToFloat(_free_sales_amount) +
            stringutility.convertToFloat(_zero_sales_amount)
          ).toString()
        } else {
          //C0401(非0000000000)
          _sales_amount = Math.round(
            stringutility.convertToFloat(_sales_amount)
          ).toString()
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////
        //以下金額都要四捨五入
        _free_sales_amount = Math.round(
          stringutility.convertToFloat(_free_sales_amount)
        ).toString()
        _zero_sales_amount = Math.round(
          stringutility.convertToFloat(_zero_sales_amount)
        ).toString()
        _tax_amount = Math.round(
          stringutility.convertToFloat(_tax_amount)
        ).toString()
        _total_amount = Math.round(
          stringutility.convertToFloat(_total_amount)
        ).toString()
        /////////////////////////////////////////////////////////////////////////////////////////////////

        if (_indexId !== _id) {
          ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          if (_indexId !== '') {
            //處理 mig xml 檔
            var _mig_xml = xml.Parser.toString({
              document: _xmlDocument,
            })

            if (voucher_type === 'EGUI') {
              if (_pre_mig_type === 'B2BS') {
                _mig_xml = _mig_xml.replace(
                  'Invoice',
                  'Invoice xmlns="urn:GEINV:eInvoiceMessage:C0401:3.1"'
                )
                if (_pre_zero_sales_amount == 0) {
                  //非零稅要拿掉
                  _mig_xml = _mig_xml.replace('<CustomsClearanceMark/>', '')
                }
                if (_pre_buyer == '0000000000') {
                  //B2C +C0401
                  _mig_xml = _mig_xml.replace('<RelateNumber/>', '')
                }
              } else if (_pre_mig_type === 'B2BE') {
                _mig_xml = _mig_xml.replace(
                  'Invoice',
                  'Invoice xmlns="urn:GEINV:eInvoiceMessage:A0101:3.1"'
                )
              } else if (_pre_mig_type === 'B2C') {
                _mig_xml = _mig_xml.replace(
                  'Invoice',
                  'Invoice xmlns="urn:GEINV:eInvoiceMessage:C0401:3.1"'
                )
                if (_pre_zero_sales_amount == 0) {
                  //非零稅要拿掉
                  _mig_xml = _mig_xml.replace('<CustomsClearanceMark/>', '')
                }
                if (_pre_buyer == '0000000000') {
                  //B2C +C0401
                  _mig_xml = _mig_xml.replace('<RelateNumber/>', '')
                }
              }
            } else {
              //ALLOWANCE
              if (_pre_mig_type === 'B2BS') {
                //_mig_xml = _mig_xml.replace('Allowance', 'Allowance xmlns="urn:GEINV:eInvoiceMessage:B0401:3.1"');
                _mig_xml = _mig_xml.replace(
                  'Allowance',
                  'Allowance xmlns="urn:GEINV:eInvoiceMessage:D0401:3.1"'
                )
              } else if (_pre_mig_type === 'B2BE') {
                _mig_xml = _mig_xml.replace(
                  'Allowance',
                  'Allowance xmlns="urn:GEINV:eInvoiceMessage:B0101:3.1"'
                )
              } else if (_pre_mig_type === 'B2C') {
                _mig_xml = _mig_xml.replace(
                  'Allowance',
                  'Allowance xmlns="urn:GEINV:eInvoiceMessage:D0401:3.1"'
                )
              }
            }
            //A0101-AX123456789-123
            var _xml_mig_type = invoiceutility.getMigType(
              'APPLY',
              voucher_type,
              _pre_mig_type
            )
            var _file_name =
              _xml_mig_type + '-' + _pre_voucher_number + '-' + _pre_apply_id
            var _jsonObj = {
              apply_id: _pre_apply_id,
              mig_type: _xml_mig_type,
              file_name: _file_name,
              mig_xml: _mig_xml,
            }
            _jsonObjAry.push(_jsonObj)
            _isFirst = true
          }
          ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          //要記錄下一筆的migType
          if (_mig_type === 'B2BS') {
            _xmlDocument = xml.Parser.fromString({
              text: _b2c_xml,
            })
          } else if (_mig_type === 'B2BE') {
            _xmlDocument = xml.Parser.fromString({
              text: _b2be_xml,
            })
          } else if (_mig_type === 'B2C') {
            _xmlDocument = xml.Parser.fromString({
              text: _b2c_xml,
            })
          }

          if (voucher_type === 'EGUI') {
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'InvoiceNumber',
              _voucher_number
            )
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'InvoiceDate',
              _voucher_date
            )
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'InvoiceTime',
              _voucher_time
            )
          } else {
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'AllowanceNumber',
              _voucher_number
            )
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'AllowanceDate',
              _voucher_date
            )
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'AllowanceType',
              '2'
            )
          }
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Seller',
            'Identifier',
            _seller
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Seller',
            'Name',
            _seller_name
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Seller',
            'Address',
            _seller_address
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Buyer',
            'Identifier',
            _buyer
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Buyer',
            'Name',
            _buyer_name
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Buyer',
            'Address',
            _buyer_address
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Main',
            'InvoiceType',
            _invoice_type
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Main',
            'RandomNumber',
            _random_number
          )

          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Main',
            'MainRemark',
            _main_remark
          )
          if (voucher_type === 'EGUI' && _zero_sales_amount != 0) {
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'CustomsClearanceMark',
              _clearance_mark
            )
          }
          if (voucher_type === 'EGUI' && _buyer != '0000000000') {
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'RelateNumber',
              _id
            )
          }
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Main',
            'PrintMark',
            _print_mark
          )

          if (_mig_type === 'B2C') {
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'CarrierType',
              _carrier_type
            )
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'CarrierId1',
              _carrierid1
            )
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'CarrierId2',
              _carrierid2
            )
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'NPOBAN',
              _npoban
            )
          }
          //DonateMark
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Main',
            'DonateMark',
            '0'
          )
          if (_npoban !== '') {
            setXmlMainAndAmountValue(
              _xmlDocument,
              _select_path,
              'Main',
              'DonateMark',
              '1'
            )
          }
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Amount',
            'SalesAmount',
            _sales_amount
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Amount',
            'FreeTaxSalesAmount',
            _free_sales_amount
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Amount',
            'ZeroTaxSalesAmount',
            _zero_sales_amount
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Amount',
            'TaxAmount',
            _tax_amount
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Amount',
            'TaxRate',
            _tax_rate
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Amount',
            'TaxType',
            _tax_type
          )
          setXmlMainAndAmountValue(
            _xmlDocument,
            _select_path,
            'Amount',
            'TotalAmount',
            _total_amount
          )

          _indexId = _id
        }

        //Item Details
        var _item_description =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_item_description'
          ]
        var _unit_price =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_unit_price'
          ]
        var _item_quantity =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_item_quantity'
          ]
        var _dtl_item_tax_code =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_dtl_item_tax_code'
          ]
        var _dtl_item_tax_rate =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_dtl_item_tax_rate'
          ]
        _dtl_item_tax_rate.replace('%', '')
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //20201110 walter 紀錄原始Netsuite資料內容
        var _item_amount =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_item_amount'
          ]
        var _item_tax_amount =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_item_tax_amount'
          ]
        var _item_total_amount =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_item_total_amount'
          ]
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var _item_seq =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_item_seq'
          ]
        var _item_remark =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_item_remark'
          ]
        var _item_unit =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_item_unit'
          ]
        var _original_gui_number =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_original_gui_number'
          ]
        var _original_gui_date =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_original_gui_date'
          ]
        var _original_gui_yearmonth =
          _result.values[
            'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID.custrecord_gw_original_gui_yearmonth'
          ]

        var _item_tax_type = gwconfigure.getGwTaxTypeFromNSTaxCode(
          _dtl_item_tax_code
        )

        //折讓單的稅別要四捨五入(_allowanceTaxAmount)
        var _allowanceTaxAmount = Math.round(
          stringutility.convertToFloat(_item_tax_amount)
        ).toString()
        if (access_model == _GATEWEB_MODEL) {
          _allowanceTaxAmount = Math.round(
            (stringutility.convertToFloat(_item_amount) *
              stringutility.convertToFloat(_dtl_item_tax_rate)) /
              100
          ).toString()
        }
        //把小數點.0拿掉
        _item_quantity = Math.round(
          stringutility.convertToFloat(_item_quantity)
        ).toString()
        _dtl_item_tax_rate = Math.round(
          stringutility.convertToFloat(_dtl_item_tax_rate)
        ).toString()
        //_item_amount       = (Math.round((stringutility.convertToFloat(_item_amount)))).toString();
        //20201102 walter modify 取消四捨五入
        if (
          voucher_type === 'EGUI' &&
          _mig_type !== 'B2E' &&
          _buyer == '0000000000'
        ) {
          //C0401(0000000000) 單價要含稅 ,要相容以前資料
          if (
            access_model == _GATEWEB_MODEL ||
            stringutility.convertToFloat(_item_total_amount) == 0
          ) {
            //_item_amount = Math.round( convertToFloat(_item_quantity) * convertToFloat(_unit_price) * (1 + convertToFloat(_dtl_item_tax_rate)/100) ).toString();
            _item_amount = Math.round(
              stringutility.convertToFloat(_item_amount) *
                (1 + stringutility.convertToFloat(_dtl_item_tax_rate) / 100)
            ).toString()
          } else {
            _item_amount = _item_total_amount
          }
        }
        if (stringutility.convertToFloat(_item_quantity) != 0) {
          _unit_price = (
            stringutility.convertToFloat(_item_amount) /
            stringutility.convertToFloat(_item_quantity)
          )
            .toFixed(_numericToFixed)
            .toString()
        } else {
          _unit_price = '0'
        }
        log.debug('get result unit_price', 'unit_price=' + _unit_price)

        if (voucher_type === 'EGUI') {
          setEGUIXmlDetailsItemValue(
            _xmlDocument,
            _isFirst,
            _item_description,
            _item_quantity,
            _item_unit,
            _unit_price,
            _item_amount,
            _item_seq,
            _item_remark
          )
        } else {
          setAllowanceXmlDetailsItemValue(
            _xmlDocument,
            _select_path,
            _isFirst,
            _item_description,
            _item_quantity,
            _item_unit,
            _unit_price,
            _item_amount,
            _item_seq,
            _item_remark,
            _original_gui_number,
            _original_gui_date,
            _item_tax_type,
            _allowanceTaxAmount
          )
        }

        _isFirst = false

        _pre_apply_id = _id
        _pre_mig_type = _mig_type
        _pre_buyer = _buyer
        _pre_tax_type = _tax_type
        _pre_voucher_number = _voucher_number
        _pre_zero_sales_amount = _zero_sales_amount

        return true
      })
      log.debug(
        'check data',
        'voucher_type=' + voucher_type + ' ,_pre_tax_type=' + _pre_tax_type
      )
      //有資料才做
      if (_pre_apply_id != 0) {
        var _mig_xml = xml.Parser.toString({
          document: _xmlDocument,
        })
        if (voucher_type === 'EGUI') {
          if (_pre_mig_type === 'B2BS') {
            //_mig_xml = _mig_xml.replace('Invoice', 'Invoice xmlns="urn:GEINV:eInvoiceMessage:A0401:3.1"');
            _mig_xml = _mig_xml.replace(
              'Invoice',
              'Invoice xmlns="urn:GEINV:eInvoiceMessage:C0401:3.1"'
            )
            //_mig_xml = _mig_xml.replace('Invoice', 'Invoice xmlns="urn:GEINV:eInvoiceMessage:C0401:3.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:GEINV:eInvoiceMessage:C0401:3.1 C0401.xsd"');
            if (_pre_zero_sales_amount == 0) {
              //非零稅要拿掉
              _mig_xml = _mig_xml.replace('<CustomsClearanceMark/>', '')
            }
            if (_pre_buyer == '0000000000') {
              //B2C +C0401
              _mig_xml = _mig_xml.replace('<RelateNumber/>', '')
            }
            log.debug('convert last B2BS xml data', _mig_xml)
          } else if (_pre_mig_type === 'B2BE') {
            _mig_xml = _mig_xml.replace(
              'Invoice',
              'Invoice xmlns="urn:GEINV:eInvoiceMessage:A0101:3.1"'
            )
          } else if (_pre_mig_type === 'B2C') {
            _mig_xml = _mig_xml.replace(
              'Invoice',
              'Invoice xmlns="urn:GEINV:eInvoiceMessage:C0401:3.1"'
            )
            if (_pre_zero_sales_amount == 0) {
              //非零稅要拿掉
              _mig_xml = _mig_xml.replace('<CustomsClearanceMark/>', '')
            }
            if (_pre_buyer == '0000000000') {
              //B2C +C0401
              _mig_xml = _mig_xml.replace('<RelateNumber/>', '')
            }
            log.debug('convert last B2C xml data', _mig_xml)
          }
        } else {
          //ALLOWANCE
          if (_pre_mig_type === 'B2BS') {
            //_mig_xml = _mig_xml.replace('Allowance', 'Allowance xmlns="urn:GEINV:eInvoiceMessage:B0401:3.1"');
            _mig_xml = _mig_xml.replace(
              'Allowance',
              'Allowance xmlns="urn:GEINV:eInvoiceMessage:D0401:3.1"'
            )
          } else if (_pre_mig_type === 'B2BE') {
            _mig_xml = _mig_xml.replace(
              'Allowance',
              'Allowance xmlns="urn:GEINV:eInvoiceMessage:B0101:3.1"'
            )
          } else if (_pre_mig_type === 'B2C') {
            _mig_xml = _mig_xml.replace(
              'Allowance',
              'Allowance xmlns="urn:GEINV:eInvoiceMessage:D0401:3.1"'
            )
          }
        }

        //A0101-AX123456789-123
        var _xml_mig_type = invoiceutility.getMigType(
          'APPLY',
          voucher_type,
          _pre_mig_type
        )
        var _file_name =
          invoiceutility.getMigType('APPLY', voucher_type, _pre_mig_type) +
          '-' +
          _pre_voucher_number +
          '-' +
          _pre_apply_id
        var _jsonObj = {
          apply_id: _pre_apply_id,
          mig_type: _xml_mig_type,
          file_name: _file_name,
          mig_xml: _mig_xml,
        }

        _jsonObjAry.push(_jsonObj)
      }
    } catch (e) {
      log.error(e.name, e.message)
    }
    log.debug('_jsonObjAry', JSON.stringify(_jsonObjAry))
    return _jsonObjAry
  }

  //處理發票資料-END
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function updateVoucherMainRecord(
    access_model,
    applyID,
    mig_type,
    mig_xml,
    statusId,
    message
  ) {
    var _upload_status = 'P'
    try {
      var _record = record.load({
        type: _voucher_main_record,
        id: parseInt(applyID),
        isDynamic: true,
      })
      if (
        stringutility.convertToFloat(statusId) < 200 ||
        stringutility.convertToFloat(statusId) > 299
      ) {
        _upload_status = 'E'
        _record.setValue({
          fieldId: 'custrecord_gw_voucher_status',
          value: 'VOUCHER_ERROR',
        })
      }
      _record.setValue({
        fieldId: 'custrecord_gw_voucher_upload_status',
        value: _upload_status,
      })
      _record.setValue({
        fieldId: 'custrecord_gw_uploadstatus_messag',
        value: message,
      })
      _record.setValue({
        fieldId: 'custrecord_gw_upload_access_model',
        value: access_model,
      })

      _record.save()

      //寫入日誌檔
      var _recordObj = JSON.parse(JSON.stringify(_record))
      updateXmlUploadLog(_recordObj, mig_type, mig_xml, statusId, message)
    } catch (e) {
      log.error(e.name, e.message)
    }
  }

  //寫入日誌檔-20201124
  function updateXmlUploadLog(recordObj, mig_type, mig_xml, statusId, message) {
    try {
      log.debug('recordObj', JSON.stringify(recordObj))

      var _record = record.create({
        type: 'customrecord_gw_xml_upload_log',
        isDynamic: true,
      })

      _record.setValue({
        fieldId: 'custrecord_gw_upload_voucher_apply_id',
        value: stringutility.convertToInt(recordObj.id),
      })

      _record.setValue({
        fieldId: 'custrecord_gw_upload_seller_ban',
        value: recordObj.fields.custrecord_gw_seller,
      })
      _record.setValue({
        fieldId: 'custrecord_gw_upload_buyer_id',
        value: recordObj.fields.custrecord_gw_original_buyer_id,
      })
      _record.setValue({
        fieldId: 'custrecord_gw_upload_buyer_ban',
        value: recordObj.fields.custrecord_gw_buyer,
      })
      _record.setValue({
        fieldId: 'custrecord_gw_upload_voucher_number',
        value: recordObj.fields.custrecord_gw_voucher_number,
      })
      _record.setValue({
        fieldId: 'custrecord_gw_upload_voucher_yearmonth',
        value: recordObj.fields.custrecord_gw_voucher_yearmonth,
      })
      _record.setValue({
        fieldId: 'custrecord_gw_upload_voucher_migtype',
        value: mig_type,
      })
      _record.setValue({
        fieldId: 'custrecord_gw_upload_voucher_xml',
        value: mig_xml,
      })
      _record.setValue({
        fieldId: 'custrecord_gw_upload_response_status',
        value: statusId,
      })
      _record.setValue({
        fieldId: 'custrecord_gw_upload_response_message',
        value: message,
      })

      var _upload_voucher_date = dateutility.getCompanyLocatDate()
      var _upload_voucher_time = dateutility.getCompanyLocatTime()
      log.debug(
        'Upload Xml Date',
        '_upload_voucher_date=' +
          _upload_voucher_date +
          ' ,_upload_voucher_time=' +
          _upload_voucher_time
      )

      _record.setValue({
        fieldId: 'custrecord_gw_upload_voucher_date',
        value: _upload_voucher_date,
      })
      _record.setValue({
        fieldId: 'custrecord_gw_upload_voucher_time',
        value: _upload_voucher_time,
      })
      if (
        stringutility.convertToFloat(statusId) < 200 ||
        stringutility.convertToFloat(statusId) > 299
      ) {
        _record.setValue({
          fieldId: 'custrecord_gw_download_voucher_status',
          value: 'E',
        })
      }
      //Hide below fields
      //_record.setValue({fieldId:'custrecord_gw_download_voucher_date',value:message});
      //_record.setValue({fieldId:'custrecord_gw_download_voucher_time',value:message});
      //_record.setValue({fieldId:'custrecord_gw_download_voucher_status',value:message});
      //_record.setValue({fieldId:'custrecord_gw_download_voucher_message',value:message});

      var _applyId = _record.save()
    } catch (e) {
      log.error(e.name, e.message)
    }
  }

  function executeScript(context) {
    //STEP 1. 上傳發票
    var _access_model = migxmlutility.getConfigureValue(
      'ACCESS_MODEL',
      'XML_MODEL'
    )

    var _guiJsonObjAry = getVoucherToDoList(_access_model, 'EGUI')

    for (var i = 0; i < _guiJsonObjAry.length; i++) {
      var _obj = _guiJsonObjAry[i]

      var _apply_id = _obj.apply_id
      var _mig_type = _obj.mig_type
      var _mig_xml = _obj.mig_xml
      var _file_name = _obj.file_name

      //更新結果
      var _guiResultObj = sendXmlToGW(_mig_xml, _file_name + '.xml')
      log.debug(
        'GUI result',
        'codenumber=' +
          _guiResultObj.codenumber +
          '  ,message=' +
          _guiResultObj.message
      )

      updateVoucherMainRecord(
        _access_model,
        _apply_id,
        _mig_type,
        _mig_xml,
        _guiResultObj.codenumber,
        _guiResultObj.message
      )
    }

    //STEP 4. 上傳折讓單
    var _allowanceJsonObjAry = getVoucherToDoList(_access_model, 'ALLOWANCE')
    for (var i = 0; i < _allowanceJsonObjAry.length; i++) {
      var _obj = _allowanceJsonObjAry[i]

      var _apply_id = _obj.apply_id
      var _mig_type = _obj.mig_type
      var _mig_xml = _obj.mig_xml
      var _file_name = _obj.file_name

      //更新結果
      var _allowanceResultObj = sendXmlToGW(_mig_xml, _file_name + '.xml')
      log.debug(
        'Allowance result',
        'codenumber=' +
          _allowanceResultObj.codenumber +
          '  ,message=' +
          _allowanceResultObj.message
      )

      updateVoucherMainRecord(
        _access_model,
        _apply_id,
        _mig_type,
        _mig_xml,
        _allowanceResultObj.codenumber,
        _allowanceResultObj.message
      )
    }
  }

  return {
    execute: executeScript,
  }
})
