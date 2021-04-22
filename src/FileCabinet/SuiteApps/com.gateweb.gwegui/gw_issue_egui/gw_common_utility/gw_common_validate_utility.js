/**
 *String Utility Tool
 *gwValidateUtility.js
 *@NApiVersion 2.x
 */
define(['N/format'], function (format) {
  function validateAlphanumeric(value) {
    var alphanumericRegxp = /[^\a-\z\A-\Z0-9._-]/g
    //var alphanumericRegxp = /[^\a-\z\A-\Z0-9._]/g;
    if (alphanumericRegxp.test(value)) {
      return false
    } else {
      return true
    }
    return false
  }

  function checkCarrier(type, value) {
    if (type === 'CQ0001') {
      //自然人憑證 TP07180222317771
      return /[A-Z]{2}[\d]{14}$/.test(value)
    } else if (type === '3J0002') {
      //手機條碼 /76PLT2E , /W1W6QO2
      return /[\/]([A-Z0-9]|\+|\.|-){7}$/.test(value)
    }
  }

  function checkCarrier_bak(type, value) {
    var flag = false

    if (type === 'CQ0001') {
      //自然人憑證 TP07180222317771
      var regxp = /[a-zA-Z]{2}[\\d]{14}$/
      if (regxp.test(value)) {
        flag = true
      }
    } else if (type === '3J0002') {
      //手機條碼 /76PLT2E , /W1W6QO2
      //由Code39組成，總長度為8碼字元
      //第一碼必為『/』
      //其餘七碼則由數字【0-9】、大寫英文【A-Z】與特殊符號【.】【-】【+】組成
      //var regxp = /[\\/]([^\\W_]|\\+|\\.|-){7}$/;
      var regxp = /[\/]([A-Z0-9]|\+|\.|-){7}$/
      if (regxp.test(value)) {
        flag = true
      }
    }

    return flag
  }

  //電子信箱格式驗證
  function checkEmail(value) {
    var flag = true
    var emailRegxp = /[\w-]+@([\w-]+\.)+[\w-]+/
    if (emailRegxp.test(value) != true) {
      flag = false
    }
    return flag
  }

  //檢查統編
  function isValidGUI(taxId) {
    var invalidList = '00000000,11111111'
    if (/^\d{8}$/.test(taxId) == false || invalidList.indexOf(taxId) != -1) {
      return false
    }

    var validateOperator = [1, 2, 1, 2, 1, 2, 4, 1],
      sum = 0,
      calculate = function (product) {
        // 個位數 + 十位數
        var ones = product % 10,
          tens = (product - ones) / 10
        return ones + tens
      }
    for (var i = 0; i < validateOperator.length; i++) {
      sum += calculate(taxId[i] * validateOperator[i])
    }

    return sum % 10 == 0 || (taxId[6] == '7' && (sum + 1) % 10 == 0)
  }

  function checkIdent(id) {
    //檢查身分證字號-------------------------------------------------------------------
    if (id.length != 10) return false

    if (
      isNaN(id.substr(1, 9)) ||
      id.substr(0, 1) < 'A' ||
      id.substr(0, 1) > 'Z'
    ) {
      return false
    }

    var head = 'ABCDEFGHJKLMNPQRSTUVXYWZIO'
    id = head.indexOf(id.substring(0, 1)) + 10 + '' + id.substr(1, 9)
    console.log('id=' + id)
    var s =
      parseInt(id.substr(0, 1)) +
      parseInt(id.substr(1, 1)) * 9 +
      parseInt(id.substr(2, 1)) * 8 +
      parseInt(id.substr(3, 1)) * 7 +
      parseInt(id.substr(4, 1)) * 6 +
      parseInt(id.substr(5, 1)) * 5 +
      parseInt(id.substr(6, 1)) * 4 +
      parseInt(id.substr(7, 1)) * 3 +
      parseInt(id.substr(8, 1)) * 2 +
      parseInt(id.substr(9, 1)) +
      parseInt(id.substr(10, 1))
    console.log('s=' + s)

    //判斷是否可整除
    if (s % 10 != 0) return false

    return true
  }

  function checkResident(id) {
    //檢查居留證號碼---------------------------------------------------------------------
    if (id.length != 10) return false

    if (
      isNaN(id.substr(2, 8)) ||
      id.substr(0, 1) < 'A' ||
      id.substr(0, 1) > 'Z' ||
      id.substr(1, 1) < 'A' ||
      id.substr(1, 1) > 'Z'
    ) {
      return false
    }

    var head = 'ABCDEFGHJKLMNPQRSTUVXYWZIO'
    id =
      head.indexOf(id.substr(0, 1)) +
      10 +
      '' +
      ((head.indexOf(id.substr(1, 1)) + 10) % 10) +
      '' +
      id.substr(2, 8)
    console.log('id=' + id)
    s =
      parseInt(id.substr(0, 1)) +
      parseInt(id.substr(1, 1)) * 9 +
      parseInt(id.substr(2, 1)) * 8 +
      parseInt(id.substr(3, 1)) * 7 +
      parseInt(id.substr(4, 1)) * 6 +
      parseInt(id.substr(5, 1)) * 5 +
      parseInt(id.substr(6, 1)) * 4 +
      parseInt(id.substr(7, 1)) * 3 +
      parseInt(id.substr(8, 1)) * 2 +
      parseInt(id.substr(9, 1)) +
      parseInt(id.substr(10, 1))
    console.log('s=' + s)

    //判斷是否可整除
    if (s % 10 != 0) return false

    return true
  }

  function validateEGUINumber(value) {
    var _regxp = /^[A-Z]{2}[0-9]{8}$/
    if (_regxp.test(value)) {
      return true
    } else {
      return false
    }
    return false
  }

  return {
    validateAlphanumeric: validateAlphanumeric,
    validateEGUINumber: validateEGUINumber,
    checkCarrier: checkCarrier,
    checkEmail: checkEmail,
    isValidGUI: isValidGUI,
    checkIdent: checkIdent,
  }
})
