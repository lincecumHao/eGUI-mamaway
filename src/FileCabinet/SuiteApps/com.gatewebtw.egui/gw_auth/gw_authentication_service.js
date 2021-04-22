define([
  './gw_company_setting_service',
  './gw_cred_record_service',
  './gw_crypto_service',
], (GwCompanySettingService, GwCredentialService, GwCryptoService) => {
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
  let exports = {}

  function getCompanyInfo() {
    return GwCompanySettingService.getCompanyInfo()
  }

  function decryptData(data, iv, taxId) {
    if (!taxId) taxId = getDefaultTaxID()
    var guid = GwCredentialService.getPasswordToken(taxId)
    return GwCryptoService.decryptData(data, iv, guid)
  }

  function encryptData(data, taxId) {
    if (!taxId) taxId = getDefaultTaxID()
    var guid = GwCredentialService.getPasswordToken(taxId)
    return GwCryptoService.encryptData(guid, data)
  }

  function getDefaultGUID() {
    var defaultTaxId = getDefaultTaxID()
    return GwCredentialService.getPasswordToken(defaultTaxId)
  }

  function getDefaultTaxID() {
    return GwCompanySettingService.getCompanyInfo().gui
  }

  function hashSha256(data, taxId) {
    if (!taxId) taxId = getDefaultTaxID()
    var guid = GwCredentialService.getPasswordToken(taxId)
    return GwCryptoService.hashSha256(guid, data)
  }

  exports.getMasterCompanySetting = getCompanyInfo
  exports.getCurrentUserInfo = GwCompanySettingService.getCurrentUserInfo
  exports.getDefaultInfo = GwCompanySettingService.getCurrentInfo
  exports.hash256 = hashSha256
  exports.encryptData = encryptData
  exports.defaultSubsidiary = 1
  exports.decryptData = decryptData
  return exports
})
