/**
 *
 * @copyright 2023 GateWeb
 * @author Chesley Lo <chesleylo@gateweb.com.tw>
 *
 * @NApiVersion 2.1
 * @NModuleScope Public
 *
 * @NScriptType UserEventScript
 */
define([
    '../gw_dao/gw_transaction_egui_fields',
    'N/search',
    '../../gw_library/gw_lib_transaction_util',
    'N/record'
], (
    gwTransactionEGUIFields,
    search,
    gwLibTransactionUtil,
    record
) => {

    let exports = {};

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
            if (gwLibTransactionUtil.isNeedToClearValueForEGUI(scriptContext)) {
                // proceed to set Default value for eGUI
                log.debug({title: 'beforeLoad - clearValueForEGUI', details: 'start'})
                gwLibTransactionUtil.clearValueForEGUI(scriptContext)
                gwLibTransactionUtil.setSourceFieldValue(scriptContext)
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
            if (gwLibTransactionUtil.isNeedToSetDefaultValueForEGUIData(scriptContext)) {
                // proceed to set Default value for eGUI
                log.debug({title: 'beforeSubmit - setDefaultValueForEGUI', details: 'start'})
                gwLibTransactionUtil.setDefaultValueForEGUI(scriptContext)
            }
        } catch (e) {
            log.error({
                title: 'beforeSubmit - error',
                details: e
            })
        }

    }

    function createExternalSalesVoucherMain(scriptContext) {
        log.audit({title: 'createExternalSalesVoucherMain', details: 'start...'})
        const recordId = 'customrecord_gw_voucher_main'
        const voucherMainRecordObject = record.create({
            type: recordId
        })
        voucherMainRecordObject.setValue({fieldId: 'custrecord_gw_voucher_type', value: 'EGUI'})

        //custrecord_gw_voucher_date - convert date to YYYYMMDD
        //custrecord_gw_voucher_yearmonth convert date to 申報期別

        //custrecord_gw_seller
        //custrecord_gw_seller_name
        //custrecord_gw_seller_address
        //custrecord_gw_buyer - INV: 統一編號(id: custbody_gw_tax_id_number)
        //custrecord_gw_buyer_name - INV 發票抬頭(id: custbody_gw_gui_title)
        //custrecord_gw_buyer_address - INV 登記地址(id: custbody_gw_gui_address)
        voucherMainRecordObject.setValue({fieldId: 'custrecord_gw_voucher_format_code', value: '35'})
        //custrecord_gw_clearance_mark - INV: 通關註記(id: custbody_gw_egui_clearance_mark)
        voucherMainRecordObject.setValue({fieldId: 'custrecord_gw_voucher_status', value: 'VOUCHER_SUCCESS'})
        voucherMainRecordObject.setValue({fieldId: 'custrecord_gw_voucher_upload_status', value: 'C'})
        //custrecord_gw_zero_sales_amount - INV total amount (need to convert to TWD)
        voucherMainRecordObject.setValue({fieldId: 'custrecord_gw_tax_type', value: 2})
        voucherMainRecordObject.setValue({fieldId: 'custrecord_gw_tax_rate', value: 0})
        //custrecord_gw_total_amount - INV total amount (need to convert to TWD)
        //custrecord_voucher_sale_tax_apply_period - need to convert to 申報期別
        //custrecord_gw_applicable_zero_tax - INV: 適用零稅率規定(id: custbody_gw_applicable_zero_tax)
        //custrecord_gw_customs_export_category - INV: 海關出口報單類別(id: custbody_gw_customs_export_category)
        //custrecord_gw_customs_export_no - INV: 海關出口報單號碼(id: custbody_gw_customs_export_no)
        //custrecord_gw_customs_export_date - INV: 輸出或結匯日期(id: custbody_gw_customs_export_date) - need to convert to YYYMMDD
        voucherMainRecordObject.setValue({fieldId: 'custrecord_gw_ns_transaction', value: scriptContext.newRecord.id})

        const resultId = voucherMainRecordObject.save({ignoreMandatoryFields: true})

        log.debug({title: 'createExternalSalesVoucherMain - resultId', details: resultId})
    }

    function updateExternalSalesVoucherMain(scriptContext) {
        log.audit({title: 'updateExternalSalesVoucherMain', details: 'start...'})
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
            if (scriptContext.type !== scriptContext.UserEventType.DELETE) {
                const esInfoCompleted_old = scriptContext.oldRecord.getValue({fieldId: 'custbody_gw_es_info_completed'})
                const esInfoCompleted_new = scriptContext.newRecord.getValue({fieldId: 'custbody_gw_es_info_completed'})
                log.audit({title: 'afterSubmit - esInfoCompleted_old', details: esInfoCompleted_old})
                log.audit({title: 'afterSubmit - esInfoCompleted_new', details: esInfoCompleted_new})

                const createdDate = scriptContext.newRecord.getValue({fieldId: 'createddate'})
                log.audit({title: 'afterSubmit - createdDate', details: createdDate})

                if(!esInfoCompleted_old && esInfoCompleted_new) {
                    // TODO - create
                    // createExternalSalesVoucherMain(scriptContext)
                }else if(esInfoCompleted_old && esInfoCompleted_new) {
                    // TODO - update
                    updateExternalSalesVoucherMain(scriptContext)
                }

            }
        } catch (e) {
            log.error({title: 'afterSubmit - e', details: e})
        }
    }

    exports.beforeLoad = beforeLoad;
    exports.beforeSubmit = beforeSubmit;
    exports.afterSubmit = afterSubmit;
    return exports;
});
