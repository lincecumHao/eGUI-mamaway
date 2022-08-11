define(['./gw_lib_search', './gw_service_ap_doc_type_options'], function (
  searchLib,
  apDocTypeService
) {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2020 Gateweb
   * @author Sean Lin <seanlin816@gmail.com>
   *
   * @NApiVersion 2.0
   * @NModuleScope Public

   */
  var exports = {}
  var eguiFormat = /^([A-Z]{0,2})([0-9]{8})$/
  var guiNumbers = []
  var guiNumbersWithRecordId = []
  var guiNumberFieldId = 'custrecord_gw_ap_doc_gui_num'
  var docTypeFieldId = 'custrecord_gw_ap_doc_type'
  var apDocRecordTypeId = 'customrecord_gw_ap_doc'

  function getAllGuiNumbersCore() {
    var columns = [guiNumberFieldId, 'isinactive', docTypeFieldId]
    var results = searchLib.search(apDocRecordTypeId, columns, null)
    var activeResults = results.filter(function (record) {
      return !record['isinactive']
    })
    guiNumbers = activeResults.map(function (result) {
      return result[guiNumberFieldId]
    })
    guiNumbersWithRecordId = activeResults.map(function (result) {
      return {
        id: result.id,
        guiNumber: result[guiNumberFieldId],
        docType: result[docTypeFieldId]
      }
    })
    return guiNumbers
  }

  var getAllGuiNumbers = getAllGuiNumbersCore

  function parseEguiNumber(value) {
    var result = eguiFormat.exec(value.toString())
    return { track: result[1].toUpperCase(), eguiNumber: result[2] }
  }

  function isGuiNumberDuplicate(guiNum, apDocId, docType) {
    const duplicatedGuiNumbers = guiNumbersWithRecordId
      .filter(function (guiNumberObj) {
        return guiNumberObj.guiNumber.toString() === guiNum.toString()
        return guiNumberObj.guiNumber
      })
      .filter(function (guiNumberObj) {
        // If ap doc id is not 0, means it's updating ap doc, then try to find different ap doc id with same gui number
        if (apDocId) {
          return parseInt(guiNumberObj.id) !== parseInt(apDocId)
        } else {
          return true
        }
      })
      .filter(function (guiNumberObj) {
        var docTypeNumber = apDocTypeService.getDocTypeCodeByRecordId(
          guiNumberObj.docType
        )
        return parseInt(docTypeNumber) === parseInt(docType)
      })
    return duplicatedGuiNumbers.length > 0
  }

  function constructorWrapper(func) {
    return function () {
      if (guiNumbers.length === 0) {
        getAllGuiNumbers()
      }
      var result = func.apply(this, arguments)
      return result
    }
  }

  function getGuiNumberFromApDoc(guinumber) {
    var columns = [guiNumberFieldId, 'isinactive']
    var filters = []
    filters.push(['custrecord_gw_ap_doc_gui_num', 'contains', guinumber])
    filters.push('AND')
    filters.push(['isinactive', 'is', false])
    var results = searchLib.search(apDocRecordTypeId, columns, filters)
    log.debug({ title: 'results', details: results })
    return results
  }

  exports.parseEguiNumber = parseEguiNumber
  exports.isGuiNumberDuplicate = constructorWrapper(isGuiNumberDuplicate)
  exports.getAllGuiNumber = constructorWrapper(getAllGuiNumbers)
  exports.getGuiNumberFromApDoc = getGuiNumberFromApDoc
  return exports
})
