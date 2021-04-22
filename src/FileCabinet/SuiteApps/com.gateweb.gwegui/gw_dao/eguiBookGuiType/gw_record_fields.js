define(['../../library/ramda.min'], function (ramda) {
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
  var exports = {}

  class FieldConfig {
    constructor() {
      this.recordId = 'customrecord_gw_gui_book_gui_type'
      this.fieldConfig = {
        name: {
          id: 'name',
          sourceField: '',
          outputField: 'name',
        },
        custrecord_gw_gbgt_value: {
          id: 'custrecord_gw_gbgt_value',
          sourceField: '',
          outputField: 'value',
        },
        custrecord_gw_gbgt_text: {
          id: 'custrecord_gw_gbgt_text',
          sourceField: '',
          outputField: 'text',
        },
      }
      this.fields = ramda.indexBy(ramda.prop('id'), ramda.values(fields))
    }
  }

  var recordId = 'customrecord_gw_gui_book_gui_type'
  var fieldConfig = {
    name: {
      id: 'name',
      sourceField: '',
      outputField: 'name',
    },
    custrecord_gw_gbgt_value: {
      id: 'custrecord_gw_gbgt_value',
      sourceField: '',
      outputField: 'value',
    },
    custrecord_gw_gbgt_text: {
      id: 'custrecord_gw_gbgt_text',
      sourceField: '',
      outputField: 'text',
    },
  }

  var fields = ramda.indexBy(ramda.prop('id'), ramda.values(fieldConfig))

  var fieldInputMapping = ramda.reduce(
    function (result, fieldId) {
      var fieldObj = fields[fieldId]
      if (fieldObj.sourceField) {
        result[fieldObj.sourceField] = fieldId
      }
      return result
    },
    {},
    Object.keys(fields)
  )

  var fieldOutputMapping = ramda.reduce(
    function (result, fieldId) {
      var fieldObj = fields[fieldId]
      if (fieldObj.outputField) {
        result[fieldObj.id] = fieldObj.outputField
      }
      return result
    },
    {},
    Object.keys(fields)
  )

  exports.fieldConfig = fieldConfig
  exports.fields = fields
  exports.allFieldIds = Object.keys(fields).map(function (key) {
    return key
  })
  exports.fieldOutputMapping = fieldOutputMapping
  exports.fieldInputMapping = fieldInputMapping
  exports.recordId = recordId
  return exports
})
