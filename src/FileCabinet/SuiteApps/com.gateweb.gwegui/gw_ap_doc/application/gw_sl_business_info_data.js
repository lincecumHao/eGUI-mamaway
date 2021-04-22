define(['N/https', 'N/config'], (https, config) => {
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
    var subsidiary = context.request.parameters['subsidiary']
    var buyerInfo = getBuyer(subsidiary)
    context.response.write({ output: JSON.stringify(buyerInfo) })
  }

  function getBuyer(subsidiary) {
    if (!subsidiary) {
      subsidiary = 1
    }
    var buyerFromNS = getBuyerFromNs()
    var buyerFromBuInfo = getBuyerFromBuInfo(subsidiary)
    if (buyerFromBuInfo && buyerFromBuInfo.buyerTaxId) {
      return buyerFromBuInfo
    }
    return buyerFromNS
  }

  function getBuyerFromBuInfo(subsidiary) {
    return {
      buyerTaxId: '',
      buyerName: '',
    }
  }

  function getBuyerFromNs() {
    var companyInfo = config.load({
      type: config.Type.COMPANY_INFORMATION,
    })
    var legalName = companyInfo.getValue({
      fieldId: 'legalname',
    })
    var taxId = companyInfo.getValue({
      fieldId: 'employerid',
    })
    return {
      buyerTaxId: taxId,
      buyerName: legalName,
    }
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
