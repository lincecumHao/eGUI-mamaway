define(['../../gw_auth/gw_authentication_service', 'N/url'], (
  GwAuthService,
  url
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

  /**
   * beforeSubmit event haler; executes prior to any write operation on the record.
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
    if (context.type === context.UserEventType.CREATE) {
      var agentName = context.newRecord.getValue({ fieldId: 'name' })
      log.debug({ title: 'before submit agentName', details: agentName })
      var agentKey = GwAuthService.hash256(agentName)
      log.debug({ title: 'before submit agentKey', details: agentKey })
      var configObj = generateConfigContent(agentKey)
      context.newRecord.setValue({
        fieldId: 'custrecord_printer_agent_key',
        value: agentKey,
      })
      context.newRecord.setValue({
        fieldId: 'custrecord_gw_printer_agent_config',
        value: JSON.stringify(configObj),
      })
    } else {
      log.debug({ title: 'before submit event type', details: context.type })
    }
  }

  function generateConfigContent(agentKey) {
    var output = {
      url: '',
      payload: {
        companyId: 0,
        subsidiary: 0,
        gui: '',
        encryptedText: '',
        encryptedIv: '',
      },
    }
    var content = {
      printerKey: agentKey,
    }
    var companySettings = GwAuthService.getDefaultInfo()
    var decryptUrl = url.resolveScript({
      scriptId: 'customscript_gw_sl_decrypt_payload',
      deploymentId: 'customdeploy_gw_sl_decrypt_payload',
      returnExternalUrl: true,
    })

    var encryptAgentKey = GwAuthService.encryptData(JSON.stringify(content))
    output.url = decryptUrl
    output.payload.companyId = companySettings.nsAccountId
    output.payload.encryptedText = encryptAgentKey.ciphertext
    output.payload.encryptedIv = encryptAgentKey.iv
    output.payload.gui = companySettings.gui
    output.payload.subsidiary = companySettings.subsidiary
    return output
  }

  exports.beforeSubmit = beforeSubmit
  return exports
})
