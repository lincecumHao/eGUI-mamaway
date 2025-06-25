/**
 *
 * @copyright 2025 Inzaghi
 * @author Chesley Lo
 *
 * @NApiVersion 2.1
 * @NModuleScope Public
 *
 * @NScriptType ClientScript
 *
 */
define([
    '../../gw_ap_doc/field_validation/gw_lib_string',
    '../../gw_ap_doc/field_validation/gw_lib_field_validation_tax_id_number',
    'N/currentRecord'
], function (
    stringUtil,
    taxIdValidator,
    currentRecord
) {

    let exports = {};

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
        let flag = true
        const recordObject = currentRecord.get()
        console.log(JSON.stringify(recordObject))
        const recordType = recordObject.getValue({fieldId: 'type'})
        console.log('recordType:', recordType)
        const taxFieldId = (recordType === 'custjob' || recordType === 'vendor') ? `custentity_gw_tax_id_number` : `custbody_gw_tax_id_number`
        console.log('taxFieldId:', taxFieldId)
        const taxId = recordObject.getValue({fieldId: taxFieldId})
        const isValidUniformNumberFormat = taxIdValidator.isValidUniformNumberFormat(taxId)
        const isNumberCalculatedValid = taxIdValidator.isNumberCalculatedValid(taxId)
        console.log('saveRecord - info', {
            taxId,
            isValidUniformNumberFormat,
            isNumberCalculatedValid
        })
        if (!isValidUniformNumberFormat || !isNumberCalculatedValid) flag = false
        if (stringUtil.isNullOrEmpty(taxId.toString()) || taxIdValidator.isB2CTaxId(taxId)) flag = true

        if(flag === false) {
            let errorMessage = null
            errorMessage = (taxId.toString() === '00000000') ? `如為B2C請輸入10個0` : `統編格式錯誤`
            alert(errorMessage)
        }

        return flag
    }

    exports.saveRecord = saveRecord;

    return exports;
});
