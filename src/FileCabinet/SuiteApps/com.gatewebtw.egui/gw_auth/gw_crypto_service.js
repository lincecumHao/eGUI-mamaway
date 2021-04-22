define(['N/crypto', 'N/encode'], function (crypto, encode) {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2020 Gateweb
   * @author Sean Lin <seanlin816@gmail.com>
   *
   * @NApiVersion 2.1
   * @NModuleScope Public

   */
  var exports = {}

  function encryptData(guid, content) {
    var sKey = crypto.createSecretKey({
      guid: guid,
      encoding: encode.Encoding.UTF_8,
    })
    var cipher = crypto.createCipher({
      algorithm: crypto.EncryptionAlg.AES,
      key: sKey,
      padding: crypto.Padding.PKCS5Padding,
    })
    cipher.update({
      input: content,
    })
    var cipherOut = cipher.final()
    return cipherOut
  }

  function hashSha256(guid, content) {
    var sKey = crypto.createSecretKey({
      guid: guid,
      encoding: encode.Encoding.UTF_8,
    })

    var hmacSHA256 = crypto.createHmac({
      algorithm: crypto.HashAlg.SHA256,
      key: sKey,
    })
    hmacSHA256.update({
      input: content,
      inputEncoding: encode.Encoding.UTF_8,
    })
    var digestSHA256 = hmacSHA256.digest({
      outputEncoding: encode.Encoding.HEX,
    })
    return digestSHA256
  }

  function validatePasswordToken(passwordToken) {
    var validateResult = {
      success: true,
    }
    try {
      var inputString = 'YWJjZGVmZwo='
      encryptData(passwordToken, inputString)

      log.debug({ title: 'validatePasswordToken', details: 'cipher finaled' })
    } catch (e) {
      log.debug({ title: 'validatePasswordToken error', details: e })
      validateResult.success = false
      validateResult.error = {}
      validateResult.error.code = e.name
      validateResult.error.message = e.message
    }
    return validateResult
  }

  function decryptData(encryptText, encryptIv, passwordToken) {
    var sKey = crypto.createSecretKey({
      guid: passwordToken,
      encoding: encode.Encoding.UTF_8,
    })
    var decipher = crypto.createDecipher({
      algorithm: crypto.EncryptionAlg.AES,
      key: sKey,
      iv: encryptIv,
      padding: crypto.Padding.PKCS5Padding,
    })
    decipher.update({
      input: encryptText,
    })
    var result = decipher.final()
    return result
  }

  exports.encryptData = encryptData
  exports.decryptData = decryptData
  exports.hashSha256 = hashSha256
  exports.validatePasswordToken = validatePasswordToken
  return exports
})
