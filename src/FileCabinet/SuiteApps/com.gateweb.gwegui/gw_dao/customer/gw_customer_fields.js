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
  var fieldConfig = {
    companyname: {
      id: 'companyname',
      sourceField: '',
      outputField: 'companyname',
    },
    email: {
      id: 'email',
      sourceField: '',
      outputField: 'email',
    },
    entityid: {
      id: 'entityid',
      sourceField: '',
      outputField: 'entityid',
    },

    custentity_gw_gui_address: {
      id: 'custentity_gw_gui_address',
      sourceField: '',
      outputField: 'guiAddress',
    },
    custentity_gw_gui_title: {
      id: 'custentity_gw_gui_title',
      sourceField: '',
      outputField: 'guiTitle',
    },
    custentity_gw_tax_id_number: {
      id: 'custentity_gw_tax_id_number',
      sourceField: '',
      outputField: 'taxId',
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
  return exports
})
