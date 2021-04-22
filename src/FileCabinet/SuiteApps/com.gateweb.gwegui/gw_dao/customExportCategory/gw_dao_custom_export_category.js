define(['../gw_abstract_dao', './gw_record_fields'], (gwDao, fieldConfig) => {
  class CustomExportCategory extends gwDao.DataAccessObject {
    constructor() {
      super('customrecord_gw_customs_export_category', fieldConfig)
    }
  }

  return new CustomExportCategory()
})
