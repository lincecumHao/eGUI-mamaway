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
  var recordId = 'customrecord_gw_assignlog'
  var assignLogStatus = {
    11: '一般字軌-未使用',
    12: '一般字軌-使用中',
    13: '一般字軌-已使用完畢',
    14: '一般字軌-作廢',
    21: '手開(不上傳)字軌-未使用',
    22: '手開(不上傳)字軌-使用中',
    23: '手開(不上傳)字軌-已使用完畢',
    24: '手開(不上傳)字軌-作廢',
    31: '手開發票字軌-未使用',
    32: '手開發票字軌-使用中',
    33: '手開發票字軌-已使用完畢',
    34: '手開發票字軌-作廢'
  }
  var fieldConfig = {
    name: {
      id: 'name',
      sourceField: '',
      outputField: 'name'
    },
    custrecord_gw_assignlog_businessno: {
      id: 'custrecord_gw_assignlog_businessno',
      sourceField: '',
      outputField: 'taxId'
    },
    custrecord_gw_assignlog_deptcode: {
      id: 'custrecord_gw_assignlog_deptcode',
      sourceField: '',
      outputField: 'departmentId'
    },
    custrecord_gw_assignlog_deptname: {
      id: 'custrecord_gw_assignlog_deptname',
      sourceField: '',
      outputField: 'departmentText'
    },
    custrecord_gw_assignlog_invoicetype: {
      id: 'custrecord_gw_assignlog_invoicetype',
      sourceField: '',
      outputField: 'guiType'
    },
    custrecord_gw_assignlog_invoicetrack: {
      id: 'custrecord_gw_assignlog_invoicetrack',
      sourceField: '',
      outputField: 'track'
    },
    custrecord_gw_assignlog_startno: {
      id: 'custrecord_gw_assignlog_startno',
      sourceField: '',
      outputField: 'startNum'
    },
    custrecord_gw_assignlog_endno: {
      id: 'custrecord_gw_assignlog_endno',
      sourceField: '',
      outputField: 'endNum'
    },
    custrecord_gw_assignlog_yearmonth: {
      id: 'custrecord_gw_assignlog_yearmonth',
      sourceField: '',
      outputField: 'yearMonth'
    },
    custrecord_gw_assignlog_status: {
      id: 'custrecord_gw_assignlog_status',
      sourceField: '',
      outputField: 'statusId'
    },
    custrecord_gw_assignlog_taketime: {
      id: 'custrecord_gw_assignlog_taketime',
      sourceField: '',
      outputField: 'takeTime'
    },
    custrecord_gw_assignlog_lastinvnumbe: {
      id: 'custrecord_gw_assignlog_lastinvnumbe',
      sourceField: '',
      outputField: 'lastInvoiceNumber'
    },
    custrecord_gw_last_invoice_date: {
      id: 'custrecord_gw_last_invoice_date',
      sourceField: '',
      outputField: 'lastInvDate'
    },
    custrecord_gw_assignlog_reason: {
      id: 'custrecord_gw_assignlog_reason',
      sourceField: '',
      outputField: 'cancelReason'
    },
    custrecord_gw_assignlog_usedcount: {
      id: 'custrecord_gw_assignlog_usedcount',
      sourceField: '',
      outputField: 'usedCount'
    },
    custrecord_gw_assignlog_classification: {
      id: 'custrecord_gw_assignlog_classification',
      sourceField: '',
      outputField: 'classId'
    },
    custrecord_gw_assignlog_class_name: {
      id: 'custrecord_gw_assignlog_class_name',
      sourceField: '',
      outputField: 'classText'
    },
    custrecord_gw_egui_format_code: {
      id: 'custrecord_gw_egui_format_code',
      sourceField: '',
      outputField: 'eguiFormatValue'
    },
    custrecord_gw_egui_format_name: {
      id: 'custrecord_gw_egui_format_name',
      sourceField: '',
      outputField: 'eguiFormatText'
    },
    custrecord_gw_book_binding_count: {
      id: 'custrecord_gw_book_binding_count',
      sourceField: '',
      outputField: 'guiCountInBook'
    },
    custrecord_gw_assignlog_peroid: {
      id: 'custrecord_gw_assignlog_peroid',
      sourceField: '',
      outputField: 'guiPeriod'
    }
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
  exports.recordId = recordId
  exports.assignLogStatus = assignLogStatus
  exports.assignLogStatusTextToId = ramda.invertObj(assignLogStatus)
  return exports
})
