define(['../gw_abstract_dao', './gw_record_fields'], (gwDao, fieldConfig) => {
  class EguiBookType extends gwDao.DataAccessObject {
    constructor() {
      super(fieldConfig.recordId, fieldConfig)
    }

    getDefaultBookType() {
      return this.getByValue('egui')
    }
    getManualGuiBookType() {
      return this.getByValue('mgui')
    }
  }

  return new EguiBookType()
})
