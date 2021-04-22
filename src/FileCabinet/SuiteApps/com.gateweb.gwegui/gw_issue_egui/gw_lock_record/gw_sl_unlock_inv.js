define(['N/https', 'N/ui/serverWidget', 'N/url', 'N/runtime', 'N/record'], (
  https,
  serverWidget,
  url,
  runtime,
  record
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

   * @NScriptType Suitelet
   */
  var exports = {}

  /**
   * onRequest event handler
   *
   * @gov XXX
   *
   * @param {Object} context
   * @param {ServerRequest} context.request - The incoming request object
   * @param {ServerResponse} context.response - The outgoing response object
   */
  function onRequest(context) {
    log.audit({ title: `${context.request.method} request received` })

    const eventRouter = {
      [https.Method.GET]: onGet,
      [https.Method.POST]: onPost,
    }

    try {
      eventRouter[context.request.method](context)
    } catch (e) {
      onError({ context: context, error: e })
    }

    log.audit({ title: 'Request complete.' })
  }

  /**
   * Event handler for HTTP GET request
   *
   * @gov XXX
   *
   * @param {Object} context
   * @param {ServerRequest} context.request - The incoming request object
   * @param {ServerResponse} context.response - The outgoing response object
   */
  function onGet(context) {
    // TODO
    var invForm = serverWidget.createForm({ title: 'Unlock Invoices' })
    invForm.addField({
      id: 'inv_ids',
      label: 'Invoice',
      type: serverWidget.FieldType.MULTISELECT,
      source: 'invoice',
    })
    invForm.addSubmitButton({ label: 'Submit' })

    context.response.writePage(invForm)
  }

  /**
   * Event handler for HTTP POST request
   *
   * @gov XXX
   *
   * @param {Object} context
   * @param {ServerRequest} context.request - The incoming request object
   * @param {ServerResponse} context.response - The outgoing response object
   */
  function onPost(context) {
    // TODO
    log.debug({
      title: 'onPost parameters',
      details: context.request.parameters,
    })
    var invoiceIds = context.request.parameters['inv_ids'].split('\u0005')
    log.debug({ title: 'onPost invoiceIds', details: invoiceIds })
    toggleLockRecord(invoiceIds)
    var scriptUrl = url.resolveScript({
      scriptId: runtime.getCurrentScript().id,
      deploymentId: runtime.getCurrentScript().deploymentId,
    })
    log.debug({ title: 'scriptUrl', details: scriptUrl })
    var invForm = serverWidget.createForm({ title: 'Unlock Successful' })
    var linkField = (invForm
      .addField({
        id: 'home_line',
        type: serverWidget.FieldType.INLINEHTML,
        label: 'Back to previous page',
      })
      .updateLayoutType({
        layoutType: serverWidget.FieldLayoutType.OUTSIDEBELOW,
      })
      .updateBreakType({
        breakType: serverWidget.FieldBreakType.STARTROW,
      }).defaultValue =
      "<a href='" +
      scriptUrl +
      "' style='font-size: 16px'> Back to previous page</a>")
    context.response.writePage(invForm)
  }

  function toggleLockRecord(invoiceIds) {
    invoiceIds.forEach(function (invId) {
      log.debug({ title: 'invId', details: invId })
      record.submitFields({
        type: record.Type.INVOICE,
        id: invId,
        values: {
          custbody_gw_lock_transaction: false,
        },
      })
    })
  }

  /**
   * Error handler for Suitelet
   *
   * @gov XXX
   *
   * @param {Object} params
   * @param {Error} params.error - The error which triggered this handler
   * @param {Object} params.context
   * @param {ServerRequest} params.context.request - The incoming request object
   * @param {ServerResponse} params.context.response - The outgoing response object
   */
  function onError(params) {
    // TODO
    log.debug({ title: 'Error Occurs', details: params.error })
    var scriptUrl = url.resolveScript({
      scriptId: runtime.getCurrentScript().id,
      deploymentId: runtime.getCurrentScript().deploymentId,
    })
    log.debug({ title: 'scriptUrl', details: scriptUrl })
    var invForm = serverWidget.createForm({ title: 'Unlock Invoices Failed' })
    var messageField = invForm.addField({
      id: 'error_message',
      type: serverWidget.FieldType.LABEL,
      label: params.error.message,
    })

    var linkField = (invForm
      .addField({
        id: 'home_line',
        type: serverWidget.FieldType.INLINEHTML,
        label: 'Back to previous page',
      })
      .updateLayoutType({
        layoutType: serverWidget.FieldLayoutType.OUTSIDEBELOW,
      })
      .updateBreakType({
        breakType: serverWidget.FieldBreakType.STARTROW,
      }).defaultValue =
      "<a href='" +
      scriptUrl +
      "' style='font-size: 16px'> Back to previous page</a>")

    params.context.response.writePage(invForm)
  }

  exports.onRequest = onRequest
  return exports
})
