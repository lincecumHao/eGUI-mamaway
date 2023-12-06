/**
 *
 * @copyright 2023 GateWeb
 * @author Chesley Lo <chesleylo@gateweb.com.tw>
 *
 * @NApiVersion 2.1
 * @NModuleScope Public
 */
define([
    '../gw_issue_egui/gw_dao/gw_transaction_egui_fields',
    'N/search'
], (
    gwTransactionEGUIFields,
    search
) => {

    let exports = {};

    exports.isNeedToClearCreditMemoEGUIData = function (scriptContext) {
        const createdFrom = scriptContext.newRecord.getValue({fieldId: 'createdfrom'})
        return createdFrom && scriptContext.type === scriptContext.UserEventType.CREATE
    }

    exports.clearValueForEGUI = function (scriptContext) {
        gwTransactionEGUIFields.allFieldIds.forEach(function (fieldId) {
            scriptContext.newRecord.setValue({
                fieldId: gwTransactionEGUIFields.fields[fieldId].id,
                value: gwTransactionEGUIFields.fields[fieldId].defaultValue
            })
        })
    }

    exports.setSourceFieldValue = function (scriptContext) {
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

    exports.setDefaultValueForEGUI = function (scriptContext) {
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
            if(gwTransactionEGUIFields.fields[fieldId].id === 'custbody_gw_evidence_issue_status') {
                gwTransactionEGUIFields.fields[fieldId].defaultValue = getDefaultStatusByStatusCode('MI')
            }
            scriptContext.newRecord.setValue({
                fieldId: gwTransactionEGUIFields.fields[fieldId].id,
                value: gwTransactionEGUIFields.fields[fieldId].defaultValue
            })
        })
    }

    exports.isNeedToSetDefaultValueForEGUIData = function (scriptContext) {
        return scriptContext.type === scriptContext.UserEventType.CREATE
    }

    exports.isNeedToClearValueForEGUI = function (scriptContext) {
        return scriptContext.type === scriptContext.UserEventType.COPY
    }

    function getDefaultStatusByStatusCode(statusCode) {
        var recordType = 'customrecord_gw_evidence_status'
        var searchFilters = []
        searchFilters.push(['custrecord_gw_evidence_status_value', 'is', statusCode])
        var searchColumns = []
        searchColumns.push('name')
        searchColumns.push('id')
        var customrecord_gw_evidence_statusSearchObj = search.create({
            type: recordType,
            filters:searchFilters,
            columns: searchColumns
        });
        var searchResultCount = customrecord_gw_evidence_statusSearchObj.runPaged().count;
        log.debug("customrecord_gw_evidence_statusSearchObj result count",searchResultCount);
        var defaultStatusId = null
        customrecord_gw_evidence_statusSearchObj.run().each(function(result){
            // .run().each has a limit of 4,000 results
            defaultStatusId = result.id
            return true
        })

        log.debug({
            title: 'getDefaultStatusByStatusCode - defaultStatusId',
            details: defaultStatusId
        })
        return defaultStatusId
    }

    return exports;
});
