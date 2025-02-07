define(['../gw_abstract_dao', './gw_record_fields'], (gwDao, fieldConfig) => {
  class DocumentStatus extends gwDao.DataAccessObject {
    constructor() {
      super(fieldConfig.recordId, fieldConfig)
    }

    getByCsvValue(csvValue) {
      return this.getAll().filter(function(option) {
        return option.csvValue.toString() === csvValue.toString()

      })[0]
    }
  }

  return new DocumentStatus()
})
