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
  var consolidationMark = ''
  var consolidationQty = 0

  function isConsolidationMarkValid(value) {
    consolidationMark = value
    if ((docType === 26 || docType === 27) && value.toUpperCase() !== 'A') {
      consolidationMark = ''
      return false
    }
    return true
  }

  function isConsolidateQtyValid(value) {
    if (consolidationMark === 'A') {
      return value >= 1 && value <= 9999
    }
    if (!consolidationMark || consolidationMark === '') {
      return value === 1
    }
  }

  exports.isConsolidationMarkValid = isConsolidationMarkValid
  exports.isConsolidateQtyValid = isConsolidateQtyValid

  return exports
})
