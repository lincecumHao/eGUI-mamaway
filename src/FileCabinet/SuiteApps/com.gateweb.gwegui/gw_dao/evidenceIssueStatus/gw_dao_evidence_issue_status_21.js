define(['../gw_abstract_dao', './gw_record_fields'], (gwDao, fieldConfig) => {
  class EvidenceIssueStatus extends gwDao.DataAccessObject {
    constructor() {
      super(fieldConfig.recordId, fieldConfig)
    }

    getByStatusCode(code) {
      return this.getByValue(code)
    }
    getUnIssuedStatus() {
      return this.getByValue('I')
    }
    getIssuedAndNotTransformedStatus() {
      return this.getByValue('PA')
    }

    getGwIssuedStatus() {
      return this.getByValue('A')
    }
    getGwUploadedStatus() {
      return this.getByValue('IP')
    }

    getGwUploadSuccessStatus() {
      return this.getByValue('IC')
    }

    getGwUploadFailedStatus() {
      return this.getByValue('IE')
    }
  }

  return new EvidenceIssueStatus()
})
