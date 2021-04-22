define([
  '../vo/gw_ap_doc_fields',
  '../application/gw_service_ap_doc_type_options',
], function (GwApDocFields, GwApDocTypeOptions) {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2020 Gateweb
   * @author Sean Lin <seanlin816@gmail.com>
   *
   * @NApiVersion 2.0
   * @NModuleScope Public

   */
  var exports = {}
  var recordValidationRoute = {}
  var allDocType = GwApDocTypeOptions.getAllDoctype()

  function isRecordValid(data) {
    var docType = data[GwApDocFields.fields.docType.id]

    var taxType = data[GwApDocFields.fields.taxType.id]
  }

  return exports
})
