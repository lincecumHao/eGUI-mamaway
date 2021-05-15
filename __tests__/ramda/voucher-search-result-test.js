import ramda from 'ramda'
import gwMapUtil from 'mapUtil'
import voucherMainFields from 'voucherMainFields'
import voucherDetailFields from 'voucherDetailFields'
var searchResultsMock = [
  {
    name: 'VoucherMainRecord',
    id: '602',
    custrecord_gw_apply_internal_id: '',
    custrecord_gw_voucher_type: 'EGUI',
    custrecord_gw_voucher_number: 'RQ20200008',
    custrecord_gw_voucher_date: '20210427',
    custrecord_gw_voucher_yearmonth: '11004',
    custrecord_gw_seller: '24549210',
    custrecord_gw_buyer: '24549210',
    custrecord_gw_invoice_type: '07',
    custrecord_gw_voucher_format_code: '35',
    custrecord_gw_clearance_mark: '',
    custrecord_gw_voucher_status: 'VOUCHER_ISSUE',
    custrecord_gw_voucher_upload_status: 'A',
    custrecord_gw_sales_amount: '2970',
    custrecord_gw_free_sales_amount: '0',
    custrecord_gw_zero_sales_amount: '0',
    custrecord_gw_tax_amount: '149',
    custrecord_gw_tax_type: '1',
    custrecord_gw_total_amount: '3119',
    custrecord_gw_need_upload_egui_mig: 'ALL',
    custrecord_gw_upload_access_model: 'NETSUITE',
    custrecord_voucher_sale_tax_apply_period: { value: '68', text: '11004' },
    custrecord_gw_voucher_sales_tax_apply: true,
    custrecord_gw_applicable_zero_tax: '',
    custrecord_gw_customs_export_category: '',
    custrecord_gw_customs_export_no: '',
    custrecord_gw_customs_export_date: '',
    custrecord_gw_voucher_main_apply_user_id: '',
    custrecord_gw_accept_status: '',
    custrecord_gw_buyer_email: '',
    custrecord_gw_uploadstatus_messag: '',
    custrecord_gw_lock_transaction: false,
    custrecord_gw_print_mark: 'Y',
    custrecord_gw_original_buyer_id: '',
    owner: { value: '-4', text: '-System-' },
    custrecord_gw_buyer_address: '',
    custrecord_gw_buyer_dept_code: '',
    custrecord_gw_buyer_name: '',
    custrecord_gw_carrierid1: '',
    custrecord_gw_carrierid2: '',
    custrecord_gw_carrier_type: '',
    custrecord_gw_discount_amount: '',
    custrecord_gw_confirm_status: '',
    custrecord_gw_discount_count: '',
    custrecord_gw_discount_free_amount: '0',
    custrecord_gw_discount_sales_amount: '0',
    custrecord_gw_discount_zero_amount: '0',
    custrecord_gw_is_completed_detail: false,
    custrecord_gw_is_manual_voucher: false,
    custrecord_gw_is_printed_pdf: false,
    custrecord_gw_main_remark: '',
    custrecord_gw_mig_type: 'B2C',
    custrecord_gw_npoban: '',
    custrecord_gw_random_number: '6220',
    custrecord_gw_seller_address: '台北市忠孝東路四段258號2樓',
    custrecord_gw_seller_name: '關網資訊股份有限公司',
    custrecord_gw_tax_rate: '5.0',
    custrecord_gw_voucher_classification: '',
    custrecord_gw_voucher_extra_memo: '',
    custrecord_gw_voucher_dept_code: '',
    custrecord_gw_voucher_dept_name: '',
    custrecord_gw_voucher_owner: '',
    custrecord_gw_voucher_time: '23:59:59',
    custrecord_gw_is_printed_paper: false,
    CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID: {
      custrecord_gw_item_description: 'GW Test Item 1',
      custrecord_gw_unit_price: '990.00',
      custrecord_gw_item_quantity: '3',
      custrecord_gw_dtl_item_tax_code: '1',
      custrecord_gw_dtl_item_tax_rate: '5.0',
      custrecord_gw_item_amount: '2970',
      custrecord_gw_item_seq: '1',
      custrecord_gw_item_remark: '',
      custrecord_gw_original_gui_internal_id: '',
      custrecord_gw_original_gui_date: '',
      custrecord_gw_original_gui_number: '',
      custrecord_gw_original_gui_yearmonth: '',
      custrecord_gw_ns_document_apply_id: { value: '', text: ' ' },
      custrecord_gw_ns_document_type: 'Invoice',
      custrecord_gw_ns_document_number: '1',
      custrecord_gw_item_tax_amount: '148.5',
      custrecord_gw_item_total_amount: '3118.5',
      custrecord_gw_item_unit: '個',
      internalid: { value: '702', text: '702' },
      custrecord_gw_voucher_main_internal_id: {
        value: '602',
        text: 'VoucherMainRecord',
      },
      custrecord_gw_ns_document_item_id: '9',
      custrecord_gw_ns_document_id: '3',
      custrecord_gw_ns_document_items_seq: '1',
      custrecord_gw_ns_item_discount_amount: '',
      custrecord_gw_ns_item_discount_count: '',
    },
  },
  {
    name: 'VoucherMainRecord',
    id: '602',
    custrecord_gw_apply_internal_id: '',
    custrecord_gw_voucher_type: 'EGUI',
    custrecord_gw_voucher_number: 'RQ20200008',
    custrecord_gw_voucher_date: '20210427',
    custrecord_gw_voucher_yearmonth: '11004',
    custrecord_gw_seller: '24549210',
    custrecord_gw_buyer: '24549210',
    custrecord_gw_invoice_type: '07',
    custrecord_gw_voucher_format_code: '35',
    custrecord_gw_clearance_mark: '',
    custrecord_gw_voucher_status: 'VOUCHER_ISSUE',
    custrecord_gw_voucher_upload_status: 'A',
    custrecord_gw_sales_amount: '2970',
    custrecord_gw_free_sales_amount: '0',
    custrecord_gw_zero_sales_amount: '0',
    custrecord_gw_tax_amount: '149',
    custrecord_gw_tax_type: '1',
    custrecord_gw_total_amount: '3119',
    custrecord_gw_need_upload_egui_mig: 'ALL',
    custrecord_gw_upload_access_model: 'NETSUITE',
    custrecord_voucher_sale_tax_apply_period: { value: '68', text: '11004' },
    custrecord_gw_voucher_sales_tax_apply: true,
    custrecord_gw_applicable_zero_tax: '',
    custrecord_gw_customs_export_category: '',
    custrecord_gw_customs_export_no: '',
    custrecord_gw_customs_export_date: '',
    custrecord_gw_voucher_main_apply_user_id: '',
    custrecord_gw_accept_status: '',
    custrecord_gw_buyer_email: '',
    custrecord_gw_uploadstatus_messag: '',
    custrecord_gw_lock_transaction: false,
    custrecord_gw_print_mark: 'Y',
    custrecord_gw_original_buyer_id: '',
    owner: { value: '-4', text: '-System-' },
    custrecord_gw_buyer_address: '',
    custrecord_gw_buyer_dept_code: '',
    custrecord_gw_buyer_name: '',
    custrecord_gw_carrierid1: '',
    custrecord_gw_carrierid2: '',
    custrecord_gw_carrier_type: '',
    custrecord_gw_discount_amount: '',
    custrecord_gw_confirm_status: '',
    custrecord_gw_discount_count: '',
    custrecord_gw_discount_free_amount: '0',
    custrecord_gw_discount_sales_amount: '0',
    custrecord_gw_discount_zero_amount: '0',
    custrecord_gw_is_completed_detail: false,
    custrecord_gw_is_manual_voucher: false,
    custrecord_gw_is_printed_pdf: false,
    custrecord_gw_main_remark: '',
    custrecord_gw_mig_type: 'B2C',
    custrecord_gw_npoban: '',
    custrecord_gw_random_number: '6220',
    custrecord_gw_seller_address: '台北市忠孝東路四段258號2樓',
    custrecord_gw_seller_name: '關網資訊股份有限公司',
    custrecord_gw_tax_rate: '5.0',
    custrecord_gw_voucher_classification: '',
    custrecord_gw_voucher_extra_memo: '',
    custrecord_gw_voucher_dept_code: '',
    custrecord_gw_voucher_dept_name: '',
    custrecord_gw_voucher_owner: '',
    custrecord_gw_voucher_time: '23:59:59',
    custrecord_gw_is_printed_paper: false,
    CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID: {
      custrecord_gw_item_description: 'GW Test Item 1',
      custrecord_gw_unit_price: '990.00',
      custrecord_gw_item_quantity: '3',
      custrecord_gw_dtl_item_tax_code: '1',
      custrecord_gw_dtl_item_tax_rate: '5.0',
      custrecord_gw_item_amount: '2970',
      custrecord_gw_item_seq: '1',
      custrecord_gw_item_remark: '',
      custrecord_gw_original_gui_internal_id: '',
      custrecord_gw_original_gui_date: '',
      custrecord_gw_original_gui_number: '',
      custrecord_gw_original_gui_yearmonth: '',
      custrecord_gw_ns_document_apply_id: { value: '', text: ' ' },
      custrecord_gw_ns_document_type: 'Invoice',
      custrecord_gw_ns_document_number: '1',
      custrecord_gw_item_tax_amount: '148.5',
      custrecord_gw_item_total_amount: '3118.5',
      custrecord_gw_item_unit: '個',
      internalid: { value: '602', text: '602' },
      custrecord_gw_voucher_main_internal_id: {
        value: '602',
        text: 'VoucherMainRecord',
      },
      custrecord_gw_ns_document_item_id: '9',
      custrecord_gw_ns_document_id: '3',
      custrecord_gw_ns_document_items_seq: '1',
      custrecord_gw_ns_item_discount_amount: '',
      custrecord_gw_ns_item_discount_count: '',
    },
  },
]
function composeBodyAndLinesFromResults(searchResults) {
  var resultsBody = ramda.uniq(
    ramda.map((result) => {
      var resultClone = JSON.parse(JSON.stringify(result))
      delete resultClone.CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID
      return resultClone
    }, searchResults)
  )

  var resultLines = ramda.map((result) => {
    return result.CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID
  }, searchResults)

  var vouchers = ramda.map((resultBody) => {
    resultBody.lines = ramda.filter((line) => {
      var lineParentId = line.custrecord_gw_voucher_main_internal_id.value.toString()
      var bodyId = resultBody.id.toString()
      return bodyId === lineParentId
    }, resultLines)
    return resultBody
  }, resultsBody)
  return vouchers
}
function getDocumentObjs(searchResults) {
  return ramda.map((searchResult) => {
    var document = gwMapUtil.mapTo(searchResult, voucherMainFields)
    document.lines = ramda.map((resultLine) => {
      return gwMapUtil.mapTo(resultLine, voucherDetailFields)
    }, searchResult.lines)
    return document
  }, searchResults)

  // return searchResults
}
describe('merge Search Results in one object', () => {
  it('should return one object with lines', () => {
    var vouchers = getDocumentObjs(
      composeBodyAndLinesFromResults(searchResultsMock)
    )
    console.log(JSON.stringify(vouchers))
  })
})
