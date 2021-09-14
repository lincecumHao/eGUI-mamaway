define([
  '../../gw_dao/evidenceIssueStatus/gw_dao_evidence_issue_status_21',
  '../../gw_issue_egui_job/gw_invoice_service'
], (evidenceIssueStatus, invoiceService) => {
  /**
     * Module Description...
     *
     * @type {Object} module-name
     *
     * @copyright 2021 Gateweb
     * @author Sean Lin <sean.hyl@gmail.com>
     *
     * @NApiVersion 2.1
     * @NModuleScope Public

     */
  class eGUIVoided {
    execute(args) {
      const { eguiObj, voucherId } = args
      const invoiceId = eguiObj.transactions?.value
      invoiceService.eguiVoided(invoiceId)
    }
  }

  return eGUIVoided
})
