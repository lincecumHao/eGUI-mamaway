/**
 *
 * @copyright 2023 GateWeb
 * @author Chesley Lo <chesleylo@gateweb.com.tw>
 *
 * @NApiVersion 2.1
 * @NModuleScope Public
 */
define([
    'N/search'
], (
    search
) => {

    let exports = {}

    function getSearchFilters () {
        let filters = []
        filters.push(['custrecord_gw_voucher_upload_status', 'is', 'A'])
        filters.push('AND')
        filters.push(['custrecord_gw_voucher_status', 'is', 'VOUCHER_SUCCESS'])
        filters.push('AND')
        filters.push(['custrecord_gw_need_upload_egui_mig', 'isnot', 'NONE'])
        filters.push('AND')
        filters.push(['custrecord_gw_need_upload_egui_mig', 'isnot', 'RETRIEVE'])
        filters.push('AND')
        filters.push(['custrecord_gw_is_completed_detail', 'is', 'T'])

        return filters
    }
    function getSearchColumns () {
        return [
            "name",
            "id",
            "custrecord_gw_apply_internal_id",
            "custrecord_gw_voucher_type",
            "custrecord_gw_voucher_number",
            "custrecord_gw_voucher_date",
            "custrecord_gw_voucher_time",
            "custrecord_gw_voucher_yearmonth",
            "custrecord_gw_seller",
            "custrecord_gw_seller_name",
            "custrecord_gw_seller_address",
            "custrecord_gw_buyer",
            "custrecord_gw_buyer_name",
            "custrecord_gw_buyer_email",
            "custrecord_gw_buyer_address",
            "custrecord_gw_buyer_dept_code",
            "custrecord_gw_voucher_dept_code",
            "custrecord_gw_voucher_dept_name",
            "custrecord_gw_voucher_classification",
            "custrecord_gw_invoice_type",
            "custrecord_gw_mig_type",
            "custrecord_gw_voucher_format_code",
            "custrecord_gw_carrier_type",
            "custrecord_gw_carrierid1",
            "custrecord_gw_carrierid2",
            "custrecord_gw_npoban",
            "custrecord_gw_clearance_mark",
            "custrecord_gw_main_remark",
            "custrecord_gw_random_number",
            "custrecord_gw_discount_amount",
            "custrecord_gw_discount_count",
            "custrecord_gw_voucher_owner",
            "custrecord_gw_voucher_status",
            "custrecord_gw_voucher_upload_status",
            "custrecord_gw_accept_status",
            "custrecord_gw_confirm_status",
            "custrecord_gw_uploadstatus_messag",
            "custrecord_gw_sales_amount",
            "custrecord_gw_free_sales_amount",
            "custrecord_gw_zero_sales_amount",
            "custrecord_gw_tax_amount",
            "custrecord_gw_tax_type",
            "custrecord_gw_tax_rate",
            "custrecord_gw_total_amount",
            "custrecord_gw_need_upload_egui_mig",
            "custrecord_gw_print_mark",
            "custrecord_gw_is_printed_pdf",
            "custrecord_gw_is_printed_paper",
            "custrecord_gw_lock_transaction",
            "custrecord_gw_is_completed_detail",
            "custrecord_gw_voucher_extra_memo",
            "custrecord_gw_discount_sales_amount",
            "custrecord_gw_discount_free_amount",
            "custrecord_gw_discount_zero_amount",
            "custrecord_gw_is_manual_voucher",
            "custrecord_gw_original_buyer_id",
            "custrecord_gw_voucher_main_apply_user_id",
            "custrecord_gw_upload_access_model",
            "custrecord_voucher_sale_tax_apply_period",
            "custrecord_gw_voucher_sales_tax_apply",
            "custrecord_gw_applicable_zero_tax",
            "custrecord_gw_customs_export_category",
            "custrecord_gw_customs_export_no",
            "custrecord_gw_customs_export_date",
            "custrecord_gw_ns_transaction",
            "custrecord_gw_dm_mig_type",
            "custrecord_gw_dm_seller_profile",
            "custrecord_upload_xml_file_name"
        ]
    }

    exports.getPendingUploadData = function () {
        let searchFilters = getSearchFilters()
        let searchColumns = getSearchColumns()

        return search.create({
            type: 'customrecord_gw_voucher_main',
            filters: searchFilters,
            columns: searchColumns
        })
    }

    return exports
});
