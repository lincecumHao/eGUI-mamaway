define(['N/https', './gw_authentication_service'], (https, GwAuthService) => {
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
    context.response.write('get aloha')
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
      title: 'onPost request params',
      details: context.request.parameters,
    })
    log.debug({ title: 'onPost request body', details: context.request.body })
    var body = JSON.parse(context.request.body)
    var companyId = body.payload.companyId
    var taxId = body.payload.gui
    var subsidiary = body.payload.subsidiary
    log.debug({
      title: 'onPost body json',
      details: body,
    })
    var result = GwAuthService.decryptData(
      body.payload.encryptedText,
      body.payload.encryptedIv,
      taxId
    )
    log.debug({ title: 'onPost decrypt result', details: result })
    var responseObj = {
      success: true,
      content: JSON.parse(result),
      error: {
        code: '',
        message: '',
      },
    }
    context.response.write(JSON.stringify(responseObj))
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
    var responseObj = {
      success: false,
      content: '',
      error: {
        code: params.error.code,
        message: params.error.message,
      },
    }
    log.debug({ title: 'Error Occurs', details: params.error })
    params.context.response.write(JSON.stringify(responseObj))
  }

  exports.onRequest = onRequest
  return exports
})
