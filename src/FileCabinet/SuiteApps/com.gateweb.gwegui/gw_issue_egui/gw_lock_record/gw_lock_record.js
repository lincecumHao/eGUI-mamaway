/**
 * Module Description...
 *
 * @exports XXX
 *
 * @copyright 2020 Gateweb
 * @author Sean Lin <seanlin816@gmail.com>
 *
 * @NApiVersion 2.0
 * @NModuleScope Public
 */
define([
  'N/record',
  'N/error',
  '../gw_ar_ext_lib/validate',
  'N/record',
], function (record, error, validate, record) {
  var lock_validate_field = 'custbody_gw_lock_transaction'
  var recordTypeMapping = {
    CREDITMEMO: record.Type.CREDIT_MEMO,
    INVOICE: record.Type.INVOICE,
    CUSTOMER_DEPOSIT: record.Type.CUSTOMER_DEPOSIT,
    DEPOSIT_APPLICATION: record.Type.DEPOSIT_APPLICATION,
  }

  function isRecordLocked(record) {
    var value = record.getValue({
      fieldId: lock_validate_field,
    })
    log.debug({ title: 'eGuiNum Value', details: value })
    return value
  }

  function recordLockedError() {
    return error.create({
      name: 'RECORD_LOCKED',
      message: 'Current record is locked because eGUI is issued',
      notifyOff: true,
    })
  }

  function isFieldEmpty(value) {
    return validate.isEmpty(value)
  }

  function toggleRecordLock(recordType, ids, lock) {
    var values = {}
    values[lock_validate_field] = lock
    ids.forEach((id) => {
      record.submitFields({
        type: recordTypeMapping[recordType],
        id: id,
        values: values,
        options: {
          enableSourcing: false,
          ignoreMandatoryFields: true,
        },
      })
    })
  }

  return {
    isRecordLocked: isRecordLocked,
    recordLockedError: recordLockedError,
    toggleRecordLock: toggleRecordLock,
    fieldIdForValidation: lock_validate_field,
  }
})
