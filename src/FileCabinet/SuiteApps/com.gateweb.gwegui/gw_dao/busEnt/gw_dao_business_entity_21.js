define([
  '../gw_abstract_dao',
  './gw_record_fields',
  '../consolidatePaymentCode/gw_dao_consolidate_payment_code_21'
], function (gwDao, fieldConfig, gwDaoConsolidatePaymentCode) {
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

  class BusinessEntityDao extends gwDao.DataAccessObject {
    constructor() {
      super(fieldConfig.recordId, fieldConfig)
      // this.allOptions = this.mapAllOptions()
    }

    mapAllOptions() {
      this.allOptions = this.allOptions.map(function (optionObject) {
        var consolidateFieldId =
          fieldConfig.fields.custrecord_gw_be_conso_payment_code.outputField
        if (optionObject[consolidateFieldId]) {
          optionObject[consolidateFieldId] =
            gwDaoConsolidatePaymentCode.getById(
              optionObject[consolidateFieldId].value
            )
        }
        return optionObject
      })
      return this.allOptions
    }

    getAll() {
      this.allOptions = super.getAll().map(function (optionObject) {
        var consolidateFieldId =
          fieldConfig.fields.custrecord_gw_be_conso_payment_code.outputField
        if (optionObject[consolidateFieldId]) {
          optionObject[consolidateFieldId] =
            gwDaoConsolidatePaymentCode.getById(
              optionObject[consolidateFieldId].value
            )
        }
        return optionObject
      })
      return this.allOptions
    }

    getByAccountSubsidiary(account, subsidiary) {
      return this.getAll().filter(function (recordObj) {
        return (
          recordObj[fieldConfig.fields.custrecord_gw_be_ns_id.outputField] ===
            account &&
          recordObj[
            fieldConfig.fields.custrecord_gw_be_ns_subsidiary.outputField
          ].value === subsidiary
        )
      })[0]
    }

    /**
     *
     * @param subsidiaryId {string}
     * @returns {*}
     */
    getBySubsidiary(subsidiaryId) {
      return this.getAll().filter(function (recordObj) {
        return (
          recordObj[
            fieldConfig.fields.custrecord_gw_be_ns_subsidiary.outputField
          ].value.toString() === subsidiaryId.toString()
        )
      })[0]
    }

    getByTaxId(taxId) {
      return this.getAll().filter(function (recordObj) {
        return (
          recordObj[
            fieldConfig.fields.custrecord_gw_be_tax_id_number.outputField
          ].toString() === taxId.toString()
        )
      })[0]
    }
  }

  return new BusinessEntityDao()
})
