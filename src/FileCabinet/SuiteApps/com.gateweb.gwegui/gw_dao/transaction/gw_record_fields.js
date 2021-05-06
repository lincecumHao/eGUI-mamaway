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
  var recordId = 'transaction'
  var fieldConfig = {
    mainline: {
      id: 'mainline',
      sourceField: 'mainline',
      outputField: 'mainline',
    },
    trandate: {
      id: 'trandate',
      sourceField: 'trandate',
      outputField: 'trandate',
    },
    type: {
      id: 'type',
      sourceField: 'type',
      outputField: 'type',
    },
    tranid: {
      id: 'tranid',
      sourceField: 'tranid',
      outputField: 'tranid',
    },
    entity: {
      id: 'entity',
      sourceField: 'entity',
      outputField: 'entity',
    },
    memo: {
      id: 'memo',
      sourceField: 'memo',
      outputField: 'memo',
    },
    amount: {
      id: 'amount',
      sourceField: 'amount',
      outputField: 'amount',
    },
    custbody_gw_gui_address: {
      id: 'custbody_gw_gui_address',
      sourceField: 'custbody_gw_gui_address',
      outputField: 'custbody_gw_gui_address',
    },
    custbody_gw_gui_title: {
      id: 'custbody_gw_gui_title',
      sourceField: 'custbody_gw_gui_title',
      outputField: 'custbody_gw_gui_title',
    },
    custbody_gw_tax_id_number: {
      id: 'custbody_gw_tax_id_number',
      sourceField: 'custbody_gw_tax_id_number',
      outputField: 'custbody_gw_tax_id_number',
    },
    custbody_gw_creditmemo_deduction_list: {
      id: 'custbody_gw_creditmemo_deduction_list',
      sourceField: 'custbody_gw_creditmemo_deduction_list',
      outputField: 'custbody_gw_creditmemo_deduction_list',
    },
    custbody_gw_gui_donation_code: {
      id: 'custbody_gw_gui_donation_code',
      sourceField: 'custbody_gw_gui_donation_code',
      outputField: 'custbody_gw_gui_donation_code',
    },
    custbody_gw_gui_donation_mark: {
      id: 'custbody_gw_gui_donation_mark',
      sourceField: 'custbody_gw_gui_donation_mark',
      outputField: 'custbody_gw_gui_donation_mark',
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
