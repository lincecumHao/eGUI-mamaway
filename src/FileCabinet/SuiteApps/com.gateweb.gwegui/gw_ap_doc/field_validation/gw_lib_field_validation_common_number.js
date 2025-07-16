define([], function () {
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
  var commonFormat = /^([B]{2})([A-Z,0-9]{8})$/

  function isFormatSimilarToGuiNumber(value) {
    var isSimilar = eguiFormat.test(value)
    return isSimilar
  }

  function isCommonNumberOptional(docType) {
    // var docTypeInt = docType ? parseInt(docType) : 0
    var commonOptionalDocType = [22, 24, 25, 27]
    return commonOptionalDocType.indexOf(docType) > -1
  }

  function isCommonNumberDuplicate(docType) {
    return docType === 25;
  }

  function isCommonNumberRequired(docType) {
    // var docTypeInt = docType ? parseInt(docType) : 0
    var commonRequiredDocType = [28, 29]
    return commonRequiredDocType.indexOf(docType) > -1
  }

  function isCommonNumberMustNotHave(docType) {
    // var docTypeInt = docType ? parseInt(docType) : 0
    var commonMustNotHaveDocType = [21, 26, 23]
    return commonMustNotHaveDocType.indexOf(docType) > -1
  }

  function isLengthValid(docType, value) {
    // var docTypeInt = docType ? parseInt(docType) : 0
    if (isCommonNumberOptional(docType)) {
      if (docType === 25) {
        return value.toString().length === 10
      } else {
        return value.toString().length >= 1 && value.toString().length <= 10
      }
    }
    if (isCommonNumberRequired(docType)) {
      return value.toString().length === 14
    }
  }

  function isExportNumberLengthValid(value) {
    return value.toString().length === 14
  }

  function isFormatValid(value) {
    return commonFormat.test(value)
  }

  exports.isFormatSimilarToGuiNumber = isFormatSimilarToGuiNumber
  exports.isCommonNumberOptional = isCommonNumberOptional
  exports.isCommonNumberDuplicate = isCommonNumberDuplicate
  exports.isCommonNumberRequired = isCommonNumberRequired
  exports.isCommonNumberMustNotHave = isCommonNumberMustNotHave
  exports.isLengthValid = isLengthValid
  exports.isExportNumberLengthValid = isExportNumberLengthValid
  exports.isFormatValid = isFormatValid
  return exports
})
