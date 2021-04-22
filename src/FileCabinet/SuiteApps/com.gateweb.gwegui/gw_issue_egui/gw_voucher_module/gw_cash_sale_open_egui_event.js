define(['N/currentRecord', 'N/url'], function (currentRecord, url) {
  /**
   * @NApiVersion 2.1
   * @NScriptType ClientScript
   * @NModuleScope Public
   */
  var exports = {}

  var _current_record = currentRecord.get()

  function pageInit(context) {
    // TODO
  }

  function onButtonClick() {
    var _eguiEditScriptId = 'customscript_gw_cash_sale_egui_ui_edit'
    var _eguiEditDeploymentId = 'customdeploy_gw_cash_sale_egui_ui_edit'

    var _internalId = _current_record.id
    if (_internalId != 0) {
      try {
        var params = {
          select_cash_sale_id: _internalId,
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
