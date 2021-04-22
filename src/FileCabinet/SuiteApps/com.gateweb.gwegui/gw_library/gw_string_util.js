/**
 *String Utility Tool
 *gwStringUtility.js
 *@NApiVersion 2.x
 */
define([], function () {
  //字串補0
  function padding(str, length) {
    return (Array(length).join('0') + str).slice(-length)
  }

  function test1(str, length) {
    return (Array(length).join('0') + str).slice(-length)
  }

  function trim(str) {
    if (typeof str === 'undefined' || str == null || str.length == 0) {
      str = ' '
    } else {
      str.trim()
    }
    return str
  }

  return {
    trim: trim,
    padding: padding,
    test1: test1,
  }
})
