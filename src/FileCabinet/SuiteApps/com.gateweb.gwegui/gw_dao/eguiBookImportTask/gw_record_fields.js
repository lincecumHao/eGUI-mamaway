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
  var recordId = 'customrecord_gw_gb_import_task'
  var sublists = {
    eguiBook: 'recmachcustrecord_gw_gb_import_task',
  }

  var fieldConfig = {
    custrecord_gw_gbi_tax_id: {
      id: 'custrecord_gw_gbi_tax_id',
      sourceField: 'taxId',
      outputField: 'taxId',
    },
    custrecord_gw_gbi_track: {
      id: 'custrecord_gw_gbi_track',
      sourceField: 'track',
      outputField: 'track',
    },
    custrecord_gw_gbi_start_num: {
      id: 'custrecord_gw_gbi_start_num',
      sourceField: 'startNum',
      outputField: 'startNum',
    },
    custrecord_gw_gbi_end_num: {
      id: 'custrecord_gw_gbi_end_num',
      sourceField: 'endNum',
      outputField: 'endNum',
    },
    custrecord_gw_gbi_tax_period: {
      id: 'custrecord_gw_gbi_tax_period',
      sourceField: 'taxPeriod',
      outputField: 'taxPeriod',
    },
    custrecord_gw_gbi_total_egui_count: {
      id: 'custrecord_gw_gbi_total_egui_count',
      sourceField: 'totalCount',
      outputField: 'totalCount',
    },
    custrecord_gw_gbi_egui_count_per_book: {
      id: 'custrecord_gw_gbi_egui_count_per_book',
      sourceField: 'guiCountPerBook',
      outputField: 'guiCountPerBook',
    },
    custrecord_gw_gbi_book_egui_type: {
      id: 'custrecord_gw_gbi_book_egui_type',
      sourceField: 'bookGuiType',
      outputField: 'bookGuiType',
    },
    // custrecord_gw_gbi_type: {
    //   id: 'custrecord_gw_gbi_type',
    //   sourceField: 'importType',
    //   outputField: 'importType',
    // },
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
  exports.sublists = sublists
  exports.recordId = recordId
  return exports
})
