define(['../gw_abstract_dao', './gw_record_fields'], function (
  gwDao,
  fieldConfig
) {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2020 Gateweb
   * @author Sean Lin <seanlin816@gmail.com>
   *
   * @NApiVersion 2.1
   * @NModuleScope Public

   */
  class DocumentIssuanceStatus extends gwDao.DataAccessObject {
    constructor() {
      super('customrecord_gw_ed_issuance_status', fieldConfig)
    }

    getByStatusCode(statusCode) {
      return this.getAll().filter(function (option) {
        return option.statusCode.toString() === statusCode.toString()
      })[0]
    }

    getByName(name) {
      return this.getAll().filter(function (option) {
        return option.name === name
      })[0]
    }
  }

  return new DocumentIssuanceStatus()
})
