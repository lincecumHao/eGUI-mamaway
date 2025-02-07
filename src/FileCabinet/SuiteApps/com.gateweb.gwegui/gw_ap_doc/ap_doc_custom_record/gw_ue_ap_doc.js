define([
  'N/runtime',
  'N/error',
  '../vo/gw_ap_doc_fields',
  '../transactionSublist/gw_cs_ap_sublist_display',
  '../transactionSublist/gw_cs_trans_ap_doc_sublist',
  '../application/gw_service_ap_doc_type_options',
], (
  runtime,
  error,
  apDocFields,
  sublistDisplay,
  apDocSublist,
  apDocTypeService
) => {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2020 Gateweb
   * @author Sean Lin <seanlin816@gmail.com>
   *
   * @NApiVersion 2.1
   * @NModuleScope Public

   * @NScriptType UserEventScript
   */
  var exports = {}
  const DO_NOT_ALLOW_VIA_USER_INTERFACE_ERROR_MESSAGE = 'Do not allow to create 進項發票或憑證 via UserInterface, please go back to bill record to enter 進項發票或憑證'

  function isViaUserInterface(context) {
    return (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.COPY)
        && runtime.executionContext === runtime.ContextType.USER_INTERFACE
  }

  /**
   * beforeLoad event handler; executes whenever a read operation occurs on a record, and prior
   * to returning the record or page.
   *
   * @gov XXX
   *
   * @param {Object} context
   * @param {Record} context.newRecord - The new record being loaded
   * @param {UserEventType} context.type - The action type that triggered this event
   * @param {Form} context.form - The current UI form
   */
  function beforeLoad(context) {
    // TODO

    log.debug({
      title: 'beforeLoad',
      details: {
        contextType: context.type,
        runtimeExecutionContext: runtime.executionContext
      }
    })

    if(isViaUserInterface(context)) {
      throw DO_NOT_ALLOW_VIA_USER_INTERFACE_ERROR_MESSAGE
    }
  }

  /**
   * beforeSubmit event handler; executes prior to any write operation on the record.
   *
   * @gov XXX
   *
   * @param {Object} context
   * @param {Record} context.newRecord - The new record being submitted
   * @param {Record} context.oldRecord - The old record before it was modified
   * @param {UserEventType} context.type - The action type that triggered this event
   */
  function beforeSubmit(context) {
    // TODO
    log.debug({ title: 'beforeSubmit', details: context.type })

    if(context.type !== context.UserEventType.CREATE) return

    let errorMessageAry =[]

    if (checkRequiredFields(context, errorMessageAry)) {
      let recordData = getRecordData(context)

      checkFieldsDisplay(context, errorMessageAry)
      validateLine(recordData, context, errorMessageAry)
    }

    if (errorMessageAry.length > 0) {
      let errorMessage = errorMessageAry.join('，')
      log.debug({ title: 'importErrorMessage', details: errorMessage })

      throw errorMessage
    }

    log.debug({ title: 'beforeSubmit_end', details: context })
  }

  /**
   * afterSubmit event handler; executes immediately after a write operation on a record.
   *
   * @gov XXX
   *
   * @param {Object} context
   * @param {Record} context.newRecord - The new record being submitted
   * @param {Record} context.oldRecord - The old record before it was modified
   * @param {UserEventType} context.type - The action type that triggered this event
   */
  function afterSubmit(context) {
    // TODO
    log.debug({ title: 'afterSubmit', details: context.type })
  }

  function checkRequiredFields(context, errorMessageAry) {
    let transactionNo = context.newRecord.getValue({fieldId:'custrecord_gw_apt_doc_tran_id'})
    let docType = apDocTypeService.getDocTypeCodeByRecordId(context.newRecord.getValue({fieldId:'custrecord_gw_ap_doc_type'}))

    if (transactionNo === '') {
      errorMessageAry.push('transactionNo為必填欄位')
    }

    if (docType === '') {
      errorMessageAry.push('憑證格式代碼為必填欄位')
    }

     return (errorMessageAry.length === 0)
  }

  function checkFieldsDisplay(context, errorMessageAry){
    let docType = apDocTypeService.getDocTypeCodeByRecordId(context.newRecord.getValue({fieldId:'custrecord_gw_ap_doc_type'}))

    sublistDisplay.formDisplaySettings[docType]['mandatoryFields'].map(function (field){
      if (context.newRecord.getValue({ fieldId:  field.id}) === '') {
        errorMessageAry.push(field.chtName + '為必填欄位')
      }
    })

    sublistDisplay.formDisplaySettings[docType]['disabledFields'].map(function (field){
      if (context.newRecord.getValue({ fieldId:  field.id}) !== '') {
        errorMessageAry.push(field.chtName + '需為空值')
      }
    })
  }

  function getRecordData(context){
    let recordData = {}

    apDocFields.fieldNames.forEach(function (fieldName) {
      let fieldDefObj = apDocFields.fields[fieldName]
      recordData[fieldDefObj.id] = context.newRecord.getValue({ fieldId: fieldDefObj.id })
    })

    return recordData
  }

  function validateLine(recordData, context, errorMessageAry) {
    Object.keys(recordData).forEach(function(fieldId) {
      let ignoreFields = ['']
      if (ignoreFields.indexOf(fieldId) === -1) {
        let fieldValidationResult = apDocSublist.validateFieldForAPI('', fieldId, recordData)

        if (!fieldValidationResult.isValid) {
          //log.debug({ title: 'fieldValidationResult', details: fieldValidationResult.error })
          errorMessageAry.push(getChtNameByFieldId(fieldId) + ': ' + fieldValidationResult.error[0].chtMessage)
        }
      }
    })
  }

  function getChtNameByFieldId(fieldId) {
    let fields = apDocFields.fields
    let chtName

    for (let key in fields) {
      if (fields[key].id === fieldId) {
        chtName = fields[key].chtName
        break
      }
    }
    return chtName || fieldId
  }

  exports.beforeLoad = beforeLoad
  exports.beforeSubmit = beforeSubmit
  exports.afterSubmit = afterSubmit
  return exports
})
