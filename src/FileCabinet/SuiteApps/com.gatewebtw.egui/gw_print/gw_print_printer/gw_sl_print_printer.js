define([
  'N/https',
  'N/runtime',
  'N/search',
  '../gw_printer/gw_printer_settings_repo',
  '../../gw_library/gw_api/gw_api',
], (https, runtime, search, GwPrinterRepo, GwApi) => {
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
    // TODO
    log.debug({ title: 'onPost context body', details: context.request.body })
    log.debug({
      title: 'onPost context body type',
      details: typeof context.request.body,
    })
    var requestBodyObject = JSON.parse(context.request.body)
    log.debug({
      title: 'onPost context body object',
      details: requestBodyObject,
    })
    var employeeId = runtime.getCurrentUser().id
    var employee = search.lookupFields({
      type: search.Type.EMPLOYEE,
      id: employeeId,
      columns: ['custentity_gw_emp_printer'],
    })
    log.debug({ title: 'get employee fields', details: employee })
    var printerSettingField = employee.custentity_gw_emp_printer[0]
    var printerSettingId = printerSettingField ? printerSettingField.value : 0
    log.debug({ title: 'printerSettingId', details: printerSettingId })
    // TODO: Error handling if not printer id
    var printer = GwPrinterRepo.getPrinterById(printerSettingId)[0]
    log.debug({ title: 'printer', details: printer })
    GwApi.printEGui(requestBodyObject, printer)
    context.response.write('aloha')
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
