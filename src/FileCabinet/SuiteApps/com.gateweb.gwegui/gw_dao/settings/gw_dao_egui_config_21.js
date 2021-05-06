define(['N/config', '../gw_abstract_dao', './gw_record_fields'], (
  config,
  gwDao,
  fieldConfig
) => {
  function getAccountId() {
    var companyInfo = config.load({
      type: config.Type.COMPANY_INFORMATION,
    })
    return companyInfo.getValue({
      fieldId: 'companyid',
    })
  }

  class EGuiConfig extends gwDao.DataAccessObject {
    constructor() {
      super(fieldConfig.recordId, fieldConfig)
    }

    getConfig() {
      var accountId = getAccountId()
      return this.allOptions.filter(function (option) {
        return option.nsAcctId.toString() === accountId.toString()
      })[0]
    }
  }

  return new EGuiConfig()
})
