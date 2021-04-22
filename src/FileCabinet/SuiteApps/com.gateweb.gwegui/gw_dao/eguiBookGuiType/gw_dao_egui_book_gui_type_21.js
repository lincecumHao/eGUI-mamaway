define(['../gw_abstract_dao', './gw_record_fields'], (gwDao, fieldConfig) => {
  class EguiBookGuiType extends gwDao.DataAccessObject {
    constructor() {
      log.debug({ title: 'fieldConfig', details: fieldConfig })
      super(fieldConfig.recordId, fieldConfig)
    }
    getDefaultGuiType() {
      return this.getByValue('07')
    }
  }

  return new EguiBookGuiType()
})
