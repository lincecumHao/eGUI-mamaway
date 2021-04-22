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
  var recordId = 'customrecord_gw_gui_book'
  var fieldConfig = {
    name: {
      id: 'name',
      sourceField: 'name',
      targetField: 'name',
    },
    custrecord_gw_gb_company_tax_id: {
      id: 'custrecord_gw_gb_company_tax_id',
      sourceField: 'businessTaxId',
      targetField: 'taxId',
    },
    custrecord_gw_gb_subsidiary: {
      id: 'custrecord_gw_gb_subsidiary',
      sourceField: 'subsidiary',
      targetField: 'subsidiary',
    },
    custrecord_gw_gb_location: {
      id: 'custrecord_gw_gb_location',
      sourceField: 'location',
      targetField: 'location',
    },
    custrecord_gw_gb_department: {
      id: 'custrecord_gw_gb_department',
      sourceField: 'department',
      targetField: 'department',
    },
    custrecord_gw_gb_classification: {
      id: 'custrecord_gw_gb_classification',
      sourceField: 'classification',
      targetField: 'classification',
    },
    custrecord_gw_gb_gui_type: {
      id: 'custrecord_gw_gb_gui_type',
      sourceField: 'guiType',
      targetField: 'guiType',
    },
    custrecord_gw_gb_track: {
      id: 'custrecord_gw_gb_track',
      sourceField: 'bookTrack',
      targetField: 'track',
    },
    custrecord_gw_gb_start_num: {
      id: 'custrecord_gw_gb_start_num',
      sourceField: 'bookStartNum',
      targetField: 'guiStartNum',
    },
    custrecord_gw_gb_end_num: {
      id: 'bookEndNum',
      sourceField: 'endNumStr',
      targetField: 'guiEndNum',
    },
    custrecord_gw_gb_period: {
      id: 'custrecord_gw_gb_period',
      sourceField: 'bookTaxPeriod',
      targetField: 'taxPeriod',
    },
    custrecord_gw_gb_book_type: {
      id: 'custrecord_gw_gb_book_type',
      sourceField: 'type',
      targetField: 'type',
    },
    custrecord_gw_gb_book_status: {
      id: 'custrecord_gw_gb_book_status',
      sourceField: 'bookStatus',
      targetField: 'status',
    },
    custrecord_gw_gb_picked_time: {
      id: 'custrecord_gw_gb_picked_time',
      sourceField: '',
      targetField: 'pickedTime',
    },
    custrecord_gw_gb_last_gui_number: {
      id: 'custrecord_gw_gb_last_gui_number',
      sourceField: '',
      targetField: 'lastGuiNumber',
    },
    custrecord_gw_gb_last_gui_date: {
      id: 'custrecord_gw_gb_last_gui_date',
      sourceField: '',
      targetField: 'lastGuiDate',
    },
    custrecord_gw_gb_reason: {
      id: 'custrecord_gw_gb_reason',
      sourceField: '',
      targetField: 'reason',
    },
    custrecord_gw_gb_used_count: {
      id: 'custrecord_gw_gb_used_count',
      sourceField: 'usedCount',
      targetField: 'eguiUsedCount',
    },
    custrecord_gw_gb_egui_format: {
      id: 'custrecord_gw_gb_egui_format',
      sourceField: 'guiFormat',
      targetField: 'eguiFormat',
    },
    custrecord_gw_gb_gui_count: {
      id: 'custrecord_gw_gb_gui_count',
      sourceField: 'guiCount',
      targetField: 'guiCount',
    },
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

  var fieldIdMapping = ramda.map(function (fieldObj) {
    return fieldObj.id
  }, fieldConfig)

  exports.recordId = recordId
  exports.fields = fieldConfig
  exports.fieldIds = fieldIdMapping
  exports.allFieldIds = Object.keys(fieldConfig).map(function (key) {
    return key
  })
  exports.fieldOutputMapping = fieldOutputMapping
  exports.fieldInputMapping = fieldInputMapping
  return exports
})
