/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define([
    'N/record',
    'N/search',
    'N/task',
    '../services/gw_allowance_consent_notification'
], (
    record,
    search,
    task,
    gwAllowanceConsentNotification
) => {
    /**
     * Defines the function definition that is executed before record is loaded.
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
     * @param {Form} scriptContext.form - Current form
     * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
     * @since 2015.2
     */
    const beforeLoad = (scriptContext) => {

    }

    /**
     * Defines the function definition that is executed before record is submitted.
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
     * @since 2015.2
     */
    const beforeSubmit = (scriptContext) => {

    }

    function createAllowanceConsentNotificationRecord(recordId) {
        let recordObject = record.create({
            type: 'customrecord_gw_allowance_consent_notify'
        });
        log.debug({title: 'new Date().getTime()', details: new Date().getTime()});
        recordObject.setValue({
            fieldId: 'custrecord_unique_id',
            value: new Date().getTime()
        });
        recordObject.setValue({
            fieldId: 'custrecord_gw_voucher_main_id',
            value: recordId
        });
        recordObject.setValue({
            fieldId: 'custrecord_need_to_enter_record_info',
            value: true
        });
        const resultId = recordObject.save({
            enableSourcing: true,
            ignoreMandatoryFields: true
        });

        return resultId;
    }

    function updateVoucherMain(scriptContext, recordId) {
        const voucherMainId = gwAllowanceConsentNotification.getVoucherMainId(recordId);
        record.submitFields({
            type: 'customrecord_gw_voucher_main',
            id: voucherMainId,
            values: {
                custrecord_gw_need_upload_egui_mig: 'ALL',
                custrecord_gw_voucher_date: scriptContext.newRecord.getValue({fieldId: 'custrecord_new_voucher_date'})
            }
        });
    }

    /**
     * Defines the function definition that is executed after record is submitted.
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
     * @since 2015.2
     */
    const afterSubmit = (scriptContext) => {
        try {
            const buyerAgree = scriptContext.newRecord.getValue({fieldId: 'custrecord_buyer_agree'});
            const buyerReject = scriptContext.newRecord.getValue({fieldId: 'custrecord_buyer_reject'});
            const recordId = scriptContext.newRecord.id;
            if (scriptContext.type === scriptContext.UserEventType.EDIT && buyerAgree) {
                // TODO - update voucher main -> NEEDUPLOADMIG (id: custrecord_gw_need_upload_egui_mig) to ALL
                updateVoucherMain(scriptContext, recordId);
                // TODO - execute Map/Reduce to send the notification
                gwAllowanceConsentNotification.executeScript(recordId, false, 'send_buyer_agree_to_seller');
            } else if (scriptContext.type === scriptContext.UserEventType.EDIT && buyerReject) {
                // TODO - execute Map/Reduce to send the notification
                gwAllowanceConsentNotification.executeScript(recordId, false, 'send_buyer_reject_to_seller');
            }
        } catch (e) {
            log.error({title: 'afterSubmit', details: e});
        }
    }

    return {beforeLoad, beforeSubmit, afterSubmit}

});
