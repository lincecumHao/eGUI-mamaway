define(['../gw_abstract_dao', './gw_record_fields'], (gwDao, fieldConfig) => {
  class EGuiBookStatusDao extends gwDao.DataAccessObject {
    constructor() {
      super(fieldConfig.recordId, fieldConfig)
      this.statusCode = {
        NEW: 'new',
        IN_USE: 'inUse',
        USED: 'used',
        VOID: 'void',
      }
    }

    getUnusedStatus() {
      return this.allOptions.filter(
        (option) => option.value === this.statusCode.NEW
      )[0]
    }

    getInUseStatus() {
      return this.allOptions.filter(
        (option) => option.value === this.statusCode.IN_USE
      )[0]
    }

    getUsedStatus() {
      return this.allOptions.filter(
        (option) => option.value === this.statusCode.USED
      )[0]
    }

    getVoidStatus() {
      return this.allOptions.filter(
        (option) => option.value === this.statusCode.VOID
      )[0]
    }
  }

  return new EGuiBookStatusDao()
})
