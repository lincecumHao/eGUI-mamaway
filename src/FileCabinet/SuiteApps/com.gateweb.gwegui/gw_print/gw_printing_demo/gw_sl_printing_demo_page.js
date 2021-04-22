define(['N/https', 'N/ui/serverWidget'], (https, serverWidget) => {
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
    log.debug({ title: 'onGet' })
    var form = createForm()
    context.response.writePage(form)
  }

  function createForm() {
    var form = serverWidget.createForm({
      title: 'Download PDF Demo',
    })
    form.clientScriptModulePath = './gw_cs_sl_printing_demo_buttons.js'
    createButton(form)
    return form
  }

  function createButton(form) {
    form.addButton({
      id: '_download_pdf_btn',
      label: 'Download PDF',
      functionName: 'downloadPdfClicked',
    })
    form.addButton({
      id: '_print_btn',
      label: 'Print',
      functionName: 'printToPrinterClicked',
    })
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
  }

  exports.onRequest = onRequest
  return exports
})
