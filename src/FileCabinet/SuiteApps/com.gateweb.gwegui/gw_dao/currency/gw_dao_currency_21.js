define(['../gw_abstract_dao', './gw_record_fields'], (gwDao, fieldConfig) => {
  class Currency extends gwDao.DataAccessObject {
    constructor() {
      super(fieldConfig.recordId, fieldConfig)
    }
  }

  return new Currency()
})
