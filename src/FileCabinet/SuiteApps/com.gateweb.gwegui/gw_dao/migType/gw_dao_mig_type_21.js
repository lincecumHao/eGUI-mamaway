define([
  '../gw_abstract_dao',
  './gw_record_fields',
  '../../library/ramda.min',
], (gwDao, fieldConfig, ramda) => {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2021 Gateweb
   * @author Sean Lin <sean.hyl@gmail.com>
   *
   * @NApiVersion 2.1
   * @NModuleScope Public

   */
  class MigType extends gwDao.DataAccessObject {
    constructor() {
      super(fieldConfig.recordId, fieldConfig)
      this.eguiActionEnum = { ISSUE: 'ISSUE', CANCEL: 'CANCEL' }
      this.eguiTypeEnum = { EGUI: 'EGUI', ALLOWANCE: 'Allowance' }
      this.businessTranTypeEnum = {
        B2C: 'B2C',
        B2B: 'B2BS',
        B2B_Exchange: 'B2BE',
      }
    }

    getByBusinessTypeAndDocType(action, businessType, docType) {
      return ramda.filter(function (option) {
        return (
          option[
            fieldConfig.fields.custrecord_gw_mt_egui_type.outputField
          ].toUpperCase() === docType.toUpperCase() &&
          option[
            fieldConfig.fields.custrecord_gw_mt_bus_tran_type.outputField
          ].toUpperCase() === businessType.toUpperCase() &&
          option[
            fieldConfig.fields.custrecord_gw_mt_action_mode.outputField
          ].toUpperCase() === action.toUpperCase()
        )
      }, this.allOptions)[0]
    }

    getIssueEguiMigType(businessType) {
      return this.getByBusinessTypeAndDocType(
        this.eguiActionEnum.ISSUE,
        businessType,
        this.eguiTypeEnum.EGUI
      )
    }

    getIssueAllowanceMigType(businessType) {
      return this.getByBusinessTypeAndDocType(
        this.eguiActionEnum.ISSUE,
        businessType,
        this.eguiTypeEnum.EGUI
      )
    }

    getIssueEguiExchangeMigType() {
      return this.getByBusinessTypeAndDocType(
        this.eguiActionEnum.ISSUE,
        this.businessTranTypeEnum.B2B_Exchange,
        this.eguiTypeEnum.EGUI
      )
    }
  }

  return new MigType()
})
