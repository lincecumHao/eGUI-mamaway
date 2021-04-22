define(['N/runtime', 'N/config'], (runtime, config) => {
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

  function getCurrentUserInfo() {
    var user = runtime.getCurrentUser()
    return {
      id: user.id,
      subsidiary: user.subsidiary,
    }
  }

  function getCompanyInfo() {
    var companyInfo = config.load({
      type: config.Type.COMPANY_INFORMATION,
    })
    var legalName = companyInfo.getValue({
      fieldId: 'legalname',
    })
    var accountId = companyInfo.getValue({
      fieldId: 'companyid',
    })
    var taxId = companyInfo.getValue({
      fieldId: 'employerid',
    })
    var email = companyInfo.getValue({
      fieldId: 'email',
    })
    return {
      name: legalName,
      nsAccountId: accountId,
      gui: taxId,
      email: email,
    }
  }

  function getCurrentInfo() {
    var companyInfo = getCompanyInfo()
    var userInfo = getCurrentUserInfo()
    var currentInfo = {
      name: companyInfo.name,
      nsAccountId: companyInfo.nsAccountId,
      subsidiary: userInfo.subsidiary,
      gui: companyInfo.gui,
      email: companyInfo.email,
    }
    return currentInfo
  }

  exports.getCompanyInfo = getCompanyInfo
  exports.getCurrentUserInfo = getCurrentUserInfo
  exports.getCurrentInfo = getCurrentInfo
  return exports
})
