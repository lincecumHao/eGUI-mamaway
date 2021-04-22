define(['../application/gw_service_ap_doc_gui_number'], function (
  guiNumService
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
  var availableTrackValues = []

  function setAvailableTrackValues(trackArr) {
    availableTrackValues = trackArr
  }

  function isFormatValid(value) {
    var isValid = eguiFormat.test(value)
    return isValid
  }

  function parseEguiNumber(value) {
    var result = eguiFormat.exec(value.toString())
    // console.log('parseEguiNumber result', result)
    return { track: result[1].toUpperCase(), eguiNumber: result[2] }
  }

  function isTrackValid(value) {
    var guiNumberObject = parseEguiNumber(value)
    var track = guiNumberObject.track
    var result = availableTrackValues.filter(function (trackRecordObj) {
      return trackRecordObj.custrecord_gw_track_invoice_track === track
    })
    return result.length > 0
  }

  function isGuiNumberOptional(docType) {
    var guiOptionalDocType = [22, 24, 25, 27]
    return guiOptionalDocType.indexOf(docType) > -1
  }

  function isGuiNumberRequired(docType) {
    var guiRequiredDocType = [21, 23, 26]
    return guiRequiredDocType.indexOf(docType) > -1
  }

  function isGuiNumberMustNotHave(docType) {
    var guiMustNotHaveDocType = [28, 29]
    return guiMustNotHaveDocType.indexOf(docType) > -1
  }

  function isGuiTrackValidationRequired(docType) {
    var guiTrackValidationRequiredDocType = [21, 22, 25]
    return guiTrackValidationRequiredDocType.indexOf(parseInt(docType)) > -1
  }

  function isGuiNumberDuplicated(guiNumber, apDocId) {
    return guiNumService.isGuiNumberDuplicate(guiNumber, apDocId)
  }

  exports.setAvailableTrackValues = setAvailableTrackValues
  exports.parseEguiNumber = parseEguiNumber
  exports.isFormatValid = isFormatValid
  exports.isTrackValid = isTrackValid
  exports.isGuiNumberRequired = isGuiNumberRequired
  exports.isGuiNumberMustNotHave = isGuiNumberMustNotHave
  exports.isGuiNumberOptional = isGuiNumberOptional
  exports.isGuiTrackValidationRequired = isGuiTrackValidationRequired
  exports.isGuiNumberDuplicated = isGuiNumberDuplicated
  return exports
})
