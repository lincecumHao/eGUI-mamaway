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
define([
    '../gw_dao/gw_transaction_egui_fields',
    'N/search'
], (
    gwTransactionEGUIFields,
    search
) => {

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
            }
        })
        return APPLIED_SUBSIDIARY.indexOf(subsidiaryId) !== -1 && scriptContext.type === scriptContext.UserEventType.CREATE
    }

    function setDefaultValueForEGUI(scriptContext) {
        log.debug({
            title: 'setDefaultValueForEGUI - gwTransactionEGUIFields.defaultValueFields',
            details: gwTransactionEGUIFields.defaultValueFields
        })
        gwTransactionEGUIFields.defaultValueFields.forEach(function (fieldId) {
            log.debug({
                title: 'setDefaultValueForEGUI - fieldId',
                details: {
                    fieldId: fieldId,
                    objectValue: gwTransactionEGUIFields.fields[fieldId]
                }
            })
            scriptContext.newRecord.setValue({
                fieldId: gwTransactionEGUIFields.fields[fieldId].id,
                value: gwTransactionEGUIFields.fields[fieldId].defaultValue
            })
        })
    }

    function isNeedToClearValueForEGUI(scriptContext) {
        log.debug({
            title: 'isNeedToClearValueForEGUI - scriptContext.type',
            details: scriptContext.type
        })
        log.debug({
            title: 'isNeedToClearValueForEGUI - scriptContext.UserEventType enumerable',
            details: scriptContext.UserEventType
        })
        const subsidiaryId = scriptContext.newRecord.getValue({fieldId: 'subsidiary'})
        return APPLIED_SUBSIDIARY.indexOf(subsidiaryId) !== -1 && scriptContext.type === scriptContext.UserEventType.COPY
    }

    function clearValueForEGUI(scriptContext) {
        gwTransactionEGUIFields.allFieldIds.forEach(function (fieldId) {
            scriptContext.newRecord.setValue({
                fieldId: gwTransactionEGUIFields.fields[fieldId].id,
                value: gwTransactionEGUIFields.fields[fieldId].defaultValue
            })
        })
    }

    function setSourceFieldValue(scriptContext) {
        let lookFieldsObject = {}
        gwTransactionEGUIFields.sourcedFields.forEach(function (fieldId) {
            if (!lookFieldsObject[`${gwTransactionEGUIFields.fields[fieldId].sourceRecord}`]) {
                lookFieldsObject[`${gwTransactionEGUIFields.fields[fieldId].sourceRecord}`] = {}
                lookFieldsObject[`${gwTransactionEGUIFields.fields[fieldId].sourceRecord}`].fieldIds = []
            }
            lookFieldsObject[`${gwTransactionEGUIFields.fields[fieldId].sourceRecord}`].fieldIds.push(gwTransactionEGUIFields.fields[fieldId].sourceFieldId)
        })
        log.debug({
            title: 'setSourceFieldValue - lookFieldsObject',
            details: lookFieldsObject
        })
        Object.keys(lookFieldsObject).map(function (key) {
            const customerId = scriptContext.newRecord.getValue({fieldId: 'entity'})
            if (key === 'customer') {
                const lookupResultObject = search.lookupFields({
                    type: key,
                    id: customerId,
                    columns: lookFieldsObject[key].fieldIds
                })
                log.debug({
                    title: 'setSourceFieldValue - lookupResultObject',
                    details: lookupResultObject
                })

                Object.keys(lookupResultObject).map(function (eachLookupResultObjectKey) {
                    scriptContext.newRecord.setValue({
                        fieldId: eachLookupResultObjectKey.replace('custentity', 'custbody'),
                        value: lookupResultObject[eachLookupResultObjectKey]
                    })
                })
            }
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
        try {
            if (isNeedToClearValueForEGUI(scriptContext)) {
                // proceed to set Default value for eGUI
                log.debug({title: 'beforeLoad - clearValueForEGUI', details: 'start'})
                clearValueForEGUI(scriptContext)
                setSourceFieldValue(scriptContext)
            }
        } catch (e) {
            log.error({
                title: 'beforeLoad - e',
                details: e
            })
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
        try {
            if (isNeedToSetDefaultValueForEGUI(scriptContext)) {
                // proceed to set Default value for eGUI
                log.debug({title: 'beforeSubmit - setDefaultValueForEGUI', details: 'start'})
                setDefaultValueForEGUI(scriptContext)
            }
        } catch (e) {
            log.error({
                title: 'beforeSubmit - error',
                details: e
            })
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

    exports.beforeLoad = beforeLoad;
    exports.beforeSubmit = beforeSubmit;
    // exports.afterSubmit = afterSubmit;
    return exports;
});
