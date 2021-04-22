define([], function () {
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
  var fields = {
    custrecord_gw_gbi_tax_id: {
      id: 'custrecord_gw_gbi_tax_id',
      sourceField: 'taxId',
    },
    custrecord_gw_gbi_track: {
      id: 'custrecord_gw_gbi_track',
      sourceField: 'track',
    },
    custrecord_gw_gbi_start_num: {
      id: 'custrecord_gw_gbi_start_num',
      sourceField: 'startNum',
    },
    custrecord_gw_gbi_end_num: {
      id: 'custrecord_gw_gbi_end_num',
      sourceField: 'endNum',
    },
    custrecord_gw_gbi_tax_period: {
      id: 'custrecord_gw_gbi_tax_period',
      sourceField: 'taxPeriod',
    },
    custrecord_gw_gbi_total_egui_count: {
      id: 'custrecord_gw_gbi_total_egui_count',
      sourceField: 'totalCount',
    },
    custrecord_gw_gbi_egui_count_per_book: {
      id: 'custrecord_gw_gbi_egui_count_per_book',
      sourceField: 'guiCountPerBook',
    },
    custrecord_gw_gbi_egui_book_type: {
      id: 'custrecord_gw_gbi_egui_book_type',
      sourceField: 'guiCountPerBook',
    },
  }
  var sublists = {
    eguiBook: 'recmachcustrecord_gw_gb_import_task',
  }

  exports.fields = fields
  exports.sublists = sublists
  exports.recordId = recordId
  return exports
})
