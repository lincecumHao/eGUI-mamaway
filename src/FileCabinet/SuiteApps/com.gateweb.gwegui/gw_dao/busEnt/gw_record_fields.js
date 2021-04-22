define(['../../library/ramda.min'], function (ramda) {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2021 Gateweb
   * @author Sean Lin <sean.hyl@gmail.com>
   *
   * @NApiVersion 2.0
   * @NModuleScope Public

   */
  var exports = {}
  var recordId = 'customrecord_gw_business_entity'
  var fieldConfig = {
    name: {
      id: 'name',
      sourceField: '',
      outputField: 'name',
    },
    custrecord_gw_be_tax_id_number: {
      id: 'custrecord_gw_be_tax_id_number',
      sourceField: '',
      outputField: 'taxId',
    },
    custrecord_gw_be_vat_number: {
      id: 'custrecord_gw_be_vat_number',
      sourceField: '',
      outputField: 'vatId',
    },

    custrecord_gw_be_gui_title: {
      id: 'custrecord_gw_be_gui_title',
      sourceField: '',
      outputField: 'title',
    },
    custrecord_gw_be_business_owner_name: {
      id: 'custrecord_gw_be_business_owner_name',
      sourceField: '',
      outputField: 'ownerName',
    },
    custrecord_gw_be_tax_filing_type: {
      id: 'custrecord_gw_be_tax_filing_type',
      sourceField: '',
      outputField: 'taxFilingType',
    },
    custrecord_gw_be_conso_payment_code: {
      id: 'custrecord_gw_be_conso_payment_code',
      sourceField: '',
      outputField: 'consolidatePaymentCode',
    },
    custrecord_gw_be_sale_income_cons_parent: {
      id: 'custrecord_gw_be_sale_income_cons_parent',
      sourceField: '',
      outputField: 'isConsolidateToParent',
    },
    custrecord_gw_be_business_address_city: {
      id: 'custrecord_gw_be_business_address_city',
      sourceField: '',
      outputField: 'city',
    },
    custrecord_gw_be_business_address: {
      id: 'custrecord_gw_be_business_address',
      sourceField: '',
      outputField: 'address',
    },
    custrecord_gw_be_contact_name: {
      id: 'custrecord_gw_be_contact_name',
      sourceField: '',
      outputField: 'repName',
    },
    custrecord_gw_be_contact_phone_number: {
      id: 'custrecord_gw_be_contact_phone_number',
      sourceField: '',
      outputField: 'repTel',
    },
    custrecord_gw_be_contact_email: {
      id: 'custrecord_gw_be_contact_email',
      sourceField: '',
      outputField: 'repEmail',
    },
    custrecord_gw_be_contact_ext: {
      id: 'custrecord_gw_be_contact_ext',
      sourceField: '',
      outputField: 'repExtension',
    },
    custrecord_gw_be_is_applied_by_agent: {
      id: 'custrecord_gw_be_is_applied_by_agent',
      sourceField: '',
      outputField: 'isAppliedByAgent',
    },
    custrecord_gw_be_agent_registar_num: {
      id: 'custrecord_gw_be_agent_registar_num',
      sourceField: '',
      outputField: 'agentRegisteredNum',
    },
    custrecord_gw_be_applicant_id_num: {
      id: 'custrecord_gw_be_applicant_id_num',
      sourceField: '',
      outputField: 'applicantIdNum',
    },
    custrecord_gw_be_applicant_name: {
      id: 'custrecord_gw_be_applicant_name',
      sourceField: '',
      outputField: 'applicantName',
    },
    custrecord_gw_be_applicant_area_code: {
      id: 'custrecord_gw_be_applicant_area_code',
      sourceField: '',
      outputField: 'applicantAreaCode',
    },
    custrecord_gw_be_applicant_phone: {
      id: 'custrecord_gw_be_applicant_phone',
      sourceField: '',
      outputField: 'applicantTel',
    },
    custrecord_gw_be_applicant_ext: {
      id: 'custrecord_gw_be_applicant_ext',
      sourceField: '',
      outputField: 'applicantExtension',
    },
    custrecord_gw_be_ns_id: {
      id: 'custrecord_gw_be_ns_id',
      sourceField: '',
      outputField: 'nsAccountId',
    },
    custrecord_gw_be_ns_subsidiary: {
      id: 'custrecord_gw_be_ns_subsidiary',
      sourceField: '',
      outputField: 'subsidiary',
    },
    custrecord_gw_be_tax_filing_agent: {
      id: 'custrecord_gw_be_tax_filing_agent',
      sourceField: '',
      outputField: 'taxFilingAgent',
    },
    custrecord_gw_be_tax_direct_deduct: {
      id: 'custrecord_gw_be_tax_direct_deduct',
      sourceField: '',
      outputField: 'taxDeductOption',
    },
    custrecord_gw_be_is_non_value_added: {
      id: 'custrecord_gw_be_is_non_value_added',
      sourceField: '',
      outputField: 'isNonValueAdded',
    },
  }

  var fieldInputMapping = ramda.reduce(
    function (result, fieldId) {
      var fieldObj = fieldConfig[fieldId]
      if (fieldObj.sourceField) {
        result[fieldId] = fieldObj.sourceField
      }
      return result
    },
    {},
    Object.keys(fieldConfig)
  )

  var fieldOutputMapping = ramda.reduce(
    function (result, fieldId) {
      var fieldObj = fieldConfig[fieldId]
      if (fieldObj.outputField) {
        result[fieldObj.id] = fieldObj.outputField
      }
      return result
    },
    {},
    Object.keys(fieldConfig)
  )

  exports.fields = fieldConfig
  exports.allFieldIds = Object.keys(fieldConfig).map(function (key) {
    return key
  })
  exports.fieldOutputMapping = fieldOutputMapping
  exports.fieldInputMapping = fieldInputMapping
  exports.recordId = recordId
  return exports
})
