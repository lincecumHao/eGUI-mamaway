define(['N/runtime', 'N/record'], (runtime, record) => {
  /**
     * Module Description...
     *
     * @type {Object} module-name
     *
     * @copyright 2021 Gateweb
     * @author Sean Lin <seanlin@gateweb.com.tw>
     *
     * @NApiVersion 2.1
     * @NModuleScope Public

     * @NScriptType ScheduledScript
     */
  var exports = {}

  /**
   * cheduled script trigger point
   *
   * @gov XXX
   *
   * @param {Object} context
   * @param {InvocationType} context.type - Enumeration that holds the string values for scheduled
   *      script execution contexts
   */
  function execute(context) {
    // TODO
    var params = JSON.parse(
      runtime
        .getCurrentScript()
        .getParameter({ name: 'custscript_gw_ss_ut_input' })
    )
    log.debug({ title: 'params', details: params })
    var _id = record.submitFields({
      type: record.Type.INVOICE,
      id: parseInt(params.id),
      values: params.values,
      options: {
        enableSourcing: false,
        ignoreMandatoryFields: true
      }
    })
  }

  exports.execute = execute
  return exports
})
