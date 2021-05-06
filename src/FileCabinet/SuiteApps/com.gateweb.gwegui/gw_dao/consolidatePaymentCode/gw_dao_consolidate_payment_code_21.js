define(['../gw_abstract_dao', './gw_record_fields'], function (
  gwDao,
  fieldConfig
) {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2021 Gateweb
   * @author Sean Lin <sean.hyl@gmail.com>
   *
   * @NApiVersion 2.1
   * @NModuleScope Public

   */

  class ConsolidatePaymentCode extends gwDao.DataAccessObject {
    constructor() {
      super(fieldConfig.recordId, fieldConfig)
    }
    getByCode(code) {
      return this.allOptions.filter(function (option) {
        return option.code.toString() === code.toString()
      })[0]
    }
  }

  return new ConsolidatePaymentCode()
})
