define(['../gw_abstract_dao', './gw_record_fields'], (gwDao, fieldConfig) => {
  class AssignLogTrack extends gwDao.DataAccessObject {
    constructor() {
      super(fieldConfig.recordId, fieldConfig)
    }

    getAvailableGuiTrack(docTypeCode, docPeriod, track) {
      var options = this.getAll().filter(function (option) {
        return (
          option.docPeriod.toString() === docPeriod.toString() &&
          option.docTypeCode.toString() === docTypeCode.toString() &&
          option.track.toString() === track.toString()
        )
      })[0]
      return options
    }
  }

  return new AssignLogTrack()
})
