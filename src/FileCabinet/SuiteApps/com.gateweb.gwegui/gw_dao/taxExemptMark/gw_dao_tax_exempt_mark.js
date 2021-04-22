define(['../gw_abstract_dao', './gw_record_fields'], (gwDao, fieldConfig) => {
  class TaxExemptMark extends gwDao.DataAccessObject {
    constructor() {
      super('customrecord_gw_exempt_option', fieldConfig)
    }
  }

  return new TaxExemptMark()
})
