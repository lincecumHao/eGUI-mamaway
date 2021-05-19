define([
  '../../library/ramda.min',
  './gw_dao_voucher',
  '../../library/gw_mapping_util',
  './gw_dao_voucher_allowance_main_fields',
  './gw_dao_voucher_allowance_detail_fields',
], (ramda, gwVoucherDao, gwMapUtil, mainFields, detailFields) => {
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

  class DocumentToAllowanceMapper {
    transformSearchResults(voucherSearchResults) {
      const searchResults = composeBodyAndLinesFromResults(voucherSearchResults)
      return ramda.map((searchResult) => {
        var document = gwMapUtil.mapTo(searchResult, mainFields)

        document.lines = ramda.map((resultLine) => {
          return gwMapUtil.mapTo(resultLine, detailFields)
        }, searchResult.lines)
        return document
      }, searchResults)
    }
  }

  return new DocumentToAllowanceMapper()
})
