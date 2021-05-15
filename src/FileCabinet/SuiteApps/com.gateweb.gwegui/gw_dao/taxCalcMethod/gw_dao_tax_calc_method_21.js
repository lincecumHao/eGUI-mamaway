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
   * @NApiVersion 2.0
   * @NModuleScope Public

   */
  class TaxCalculationMethod extends gwDao.DataAccessObject {
    constructor() {
      super(fieldConfig.recordId, fieldConfig)
    }
  }

  return new TaxCalculationMethod()
})
