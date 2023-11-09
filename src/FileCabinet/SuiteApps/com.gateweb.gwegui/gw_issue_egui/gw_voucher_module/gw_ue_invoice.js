/**
 *
 * @copyright 2023 GateWeb
 * @author Chesley Lo <{chesleylo@gateweb.com.tw}>
 *
 * @NApiVersion 2.1
 * @NModuleScope Public
 *
 * @NScriptType UserEventScript
 */
define([], () => {

    let exports = {};

    const APPLIED_SUBSIDIARY = ['11']
    const DEFAULT_ISSUE_VOUCHER_STATUS_ID = 14

    function isNeedToSetDefaultValueForEGUI(scriptContext) {
        const subsidiaryId = scriptContext.newRecord.getValue({fieldId: 'subsidiary'})
        log.debug({
            title: 'isNeedToSetDefaultValueForEGUI - subsidiary info',
            details: {
                subsidiaryId: subsidiaryId,
                valueType: typeof subsidiaryId
            }})
        return APPLIED_SUBSIDIARY.indexOf(subsidiaryId) !== -1 && scriptContext.type === scriptContext.UserEventType.CREATE
    }

    function setDefaultValueForEGUI(scriptContext) {
        scriptContext.newRecord.setValue({fieldId: 'custbody_gw_evidence_issue_status', value: DEFAULT_ISSUE_VOUCHER_STATUS_ID})
        scriptContext.newRecord.setValue({fieldId: 'custbody_gw_is_issue_egui', value: true})
    }

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
        if(isNeedToSetDefaultValueForEGUI(scriptContext)) {
            // proceed to set Default value for eGUI
            log.debug({title: 'beforeLoad - setDefaultValueForEGUI', details: 'start'})
            setDefaultValueForEGUI(scriptContext)
        }
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
        if(isNeedToSetDefaultValueForEGUI(scriptContext)) {
            // proceed to set Default value for eGUI
            log.debug({title: 'beforeSubmit - setDefaultValueForEGUI', details: 'start'})
            setDefaultValueForEGUI(scriptContext)
        }
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

    }

    // exports.beforeLoad = beforeLoad;
    exports.beforeSubmit = beforeSubmit;
    // exports.afterSubmit = afterSubmit;
    return exports;
});
