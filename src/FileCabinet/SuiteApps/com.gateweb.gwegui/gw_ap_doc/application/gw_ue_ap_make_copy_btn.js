/**
 *
 * @copyright 2023 Gateweb
 * @author Chesley Lo <chesleylo@gateweb.com>
 *
 * @NApiVersion 2.1
 * @NModuleScope Public
 *
 * @NScriptType UserEventScript
 */
define([], () => {

    let exports = {};

    function addMakeCopyBtn(scriptContext) {
        scriptContext.form.clientScriptModulePath = 'SuiteApps/com.gateweb.gwegui/gw_ap_doc/application/gw_cs_ap_make_copy_btn.js'
        scriptContext.form.addButton({
            id: 'custpage_ap_make_copy',
            label: `Copy Previous AP Voucher Line`,
            functionName: `makeCopyVoucherLine`
        })
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
        if (scriptContext.type === scriptContext.UserEventType.EDIT) addMakeCopyBtn(scriptContext)
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

    exports.beforeLoad = beforeLoad;
    // exports.beforeSubmit = beforeSubmit;
    // exports.afterSubmit = afterSubmit;
    return exports;
});
