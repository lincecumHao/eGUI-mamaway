define([
  '../../library/ramda.min',
  '../../gw_dao/voucher/gw_service_map_egui_voucher',
  '../../gw_dao/voucher/gw_service_map_voucher_egui',
  '../../gw_dao/voucher/gw_dao_voucher_main_fields',
  '../../gw_dao/voucher/gw_dao_voucher_detail_fields',
  '../../gw_dao/voucher/gw_dao_voucher',
], (
  ramda,
  gwEguiVoucherMapper,
  gwVoucherEguiMapper,
  mainFields,
  detailFields,
  gwVoucherDao
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

    return ramda.map((resultBody) => {
      resultBody.lines = ramda.filter((line) => {
        var lineParentId = line.custrecord_gw_voucher_main_internal_id.value.toString()
        var bodyId = resultBody.id.toString()
        return bodyId === lineParentId
      }, resultLines)
      return resultBody
    }, resultsBody)
  }

  class DocumentService {
    searchDocumentByIds(internalIds) {
      var searchFilters = []
      var internalIdFilters = ramda.reduce(
        (result, internalId) => {
          result.push(['internalId', 'is', internalId])
          result.push('OR')
          return result
        },
        [],
        internalIds
      )
      log.debug({ title: 'internalIdFilters', details: internalIdFilters })
      internalIdFilters.pop()
      searchFilters.push(internalIdFilters)
      return gwVoucherEguiMapper.transformSearchResults(
        composeBodyAndLinesFromResults(
          gwVoucherDao.searchVoucher(searchFilters)
        )
      )
    }
    eguiUploaded() {}
    allowanceUploaded() {}
  }
  return exports
})
