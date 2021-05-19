define(['./gw_credit_memo_service', './gw_allowance_service'], (
  gwCmService,
  gwAllowanceService
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

  function issueAllowanceFromCm(cmSearchResults, cmId) {
    // gwCmService.lockCreditMemo(cmId)
    var cmObj = gwCmService.composeCmObj(cmSearchResults)
    log.debug({ title: 'cmObj', details: cmObj })
    var allowanceService = new gwAllowanceService(cmObj)
    log.debug({
      title: 'allowanceObj',
      details: allowanceService.getAllowance(),
    })
    // var voucherId = allowanceService.issueAllowance()
    // log.debug({ title: 'reduce voucherId', details: voucherId })
  }

  exports.issueAllowanceFromCm = issueAllowanceFromCm
  return exports
})
