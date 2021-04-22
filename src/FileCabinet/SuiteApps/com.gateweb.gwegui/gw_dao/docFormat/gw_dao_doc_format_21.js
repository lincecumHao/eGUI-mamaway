define(['../gw_abstract_dao', './gw_record_fields'], (gwDao, fieldConfig) => {
  class DocumentFormat extends gwDao.DataAccessObject {
    constructor() {
      super('customrecord_gw_doc_format_option', fieldConfig)
    }
    getDefaultApFormat() {}
    getDefaultArGuiFormat(eguiTypeCode) {
      if (eguiTypeCode === '07') {
        return this.getByValueAndMofCode(35, '07')
      }
      if (eguiTypeCode === '08') {
        return this.getByValueAndMofCode(37)
      }
    }
    getByValueAndMofCode(value, mofCode) {
      if (!mofCode) {
        mofCode = '00'
      }
      return this.allOptions.filter(function (option) {
        return (
          parseInt(option.value) === parseInt(value) &&
          mofCode === option.mofCode
        )
      })[0]
    }
  }

  return new DocumentFormat()
})
