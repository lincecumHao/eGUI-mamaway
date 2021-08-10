define([
  'N/record',
  'N/search',
  '../library/ramda.min',
  '../gw_dao/transactionSearch/gw_transaction_fields',
  '../gw_dao/evidenceIssueStatus/gw_dao_evidence_issue_status_21'
], (record, search, ramda, transSearchFields, gwEvidenceIssueStatusDao) => {
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

  function getInvoiceToIssueEguiSearch() {
    var searchFilters = []
    searchFilters.push(['cogs', 'is', 'F'])
    searchFilters.push('AND')
    searchFilters.push(['status', 'noneof', 'CustInvc:V', 'CustCred:V'])
    searchFilters.push('AND')
    searchFilters.push(['type', 'is', 'CustInvc'])
    searchFilters.push('AND')
    searchFilters.push(['shipping', 'is', 'F'])
    searchFilters.push('AND')
    searchFilters.push(['custbody_gw_is_issue_egui', 'is', 'T'])
    searchFilters.push('AND')

    searchFilters.push(getIssueSubFilter())
    var searchColumns = JSON.parse(
      JSON.stringify(transSearchFields.allFieldIds)
    )
    searchColumns.push('taxItem.rate')
    searchColumns.push('customer.email')
    searchColumns.push('item.displayname')
    return search.create({
      type: search.Type.INVOICE,
      filters: searchFilters,
      columns: searchColumns
    })
  }

  function getInvoiceToIssueEguiSearchById(internalId) {
    var searchFilters = []
    searchFilters.push(['internalid', 'is', internalId])
    var searchColumns = JSON.parse(
      JSON.stringify(transSearchFields.allFieldIds)
    )
    searchColumns.push('taxItem.rate')
    searchColumns.push('customer.email')
    searchColumns.push('item.displayname')
    return search.create({
      type: search.Type.INVOICE,
      filters: searchFilters,
      columns: searchColumns
    })
  }

  function getInvoiceSearchResultDebugger(internalId) {
    var searchFilters = []
    searchFilters.push(['internalid', 'is', internalId])
    var searchColumns = JSON.parse(
      JSON.stringify(transSearchFields.allFieldIds)
    )
    searchColumns.push('taxItem.rate')
    searchColumns.push('customer.email')
    searchColumns.push('item.displayname')
    var invoiceSearch = search.create({
      type: search.Type.INVOICE,
      filters: searchFilters,
      columns: searchColumns
    })

    var pagedData = invoiceSearch.runPaged({
      pageSize: 1000
    })
    var searchResults = []
    for (var i = 0; i < pagedData.pageRanges.length; i++) {
      var currentPage = pagedData.fetch({ index: i })
      currentPage.data.forEach(function (result) {
        var value = JSON.parse(JSON.stringify(result)).values
        var resultObject = {}
        Object.keys(value).forEach(function (key) {
          var objectValue = value[key]
          var newKey = key
          if (key.indexOf('.') > -1) {
            newKey = key.split('.')[1] + '.' + key.split('.')[0]
          }
          if (typeof objectValue === 'string') {
            resultObject[newKey] = objectValue
          } else {
            if (objectValue.length === 0) {
              resultObject[newKey] = ''
            } else if (objectValue.length === 1) {
              resultObject[newKey] = objectValue[0]
            } else {
              resultObject[newKey] = objectValue
            }
          }
        })
        searchResults.push(resultObject)
      })
    }
    return searchResults
  }

  function getIssueSubFilter() {
    var subFilters = []
    subFilters.push(getNewIssueSubFilter())
    subFilters.push('OR')
    subFilters.push(getIssuedAndNotImportedEguiSubFilter())
    return subFilters
  }

  function getNewIssueSubFilter() {
    var subFilters = []
    var unissuedStatus = gwEvidenceIssueStatusDao.getUnIssuedStatus()
    subFilters.push(['custbody_gw_lock_transaction', 'is', 'F'])
    subFilters.push('AND')
    subFilters.push([
      'custbody_gw_evidence_issue_status',
      'anyof',
      '@NONE@',
      unissuedStatus.id
    ])

    return subFilters
  }

  function getIssuedAndNotImportedEguiSubFilter() {
    var subFilters = []
    var issuedAndNotImportedStatus = gwEvidenceIssueStatusDao.getIssuedAndNotTransformedStatus()
    subFilters.push(['custbody_gw_lock_transaction', 'is', 'T'])
    subFilters.push('AND')
    subFilters.push([
      'custbody_gw_evidence_issue_status',
      'is',
      issuedAndNotImportedStatus.id
    ])
    return subFilters
  }

  function getStrongBuyerSubfilter() {
    var subFilters = []
    var unissuedStatus = gwEvidenceIssueStatusDao.getUnIssuedStatus()
    subFilters.push(['custbody_gw_lock_transaction', 'is', 'F'])
    subFilters.push('AND')
    subFilters.push([
      'custbody_gw_evidence_issue_status',
      'is',
      unissuedStatus.id
    ])
    subFilters.push('AND')
    subFilters.push(['custbody_gw_gui_not_upload', 'is', 'T'])
    return subFilters
  }

  /**
   * Only Used for map reduce process, all search results for 1 invoice
   *
   * @param invoiceSearchResults {{Object}[]}
   * @return {{}}
   */
  function composeInvObj(invoiceSearchResults) {
    var uniqueResults = ramda.uniqBy(function (item) {
      return item.line
    }, invoiceSearchResults)
    var invMainObj = ramda.filter((result) => {
      return result.mainline === '*'
    }, uniqueResults)[0]
    if (!invMainObj) {
      throw 'No invoice body defined'
    }
    invMainObj.lines = ramda.filter((result) => {
      return result.mainline !== '*' && result.itemtype !== 'TaxItem'
    }, uniqueResults)
    invMainObj.taxLines = ramda.filter((result) => {
      return result.mainline !== '*' && result.itemtype === 'TaxItem'
    }, uniqueResults)
    return invMainObj
  }

  function lockInvoice(invId) {
    var updateValues = {}
    updateValues[
      transSearchFields.fields.custbody_gw_lock_transaction.id
    ] = true
    record.submitFields({
      type: record.Type.INVOICE,
      id: invId,
      values: updateValues
    })
  }

  function unlockInvoice(invId) {
    var updateValues = {}
    updateValues[
      transSearchFields.fields.custbody_gw_lock_transaction.id
    ] = false
    record.submitFields({
      type: record.Type.INVOICE,
      id: invId,
      values: updateValues
    })
  }

  function shouldUpdateInvoiceValue(value) {
    return (
      value !== gwEvidenceIssueStatusDao.getIssuedAndNotTransformedStatus().id
    )
    return false
  }

  function eguiIssued(eguiObj) {
    log.debug({ title: 'eguiIssued eguiObj', details: eguiObj })

    var updateValues = {}
    if (shouldUpdateInvoiceValue(eguiObj.gwIssueStatus.value)) {
      updateValues[transSearchFields.fields.custbody_gw_gui_num_start.id] =
        eguiObj.documentNumber
      updateValues[transSearchFields.fields.custbody_gw_gui_num_end.id] =
        eguiObj.documentNumber
    }

    updateValues[
      transSearchFields.fields.custbody_gw_evidence_issue_status.id
    ] = gwEvidenceIssueStatusDao.getGwIssuedStatus().id

    record.submitFields({
      type: record.Type.INVOICE,
      id: eguiObj.internalId,
      values: updateValues
    })
  }

  function eguiIssueFailed(eguiObj, voucherId) {
    log.debug({ title: 'eguiIssueFailed eguiObj', details: eguiObj })
    var updateValues = {}
    updateValues[
      transSearchFields.fields.custbody_gw_lock_transaction.id
    ] = false
    record.submitFields({
      type: record.Type.INVOICE,
      id: invId,
      values: updateValues
    })
  }

  exports.getInvoiceToIssueEguiSearch = getInvoiceToIssueEguiSearch
  exports.getInvoiceToIssueEguiSearchById = getInvoiceToIssueEguiSearchById
  exports.getInvoiceSearchResultDebugger = getInvoiceSearchResultDebugger
  exports.composeInvObj = composeInvObj
  exports.lockInvoice = lockInvoice
  exports.unlockInvoice = unlockInvoice
  exports.eguiIssued = eguiIssued
  exports.eguiIssueFailed = eguiIssueFailed
  return exports
})
