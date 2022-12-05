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

  function isLengthValid(value) {
    return value.toString().length === 8
  }

  function isOptional(consolidationMark) {
    return consolidationMark.toString() === 'A'
  }

  function isMustNotHave(docType) {
    var noTaxIdDocType = [28, 29]
    return noTaxIdDocType.indexOf(parseInt(docType)) > -1
  }

  var multiplier = [1, 2, 1, 2, 1, 2, 4, 1]

  function isB2CTaxId(value) {
    return value.toString() === '0000000000'
  }

  function isNumberCalculatedValid(number) {
    var numberStrArray = number.toString().split('')
    var result = numberStrArray.reduce(calculate, 0)
    if (parseInt(numberStrArray[6]) === 7) {
      return result % 5 === 0 || (result + 1) % 5 === 0
    }
    return result % 5 === 0
  }

  function calculate(total, digitStr, index) {
    return parseInt(total) + calculateNumberDigit(digitStr, index)
  }

  function calculateNumberDigit(digit, pos) {
    var result = parseInt(digit) * multiplier[pos]
    result = Math.floor(result / 10) + (result % 10)
    return result
  }

  exports.isLengthValid = isLengthValid
  exports.isB2CTaxId = isB2CTaxId
  exports.isMustNotHave = isMustNotHave
  exports.isNumberCalculatedValid = isNumberCalculatedValid
  exports.isOptional = isOptional
  return exports
})
