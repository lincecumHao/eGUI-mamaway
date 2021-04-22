define([], function () {
  /**
     * Module Description...
     *
     * @type {Object} module-name
     *
     * @copyright 2021 Sinesoft
     * @author Sean Lin <seanlin816@gmail.com>
     *
     * @NApiVersion 2.0
     * @NModuleScope Public

     */
  var exports = {}
  function htmlEncode(input) {
    if (!input) {
      return ''
    }
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
      .replace(/\r\n/, '<br />')
  }

  function htmlDecode(input) {
    if (!input) {
      return ''
    }
    return input
      .replace(/&apos;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&gt;/g, '>')
      .replace(/&lt;/g, '<')
      .replace(/&amp;/g, '&')
  }

  function isNullOrEmpty(input) {
    if (typeof input === 'undefined' || input === null) return true
    return input.replace(/\s/g, '').length < 1
  }

  function prependCharToLength(padChar, totalLength, input) {
    return input.toString().padStart(totalLength, padChar)
  }

  function appendCharToLength(padChar, totalLength, input) {
    return input.toString().padEnd(totalLength, padChar)
  }

  function prependString(padString, input) {
    return padString + input.toString()
  }

  function appendString(padString, input) {
    return input.toString() + padString
  }

  function removeAllSpace(input) {
    return input.replace(/\s/g, '')
  }

  function removeAll(patternStr, input) {
    var regExp = new RegExp(patternStr, 'g')
    return input.replace(regExp, '')
  }

  // length of string composed of Chinese character and Alpha-Numeric string
  function getByteLength(value) {
    // returns the byte length of an utf8 string
    var s = value.length
    for (var i = value.length - 1; i >= 0; i--) {
      var code = value.charCodeAt(i)
      if (code > 0x7f && code <= 0x7ff) s++
      else if (code > 0x7ff && code <= 0xffff) s += 2
      if (code >= 0xdc00 && code <= 0xdfff) i-- //trail surrogate
    }
    return s
  }

  exports.htmlEncode = htmlEncode
  exports.htmlDecode = htmlDecode
  exports.isNullOrEmpty = isNullOrEmpty
  exports.prependCharToLength = prependCharToLength
  exports.prependString = prependString
  exports.appendString = appendString
  exports.appendCharToLength = appendCharToLength
  exports.removeAllSpace = removeAllSpace
  exports.removeAll = removeAll
  exports.getByteLength = getByteLength

  return exports
})
