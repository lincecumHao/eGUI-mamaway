define(['../gw_abstract_dao', './gw_record_fields'], (gwDao, fieldConfig) => {
  class EguiType extends gwDao.DataAccessObject {
    constructor() {
      super(fieldConfig.recordId, fieldConfig)
    }

    getRegularGuiType() {
      return this.getByValue('07')
    }
    getSpecialGuiType() {
      return this.getByValue('08')
    }
  }

  return new EguiType()
})
