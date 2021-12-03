require([
  'SuiteApps/com.gateweb.gwegui/gw_issue_egui_job/gw_invoice_service',
  'SuiteApps/com.gateweb.gwegui/gw_issue_egui_job/gw_egui_service'
], (gwInvoiceService, gwEguiService) => {
  var invoiceResults = [
    {
      internalId: {
        value: '3661848',
        text: '3661848'
      },
      mainline: ' ',
      trandate: '2021-12-3',
      subsidiary: {
        value: '23',
        text: 'Group : Nineder_TW : 純萃自然股份有限公司'
      },
      type: {
        value: 'CustInvc',
        text: 'Invoice'
      },
      entity: {
        value: '210',
        text: 'Default Tax Agency TW : Default Tax Agency TW (純粹自然)'
      },
      tranid: 'IV00000056569297',
      transactionnumber: 'CUSTINVC365493',
      memomain: '',
      memo: 'VAT',
      amount: '50.00',
      fxamount: '50.00',
      grossamount: '50.00',
      netamountnotax: '50.00',
      netamount: '50.00',
      taxamount: '',
      taxtotal: '50.00',
      total: '1050.00',
      department: '',
      createdby: {
        value: '434109',
        text: 'EI00000000000088 關網共用'
      },
      createdfrom: '',
      class: '',
      location: {
        value: '42',
        text: '純萃(Luzhu)'
      },
      itemtype: 'TaxItem',
      linesequencenumber: '2',
      line: '3',
      item: {
        value: '118',
        text: '三收銀及電子發票'
      },
      unitabbreviation: '',
      quantity: '1',
      taxcode: {
        value: '118',
        text: '三收銀及電子發票'
      },
      rate: '5.00',
      fxrate: '5.00%',
      custcol_gw_item_unit_amt_inc_tax: '',
      custcol_gw_item_memo: '',
      custbody_gw_gui_date: '',
      custbody_gw_gui_tax_file_date: '',
      custbody_gw_lock_transaction: 'T',
      custbody_gw_gui_not_upload: 'T',
      custbody_gw_is_issue_egui: 'T',
      custbody_gw_allowance_num_start: '',
      custbody_gw_allowance_num_end: '',
      custbody_gw_customs_export_no: '',
      custbody_gw_customs_export_category: '',
      custbody_gw_gui_address: '00000000000',
      custbody_gw_gui_title: '00000000000',
      custbody_gw_gui_num_start: 'N68800205',
      custbody_gw_gui_num_end: 'N68800205',
      custbody_gw_tax_id_number: '24549210',
      custbody_gw_customs_export_date: '',
      custbody_gw_egui_clearance_mark: '',
      custbody_gw_applicable_zero_tax: '',
      custbody_gw_gui_main_memo: '',
      custbody_gw_gui_sales_amt_tax_exempt: '',
      custbody_gw_gui_sales_amt: '',
      custbody_gw_gui_sales_amt_tax_zero: '',
      custbody_gw_gui_tax_amt: '',
      custbody_gw_gui_tax_rate: '',
      custbody_gw_gui_tax_type: '',
      custbody_gw_gui_total_amt: '',
      custbody_gw_creditmemo_deduction_list: '',
      custbody_gw_gui_donation_code: '',
      custbody_gw_gui_donation_mark: 'F',
      custbody_gw_gui_carrier_type: '',
      custbody_gw_gui_carrier_id_1: '',
      custbody_gw_gui_carrier_id_2: '',
      custbody_gw_gui_apply_period: '',
      custbody_gw_gui_format: {
        value: '20',
        text: '35-一般稅額電子發票[裝訂數:50張]'
      },
      custbody_gw_gui_class: '',
      custbody_gw_gui_department: '',
      statusref: {
        value: 'open',
        text: 'Open'
      },
      custbody_gw_seller_tax_id: '',
      custbody_gw_evidence_issue_status: {
        value: '2',
        text: '憑證已開立, 未進入關網系統'
      },
      'rate.taxItem': '5.00%',
      'email.customer': '',
      'displayname.item': ''
    },
    {
      internalId: {
        value: '3661848',
        text: '3661848'
      },
      mainline: ' ',
      trandate: '2021-12-3',
      subsidiary: {
        value: '23',
        text: 'Group : Nineder_TW : 純萃自然股份有限公司'
      },
      type: {
        value: 'CustInvc',
        text: 'Invoice'
      },
      entity: {
        value: '713659',
        text: 'MI00000000128972 GateWeb Conpamy'
      },
      tranid: 'IV00000056569297',
      transactionnumber: 'CUSTINVC365493',
      memomain: '',
      memo: '',
      amount: '1000.00',
      fxamount: '1000.00',
      grossamount: '1000.00',
      netamountnotax: '1000.00',
      netamount: '1000.00',
      taxamount: '50.00',
      taxtotal: '50.00',
      total: '1050.00',
      department: '',
      createdby: {
        value: '434109',
        text: 'EI00000000000088 關網共用'
      },
      createdfrom: '',
      class: '',
      location: {
        value: '42',
        text: '純萃(Luzhu)'
      },
      itemtype: 'OthCharge',
      linesequencenumber: '1',
      line: '1',
      item: {
        value: '1143',
        text: 'NI20200602000003'
      },
      unitabbreviation: '',
      quantity: '1',
      taxcode: {
        value: '118',
        text: '三收銀及電子發票'
      },
      rate: '1000.00',
      fxrate: '1000.00',
      custcol_gw_item_unit_amt_inc_tax: '',
      custcol_gw_item_memo: '',
      custbody_gw_gui_date: '',
      custbody_gw_gui_tax_file_date: '',
      custbody_gw_lock_transaction: 'T',
      custbody_gw_gui_not_upload: 'T',
      custbody_gw_is_issue_egui: 'T',
      custbody_gw_allowance_num_start: '',
      custbody_gw_allowance_num_end: '',
      custbody_gw_customs_export_no: '',
      custbody_gw_customs_export_category: '',
      custbody_gw_gui_address: '00000000000',
      custbody_gw_gui_title: '00000000000',
      custbody_gw_gui_num_start: 'N68800205',
      custbody_gw_gui_num_end: 'N68800205',
      custbody_gw_tax_id_number: '24549210',
      custbody_gw_customs_export_date: '',
      custbody_gw_egui_clearance_mark: '',
      custbody_gw_applicable_zero_tax: '',
      custbody_gw_gui_main_memo: '',
      custbody_gw_gui_sales_amt_tax_exempt: '',
      custbody_gw_gui_sales_amt: '',
      custbody_gw_gui_sales_amt_tax_zero: '',
      custbody_gw_gui_tax_amt: '',
      custbody_gw_gui_tax_rate: '',
      custbody_gw_gui_tax_type: '',
      custbody_gw_gui_total_amt: '',
      custbody_gw_creditmemo_deduction_list: '',
      custbody_gw_gui_donation_code: '',
      custbody_gw_gui_donation_mark: 'F',
      custbody_gw_gui_carrier_type: '',
      custbody_gw_gui_carrier_id_1: '',
      custbody_gw_gui_carrier_id_2: '',
      custbody_gw_gui_apply_period: '',
      custbody_gw_gui_format: {
        value: '20',
        text: '35-一般稅額電子發票[裝訂數:50張]'
      },
      custbody_gw_gui_class: '',
      custbody_gw_gui_department: '',
      statusref: {
        value: 'open',
        text: 'Open'
      },
      custbody_gw_seller_tax_id: '',
      custbody_gw_evidence_issue_status: {
        value: '2',
        text: '憑證已開立, 未進入關網系統'
      },
      'rate.taxItem': '5.00%',
      'email.customer': 'jackielin@gateweb.com.tw',
      'displayname.item': '商品一批(銷售)'
    },
    {
      internalId: {
        value: '3661848',
        text: '3661848'
      },
      mainline: '*',
      trandate: '2021-12-3',
      subsidiary: {
        value: '23',
        text: 'Group : Nineder_TW : 純萃自然股份有限公司'
      },
      type: {
        value: 'CustInvc',
        text: 'Invoice'
      },
      entity: {
        value: '713659',
        text: 'MI00000000128972 GateWeb Conpamy'
      },
      tranid: 'IV00000056569297',
      transactionnumber: 'CUSTINVC365493',
      memomain: '',
      memo: '',
      amount: '1050.00',
      fxamount: '1050.00',
      grossamount: '1050.00',
      netamountnotax: '1000.00',
      netamount: '1050.00',
      taxamount: '',
      taxtotal: '50.00',
      total: '1050.00',
      department: '',
      createdby: {
        value: '434109',
        text: 'EI00000000000088 關網共用'
      },
      createdfrom: '',
      class: '',
      location: {
        value: '42',
        text: '純萃(Luzhu)'
      },
      itemtype: '',
      linesequencenumber: '0',
      line: '0',
      item: '',
      unitabbreviation: '',
      quantity: '',
      taxcode: '',
      rate: '',
      fxrate: '',
      custcol_gw_item_unit_amt_inc_tax: '',
      custcol_gw_item_memo: '',
      custbody_gw_gui_date: '',
      custbody_gw_gui_tax_file_date: '',
      custbody_gw_lock_transaction: 'T',
      custbody_gw_gui_not_upload: 'T',
      custbody_gw_is_issue_egui: 'T',
      custbody_gw_allowance_num_start: '',
      custbody_gw_allowance_num_end: '',
      custbody_gw_customs_export_no: '',
      custbody_gw_customs_export_category: '',
      custbody_gw_gui_address: '00000000000',
      custbody_gw_gui_title: '00000000000',
      custbody_gw_gui_num_start: 'N68800205',
      custbody_gw_gui_num_end: 'N68800205',
      custbody_gw_tax_id_number: '24549210',
      custbody_gw_customs_export_date: '',
      custbody_gw_egui_clearance_mark: '',
      custbody_gw_applicable_zero_tax: '',
      custbody_gw_gui_main_memo: '',
      custbody_gw_gui_sales_amt_tax_exempt: '',
      custbody_gw_gui_sales_amt: '',
      custbody_gw_gui_sales_amt_tax_zero: '',
      custbody_gw_gui_tax_amt: '',
      custbody_gw_gui_tax_rate: '',
      custbody_gw_gui_tax_type: '',
      custbody_gw_gui_total_amt: '',
      custbody_gw_creditmemo_deduction_list: '',
      custbody_gw_gui_donation_code: '',
      custbody_gw_gui_donation_mark: 'F',
      custbody_gw_gui_carrier_type: '',
      custbody_gw_gui_carrier_id_1: '',
      custbody_gw_gui_carrier_id_2: '',
      custbody_gw_gui_apply_period: '',
      custbody_gw_gui_format: {
        value: '20',
        text: '35-一般稅額電子發票[裝訂數:50張]'
      },
      custbody_gw_gui_class: '',
      custbody_gw_gui_department: '',
      statusref: {
        value: 'open',
        text: 'Open'
      },
      custbody_gw_seller_tax_id: '',
      custbody_gw_evidence_issue_status: {
        value: '2',
        text: '憑證已開立, 未進入關網系統'
      },
      'rate.taxItem': '',
      'email.customer': 'jackielin@gateweb.com.tw',
      'displayname.item': ''
    }
  ]
  var invObj = gwInvoiceService.composeInvObj(invoiceResults)
  log.debug({ title: 'invObj', details: invObj })
  var eguiService = new gwEguiService(invObj)
  log.debug({ title: 'eguiObj', details: eguiService.getEgui() })
  log.debug({ title: 'Execution end' })
})
