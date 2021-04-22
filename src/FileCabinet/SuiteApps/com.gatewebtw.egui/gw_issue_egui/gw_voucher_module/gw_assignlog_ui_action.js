/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope Public
 */
define(['N/record', 'N/search', 'N/redirect'], function (
  record,
  search,
  redirect
) {
  //之後設成Script的Parameters
  var _assignLogEditScriptId = 'customscript_gw_assignlog_ui_edit'
  var _assignLogEditDeploymentId = 'customdeploy_gw_assignlog_ui_edit'
  var _assignLogRecordId = 'customrecord_gw_assignlog_poc_001'

  function onRequest(context) {
    var _taskType =
      context.request.parameters.custpage_assignlog_hiddent_buttontype

    var _businessNo = context.request.parameters.custpage_businessno
    var _yearMonth = context.request.parameters.custpage_year_month
    var _selectStatus = context.request.parameters.custpage_status
    var _selectDeptCode = context.request.parameters.custpage_select_deptcode
    var _selectClassification =
      context.request.parameters.custpage_select_classification
    var _assignlog_hiddent_listId =
      context.request.parameters.custpage_assignlog_hiddent_listid
    var _assignlog_reason = context.request.parameters.custpage_assignlog_reason

    var _arrayObject = []
    if (
      _taskType === 'save' &&
      typeof _assignlog_hiddent_listId !== 'undefined'
    ) {
      //取得部門及類別名稱
      var _selectDeptName = ''
      if (_selectDeptCode != '') {
        var _record = record.load({
          type: record.Type.DEPARTMENT,
          id: _selectDeptCode,
          isDynamic: true,
        })
        _selectDeptName = _record.getValue({
          fieldId: 'name',
        })
      }
      //類別名稱
      var _selectClassName = ''
      if (_selectClassification != '') {
        var _record = record.load({
          type: record.Type.CLASSIFICATION,
          id: _selectClassification,
          isDynamic: true,
        })
        _selectClassName = _record.getValue({
          fieldId: 'name',
        })
      }

      //save to db
      var _idAry = _assignlog_hiddent_listId.split(',')
      for (var i = 0; i < _idAry.length; i++) {
        var _internalId = _idAry[i]

        if (parseInt(_internalId) > 0) {
          //save record
          var objRecord = record.load({
            type: _assignLogRecordId,
            id: parseInt(_internalId),
            isDynamic: true,
          })
          //狀態
          if (_selectStatus != '') {
            objRecord.setValue({
              fieldId: 'custrecord_gw_assignlog_status',
              value: _selectStatus,
            })
          }
          //部門
          objRecord.setValue({
            fieldId: 'custrecord_gw_assignlog_deptcode',
            value: _selectDeptCode,
          })
          objRecord.setValue({
            fieldId: 'custrecord_gw_assignlog_deptname',
            value: _selectDeptName,
          })
          //類別
          objRecord.setValue({
            fieldId: 'custrecord_gw_assignlog_classification',
            value: _selectClassification,
          })
          objRecord.setValue({
            fieldId: 'custrecord_gw_assignlog_class_name',
            value: _selectClassName,
          })
          //作廢理由
          objRecord.setValue({
            fieldId: 'custrecord_gw_assignlog_reason',
            value: _assignlog_reason,
          })

          try {
            var callId = objRecord.save()
            log.debug('Save assignLogObj record successfully', 'Id: ' + callId)
          } catch (e) {
            log.error({
              title: e.name,
              details: e.message,
            })
          }
        }
      }
    }

    var _arrParams = {
      custpage_assignlog_hiddent_buttontype: _taskType,
      custpage_businessno: _businessNo,
      custpage_year_month: _yearMonth,
      custpage_status: _selectStatus,
      custpage_select_deptcode: _selectDeptCode,
      custpage_select_classification: _selectClassification,
      custpage_assignlog_hiddent_listid: _assignlog_hiddent_listId,
      custpage_assignlog_reason: _assignlog_reason,
    }

    redirect.toSuitelet({
      scriptId: _assignLogEditScriptId,
      deploymentId: _assignLogEditDeploymentId,
      parameters: _arrParams,
    })
  } //End onRequest

  return {
    onRequest: onRequest,
  }
})
