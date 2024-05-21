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
    'N/currentRecord',
    'N/search'
], function (
    currentRecord,
    search
) {

    var exports = {};
    var exportSalesStatusId = null
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
        exportSalesStatusId = getExportSalesStatusId()
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
        if(scriptContext.fieldId === 'custbody_gw_egui_clearance_mark') {
            var fieldValue = scriptContext.currentRecord.getValue({fieldId: scriptContext.fieldId})
            if(fieldValue) {
                scriptContext.currentRecord.setValue({fieldId: 'custbody_gw_evidence_issue_status', value: exportSalesStatusId})
                scriptContext.currentRecord.setValue({fieldId: 'custbody_gw_is_issue_egui', value: false})
            }
        }
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

    function isNumeric(value) {
        return /^-?\d+$/.test(value);
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
            console.log('validateField - fieldValue', fieldValue)
            console.log('validateField - fieldValue.length', fieldValue.length)

            if(scriptContext.fieldId === 'custbody_gw_export_import_customs_area') {
                if(fieldValue.length !== 0 && fieldValue.length !== 2) {
                    alert('輸入關別為兩碼')
                    validateResult = false
                }
            }else if(scriptContext.fieldId === 'custbody_gw_export_transport_customs_a') {
                if(fieldValue.length !== 0 && fieldValue.length !== 2) {
                    alert('轉運關別為兩碼')
                    validateResult = false
                }
            }else if(scriptContext.fieldId === 'custbody_gw_export_year'){
                if(fieldValue.length !== 0 && fieldValue.length !== 2) {
                    alert('民國年度最為兩碼, 例:113年, 請輸入13')
                    validateResult = false
                } else if (fieldValue.length === 2 && isNumeric(fieldValue) === false) {
                    alert('請輸入數字')
                    validateResult = false
                }
            }else if(scriptContext.fieldId === 'custbody_gw_export_case_number') {
                if(fieldValue.length !== 0 && (fieldValue.length < 3 || fieldValue.length > 4)) {
                    alert('箱(艙)號為3~4碼, 請確認輸入是否有誤')
                    validateResult = false
                }
            }else if(scriptContext.fieldId === 'custbody_gw_export_serial_number') {
                if(fieldValue.length !== 0 && (fieldValue.length < 4 || fieldValue.length > 5)) {
                    alert('自編流水號為4~5碼, 請確認輸入是否有誤')
                    validateResult = false
                }
            }

            if(validateResult === false) {
                cr.setValue({
                    fieldId: scriptContext.fieldId,
                    value: '',
                    ignoreFieldChange: true
                })
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

    function validateExportSalesRequiredField(cr) {
        var errorMessage = ''
        var isNeedToValidateTotalLength = true
        var exportSalesClearanceMark = cr.getValue({fieldId: 'custbody_gw_egui_clearance_mark'}) // 通關註記 - 必填
        var exportSalesApplicableZeroTax = cr.getValue({fieldId: 'custbody_gw_applicable_zero_tax'}) // 適用零稅率規定 - 必填
        var exportSalesCustomsExportCategory = cr.getValue({fieldId: 'custbody_gw_customs_export_category'}) // 海關出口報單類別 - 如為經海關則必填
        var exportSalesCustomsExportDate = cr.getValue({fieldId: 'custbody_gw_customs_export_date'}) // 輸出或結匯日期 - 必填

        if(!exportSalesClearanceMark) errorMessage += '通關註記為必填' + '\n'
        if(!exportSalesApplicableZeroTax) errorMessage += '適用零稅率規定為必填' + '\n'
        if(exportSalesClearanceMark === '2' && !exportSalesCustomsExportCategory) errorMessage += '經海關, 海關出口報單類別為必填' + '\n'
        if(!exportSalesCustomsExportDate) errorMessage += '輸出或結匯日期為必填' + '\n'

        console.log('validateExportSalesRequiredField - Export Sales Info', {
            exportSalesClearanceMark: exportSalesClearanceMark,
            exportSalesApplicableZeroTax: exportSalesApplicableZeroTax,
            exportSalesCustomsExportCategory: exportSalesCustomsExportCategory,
            exportSalesCustomsExportDate: exportSalesCustomsExportDate
        })

        var exportSalesZeroTaxSalesAmount = cr.getValue({fieldId: 'custbody_gw_gui_sales_amt_tax_zero'}) // 零稅銷售額 - 必填
        if(!exportSalesZeroTaxSalesAmount) errorMessage += '零稅銷售額為必填' + '\n'

        var exportSalesImportCustomsArea = cr.getValue({fieldId: 'custbody_gw_export_import_customs_area'}) // 輸入關別 - 如為經海關則必填
        if(exportSalesClearanceMark === '2' && !exportSalesImportCustomsArea) errorMessage += '經海關, 輸入關別為必填' + '\n'

        var exportSalesTransportCustomsArea = cr.getValue({fieldId: 'custbody_gw_export_transport_customs_a'}) // 轉運關別 - 如為經海關且有轉運關別則選填

        var exportSalesExportYear = cr.getValue({fieldId: 'custbody_gw_export_year'}) // 民國年度 - 如為經海關則必填
        if(exportSalesClearanceMark === '2' && !exportSalesExportYear) errorMessage += '經海關, 民國年度為必填' + '\n'

        var exportSalesExportCaseNumber = cr.getValue({fieldId: 'custbody_gw_export_case_number'}) // 箱(艙)號 - 如為經海關則必填
        if(exportSalesClearanceMark === '2' && !exportSalesExportCaseNumber) {
            errorMessage += '經海關, 箱(艙)號為必填' + '\n'
            isNeedToValidateTotalLength = false
        }

        var exportSalesExportSerialNumber = cr.getValue({fieldId: 'custbody_gw_export_serial_number'}) // 自編流水號 - 如為經海關則必填
        if(exportSalesClearanceMark === '2' && !exportSalesExportSerialNumber) {
            errorMessage += '經海關, 自編流水號為必填' + '\n'
            isNeedToValidateTotalLength = false
        }

        if(exportSalesClearanceMark === '2' && isNeedToValidateTotalLength) {
            var totalLength = exportSalesExportCaseNumber.length + exportSalesExportSerialNumber.length
            if(totalLength > 8) errorMessage += '箱(艙)號+自編流水號最多為8碼'
        }

        console.log('validateExportSalesRequiredField - errorMessage', errorMessage)
        if(errorMessage.length) alert(errorMessage)

        return errorMessage.length === 0
    }


    function getExportSalesStatusId() {
        var exportSalesStatusId = null;
        var filters = []
        filters.push(['custrecord_gw_evidence_status_value', 'is', 'ES'])
        var columns = []
        columns.push('custrecord_gw_evidence_status_value')
        columns.push('custrecord_gw_evidence_status_text')
        var getExportSalesEvidenceStatusSearchObj = search.create({
            type: 'customrecord_gw_evidence_status',
            filters,
            columns
        })
        getExportSalesEvidenceStatusSearchObj.run().each(function(result){
            // .run().each has a limit of 4,000 results
            exportSalesStatusId = result.id
            return true
        })

        return exportSalesStatusId
    }

    function validateEvidenceIssueStatus(scriptContext) {
        var currentEvidenceIssueStatus = scriptContext.currentRecord.getValue({fieldId: 'custbody_gw_evidence_issue_status'})
        console.log('validateEvidenceIssueStatus - exportSalesStatusId', exportSalesStatusId)
        console.log('validateEvidenceIssueStatus - currentEvidenceIssueStatus', currentEvidenceIssueStatus)

        return exportSalesStatusId === currentEvidenceIssueStatus
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
        var returnFlag = true
        var cr = currentRecord.get()

        var exportSalesInfoCompleted = cr.getValue({
            fieldId: 'custbody_gw_es_info_completed'
        })
        console.log('saveRecord - exportSalesInfoCompleted', exportSalesInfoCompleted)
        if(exportSalesInfoCompleted && !validateEvidenceIssueStatus(scriptContext)) {
            // TODO - check 開立狀態(id: custbody_gw_evidence_issue_status)是否為"出口外銷免開發票"
            returnFlag = false
            alert('請將開立狀態改為出口外銷免開發票!')
        } else if (exportSalesInfoCompleted) {
            // TODO - validate required field value
            returnFlag = validateExportSalesRequiredField(cr)
        }

        return returnFlag
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
