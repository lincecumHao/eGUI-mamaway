define([
  './gw_cs_ap_form_display',
  '../application/gw_service_ap_doc_type_options',
], function (ApDocDisplay, ApDocTypeService) {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2020 Gateweb
   * @author Sean Lin <seanlin816@gmail.com>
   *
   * @NApiVersion 2.0
   * @NModuleScope public

   */
  var exports = {}

  /**
   * pageInit create mode handler
   *
   * @gov XXX
   *
   * @param {Object} context
   * @param {string} context.mode - The access mode of the current record. Will always be "create"
   * @param {CurrentRecord} context.currentRecord - The record in context
   *
   * @return {void}
   * @function uiCreateInit
   */
  function uiCreateInit(context) {
    console.log('uiCreateInit', context)
    ApDocDisplay.setCurrentContext(context)
    ApDocDisplay.resetAllFields()
  }

  /**
   * pageInit edit mode handler
   *
   * @gov XXX
   *
   * @param {Object} context
   * @param {string} context.mode - The access mode of the current record. Will always be "edit"
   * @param {CurrentRecord} context.currentRecord - The record in context
   *
   * @return {void}
   * @function uiEditInit
   */
  function uiEditInit(context) {
    console.log('uiEditInit', context)
    var currentRecord = context.currentRecord
    var docTypeId = currentRecord.getValue({
      fieldId: 'custrecord_gw_ap_doc_type',
    })
    var docTypeCode = ApDocTypeService.getDocTypeCodeByRecordId(docTypeId)
    ApDocDisplay.setCurrentContext(context)
    ApDocDisplay.displayFields(docTypeCode)
  }

  /**
   * pageInit edit mode handler
   *
   * @gov XXX
   *
   * @param {Object} context
   * @param {string} context.mode - The access mode of the current record. Will always be "copy"
   * @param {CurrentRecord} context.currentRecord  The record in context
   * @return {void}
   * @function uiCopyInit
   */
  function uiCopyInit(context) {
    console.log('uiCopyInit', context)
  }

  function setDocTypeMandatory(currentRecord) {
    var objField = currentRecord.getField({
      fieldId: 'custrecord_gw_ap_doc_type',
    })
    objField.isMandatory = true
  }

  exports.uiCreateInit = uiCreateInit
  exports.uiEditInit = uiEditInit
  exports.uiCopyInit = uiCopyInit
  return exports
})
