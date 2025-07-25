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
  var recordId = 'customrecord_gw_ap_doc_type_option'
  var fieldConfig = {
    name: {
      id: 'name',
      sourceField: '',
      outputField: 'name'
    },
    custrecord_gw_ap_doc_type_value: {
      id: 'custrecord_gw_ap_doc_type_value',
      sourceField: '',
      outputField: 'value'
    },
    custrecord_gw_ap_doc_type_text: {
      id: 'custrecord_gw_ap_doc_type_text',
      sourceField: '',
      outputField: 'text'
    },
    custrecord_gw_ap_doc_mof_doc_type_code: {
      id: 'custrecord_gw_ap_doc_mof_doc_type_code',
      sourceField: '',
      outputField: 'mofCode'
    }
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
