/**
 *
 * @copyright 2023 GateWeb
 * @author Chesley Lo <chesleylo@gateweb.com.tw>
 *
 * @NApiVersion 2.1
 * @NModuleScope Public
 */
define([
    'N/search',
    'N/runtime',
    'N/https',
    'N/record',
    'N/xml',
    'N/file',
    '../../../gw_issue_egui/gw_common_utility/gw_syncegui_to_document_utility',
    '../../../gw_issue_egui/gw_common_utility/gw_common_date_utility',
    '../../../gw_issue_egui/gw_common_utility/gw_common_string_utility',
    '../../../gw_issue_egui/gw_common_utility/gw_common_invoice_utility',
    '../../../gw_issue_egui/gw_common_utility/gw_common_migxml_utility',
    '../../../gw_issue_egui/gw_common_utility/gw_common_configure',
    '../../../gw_dao/taxType/gw_dao_tax_type_21'
], (
    search,
    runtime,
    https,
    record,
    xml,
    file,
    synceguidocument,
    dateutility,
    stringutility,
    invoiceutility,
    migxmlutility,
    gwconfigure,
    gwTaxType21
) => {

    let exports = {}

    const DEFAULT_PASSWORD = '1qaz2wsx'

    function getSearchFilters() {
        let filters = []
        filters.push(['custrecord_gw_voucher_upload_status', 'is', 'A'])
        filters.push('AND')
        filters.push(['custrecord_gw_voucher_status', 'is', 'VOUCHER_SUCCESS'])
        filters.push('AND')
        filters.push(['custrecord_gw_need_upload_egui_mig', 'isnot', 'NONE'])
        filters.push('AND')
        filters.push(['custrecord_gw_need_upload_egui_mig', 'isnot', 'RETRIEVE'])
        filters.push('AND')
        filters.push(['custrecord_gw_is_completed_detail', 'is', 'T'])

        return filters
    }

    function getSearchColumns() {
        return ["name", "id", "custrecord_gw_apply_internal_id", "custrecord_gw_voucher_type", "custrecord_gw_voucher_number", "custrecord_gw_voucher_date", "custrecord_gw_voucher_time", "custrecord_gw_voucher_yearmonth", "custrecord_gw_seller", "custrecord_gw_seller_name", "custrecord_gw_seller_address", "custrecord_gw_buyer", "custrecord_gw_buyer_name", "custrecord_gw_buyer_email", "custrecord_gw_buyer_address", "custrecord_gw_buyer_dept_code", "custrecord_gw_voucher_dept_code", "custrecord_gw_voucher_dept_name", "custrecord_gw_voucher_classification", "custrecord_gw_invoice_type", "custrecord_gw_mig_type", "custrecord_gw_voucher_format_code", "custrecord_gw_carrier_type", "custrecord_gw_carrierid1", "custrecord_gw_carrierid2", "custrecord_gw_npoban", "custrecord_gw_clearance_mark", "custrecord_gw_main_remark", "custrecord_gw_random_number", "custrecord_gw_discount_amount", "custrecord_gw_discount_count", "custrecord_gw_voucher_owner", "custrecord_gw_voucher_status", "custrecord_gw_voucher_upload_status", "custrecord_gw_accept_status", "custrecord_gw_confirm_status", "custrecord_gw_uploadstatus_messag", "custrecord_gw_sales_amount", "custrecord_gw_free_sales_amount", "custrecord_gw_zero_sales_amount", "custrecord_gw_tax_amount", "custrecord_gw_tax_type", "custrecord_gw_tax_rate", "custrecord_gw_total_amount", "custrecord_gw_need_upload_egui_mig", "custrecord_gw_print_mark", "custrecord_gw_is_printed_pdf", "custrecord_gw_is_printed_paper", "custrecord_gw_lock_transaction", "custrecord_gw_is_completed_detail", "custrecord_gw_voucher_extra_memo", "custrecord_gw_discount_sales_amount", "custrecord_gw_discount_free_amount", "custrecord_gw_discount_zero_amount", "custrecord_gw_is_manual_voucher", "custrecord_gw_original_buyer_id", "custrecord_gw_voucher_main_apply_user_id", "custrecord_gw_upload_access_model", "custrecord_voucher_sale_tax_apply_period", "custrecord_gw_voucher_sales_tax_apply", "custrecord_gw_applicable_zero_tax", "custrecord_gw_customs_export_category", "custrecord_gw_customs_export_no", "custrecord_gw_customs_export_date", "custrecord_gw_ns_transaction", "custrecord_gw_dm_mig_type", "custrecord_gw_dm_seller_profile", "custrecord_upload_xml_file_name"]
    }

    exports.getPendingUploadData = function () {
        let searchFilters = getSearchFilters()
        let searchColumns = getSearchColumns()

        return search.create({
            type: 'customrecord_gw_voucher_main', filters: searchFilters, columns: searchColumns
        })
    }

    function getRichCompanyInformationBySellerId(sellerId) {
        const searchType = 'customrecord_gw_business_entity'
        let searchFilters = []
        searchFilters.push(['custrecord_gw_be_tax_id_number', 'is', sellerId])
        let searchColumns = []
        searchColumns.push('custrecord_gw_be_tax_id_number')
        searchColumns.push('custrecord_gw_be_company_key')
        searchColumns.push('custrecord_gw_be_company_account')
        var customrecord_gw_business_entitySearchObj = search.create({
            type: searchType, filters: searchFilters, columns: searchColumns
        });
        var searchResultCount = customrecord_gw_business_entitySearchObj.runPaged().count;
        log.debug('customrecord_gw_business_entitySearchObj result count', searchResultCount);
        let richCompanyInformation = []
        customrecord_gw_business_entitySearchObj.run().each(function (result) {
            // .run().each has a limit of 4,000 results
            richCompanyInformation.push(JSON.parse(JSON.stringify(result)))
            return true;
        })

        return richCompanyInformation
    }

    function getRichToken(richBaseURL, companyInformation) {
        let responseObj = {
            code: 0, body: ''
        }
        let url = `${richBaseURL}/api/authenticate`
        let headers = {}
        headers['Accept'] = `text/html, application/json, application/xhtml+xml, application/xml;q=0.9, image/webp, */*;q=0.8, application/pdf`
        headers['Accept-Language'] = `en-us`
        headers['Content-Type'] = 'application/json'
        let requestBody = {
            'username': companyInformation.values.custrecord_gw_be_company_account, 'password': DEFAULT_PASSWORD
        }
        let response = https.post({
            url: url, body: JSON.stringify(requestBody), headers: headers
        })
        responseObj.code = response.code
        if (response.code !== 200) {
            responseObj.body = 'Error Occurs: ' + response.body
        } else {
            responseObj.body = JSON.parse(response.body)
        }
        log.debug({
            title: 'getToken responseCode', details: responseObj
        })

        return responseObj
    }

    function converNode(node, parentNodeName, nodeName, nodeValue, isAccessDetail) {
        try {
            var _hasChildren = node.hasChildNodes()
            if (_hasChildren) {
                var _childNodes = node.childNodes
                for (var i = 0; i < _childNodes.length; i++) {
                    var _childNode = _childNodes[i]
                    converNode(_childNode, parentNodeName, nodeName, nodeValue, isAccessDetail)
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

    function setXmlMainAndAmountValue(_xmlDocument, selectedpath, parentNodeName, nodeName, nodeValue) {
        try {
            var _migInvoiceNode = xml.XPath.select({
                node: _xmlDocument, xpath: selectedpath,
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

    function setXMLMainForEGUI(voucherMainRecordObject, _xmlDocument) {
        const _select_path = 'Invoice'
        setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Main', 'InvoiceNumber', voucherMainRecordObject.custrecord_gw_voucher_number)
        setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Main', 'InvoiceDate', voucherMainRecordObject.custrecord_gw_voucher_date)
        setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Main', 'InvoiceTime', voucherMainRecordObject.custrecord_gw_voucher_time)


        setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Seller', 'Identifier', voucherMainRecordObject.custrecord_gw_seller)
        setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Seller', 'Name', voucherMainRecordObject.custrecord_gw_seller_name)
        setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Seller', 'Address', voucherMainRecordObject.custrecord_gw_seller_address)
        setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Buyer', 'Identifier', voucherMainRecordObject.custrecord_gw_buyer)
        setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Buyer', 'Name', voucherMainRecordObject.custrecord_gw_buyer_name)
        setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Buyer', 'Address', voucherMainRecordObject.custrecord_gw_buyer_address)
        setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Main', 'InvoiceType', voucherMainRecordObject.custrecord_gw_invoice_type)
        setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Main', 'RandomNumber', voucherMainRecordObject.custrecord_gw_random_number)
        setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Main', 'MainRemark', voucherMainRecordObject.custrecord_gw_main_remark)

        let _zero_sales_amount = Math.round(stringutility.convertToFloat(voucherMainRecordObject.custrecord_gw_zero_sales_amount)).toString()
        log.debug({
            title: `setXMLMainForEGUI - _zero_sales_amount`,
            details: `typeof: ${typeof _zero_sales_amount}, value: ${_zero_sales_amount}`
        })
        if (_zero_sales_amount !== '0') {
            setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Main', 'CustomsClearanceMark', voucherMainRecordObject.custrecord_gw_clearance_mark)
        }
        if (voucherMainRecordObject.custrecord_gw_buyer !== '0000000000') {
            setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Main', 'RelateNumber', voucherMainRecordObject.id)
        }
        setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Main', 'PrintMark', voucherMainRecordObject.custrecord_gw_print_mark)

        if (voucherMainRecordObject.custrecord_gw_mig_type === 'B2C') {
            setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Main', 'CarrierType', voucherMainRecordObject.custrecord_gw_carrier_type)
            setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Main', 'CarrierId1', voucherMainRecordObject.custrecord_gw_carrierid1)
            setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Main', 'CarrierId2', voucherMainRecordObject.custrecord_gw_carrierid2)
            setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Main', 'NPOBAN', voucherMainRecordObject.custrecord_gw_npoban)
        }

        let _donateMark = voucherMainRecordObject.custrecord_gw_npoban !== '' ? '1' : '0'
        setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Main', 'DonateMark', _donateMark)

        let _sales_amount = voucherMainRecordObject.custrecord_gw_sales_amount
        let _tax_amount = voucherMainRecordObject.custrecord_gw_tax_amount
        let _free_sales_amount = voucherMainRecordObject.custrecord_gw_free_sales_amount
        let _tax_rate = (stringutility.convertToFloat(voucherMainRecordObject.custrecord_gw_tax_rate) === 0) ? '0' : voucherMainRecordObject.custrecord_gw_tax_rate
        let _tax_type = voucherMainRecordObject.custrecord_gw_tax_type
        let _total_amount = voucherMainRecordObject.custrecord_gw_total_amount

        if (voucherMainRecordObject.custrecord_gw_mig_type !== 'B2E' && voucherMainRecordObject.custrecord_gw_buyer === '0000000000') {
            _sales_amount = Math.round(stringutility.convertToFloat(_sales_amount) + stringutility.convertToFloat(_tax_amount)).toString()
            _tax_amount = '0' //B2C的發票，稅金為0
        } else {
            _sales_amount = Math.round(stringutility.convertToFloat(_sales_amount)).toString()
        }

        setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Amount', 'SalesAmount', _sales_amount)
        setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Amount', 'FreeTaxSalesAmount', Math.round(stringutility.convertToFloat(_free_sales_amount)).toString())
        setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Amount', 'ZeroTaxSalesAmount', Math.round(stringutility.convertToFloat(_zero_sales_amount)).toString())
        setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Amount', 'TaxAmount', Math.round(stringutility.convertToFloat(_tax_amount)).toString())
        setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Amount', 'TaxRate', _tax_rate)
        setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Amount', 'TaxType', _tax_type)
        setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Amount', 'TotalAmount', Math.round(stringutility.convertToFloat(_total_amount)).toString())
    }

    function replaceEGUIXML(voucherMainRecordObject, _mig_xml) {
        const replaceMapping = {
            B2BS: `Invoice xmlns="urn:GEINV:eInvoiceMessage:C0401:3.1"`,
            B2BE: `Invoice xmlns="urn:GEINV:eInvoiceMessage:A0101:3.1"`,
            B2C: `Invoice xmlns="urn:GEINV:eInvoiceMessage:C0401:3.1"`,
            B2B: `Invoice xmlns="urn:GEINV:eInvoiceMessage:A0401:3.1"`
        }

        _mig_xml = _mig_xml.replace('Invoice', replaceMapping[voucherMainRecordObject.custrecord_gw_mig_type])

        log.debug({
            title: 'replaceEGUIXML - _mig_xml', details: _mig_xml
        })

        if (voucherMainRecordObject.custrecord_gw_voucher_type === 'B2BS' || voucherMainRecordObject.custrecord_gw_voucher_type === 'B2C') {
            if (voucherMainRecordObject.custrecord_gw_zero_sales_amount === '0') _mig_xml = _mig_xml.replace('<CustomsClearanceMark/>', '') //非零稅要拿掉
            if (voucherMainRecordObject.custrecord_gw_buyer === '0000000000') _mig_xml = _mig_xml.replace('<RelateNumber/>', '') //B2C +C0401
        }
        if (voucherMainRecordObject.custrecord_gw_voucher_type === 'B2B' && voucherMainRecordObject.custrecord_gw_zero_sales_amount === '0') {
            _mig_xml = _mig_xml.replace('<CustomsClearanceMark/>', '')
        }

        return _mig_xml
    }

    function getVoucherDetailsByVoucherMainId(voucherMainId) {
        const searchType = 'customrecord_gw_voucher_details'
        let searchFilters = []
        searchFilters.push(['custrecord_gw_voucher_main_internal_id.internalid', 'anyof', voucherMainId])
        let searchColumns = []
        searchColumns.push('name')
        searchColumns.push('custrecord_gw_dtl_apply_internal_id')
        searchColumns.push('custrecord_gw_voucher_main_internal_id')
        searchColumns.push('custrecord_gw_dtl_voucher_type')
        searchColumns.push('custrecord_gw_item_description')
        searchColumns.push('custrecord_gw_item_unit')
        searchColumns.push('custrecord_gw_unit_price')
        searchColumns.push('custrecord_gw_item_quantity')
        searchColumns.push('custrecord_gw_dtl_item_tax_code')
        searchColumns.push('custrecord_gw_dtl_item_tax_rate')
        searchColumns.push('custrecord_gw_item_amount')
        searchColumns.push('custrecord_gw_item_tax_amount')
        searchColumns.push('custrecord_gw_item_total_amount')
        searchColumns.push('custrecord_gw_item_seq')
        searchColumns.push('custrecord_gw_item_remark')
        searchColumns.push('custrecord_gw_original_gui_internal_id')
        searchColumns.push('custrecord_gw_original_gui_number')
        searchColumns.push('custrecord_gw_original_gui_date')
        searchColumns.push('custrecord_gw_original_gui_yearmonth')
        searchColumns.push('custrecord_gw_dtl_voucher_number')
        searchColumns.push('custrecord_gw_dtl_voucher_date')
        searchColumns.push('custrecord_gw_dtl_voucher_time')
        searchColumns.push('custrecord_gw_dtl_voucher_yearmonth')
        searchColumns.push('custrecord_gw_dtl_voucher_status')
        searchColumns.push('custrecord_gw_dtl_voucher_upload_status')
        searchColumns.push('custrecord_gw_ns_document_type')
        searchColumns.push('custrecord_gw_ns_document_id')
        searchColumns.push('custrecord_gw_ns_document_apply_id')
        searchColumns.push('custrecord_gw_ns_document_number')
        searchColumns.push('custrecord_gw_ns_document_item_id')
        searchColumns.push('custrecord_gw_ns_document_items_seq')
        searchColumns.push('custrecord_gw_ns_item_discount_amount')
        searchColumns.push('custrecord_gw_ns_item_discount_count')
        searchColumns.push('custrecord_gw_dtl_voucher_apply_period')

        var customrecord_gw_voucher_detailsSearchObj = search.create({
            type: searchType, filters: searchFilters, columns: searchColumns
        });
        var searchResultCount = customrecord_gw_voucher_detailsSearchObj.runPaged().count
        log.debug('customrecord_gw_voucher_detailsSearchObj result count', searchResultCount)
        let voucherDetailsArray = []
        customrecord_gw_voucher_detailsSearchObj.run().each(function (result) {
            // .run().each has a limit of 4,000 results
            voucherDetailsArray.push(JSON.parse(JSON.stringify(result)))
            return true
        })

        return voucherDetailsArray
    }

    function setEGUIXmlDetailsItemValue(_xmlDocument, isFirst, description, quantity, unit, unitPrice, amount, sequenceNumber, itemremark) {
        try {
            var _migInvoiceNode = xml.XPath.select({
                node: _xmlDocument, xpath: 'Invoice',
            })

            for (var i = 0; i < _migInvoiceNode.length; i++) {
                var _childNodes = _migInvoiceNode[i].childNodes

                for (var j = 0; j < _childNodes.length; j++) {
                    var _childNode = _childNodes[j]
                    var _childNodeName = _childNodes[j].nodeName
                    //處理Details
                    if (_childNodeName === 'Details') {
                        if (isFirst === true) {
                            converNode(_childNodes[j].firstChild, 'ProductItem', 'Description', description, false)
                            converNode(_childNodes[j].firstChild, 'ProductItem', 'Quantity', quantity, false)
                            converNode(_childNodes[j].firstChild, 'ProductItem', 'Unit', unit, false)
                            converNode(_childNodes[j].firstChild, 'ProductItem', 'UnitPrice', unitPrice, false)
                            converNode(_childNodes[j].firstChild, 'ProductItem', 'Amount', amount, false)
                            converNode(_childNodes[j].firstChild, 'ProductItem', 'SequenceNumber', sequenceNumber, false)
                            converNode(_childNodes[j].firstChild, 'ProductItem', 'Remark', itemremark, false)
                        } else {
                            var _productItemNode = _childNodes[j].lastChild
                            //複製筆數
                            var _copiedNode = _productItemNode.cloneNode({
                                deep: true,
                            })
                            converNode(_copiedNode, 'Description', 'Description', description, true)
                            converNode(_copiedNode, 'Quantity', 'Quantity', quantity, true)
                            converNode(_copiedNode, 'Unit', 'Unit', unit, true)
                            converNode(_copiedNode, 'UnitPrice', 'UnitPrice', unitPrice, true)
                            converNode(_copiedNode, 'Amount', 'Amount', amount, true)
                            converNode(_copiedNode, 'SequenceNumber', 'SequenceNumber', sequenceNumber, true)
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

    function setXMLDetailsForEGUI(voucherMainRecordObject, xmlDocument, voucherDetailsArray) {
        let isFirstItem = true
        voucherDetailsArray.forEach(function (voucherDetailsObject, index) {
            log.debug({
                title: `setXMLDetailsForEGUI - voucherDetailsObject, index: ${index}`, details: voucherDetailsObject
            })
            if (index !== 0) isFirstItem = false
            let itemDesc = voucherDetailsObject.values.custrecord_gw_item_description
            let itemQuantity = Math.round(stringutility.convertToFloat(voucherDetailsObject.values.custrecord_gw_item_quantity)).toString()
            let itemUnit = voucherDetailsObject.values.custrecord_gw_item_unit
            let itemAmount = voucherDetailsObject.values.custrecord_gw_item_amount
            let itemTotalAmount = voucherDetailsObject.values.custrecord_gw_item_total_amount
            let itemTaxRate = voucherDetailsObject.values.custrecord_gw_dtl_item_tax_rate
            itemTaxRate.replace('%', '')
            itemTaxRate = Math.round(stringutility.convertToFloat(itemTaxRate)).toString()
            let itemSeq = voucherDetailsObject.values.custrecord_gw_item_seq
            let itemRemark = voucherDetailsObject.values.custrecord_gw_item_remark
            if (voucherMainRecordObject.custrecord_gw_mig_type !== 'B2E' && voucherMainRecordObject.custrecord_gw_buyer === '0000000000') {
                itemAmount = (stringutility.convertToFloat(itemTotalAmount) === 0) ? Math.round(stringutility.convertToFloat(itemAmount) * (1 + stringutility.convertToFloat(itemTaxRate) / 100)).toString() : itemTotalAmount
            }
            let unitPrice = (stringutility.convertToFloat(itemQuantity) !== 0) ? (stringutility.convertToFloat(itemAmount) / stringutility.convertToFloat(itemQuantity)).toFixed(gwconfigure.getGwNumericToFixed()).toString() : '0'
            setEGUIXmlDetailsItemValue(xmlDocument, isFirstItem, itemDesc, itemQuantity, itemUnit, unitPrice, itemAmount, itemSeq, itemRemark)
        })
    }

    function setXMLMainForAllowance(voucherMainRecordObject, _xmlDocument) {
        const _select_path = 'Allowance'
        setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Main', 'AllowanceNumber', voucherMainRecordObject.custrecord_gw_voucher_number)
        setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Main', 'AllowanceDate', voucherMainRecordObject.custrecord_gw_voucher_date)
        setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Main', 'AllowanceType', '2')

        setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Seller', 'Identifier', voucherMainRecordObject.custrecord_gw_seller)
        setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Seller', 'Name', voucherMainRecordObject.custrecord_gw_seller_name)
        setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Seller', 'Address', voucherMainRecordObject.custrecord_gw_seller_address)
        setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Buyer', 'Identifier', voucherMainRecordObject.custrecord_gw_buyer)
        setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Buyer', 'Name', voucherMainRecordObject.custrecord_gw_buyer_name)
        setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Buyer', 'Address', voucherMainRecordObject.custrecord_gw_buyer_address)
        setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Main', 'InvoiceType', voucherMainRecordObject.custrecord_gw_invoice_type)
        setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Main', 'RandomNumber', voucherMainRecordObject.custrecord_gw_random_number)
        setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Main', 'MainRemark', voucherMainRecordObject.custrecord_gw_main_remark)
        setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Main', 'PrintMark', voucherMainRecordObject.custrecord_gw_print_mark)

        if (voucherMainRecordObject.custrecord_gw_mig_type === 'B2C') {
            setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Main', 'CarrierType', voucherMainRecordObject.custrecord_gw_carrier_type)
            setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Main', 'CarrierId1', voucherMainRecordObject.custrecord_gw_carrierid1)
            setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Main', 'CarrierId2', voucherMainRecordObject.custrecord_gw_carrierid2)
            setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Main', 'NPOBAN', voucherMainRecordObject.custrecord_gw_npoban)

            let _donateMark = voucherMainRecordObject.custrecord_gw_npoban !== '' ? '1' : '0'
            setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Main', 'DonateMark', _donateMark)

            let _sales_amount = voucherMainRecordObject.custrecord_gw_sales_amount
            let _tax_amount = voucherMainRecordObject.custrecord_gw_tax_amount
            let _free_sales_amount = voucherMainRecordObject.custrecord_gw_free_sales_amount
            let _tax_rate = (stringutility.convertToFloat(voucherMainRecordObject.custrecord_gw_tax_rate) === 0) ? '0' : voucherMainRecordObject.custrecord_gw_tax_rate
            let _tax_type = voucherMainRecordObject.custrecord_gw_tax_type
            let _total_amount = voucherMainRecordObject.custrecord_gw_total_amount
            let _zero_sales_amount = Math.round(stringutility.convertToFloat(voucherMainRecordObject.custrecord_gw_zero_sales_amount)).toString()
            log.debug({
                title: `setXMLMainForAllowance - _zero_sales_amount`,
                details: `typeof: ${typeof _zero_sales_amount}, value: ${_zero_sales_amount}`
            })
            _sales_amount = Math.round(stringutility.convertToFloat(_sales_amount)).toString()
            //折讓單要放未稅金額
            _total_amount = (stringutility.convertToFloat(_sales_amount) + stringutility.convertToFloat(_free_sales_amount) + stringutility.convertToFloat(_zero_sales_amount)).toString()

            setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Amount', 'SalesAmount', _sales_amount)
            setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Amount', 'FreeTaxSalesAmount', Math.round(stringutility.convertToFloat(_free_sales_amount)).toString())
            setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Amount', 'ZeroTaxSalesAmount', Math.round(stringutility.convertToFloat(_zero_sales_amount)).toString())
            setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Amount', 'TaxAmount', Math.round(stringutility.convertToFloat(_tax_amount)).toString())
            setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Amount', 'TaxRate', _tax_rate)
            setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Amount', 'TaxType', _tax_type)
            setXmlMainAndAmountValue(_xmlDocument, _select_path, 'Amount', 'TotalAmount', Math.round(stringutility.convertToFloat(_total_amount)).toString())
        }
    }

    function setAllowanceXmlDetailsItemValue(_xmlDocument, xmlpath, isFirst, description, quantity, unit, unitPrice, amount, sequenceNumber, itemremark, originalInvoiceNumber, originalInvoiceDate, taxType, taxAmount) {
        try {
            var _migInvoiceNode = xml.XPath.select({
                node: _xmlDocument, xpath: xmlpath,
            })

            for (var i = 0; i < _migInvoiceNode.length; i++) {
                var _childNodes = _migInvoiceNode[i].childNodes

                for (var j = 0; j < _childNodes.length; j++) {
                    var _childNode = _childNodes[j]
                    var _childNodeName = _childNodes[j].nodeName
                    //處理Details
                    if (_childNodeName === 'Details') {
                        if (isFirst === true) {
                            converNode(_childNodes[j].firstChild, 'ProductItem', 'OriginalInvoiceNumber', originalInvoiceNumber, false)
                            converNode(_childNodes[j].firstChild, 'ProductItem', 'OriginalInvoiceDate', originalInvoiceDate, false)
                            converNode(_childNodes[j].firstChild, 'ProductItem', 'OriginalSequenceNumber', sequenceNumber, false)
                            converNode(_childNodes[j].firstChild, 'ProductItem', 'OriginalDescription', description, false)
                            converNode(_childNodes[j].firstChild, 'ProductItem', 'Quantity', quantity, false)
                            converNode(_childNodes[j].firstChild, 'ProductItem', 'Unit', unit, false)
                            converNode(_childNodes[j].firstChild, 'ProductItem', 'UnitPrice', unitPrice, false)
                            converNode(_childNodes[j].firstChild, 'ProductItem', 'Amount', amount, false)
                            converNode(_childNodes[j].firstChild, 'ProductItem', 'AllowanceSequenceNumber', sequenceNumber, false)
                            converNode(_childNodes[j].firstChild, 'ProductItem', 'TaxType', taxType, false)
                            converNode(_childNodes[j].firstChild, 'ProductItem', 'Tax', taxAmount, false)
                            //converNode(_childNodes[j].firstChild, 'ProductItem', 'Remark', itemremark, false);
                        } else {
                            var _productItemNode = _childNodes[j].lastChild
                            //複製筆數
                            var _copiedNode = _productItemNode.cloneNode({
                                deep: true,
                            })
                            converNode(_copiedNode, 'OriginalInvoiceNumber', 'OriginalInvoiceNumber', originalInvoiceNumber, true)
                            converNode(_copiedNode, 'OriginalInvoiceDate', 'OriginalInvoiceDate', originalInvoiceDate, true)
                            converNode(_copiedNode, 'OriginalInvoiceDate', 'OriginalSequenceNumber', sequenceNumber, true)
                            converNode(_copiedNode, 'OriginalDescription', 'OriginalDescription', description, true)
                            converNode(_copiedNode, 'Quantity', 'Quantity', quantity, true)
                            converNode(_copiedNode, 'Unit', 'Unit', unit, true)
                            converNode(_copiedNode, 'UnitPrice', 'UnitPrice', unitPrice, true)
                            converNode(_copiedNode, 'Amount', 'Amount', amount, true)
                            converNode(_copiedNode, 'AllowanceSequenceNumber', 'AllowanceSequenceNumber', sequenceNumber, true)
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

    function setXMLDetailsForAllowance(voucherMainRecordObject, xmlDocument, voucherDetailsArray) {
        const _select_path = 'Allowance'
        let isFirstItem = true
        voucherDetailsArray.forEach(function (voucherDetailsObject, index) {
            log.debug({
                title: `setXMLDetailsForAllowance - voucherDetailsObject, index: ${index}`,
                details: voucherDetailsObject
            })
            if (index !== 0) isFirstItem = false

            let taxObj = gwTaxType21.getTaxTypeByTaxCode(voucherDetailsObject.values.custrecord_gw_dtl_item_tax_code)
            log.debug('setXMLDetailsForAllowance - taxObj', taxObj)
            let itemTaxType = (taxObj) ? taxObj.value : '1';
            let _allowanceTaxAmount = Math.round(stringutility.convertToFloat(voucherDetailsObject.values.custrecord_gw_item_tax_amount)).toString()

            let itemDesc = voucherDetailsObject.values.custrecord_gw_item_description
            let itemQuantity = Math.round(stringutility.convertToFloat(voucherDetailsObject.values.custrecord_gw_item_quantity)).toString()
            let itemUnit = voucherDetailsObject.values.custrecord_gw_item_unit
            let itemAmount = voucherDetailsObject.values.custrecord_gw_item_amount
            let itemTotalAmount = voucherDetailsObject.values.custrecord_gw_item_total_amount
            let itemTaxRate = voucherDetailsObject.values.custrecord_gw_dtl_item_tax_rate
            itemTaxRate.replace('%', '')
            itemTaxRate = Math.round(stringutility.convertToFloat(itemTaxRate)).toString()
            let itemSeq = voucherDetailsObject.values.custrecord_gw_item_seq
            let itemRemark = voucherDetailsObject.values.custrecord_gw_item_remark
            let unitPrice = (stringutility.convertToFloat(itemQuantity) !== 0) ? (stringutility.convertToFloat(itemAmount) / stringutility.convertToFloat(itemQuantity)).toFixed(gwconfigure.getGwNumericToFixed()).toString() : '0'
            let originalInvoiceNumber = voucherDetailsObject.values.custrecord_gw_original_gui_number
            let originalInvoiceDate = voucherDetailsObject.values.custrecord_gw_original_gui_date
            setAllowanceXmlDetailsItemValue(xmlDocument, _select_path, isFirstItem, itemDesc, itemQuantity, itemUnit, unitPrice, itemAmount, itemSeq, itemRemark, originalInvoiceNumber, originalInvoiceDate, itemTaxType, _allowanceTaxAmount)
        })
    }

    function replaceAllowanceXML(voucherMainRecordObject, _mig_xml) {
        const replaceMapping = {
            B2BS: `Allowance xmlns="urn:GEINV:eInvoiceMessage:D0401:3.1"`,
            B2BE: `Allowance xmlns="urn:GEINV:eInvoiceMessage:B0101:3.1"`,
            B2C: `Allowance xmlns="urn:GEINV:eInvoiceMessage:D0401:3.1"`,
            B2B: `Allowance xmlns="urn:GEINV:eInvoiceMessage:B0401:3.1"`
        }
        _mig_xml = _mig_xml.replace('Allowance', replaceMapping[voucherMainRecordObject.custrecord_gw_mig_type])
        log.debug({
            title: 'replaceAllowanceXML - _mig_xml',
            details: _mig_xml
        })
        return _mig_xml
    }

    function generalXMLForUpload(voucherMainRecordObject) {
        log.debug({
            title: 'generalXMLForUpload', details: 'start...'
        })
        log.debug({
            title: 'generalXMLForUpload - voucherMainRecordObject', details: voucherMainRecordObject
        })

        let generatedObject = {}

        let xmlDocument = xml.Parser.fromString({
            text: loadInvoiceMigXml(voucherMainRecordObject.custrecord_gw_voucher_type, voucherMainRecordObject.custrecord_gw_mig_type),
        })
        if (voucherMainRecordObject.custrecord_gw_voucher_type === 'EGUI') {
            setXMLMainForEGUI(voucherMainRecordObject, xmlDocument)
            const voucherDetailsArray = getVoucherDetailsByVoucherMainId(voucherMainRecordObject.id)
            setXMLDetailsForEGUI(voucherMainRecordObject, xmlDocument, voucherDetailsArray)
            let _mig_xml = xml.Parser.toString({document: xmlDocument})
            _mig_xml = replaceEGUIXML(voucherMainRecordObject, _mig_xml)
            log.debug({
                title: 'generalXMLForUpload - EGUI - _mig_xml', details: _mig_xml
            })
            generatedObject.migXML = _mig_xml
            generatedObject.xmlMigType = invoiceutility.getMigType('APPLY', voucherMainRecordObject.custrecord_gw_voucher_type, voucherMainRecordObject.custrecord_gw_mig_type)
            generatedObject.fileName = `${generatedObject.xmlMigType}-${voucherMainRecordObject.custrecord_gw_voucher_number}-${new Date().getTime()}`
        } else {
            setXMLMainForAllowance(voucherMainRecordObject, xmlDocument)
            const voucherDetailsArray = getVoucherDetailsByVoucherMainId(voucherMainRecordObject.id)
            setXMLDetailsForAllowance(voucherMainRecordObject, xmlDocument, voucherDetailsArray)
            let _mig_xml = xml.Parser.toString({document: xmlDocument})
            _mig_xml = replaceAllowanceXML(voucherMainRecordObject, _mig_xml)
            log.debug({
                title: 'generalXMLForUpload - Allowance - _mig_xml', details: _mig_xml
            })
            generatedObject.migXML = _mig_xml
            generatedObject.xmlMigType = invoiceutility.getMigType('APPLY', voucherMainRecordObject.custrecord_gw_voucher_type, voucherMainRecordObject.custrecord_gw_mig_type)
            generatedObject.fileName = `${generatedObject.xmlMigType}-${voucherMainRecordObject.custrecord_gw_voucher_number}-${new Date().getTime()}`
        }
        return generatedObject
    }

    function loadInvoiceMigXml(voucherType, migType) {
        const migXmlPath = '../../../gw_issue_egui/gw_mig_xml/'
        var _xmlString
        const filePathMapping = {
            EGUI: {
                B2BE: `${migXmlPath}gw_a0101.xml`, B2BS: `${migXmlPath}gw_a0401.xml`, B2C: `${migXmlPath}gw_c0401.xml`
            }, ALLOWANCE: {
                B2BE: `${migXmlPath}gw_b0101.xml`,
                B2BS: `${migXmlPath}gw_b0401.xml`,
                B2B: `${migXmlPath}gw_b0401.xml`,
                B2C: `${migXmlPath}gw_d0401.xml`
            }
        }
        try {
            var _file_path = filePathMapping[voucherType][migType]
            log.debug({
                title: 'loadInvoiceMigXml - _file_path', details: _file_path
            })
            if (_file_path !== '') _xmlString = file.load(_file_path).getContents()
        } catch (e) {
            log.error(e.name, e.message)
        }
        return _xmlString
    }

    function uploadThroughRich(richBaseURL, companyInformation, getRichTokenResponse, generatedObject) {
        log.debug({
            title: 'uploadThroughRich', details: 'start...'
        })

        let responseObj = {
            code: 0, body: ''
        }
        let url = `${richBaseURL}/api/v1/mig/${generatedObject.xmlMigType}/${companyInformation.values.custrecord_gw_be_company_key}?fileName=${generatedObject.fileName}.xml`
        log.debug({
            title: 'uploadThroughRich - url', details: url
        })
        let headers = {}
        headers['Authorization'] = `Bearer ${getRichTokenResponse.body.id_token}`
        headers['Accept'] = `text/html, application/json, application/xhtml+xml, application/xml;q=0.9, image/webp, */*;q=0.8, application/pdf`
        headers['Accept-Language'] = `en-us`
        headers['Content-Type'] = 'application/xml'

        let response = https.post({
            url: url, body: generatedObject.migXML, headers: headers
        })
        responseObj.code = response.code
        if (response.code !== 200) {
            responseObj.body = 'Error Occurs: ' + response.body
        } else {
            responseObj.body = JSON.parse(response.body)
        }
        log.debug({
            title: 'uploadThroughRich responseObj', details: responseObj
        })

        return responseObj

    }

    function createUploadLog(voucherMainRecordObject, generatedObject, uploadResultResponse) {
        try {
            log.debug({
                title: 'createUploadLog', details: 'start...'
            })
            log.debug({
                title: 'createUploadLog - voucherMainRecordObject', details: voucherMainRecordObject
            })
            log.debug({
                title: 'createUploadLog - generatedObject', details: generatedObject
            })
            log.debug({
                title: 'createUploadLog - uploadResultResponse', details: uploadResultResponse
            })

            let uploadLogRecordObject = record.create({
                type: 'customrecord_gw_xml_upload_log', isDynamic: true,
            })

            uploadLogRecordObject.setValue({
                fieldId: 'custrecord_gw_upload_voucher_apply_id', value: voucherMainRecordObject.id,
            })
            uploadLogRecordObject.setValue({
                fieldId: 'custrecord_gw_upload_voucher', value: voucherMainRecordObject.id,
            })

            uploadLogRecordObject.setValue({
                fieldId: 'custrecord_gw_upload_seller_ban', value: voucherMainRecordObject.custrecord_gw_seller,
            })
            uploadLogRecordObject.setValue({
                fieldId: 'custrecord_gw_upload_buyer_id',
                value: voucherMainRecordObject.custrecord_gw_original_buyer_id,
            })
            uploadLogRecordObject.setValue({
                fieldId: 'custrecord_gw_upload_buyer_ban', value: voucherMainRecordObject.custrecord_gw_buyer,
            })
            uploadLogRecordObject.setValue({
                fieldId: 'custrecord_gw_upload_voucher_number',
                value: voucherMainRecordObject.custrecord_gw_voucher_number,
            })
            uploadLogRecordObject.setValue({
                fieldId: 'custrecord_gw_upload_voucher_yearmonth',
                value: voucherMainRecordObject.custrecord_gw_voucher_yearmonth,
            })
            uploadLogRecordObject.setValue({
                fieldId: 'custrecord_gw_upload_voucher_migtype', value: generatedObject.xmlMigType,
            })
            uploadLogRecordObject.setValue({
                fieldId: 'custrecord_gw_upload_voucher_xml', value: generatedObject.migXML,
            })
            uploadLogRecordObject.setValue({
                fieldId: 'custrecord_gw_upload_response_status', value: uploadResultResponse.code,
            })
            uploadLogRecordObject.setValue({
                fieldId: 'custrecord_gw_upload_response_message', value: uploadResultResponse.body.message,
            })

            var _upload_voucher_date = dateutility.getCompanyLocatDate()
            var _upload_voucher_time = dateutility.getCompanyLocatTime()
            log.debug({
                title: 'createUploadLog - _upload_voucher_date', details: _upload_voucher_date
            })
            log.debug({
                title: 'createUploadLog - _upload_voucher_time', details: _upload_voucher_time
            })

            uploadLogRecordObject.setValue({
                fieldId: 'custrecord_gw_upload_voucher_date', value: _upload_voucher_date,
            })
            uploadLogRecordObject.setValue({
                fieldId: 'custrecord_gw_upload_voucher_time', value: _upload_voucher_time,
            })
            if (uploadResultResponse.code !== 200) {
                uploadLogRecordObject.setValue({
                    fieldId: 'custrecord_gw_download_voucher_status', value: 'E',
                })
            }
            const resultId = uploadLogRecordObject.save()
            log.debug({
                title: 'createUploadLog - resultId', details: resultId
            })
        } catch (e) {
            log.error({
                title: 'createUploadLog - e', details: e
            })
        }
    }

    function updateVoucherMainRecord(voucherMainRecordObject, generatedObject, uploadResultResponse) {
        try {
            log.debug({
                title: 'updateVoucherMainRecord', details: 'start...'
            })

            let submitFieldsObject = {}
            submitFieldsObject['custrecord_gw_upload_access_model'] = 'NETSUITE'
            submitFieldsObject['custrecord_upload_xml_file_name'] = generatedObject.fileName
            if (uploadResultResponse.code !== 200) {
                const responseBody = JSON.parse(uploadResultResponse.body.replace('Error Occurs: ', ''))
                log.debug({
                    title: 'updateVoucherMainRecord - responseBody', details: responseBody
                })
                submitFieldsObject['custrecord_gw_voucher_status'] = 'VOUCHER_ERROR'
                submitFieldsObject['custrecord_gw_voucher_upload_status'] = 'E'
                submitFieldsObject['custrecord_gw_uploadstatus_messag'] = responseBody.subErrors[0].message
            } else {
                submitFieldsObject['custrecord_gw_voucher_upload_status'] = 'P'
                // submitFieldsObject['custrecord_gw_uploadstatus_messag'] = uploadResultResponse.body.message
            }

            const resultId = record.submitFields({
                type: 'customrecord_gw_voucher_main', id: voucherMainRecordObject.id, values: submitFieldsObject
            })

            log.debug({
                title: 'updateVoucherMainRecord - resultId', details: resultId
            })

        } catch (e) {
            log.error({
                title: 'updateVoucherMainRecord - e', details: e
            })
        }
    }

    function getLinkedTransactionByVoucherMainId(voucherMainId) {
        const searchType = 'customrecord_gw_voucher_details'
        let searchFilters = []
        searchFilters.push(['custrecord_gw_voucher_main_internal_id.internalid', 'anyof', voucherMainId])
        searchFilters.push('AND')
        searchFilters.push(['custrecord_gw_ns_document_apply_id.mainline', 'is', 'T'])
        let searchColumns = []
        searchColumns.push(search.createColumn({
            name: "internalid", join: "CUSTRECORD_GW_NS_DOCUMENT_APPLY_ID", summary: "GROUP", sort: search.Sort.ASC
        }))
        searchColumns.push(search.createColumn({
            name: "type", join: "CUSTRECORD_GW_NS_DOCUMENT_APPLY_ID", summary: "GROUP"
        }))
        var customrecord_gw_voucher_detailsSearchObj = search.create({
            type: searchType, filters: searchFilters, columns: searchColumns
        });
        var searchResultCount = customrecord_gw_voucher_detailsSearchObj.runPaged().count
        log.debug('customrecord_gw_voucher_detailsSearchObj result count', searchResultCount)
        let linkedTransactionArray = []
        customrecord_gw_voucher_detailsSearchObj.run().each(function (result) {
            // .run().each has a limit of 4,000 results
            linkedTransactionArray.push(JSON.parse(JSON.stringify(result)))
            return true
        })

        return linkedTransactionArray
    }

    function updateNetSuiteTransactionByVoucherMainId(voucherMainId) {
        log.debug({
            title: 'updateNetSuiteTransactionByVoucherMainId', details: 'start...'
        })
        log.debug({
            title: 'updateNetSuiteTransactionByVoucherMainId - voucherMainId', details: voucherMainId
        })
        const linkedTransactionArray = getLinkedTransactionByVoucherMainId(voucherMainId)
        log.debug({
            title: 'updateNetSuiteTransactionByVoucherMainId - linkedTransactionArray', details: linkedTransactionArray
        })
    }

    exports.mainProcess = function (eachObject) {
        try {
            log.debug({
                title: 'mainProcess', details: 'start...'
            })
            log.debug({
                title: 'mainProcess - eachObject', details: eachObject
            })
            const richProcessSearchResult = richProcess()[0]
            log.debug({
                title: 'mainProcess - richProcessSearchResult', details: richProcessSearchResult
            })
            if (richProcessSearchResult.values.custrecord_gw_conf_rich_process) {
                const sellerId = eachObject.custrecord_gw_seller
                //get company key and company account id
                const companyInformationArray = getRichCompanyInformationBySellerId(sellerId)
                log.debug({
                    title: 'mainProcess - companyInformationArray', details: companyInformationArray
                })
                if (companyInformationArray.length === 0) throw 'Can Not Find Mapped Company Info For Rich Process'
                // proceed rich process
                const richBaseURL = richProcessSearchResult.values.custrecord_gw_conf_rich_base_url
                // get token
                const getRichTokenResponse = getRichToken(richBaseURL, companyInformationArray[0])
                log.debug({
                    title: 'mainProcess - getRichTokenResponse', details: getRichTokenResponse
                })
                if (getRichTokenResponse.code !== 200) {
                    throw getRichTokenResponse
                }
                const generatedObject = generalXMLForUpload(eachObject)
                log.debug({
                    title: 'mainProcess - generatedObject', details: generatedObject
                })
                const uploadResultResponse = uploadThroughRich(richBaseURL, companyInformationArray[0], getRichTokenResponse, generatedObject)
                createUploadLog(eachObject, generatedObject, uploadResultResponse)
                updateVoucherMainRecord(eachObject, generatedObject, uploadResultResponse)
                // if(uploadResultResponse.code === 200) updateNetSuiteTransactionByVoucherMainId(eachObject.id)
                if (uploadResultResponse.code === 200) {
                    const DEFAULT_UPLOAD_STATUS_CODE = 'P'
                    synceguidocument.syncEguiUploadStatusToNSEvidenceStatus(eachObject.custrecord_gw_voucher_status, DEFAULT_UPLOAD_STATUS_CODE, eachObject.custrecord_gw_need_upload_egui_mig, eachObject.id)
                }
            }
            log.debug({
                title: 'mainProcess', details: 'end...'
            })
        } catch (e) {
            log.error({
                title: 'mainProcess - e', details: e
            })
        }

    }

    function richProcess() {
        log.debug({
            title: 'richProcess - runtime.accountId', details: runtime.accountId
        })
        const searchType = 'customrecord_gw_egui_config'
        let searchFilters = []
        searchFilters.push(['custrecord_gw_conf_ns_acct_id', 'is', runtime.accountId.toUpperCase()])
        searchFilters.push('AND')
        searchFilters.push(['custrecord_gw_conf_rich_process', 'is', 'T'])
        searchFilters.push('AND')
        searchFilters.push(['custrecord_gw_conf_rich_base_url', 'isnotempty', 'isnotempty'])
        let searchColumns = []
        searchColumns.push('custrecord_gw_conf_ns_acct_id')
        searchColumns.push('custrecord_gw_conf_rich_process')
        searchColumns.push('custrecord_gw_conf_rich_base_url')
        var customrecord_gw_egui_configSearchObj = search.create({
            type: searchType, filters: searchFilters, columns: searchColumns
        });
        var searchResultCount = customrecord_gw_egui_configSearchObj.runPaged().count;
        log.debug('customrecord_gw_egui_configSearchObj result count', searchResultCount);
        let richProcessSearchResult = []
        customrecord_gw_egui_configSearchObj.run().each(function (result) {
            // .run().each has a limit of 4,000 results
            richProcessSearchResult.push(JSON.parse(JSON.stringify(result)))
            return true;
        })

        return richProcessSearchResult
    }

    return exports
});
