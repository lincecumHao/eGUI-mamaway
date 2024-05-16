/**
 *
 * @copyright 2024 GateWeb
 * @author Chesley Lo <chesleylo@gateweb.com.tw>
 *
 * @NApiVersion 2.x
 * @NModuleScope Public
 *
 * @NScriptType ClientScript
 *
 */
define([
    'N/currentRecord'
], function (
    currentRecord
) {

    var exports = {};

    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
    function pageInit(scriptContext) {

    }

    /**
     * Function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @since 2015.2
     */
    function fieldChanged(scriptContext) {

    }

    /**
     * Function to be executed when field is slaved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     *
     * @since 2015.2
     */
    function postSourcing(scriptContext) {

    }

    /**
     * Function to be executed after sublist is inserted, removed, or edited.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function sublistChanged(scriptContext) {

    }

    /**
     * Function to be executed after line is selected.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function lineInit(scriptContext) {

    }

    /**
     * Validation function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @returns {boolean} Return true if field is valid
     *
     * @since 2015.2
     */
    function validateField(scriptContext) {
        var validateResult = true
        var cr = currentRecord.get()
        try {
            var fieldValue = cr.getValue({fieldId: scriptContext.fieldId})
            if(scriptContext.fieldId === 'custbody_gw_export_import_customs_area') {
                if(fieldValue.length > 2) {
                    alert('輸入關別最多為兩碼')
                    validateResult = false
                }
            }else if(scriptContext.fieldId === 'custbody_gw_export_transport_customs_a') {
                if(fieldValue.length > 2) {
                    alert('轉運關別最多為兩碼')
                    validateResult = false
                }
            }else if(scriptContext.fieldId === 'custbody_gw_export_year'){
                if(fieldValue.length > 2) {
                    alert('民國年度最多為兩碼, 例:113年, 請輸入13')
                    validateResult = false
                }
            }else if(scriptContext.fieldId === 'custbody_gw_export_case_number') {
                var exportSerialNumber = cr.getValue({fieldId: 'custbody_gw_export_serial_number'})
                var caseNumberLength = 8 - exportSerialNumber.length
                if(caseNumberLength < fieldValue.length && fieldValue.length < 3 || fieldValue.length > 4) {
                    alert('箱(艙)號為3~4碼, 請確認輸入是否有誤')
                    validateResult = false
                }
            }else if(scriptContext.fieldId === 'custbody_gw_export_serial_number') {
                var exportCaseNumber = cr.getValue({fieldId: 'custbody_gw_export_case_number'})
                var totalLength = 8 - exportCaseNumber.length
                if(totalLength < fieldValue.length && fieldValue.length < 4 || fieldValue.length > 5) {
                    alert('自編流水號為4~5碼, 請確認輸入是否有誤')
                    validateResult = false
                }
            }
        } catch (e) {
            console.log('validateField - e', JSON.stringify(e))
        }
        return validateResult;
    }

    /**
     * Validation function to be executed when sublist line is committed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateLine(scriptContext) {
        return true;
    }

    /**
     * Validation function to be executed when sublist line is inserted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateInsert(scriptContext) {
        return true;
    }

    /**
     * Validation function to be executed when record is deleted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateDelete(scriptContext) {
        return true;
    }

    /**
     * Validation function to be executed when record is saved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @returns {boolean} Return true if record is valid
     *
     * @since 2015.2
     */
    function saveRecord(scriptContext) {

        return true;
    }

    exports.pageInit = pageInit;
    exports.fieldChanged = fieldChanged;
    exports.postSourcing = postSourcing;
    exports.sublistChanged = sublistChanged;
    exports.lineInit = lineInit;
    exports.validateField = validateField;
    exports.validateLine = validateLine;
    exports.validateInsert = validateInsert;
    exports.validateDelete = validateDelete;
    exports.saveRecord = saveRecord;

    return exports;
});
