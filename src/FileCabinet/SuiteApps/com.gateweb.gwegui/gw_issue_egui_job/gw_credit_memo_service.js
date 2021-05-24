define([
  'N/record',
  'N/search',
  '../library/ramda.min',
  '../gw_dao/transactionSearch/gw_transaction_fields'
], (record, search, ramda, transSearchFields) => {
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

  function getCreditMemoToIssueAllowanceSearch() {
    var searchFilters = []
    searchFilters.push(['cogs', 'is', 'F'])
    searchFilters.push('AND')
    searchFilters.push(['status', 'noneof', 'CustInvc:V', 'CustCred:V'])
    searchFilters.push('AND')
    searchFilters.push(['type', 'is', 'CustCred'])
    searchFilters.push('AND')
    searchFilters.push(['shipping', 'is', 'F'])
    searchFilters.push('AND')
    searchFilters.push(['custbody_gw_lock_transaction', 'is', 'F'])
    searchFilters.push('AND')
    searchFilters.push(['custbody_gw_is_issue_egui', 'is', 'T'])
    searchFilters.push('AND')
    searchFilters.push(['custbody_gw_allowance_num_start', 'isempty', ''])
    var searchColumns = JSON.parse(
      JSON.stringify(transSearchFields.allFieldIds)
    )
    searchColumns.push('taxItem.rate')
    return search.create({
      type: search.Type.CREDIT_MEMO,
      filters: searchFilters,
      columns: searchColumns
    })
  }

  /**
   * Only Used for map reduce process, all search results for 1 invoice
   *
   * @param creditMemoSearchResults {{Object}[]}
   * @return {{}}
   */
  function composeCmObj(creditMemoSearchResults) {
    var cmMainObj = ramda.filter((result) => {
      return result.mainline === '*'
    }, creditMemoSearchResults)[0]
    if (!cmMainObj) {
      throw 'No credit memo body defined'
    }
    cmMainObj.lines = ramda.filter((result) => {
      return result.mainline !== '*' && result.itemtype !== 'TaxItem'
    }, creditMemoSearchResults)
    cmMainObj.taxLines = ramda.filter((result) => {
      return result.mainline !== '*' && result.itemtype === 'TaxItem'
    }, creditMemoSearchResults)
    return cmMainObj
  }

  function lockCreditMemo(cmId) {
    var updateValues = {}
    updateValues[
      transSearchFields.fields.custbody_gw_lock_transaction.id
    ] = true
    record.submitFields({
      type: record.Type.CREDIT_MEMO,
      id: cmId,
      values: updateValues
    })
  }

  function unlockCreditMemo(cmId) {
    var updateValues = {}
    updateValues[
      transSearchFields.fields.custbody_gw_lock_transaction.id
    ] = false
    record.submitFields({
      type: record.Type.CREDIT_MEMO,
      id: cmId,
      values: updateValues
    })
  }

  function cmIssued(eguiObj, voucherId) {
    var updateValues = {}
    updateValues[transSearchFields.fields.custbody_gw_allowance_num_end.id] =
      eguiObj.documentNumber
    updateValues[transSearchFields.fields.custbody_gw_allowance_num_start.id] =
      eguiObj.documentNumber
    record.submitFields({
      type: record.Type.CREDIT_MEMO,
      id: eguiObj.internalId,
      values: updateValues
    })
  }

  exports.getCreditMemoToIssueAllowanceSearch = getCreditMemoToIssueAllowanceSearch
  exports.composeCmObj = composeCmObj
  exports.lockCreditMemo = lockCreditMemo
  exports.unlockCreditMemo = unlockCreditMemo
  exports.cmIssued = cmIssued
  return exports
})
