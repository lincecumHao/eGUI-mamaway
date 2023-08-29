/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope Public
 */

define([
    'N/ui/serverWidget',
    'N/search',
    'N/runtime',
    'N/url',
    'N/task',
    'N/record',
    '../services/gw_allowance_consent_notification',
    'N/format'
], function (
    serverWidget,
    search,
    runtime,
    url,
    task,
    record,
    gwAllowanceConsentNotification,
    format
) {

    function getInputParameters(context) {
        const invoiceNumber = context.request.parameters.invoiceNumber || 0;
        const recordId = context.request.parameters.recordId || 0;
        const uniqueId = context.request.parameters.uniqueId || 0;
        const reSend = context.request.parameters.reSend || false;
        return {
            invoiceNumber,
            recordId,
            uniqueId,
            reSend
        };
    }

    function validateInputParameters(inputParameters) {
        let searchFilters = [];
        searchFilters.push(['custrecord_unique_id', 'equalto', inputParameters.uniqueId]);
        searchFilters.push('AND');
        searchFilters.push(['internalid', 'anyof', inputParameters.recordId]);
        searchFilters.push('AND');
        searchFilters.push(['custrecord_egui_invoice_number', 'is', inputParameters.invoiceNumber]);
        let searchColumns = [];
        searchColumns.push(
            search.createColumn({
                name: 'formulanumeric',
                formula: '{today} - {custrecord_notification_expired_date}'
            })
        );
        searchColumns.push('custrecord_buyer_agree');
        searchColumns.push('custrecord_buyer_reject');
        var customrecord_gw_allowance_consent_notifySearchObj = search.create({
            type: "customrecord_gw_allowance_consent_notify",
            filters: searchFilters,
            columns: searchColumns
        });
        var searchResultCount = customrecord_gw_allowance_consent_notifySearchObj.runPaged().count;
        log.debug("customrecord_gw_allowance_consent_notifySearchObj result count", searchResultCount);
        let resultObj = {
            isExisted: searchResultCount > 0 ? true : false,
            isExpired: false,
            buyerAgree: false,
            buyerReject: false
        }
        customrecord_gw_allowance_consent_notifySearchObj.run().each(function (result) {
            // .run().each has a limit of 4,000 results
            resultObj.isExpired = result.getValue(result.columns[0]) >= 1 ? true : false;
            resultObj.buyerAgree = result.getValue(result.columns[1]);
            resultObj.buyerReject = result.getValue(result.columns[2]);
            return true;
        });
        return resultObj
    }

    function createForm(context, inputParameters) {
        if (context.request.method === 'GET') {
            var form = serverWidget.createForm({
                title: '電子折讓單確認同意函'
            });
            form.clientScriptModulePath = `/SuiteApps/com.gateweb.gwegui/gw_issue_egui/gw_voucher_module/gw_cs_allowance_consent_event.js`;

            var recordIdField = form.addField({
                id: 'custpage_record_id',
                type: serverWidget.FieldType.TEXT,
                label: 'recordId'
            });
            recordIdField.defaultValue = inputParameters.recordId;
            recordIdField.updateDisplayType({displayType: serverWidget.FieldDisplayType.HIDDEN});

            var invoiceNumberField = form.addField({
                id: 'custpage_invoice_number',
                type: serverWidget.FieldType.TEXT,
                label: '發票號碼'
            });
            invoiceNumberField.defaultValue = inputParameters.invoiceNumber;
            invoiceNumberField.updateDisplayType({displayType: serverWidget.FieldDisplayType.DISABLED});

            var disagreeReasonField = form.addField({
                id: 'custpage_disagree_reason',
                type: serverWidget.FieldType.TEXT,
                label: '不同意原因'
            });
            disagreeReasonField.updateLayoutType({
                layoutType: serverWidget.FieldLayoutType.OUTSIDEBELOW
            });
            disagreeReasonField.updateBreakType({
                breakType: serverWidget.FieldBreakType.STARTCOL
            });

            var newUploadField = form.addField({
                id: 'custpage_new_upload_date',
                type: serverWidget.FieldType.DATE,
                label: '新上傳日期'
            });
            newUploadField.updateLayoutType({
                layoutType: serverWidget.FieldLayoutType.OUTSIDEBELOW
            });
            newUploadField.updateBreakType({
                breakType: serverWidget.FieldBreakType.STARTROW
            });

            var newDate = new Date();
            var currentDateString = format.format({
                value: newDate,
                type: format.Type.DATETIME,
                timezone: format.Timezone.ASIA_TAIPEI
            });
            var currentDate = format.parse({
                value: currentDateString,
                type: format.Type.DATETIME,
                timezone: format.Timezone.ASIA_TAIPEI
            });

            log.debug({
                title: 'date diff',
                details: {
                    newDate,
                    currentDateString,
                    currentDate
                }
            });

            newUploadField.defaultValue = currentDate;
            newUploadField.updateDisplayType({displayType: serverWidget.FieldDisplayType.DISABLED});

            // var applyPeriodField = form.addField({
            //     id: 'custpage_apply_period',
            //     type: serverWidget.FieldType.TEXT,
            //     label: '可申報期別'
            // });
            // applyPeriodField.updateLayoutType({
            //     layoutType: serverWidget.FieldLayoutType.OUTSIDEBELOW
            // });
            // applyPeriodField.updateBreakType({
            //     breakType: serverWidget.FieldBreakType.STARTROW
            // });

            var agreeButton = form.addButton({
                label: '同意',
                id: 'custpage_agree',
                functionName: 'handleAgree()'
            });
            var disagreeButton = form.addButton({
                label: '不同意',
                id: 'custpage_disagree',
                functionName: 'handleDisagree()'
            });

            context.response.writePage(form);
        }
    }

    function getUniqueId() {
        return new Date().getTime();
    }

    function updateUniqueId(recordId) {
        record.submitFields({
            type: 'customrecord_gw_allowance_consent_notify',
            id: recordId,
            values: {
                custrecord_unique_id: getUniqueId(),
            }
        });
    }

    function getResendLink(inputParameters) {
        var domainUrl = url.resolveDomain({
            hostType: url.HostType.FORM,
            accountId: runtime.accountId
        });

        log.debug({title: 'domainUrl', details: domainUrl});

        var currentScript = runtime.getCurrentScript();
        var scriptURL = url.resolveScript({
            scriptId: currentScript.id,
            deploymentId: currentScript.deploymentId,
            returnExternalURL: true
        });

        var domainUrl = url.resolveDomain({
            hostType: url.HostType.FORM,
            accountId: runtime.accountId
        });

        log.debug({title: 'FULL URL', details: `${domainUrl}${scriptURL}&h=75b538f36ae489e9b750`});
        let newLink = `https://${domainUrl}${scriptURL}&h=75b538f36ae489e9b750&uniqueId=${inputParameters.uniqueId}&recordId=${inputParameters.recordId}&invoiceNumber=${inputParameters.invoiceNumber}&reSend=true`;
        log.debug({title: 'newLink', details: newLink});

        return newLink;
    }

    function onRequest(context) {

        const inputParameters = getInputParameters(context);
        log.debug({title: 'inputParameters', details: inputParameters});
        let resultObj = validateInputParameters(inputParameters);
        log.debug({title: 'resultObj', details: resultObj});

        if (resultObj.isExisted && inputParameters.reSend) {
            updateUniqueId(inputParameters.recordId);
            gwAllowanceConsentNotification.executeScript(inputParameters.recordId, false, 'send_allowance_consent_to_buyer');
            var html = '<html><body><h3>系統將於30分鐘內寄送</h3></body></html>';
            context.response.write(html);
        } else if (resultObj.buyerAgree) {
            var html = '<html><body><h3>折讓單已確認</h3></body></html>';
            context.response.write(html);
        } else if (resultObj.buyerReject) {
            var html = '<html><body><h3>折讓單已拒絕</h3></body></html>';
            context.response.write(html);
        } else if (resultObj.isExpired) {
            const resendLink = getResendLink(inputParameters);
            var html = `<html><body><h3>此連結已失效, 請點<a href="${resendLink}">重新寄送</a>, 系統將會重新寄送確認信</h3></body></html>`
            context.response.write(html);
        } else if (resultObj.isExisted === false) {
            var html = '<html><body><h3>此連結無效</h3></body></html>';
            context.response.write(html);
        } else {
            createForm(context, inputParameters);
        }
    }

    return {
        onRequest: onRequest
    };
});
