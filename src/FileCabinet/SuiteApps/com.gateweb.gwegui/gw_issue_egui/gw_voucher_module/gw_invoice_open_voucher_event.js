define(['N/currentRecord', 'N/url'], function (currentRecord, url) {
  /**
   * @NApiVersion 2.0
   * @NScriptType ClientScript
   * @NModuleScope Public
   */
  var exports = {}

  var _eguiEditScriptId = 'customscript_gw_invoice_ui_edit'
  var _eguiEditDeploymentId = 'customdeploy_gw_invoice_ui_e'

  var _current_record = currentRecord.get()

  function pageInit(context) {
    // TODO
  }

  function onButtonClickForEGUI() {
    var _internalId = _current_record.id
    if (_internalId != 0) {
      try {
        var _invoice_hiddent_listid = '-1,' + _internalId
        var _creditmemo_hiddent_listid = ''
        var _params = {
          invoice_hiddent_listid: _invoice_hiddent_listid,
          creditmemo_hiddent_listid: _creditmemo_hiddent_listid,
        }

        window.location = url.resolveScript({
          scriptId: _eguiEditScriptId,
          deploymentId: _eguiEditDeploymentId,
          params: _params,
          returnExternalUrl: false,
        })
      } catch (e) {
        console.log(e.name + ':' + e.message)
      }
    }
  }

  function onButtonClickForAllowance() {
    var _internalId = _current_record.id
    if (_internalId != 0) {
      try {
        var _invoice_hiddent_listid = ''
        var _creditmemo_hiddent_listid = '-1,' + _internalId
        var _params = {
          invoice_hiddent_listid: _invoice_hiddent_listid,
          creditmemo_hiddent_listid: _creditmemo_hiddent_listid,
        }

        window.location = url.resolveScript({
          scriptId: _eguiEditScriptId,
          deploymentId: _eguiEditDeploymentId,
          params: _params,
          returnExternalUrl: false,
        })
      } catch (e) {
        console.log(e.name + ':' + e.message)
      }
    }
  }

  exports.onButtonClickForEGUI = onButtonClickForEGUI
  exports.onButtonClickForAllowance = onButtonClickForAllowance
  exports.pageInit = pageInit

  return exports
})
