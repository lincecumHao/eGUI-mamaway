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
  var recordId = 'customrecord_gw_assignlog_track'
  var fieldConfig = {
    name: {
      id: 'name',
      sourceField: '',
      outputField: 'name'
    },
    custrecord_gw_track_year_month: {
      id: 'custrecord_gw_track_year_month',
      sourceField: '',
      outputField: 'docPeriod'
    },
    custrecord_gw_track_type_code: {
      id: 'custrecord_gw_track_type_code',
      sourceField: '',
      outputField: 'docTypeCode'
    },
    custrecord_gw_track_invoice_track: {
      id: 'custrecord_gw_track_invoice_track',
      sourceField: '',
      outputField: 'track'
    },
    custrecord_gw_track_invoice_type: {
      id: 'custrecord_gw_track_invoice_type',
      sourceField: '',
      outputField: 'mofDocType'
    }
  }

  var fieldInputMapping = ramda.reduce(
    function (result, fieldId) {
      var fieldObj = fieldConfig[fieldId]
      if (fieldObj.sourceField) {
        result[fieldObj.sourceField] = fieldId
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
