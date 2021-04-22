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
    // TODO
  }

  /**
   * beforeSubmit event handler; executes prior to any write operation on the record.
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
  }

  /**
   * afterSubmit event handler; executes immediately after a write operation on a record.
   *
   * @gov XXX
   *
   * @param {Object} context
   * @param {Record} context.newRecord - The new record being submitted
   * @param {Record} context.oldRecord - The old record before it was modified
   * @param {UserEventType} context.type - The action type that triggered this event
   */
  function afterSubmit(context) {
    // TODO
  }

  exports.beforeLoad = beforeLoad
  exports.beforeSubmit = beforeSubmit
  exports.afterSubmit = afterSubmit
  return exports
})
