define([
  '../../gw_dao/voucher/gw_dao_voucher',
  '../../gw_issue_egui_job/gw_invoice_service',
  '../../gw_issue_egui_job/services/gw_egui_factory',
  '../../gw_dao/migType/gw_dao_mig_type_21'
], (gwVoucherDao, gwInvoiceService, gwEguiFactory, gwMigTypeDao) => {
  /**
     * Module Description...
     *  ReIssue will execute particularly after original egui is voided
     * @type {Object} module-name
     *
     * @copyright 2021 Gateweb
     * @author Sean Lin <sean.hyl@gmail.com>
     *
     * @NApiVersion 2.1
     * @NModuleScope Public

     */

  class ReIssueEguiService {
    constructor(voucherId, invId) {
      this.invoiceId = invId
      this.voucherId = voucherId
    }

    execute(callback) {
      var originalEGui = gwVoucherDao.getGuiByVoucherId(this.voucherId)
      log.debug({ title: 'reissue egui originalEGui', details: originalEGui })
      var invoiceSearchResult = gwInvoiceService.getInvoiceToIssueEguiById(
        this.invoiceId
      )
      log.debug({
        title: 'reissue egui invoiceSearchResult',
        details: invoiceSearchResult
      })
      var invoiceObj = gwInvoiceService.composeInvObj(invoiceSearchResult)
      log.debug({ title: 'reissue egui invoiceObj', details: invoiceObj })
      var reIssuedEguiObj = gwEguiFactory.generate(invoiceObj)
      log.debug({
        title: 'reissue egui reIssuedEguiObj',
        details: reIssuedEguiObj
      })
      // Since it's reissue, reIssued eGui's date and time needs to copy from original eGUI
      reIssuedEguiObj.documentTime = originalEGui.documentTime
      reIssuedEguiObj.randomNumber = originalEGui.randomNumber
      reIssuedEguiObj.documentNumber = originalEGui.documentNumber
      var migTypeOption = gwMigTypeDao.getIssueEguiMigType(
        gwMigTypeDao.businessTranTypeEnum.B2C
      )
      reIssuedEguiObj['migType'] = migTypeOption
      reIssuedEguiObj.uploadXmlFileName = `${migTypeOption.migType}-${
        reIssuedEguiObj.documentNumber
      }-${new Date().getTime()}.xml`
      reIssuedEguiObj.transactions = [this.invoiceId]
      log.debug({
        title: 'reissue egui updated reIssuedEguiObj',
        details: reIssuedEguiObj
      })
      // var voucherRecordObj = gwVoucherDao.transformEguiToVoucher(reIssuedEguiObj)
      // log.debug({title:"reissue egui voucherRecordObj", details:voucherRecordObj});
      var newVoucherId = gwVoucherDao.saveEguiToRecord(reIssuedEguiObj)
      var reissueEGui = gwVoucherDao.getGuiByVoucherId(newVoucherId)
      log.debug({
        title: 'reissue egui updated reIssuedEgui',
        details: reissueEGui
      })

      // Upload

      // Deactivate original eGUI
    }
  }

  return ReIssueEguiService
})
