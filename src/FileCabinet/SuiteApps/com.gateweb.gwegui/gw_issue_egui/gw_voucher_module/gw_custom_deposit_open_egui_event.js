define(['N/currentRecord', 'N/url'], function (currentRecord, url) {
  /**
   * @NApiVersion 2.0
   * @NScriptType ClientScript
   * @NModuleScope Public
   */
  var exports = {}

  var _current_record = currentRecord.get()

  function pageInit(context) {
    // TODO
  }

  function onButtonClick() {
    var _eguiEditScriptId = 'customscript_gw_deposit_egui_ui_edit'
    var _eguiEditDeploymentId = 'customdeploy_gw_deposit_egui_ui_edit'

    var _internalId = _current_record.id
    if (_internalId != 0) {
      try {
        //undepfunds
        var _sales_order = _current_record.getValue({
          fieldId: 'salesorder',
        })

        var params = {
          select_customer_deposit_id: _internalId,
          select_sales_order: _sales_order,
        }
        window.location = url.resolveScript({
          scriptId: _eguiEditScriptId,
          deploymentId: _eguiEditDeploymentId,
          params: params,
          returnExternalUrl: false,
        })
      } catch (e) {
        console.log(e.name + ':' + e.message)
      }
    }
  }

  exports.onButtonClick = onButtonClick
  exports.pageInit = pageInit

  return exports
})
