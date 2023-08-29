define([
    'N/render',
    './gw_allowance_consent_notification',
    'N/search',
    'N/url',
    'N/runtime',
    'N/record',
    'N/email',
    '../gw_common_utility/gw_common_migxml_utility',
    'N/file',
    '../../gw_print/gw_download_pdf/gw_api_client',
], (
    render,
    gwAllowanceConsentNotification,
    search,
    url,
    runtime,
    record,
    email,
    gwCommonMigXmlUtility,
    file,
    gwApiClient,
) => {
    /**
     * Module Description...
     *
     * @type {Object} module-name
     *
     * @copyright 2023 Gateweb
     * @author Chesley Lo <chesleylo@gateweb.com.tw>
     *
     * @NApiVersion 2.1
     * @NModuleScope Public

     */
    let exports = {}

    function getEmailTemplate(result, emailTemplate) {
        return render.mergeEmail({
            templateId: emailTemplate,
            customRecord: {
                id: parseInt(result.requestId),
                type: 'customrecord_gw_allowance_consent_notify'
            }
        });
    }

    function getAllowanceConsentNotificationParameter() {
        var accountId = runtime.accountId.toUpperCase();
        var searchFilters = [];
        searchFilters.push(['custrecord_gw_conf_ns_acct_id', 'is', accountId]);
        var searchColumns = [];
        searchColumns.push('custrecord_gw_conf_allowance_consent_n');
        searchColumns.push('custrecord_gw_conf_allowance_consent_np');
        var customrecord_gw_egui_configSearchObj = search.create({
            type: 'customrecord_gw_egui_config',
            filters: searchFilters,
            columns: searchColumns
        });
        var searchResultCount = customrecord_gw_egui_configSearchObj.runPaged().count;
        log.debug('customrecord_gw_egui_configSearchObj result count', searchResultCount);
        var scriptParameter = null;
        customrecord_gw_egui_configSearchObj.run().each(function(result){
            // .run().each has a limit of 4,000 results
            scriptParameter = result.getValue({name: 'custrecord_gw_conf_allowance_consent_np'});
            return true;
        });

        return scriptParameter;
    }

    function getApproveLink(result) {

        var scriptURL = url.resolveScript({
            scriptId: 'customscript_gw_sl_allowance_consent',
            deploymentId: 'customdeploy_gw_sl_allowance_consent',
            returnExternalURL: true
        });

        var domainUrl = url.resolveDomain({
            hostType: url.HostType.FORM,
            accountId: runtime.accountId
        });

        var allowanceConsentNotificationScriptParameter = getAllowanceConsentNotificationParameter();

        log.debug({title: 'scriptURL', details: scriptURL});
        log.debug({title: 'FULL URL', details: `https://${domainUrl}${scriptURL}&h=${allowanceConsentNotificationScriptParameter}`});

        const fieldLookUpObj = getUniqueIdAndInvoiceNumber(result);
        let newLink = `https://${domainUrl}${scriptURL}&h=${allowanceConsentNotificationScriptParameter}&uniqueId=${fieldLookUpObj.custrecord_unique_id}&recordId=${result.requestId}&invoiceNumber=${fieldLookUpObj.custrecord_egui_invoice_number}`;
        log.debug({title: 'newLink', details: newLink});

        return newLink;
    }

    function updateExpiredDate(result) {
        record.submitFields({
            type: 'customrecord_gw_allowance_consent_notify',
            id: result.requestId,
            values: {
                custrecord_notification_expired_date: gwAllowanceConsentNotification.getExpiredDate()
            }
        });
    }

    function getAuthorBySellerId(result) {
        const fieldLookUp = search.lookupFields({
            type: 'customrecord_gw_allowance_consent_notify',
            id: result.requestId,
            columns: ['custrecord_seller_id']
        });
        const sellerId = fieldLookUp.custrecord_seller_id;

        let searchFilters = [];
        searchFilters.push(['custrecord_gw_be_tax_id_number', 'is', sellerId]);
        let searchColumns = [];
        searchColumns.push('custrecord_gw_be_contact');
        var customrecord_gw_business_entitySearchObj = search.create({
            type: 'customrecord_gw_business_entity',
            filters: searchFilters,
            columns: searchColumns
        });
        var searchResultCount = customrecord_gw_business_entitySearchObj.runPaged().count;
        log.debug("customrecord_gw_business_entitySearchObj result count", searchResultCount);
        let authorId;
        customrecord_gw_business_entitySearchObj.run().each(function (result) {
            // .run().each has a limit of 4,000 results
            authorId = result.getValue({name: 'custrecord_gw_be_contact'});
            return true;
        });

        return parseInt(authorId);
    }

    function getBuyerEmail(result) {
        const fieldLookUp = search.lookupFields({
            type: 'customrecord_gw_allowance_consent_notify',
            id: result.requestId,
            columns: ['custrecord_buyer_email']
        });

        return fieldLookUp.custrecord_buyer_email;
    }

    function getRecordIntegerIdByScriptId(scriptId) {
        let searchFilters = [];
        searchFilters.push(['scriptid', 'is', scriptId]);
        let searchColumns = [];
        searchColumns.push('name');
        searchColumns.push('scriptid');
        let customrecordSearchObj = search.create({
            type: 'customrecordtype',
            filters: searchFilters,
            columns: searchColumns
        });
        var searchResultCount = customrecordSearchObj.runPaged().count;
        log.debug("customrecordSearchObj result count", searchResultCount);
        let recordIntegerId;
        customrecordSearchObj.run().each(function (result) {
            // .run().each has a limit of 4,000 results
            // log.debug({title: 'getRecordIntegerIdByScriptId - result', details: result});
            recordIntegerId = result.id;
            return true;
        });

        return recordIntegerId;
    }

    function getVoucherMainId(result) {
        const fieldLookUp = search.lookupFields({
            type: 'customrecord_gw_allowance_consent_notify',
            id: result.requestId,
            columns: ['custrecord_gw_voucher_main_id']
        });
        log.debug({
            title: 'in getVoucherMainId - fieldLookUp',
            details: fieldLookUp
        })
        const voucherMainId = fieldLookUp.custrecord_gw_voucher_main_id[0].value;

        return voucherMainId;
    }

    function loadInvoiceMigXml(voucherType, migType) {

        var gwMigXmlPath = '../gw_mig_xml/'
        var _gw_mig_a0101_xml_path = gwMigXmlPath + 'gw_a0101.xml';
        var _gw_mig_c0401_xml_path = gwMigXmlPath + 'gw_c0401.xml';
        var _gw_mig_b0101_xml_path = gwMigXmlPath + 'gw_b0101.xml';
        var _gw_mig_d0401_xml_path = gwMigXmlPath + 'gw_d0401.xml';

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
            log.debug(e.name, e.message)
        }

        return _xmlString
    }

    function removeChangeLineChar(text) {
        if (text) {
            while (text.indexOf('\r') > -1) {
                text = text.replace('\r', '');
            }
            while (text.indexOf('\n') > -1) {
                text = text.replace('\n', '');
            }
        }
        return text;
    }

    function generateAllowanceAttachment(xmlFileObject, allowanceContent) {
        const allowanceFileName = xmlFileObject.filename.replace('.xml', '.pdf');
        const allowanceAttachment = file.create({
            name: allowanceFileName,
            fileType: file.Type.PDF,
            contents: allowanceContent
        });

        log.debug({
            title: 'generateAllowanceAttachment - allowanceAttachment',
            details: allowanceAttachment
        });

        return allowanceAttachment;
    }

    function getAllowanceAttachmentByVoucherId(voucherMainId) {
        const b2bs_xml = loadInvoiceMigXml('ALLOWANCE', 'B2BS');
        const b2be_xml = loadInvoiceMigXml('ALLOWANCE', 'B2BE');
        const b2c_xml = loadInvoiceMigXml('ALLOWANCE', 'B2C');

        const accessModel = 'NETSUITE';
        const voucher_type = 'ALLOWANCE';
        let voucherId = voucherMainId;
        const genXmlToFtpResult = 'Y';
        const genXmlToFtpMessage = '';

        log.debug({
            title: 'getAllowanceAttachmentByVoucherId - getVoucherToDoList params',
            details: {
                accessModel,
                voucher_type,
                voucherId,
                b2bs_xml,
                b2be_xml,
                b2c_xml,
                genXmlToFtpResult,
                genXmlToFtpMessage
            }
        });

        let xmlObjectArray = gwCommonMigXmlUtility.getVoucherToDoList(accessModel, voucher_type, voucherId, b2bs_xml, b2be_xml, b2c_xml, genXmlToFtpResult, genXmlToFtpMessage);

        log.debug({
            title: 'getAllowanceAttachmentByVoucherId - xmlObjectArray',
            details: xmlObjectArray
        });

        let xmlFileObject = {
            filename: xmlObjectArray[0].file_name + '.xml',
            xml: xmlObjectArray[0].mig_xml,
            docType: 'allowance',
            docStatus: 2,
            extramemo: removeChangeLineChar(xmlObjectArray[0].extra_memo),
            uploadDocument: true,
            reprint: true
        };

        const allowanceContent = gwApiClient.getAllowanceContent(xmlFileObject);
        const allowanceAttachment = generateAllowanceAttachment(xmlFileObject, allowanceContent);

        return allowanceAttachment;
    }

    function sendEmailToBuyer(result, emailTemplate, approveLink) {
        log.debug({title: 'in sendEmailToBuyer', details: ''});

        let mergeResultObj = getEmailTemplate(result, emailTemplate);
        log.debug({title: 'sendEmailToBuyer - Email subject: ', details: mergeResultObj.subject});
        log.debug({title: 'sendEmailToBuyer - 1.Email Body: ', details: mergeResultObj.body});
        let emailBody = mergeResultObj.body;
        if (approveLink) emailBody = emailBody.replaceAll('@@button_link@@', `<a href="${approveLink}" target="_blank">請由此連結確認</a>`);
        log.debug({title: 'sendEmailToBuyer - 2.Email Body: ', details: emailBody});
        let attachments;
        if (!approveLink) {
            //TODO - get allowance PDF
            attachments = getAllowanceAttachmentByVoucherId(getVoucherMainId(result));
            log.debug({
                title: 'in sendEmailToBuyer - attachments',
                details: attachments
            });
        }
        email.send({
            author: getAuthorBySellerId(result),
            recipients: getBuyerEmail(result),
            subject: mergeResultObj.subject,
            body: emailBody,
            attachments: attachments ? [attachments] : null,
            relatedRecords: {
                customRecord: {
                    id: parseInt(result.requestId),
                    recordType: getRecordIntegerIdByScriptId('customrecord_gw_allowance_consent_notify')
                }
            }
        });
    }

    function sendEmailToSeller(result, emailTemplate) {
        log.debug({title: 'in sendEmailToSeller', details: ''});

        let mergeResultObj = getEmailTemplate(result, emailTemplate);
        log.debug({title: 'sendEmailToSeller - Email subject: ', details: mergeResultObj.subject});
        log.debug({title: 'sendEmailToSeller - Email Body: ', details: mergeResultObj.body});

        email.send({
            author: getAuthorBySellerId(result),
            recipients: getAuthorBySellerId(result),
            subject: mergeResultObj.subject,
            body: mergeResultObj.body,
            relatedRecords: {
                customRecord: {
                    id: parseInt(result.requestId),
                    recordType: getRecordIntegerIdByScriptId('customrecord_gw_allowance_consent_notify')
                }
            }
        });
    }

    function getEmailTemplateInternalIdByName(templateName) {
        let searchFilters = [];
        searchFilters.push(['name', 'is', templateName]);
        let searchColumns = [];
        searchColumns.push('name');
        let emailtemplateSearchObj = search.create({
            type: 'emailtemplate',
            filters: searchFilters,
            columns: searchColumns
        });
        var searchResultCount = emailtemplateSearchObj.runPaged().count;
        log.debug("emailtemplateSearchObj result count", searchResultCount);
        let emailTemplateId;
        emailtemplateSearchObj.run().each(function (result) {
            // .run().each has a limit of 4,000 results
            log.debug({title: 'getEmailTemplateInternalIdByName - result', details: result});
            emailTemplateId = result.id;
            return true;
        });

        return emailTemplateId;
    }

    function getUniqueIdAndInvoiceNumber(result) {
        const fieldLookUp = search.lookupFields({
            type: 'customrecord_gw_allowance_consent_notify',
            id: result.requestId,
            columns: ['custrecord_unique_id', 'custrecord_egui_invoice_number']
        });

        return fieldLookUp;
    }

    function sendEmailNotification(result) {
        log.debug({title: 'sendEmailNotification - result', details: result});
        switch (result.actionType) {
            case 'send_allowance_consent_to_buyer': {
                if (result.needToEnterRecordValue === 'false') updateExpiredDate(result);
                let approveLink = getApproveLink(result);
                sendEmailToBuyer(result, getEmailTemplateInternalIdByName('是否開立折讓單通知'), approveLink);
                break;
            }
            case 'send_buyer_agree_to_seller': {
                sendEmailToSeller(result, getEmailTemplateInternalIdByName('買方同意開立折讓單通知'));
                gwAllowanceConsentNotification.executeScript(result.requestId, false, 'send_created_allowance_voucher_to_buyer');
                break;
            }
            case 'send_buyer_reject_to_seller': {
                sendEmailToSeller(result, getEmailTemplateInternalIdByName('買方不同意開立折讓單通知'));
                break;
            }
            case 'send_created_allowance_voucher_to_buyer': {
                sendEmailToBuyer(result, getEmailTemplateInternalIdByName('折讓證明單已開立'));
                break;
            }
            default : {
                break;
            }
        }
    }

    exports.getEmailTemplate = getEmailTemplate;
    exports.sendEmailNotification = sendEmailNotification;
    return exports
})
