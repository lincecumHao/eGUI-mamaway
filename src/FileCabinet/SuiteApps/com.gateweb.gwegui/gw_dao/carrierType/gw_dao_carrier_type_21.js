define(['../gw_abstract_dao', './gw_record_fields'], (gwDao, fieldConfig) => {
  class CarrierTypeDao extends gwDao.DataAccessObject {
    constructor() {
      super('customrecord_gw_carrier_type', fieldConfig)
    }
  }

  return new CarrierTypeDao()
})
