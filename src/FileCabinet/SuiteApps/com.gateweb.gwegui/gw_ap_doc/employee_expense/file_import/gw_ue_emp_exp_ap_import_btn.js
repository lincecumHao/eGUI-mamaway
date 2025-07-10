define([], () => {
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
    // if (context.type === context.UserEventType.VIEW) addApImportBtn(context)
  }

  /**
   * @param {Object} context
   * @param {Record} context.newRecord - The new record being loaded
   * @param {UserEventType} context.type - The action type that triggered this event
   * @param {Form} context.form - The current UI form
   */
  function addApImportBtn(context) {
    log.debug({
      title: 'add ap import btn context record type',
      details: context.newRecord.type
    })
    var form = context.form
    form.clientScriptModulePath = './gw_cs_emp_exp_ap_import_btn.js'
    form.addButton({
      id: 'custpage_ap_import_btn',
      label: '批次匯入進項憑證',
      functionName:
        "apDocImportBtnClicked('" +
        context.newRecord.type +
        "'," +
        context.newRecord.id +
        ')'
    })
  }

  exports.beforeLoad = beforeLoad
  return exports
})
