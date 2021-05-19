define(['./gw_invoice_service', './gw_egui_service'], (
  gwInvoiceService,
  gwEguiService
) => {
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
  let exports = {}
  function issueEguiFromInv(searchResults, cmId) {
    try {
      gwInvoiceService.lockInvoice(cmId)
      var invoiceObj = gwInvoiceService.composeInvObj(searchResults)
      log.debug({ title: 'reduce invoiceObj', details: invoiceObj })
      var eguiService = new gwEguiService(invoiceObj)
      log.debug({ title: 'reduce eguiObj', details: eguiService.getEgui() })
      var voucherId = eguiService.issueEgui()
      log.debug({ title: 'reduce voucherId', details: voucherId })
      var uploadEguiResult = eguiService.uploadEgui(voucherId)
      log.debug({ title: 'eguiUploadResult', details: uploadEguiResult })
      context.write({
        key: voucherId,
      })
    } catch (e) {
      gwInvoiceService.unlockInvoice(context.key)
      throw e
    }
  }
  exports.issueAllowanceFromCm = issueAllowanceFromCm
  return exports
})
