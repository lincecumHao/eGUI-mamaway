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
  var recordId = 'customrecord_gw_consolidate_payment_code'
  var fieldConfig = {
    name: {
      id: 'name',
      sourceField: '',
      outputField: 'name',
    },
    custrecord_consolidate_pay_value: {
      id: 'custrecord_consolidate_pay_value',
      sourceField: '',
      outputField: 'value',
    },
    custrecord_consolidate_pay_text: {
      id: 'custrecord_consolidate_pay_text',
      sourceField: '',
      outputField: 'text',
    },

    custrecord_gw_consolidate_pay_apply_code: {
      id: 'custrecord_gw_consolidate_pay_apply_code',
      sourceField: '',
      outputField: 'code',
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
