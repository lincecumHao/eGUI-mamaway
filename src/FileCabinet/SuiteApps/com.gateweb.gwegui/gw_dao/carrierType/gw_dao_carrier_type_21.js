define(['../gw_abstract_dao', './gw_record_fields'], (gwDao, fieldConfig) => {
  class CarrierTypeDao extends gwDao.DataAccessObject {
    constructor() {
      super(fieldConfig.recordId, fieldConfig)
    }
  }

  return new CarrierTypeDao()
})
