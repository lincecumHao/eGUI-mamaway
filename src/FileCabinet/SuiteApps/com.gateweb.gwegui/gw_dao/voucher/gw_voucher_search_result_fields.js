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
  var sublists = {
    detail: 'CUSTRECORD_GW_VOUCHER_MAIN_INTERNAL_ID',
  }

  var fieldConfig = {
    name: {
      id: 'name',
      sourceField: '',
      outputField: 'name',
    },
    documentType: {
      id: 'documentType',
      sourceField: 'custrecord_gw_voucher_type',
      outputField: '',
    },
    documentNumber: {
      id: 'documentNumber',
      sourceField: 'custrecord_gw_voucher_number',
      outputField: '',
    },
    documentDate: {
      id: 'documentDate',
      sourceField: 'custrecord_gw_voucher_date',
      outputField: '',
    },
  }

  var fieldInputMapping = ramda.reduce(
    function (result, fieldId) {
      var fieldObj = fieldConfig[fieldId]
      if (fieldObj.sourceField) {
        result[fieldObj.id] = fieldObj.sourceField
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

  var fieldIdMapping = ramda.reduce(
    function (result, fieldId) {
      result[fieldId] = fieldId
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
  exports.fieldIdMapping = fieldIdMapping
  exports.fieldInputMapping = fieldInputMapping
  exports.sublists = sublists
  return exports
})
