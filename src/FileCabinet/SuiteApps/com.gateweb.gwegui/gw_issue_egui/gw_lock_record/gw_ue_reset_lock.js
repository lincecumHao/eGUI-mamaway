define([], () => {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2021 Gateweb
   * @author Sean Lin <seanlin816@gmail.com>
   *
   * @NApiVersion 2.1
   * @NModuleScope Public

   * @NScriptType UserEventScript
   */
  var exports = {}

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
    log.debug({ title: 'event type', details: context.type })
    var createdFrom =
      context.newRecord.getValue({
        fieldId: 'createdfrom',
      }) || ''

    if (
      isInCreateMode(context.type) &&
      !isNullOrEmpty(createdFrom) &&
      isRecordLocked(context.newRecord)
    ) {
      log.debug({ title: 'aloha', details: 'aloha' })
      clearLock(context.newRecord)
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
   * @param {context.UserEventType} context.type - The action type that triggered this event
   */
  function beforeSubmit(context) {
    // TODO
  }

  function isRecordLocked(record) {
    var lock_validate_field = 'custbody_gw_lock_transaction'
    var value = record.getValue({
      fieldId: lock_validate_field,
    })
    return value
  }

  function isInCreateMode(mode) {
    return mode === 'create'
  }

  function isNullOrEmpty(input) {
    if (typeof input === 'undefined' || input === null) return true
    return input.replace(/\s/g, '').length < 1
  }

  function clearLock(record) {

    var fieldsArray = [
      'custbody_gw_evidence_issue_status',
      'custbody_gw_gui_apply_period',
      'custbody_gw_gui_date',
      'custbody_gw_gui_format',
      'custbody_gw_gui_sales_amt',
      'custbody_gw_gui_sales_amt_tax_exempt',
      'custbody_gw_gui_sales_amt_tax_zero',
      'custbody_gw_gui_tax_amt',
      'custbody_gw_gui_tax_file_date',
      'custbody_gw_gui_tax_rate',
      'custbody_gw_gui_tax_type',
      'custbody_gw_gui_total_amt'
    ];

    var lock_validate_field = 'custbody_gw_lock_transaction'
    record.setValue({
      fieldId: lock_validate_field,
      value: false,
    })

    fieldsArray.forEach(function (item) {
      record.setValue({
        fieldId: item,
        value: '',
      })
    })
  }

  exports.beforeSubmit = beforeSubmit
  exports.beforeLoad = beforeLoad
  return exports
})
