define([
  './gw_mapping_util',
  '../gw_ap_doc_record_fields',
  '../../../gw_dao/docFormat/gw_dao_doc_format_21',
  '../../../gw_dao/docStatus/gw_dao_doc_status_21',
  '../../../gw_dao/taxType/gw_dao_tax_type_21',
  '../../../gw_dao/deductionCode/gw_dao_deduction_code_21',
  '../../../gw_dao/consolidateMark/gw_dao_consolidation_mark_21',
  '../../../gw_dao/customClearanceMark/gw_dao_custom_clearance_mark_21',
  '../../../gw_dao/currency/gw_dao_currency_21',
  '../../../gw_dao/taxExemptMark/gw_dao_tax_exempt_mark_21',
  '../../../gw_dao/applyPeriod/gw_dao_apply_period_21'
], (
  gwObjectMappingUtil,
  recordFields,
  docTypeDao,
  docStatusDao,
  taxTypeDao,
  deductionCodeDao,
  consolidationMarkDao,
  customClearanceMarkDao,
  currencyDao,
  zeroTaxMarkDao,
  applyPeriodDao
) => {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2022 Gateweb
   * @author Sean Lin <seanlin@gateweb.com.tw>
   *
   * @NApiVersion 2.1
   * @NModuleScope Public

   */
  const daoMapper = {
    // docType: docTypeDao,
    guiStatus: docStatusDao,
    taxType: taxTypeDao,
    deductionCode: deductionCodeDao,
    consolidationMark: consolidationMarkDao,
    customClearanceMark: customClearanceMarkDao,
    currency: currencyDao,
    zeroTaxMark: zeroTaxMarkDao,
    taxFilingPeriod: applyPeriodDao
  }

  const getListRecordId = (recordObj, fieldName) => {
    const fieldId = recordFields.fields[fieldName].toField
    recordObj[fieldId] = recordObj[fieldId]
      ? daoMapper[fieldName].getByValue(recordObj[fieldId]).id
      : ''
    return recordObj
  }

  class ApDocMapper {
    constructor(apDocObj) {
      this.apDocObj = apDocObj
    }

    convertApDocToRecordObj() {
      var apDocRecord = gwObjectMappingUtil.mapTo(this.apDocObj, recordFields)
      Object.keys(daoMapper).forEach((fieldName) => {
        apDocRecord = getListRecordId(apDocRecord, fieldName)
      })
      return apDocRecord
    }

    convertRestletRequest(){

    }
  }

  return ApDocMapper
})
