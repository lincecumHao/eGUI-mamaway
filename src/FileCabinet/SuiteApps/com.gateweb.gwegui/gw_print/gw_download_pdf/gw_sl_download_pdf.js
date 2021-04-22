define(['N/https', '../../gw_library/gw_api/gw_api', 'N/runtime'], (
  https,
  GwApi
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
    log.audit({ title: 'OnPost request' })
    var requestBody = context.request.body
    log.debug({ title: 'OnPost request body', details: requestBody })
    log.debug({
      title: 'OnPost request body type',
      details: typeof requestBody,
    })
    if (requestBody) {
      var xmlFileObj = JSON.parse(requestBody)
      var pdfFileResponse = GwApi.downloadEGuiPdf(xmlFileObj)
      context.response.write({ output: pdfFileResponse.body })
    }
    log.audit({ title: 'OnPost request finished' })
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
  }

  exports.onRequest = onRequest
  return exports
})
