define(['../gw_abstract_dao', './gw_record_fields'], (
  gwDao,
  fieldConfig
) => {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2021
   * @author  Sean Lin <sean.hyl@gmail.com>
   *
   * @NApiVersion 2.1
   * @NModuleScope Public

   */
  class ApplyPeriodDao extends gwDao.DataAccessObject {
    constructor() {
      super(fieldConfig.recordId, fieldConfig)
    }
  }

  return new ApplyPeriodDao()
})
