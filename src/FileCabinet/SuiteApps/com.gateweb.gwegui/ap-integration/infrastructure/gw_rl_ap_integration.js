define(['../services/gw_ap_doc_service', 'N/runtime', './gw_vo_response','../library/gw_wrapper_lib'], (
  apDocService,
  runtime,
  RestletResponse,
  gwWrapper
) => {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2022 Gateweb
   * @author Sean Lin <seanlin@gateweb.com.tw>
   *
   * @NApiVersion 2.1
   * @NModuleScope Public

   * @NScriptType RESTlet
   */
  var exports = {}
  const statusEnum = {
    success: 1,
    failed: -1
  }
  const errorCodeEnum = {
    eguiNumberError: 'EGUI_NUM_ERROR'
  }
  let tranResponse = {
    status: statusEnum.success,
    data: {
      transactionId: 0,
      internalId: 0
    },
    errors: [
      {
        errorCode: errorCodeEnum.eguiNumberError,
        errorMessage: 'Egui Number Error'
      }
    ]
  }

  function isSandbox() {
    return true
  }

  /**
   * Event handler for an HTTP GET request
   *
   * @gov XXX
   *
   * @param {Object} params - The parameters from the HTTP request URL.
   *
   * @return {string|Object} Returns a String when request Content-Type is text/plain;
   *      returns an Object when request Content-Type is application/json
   */
  function _get(params) {
    // TODO
    return new RestletResponse().getResponse()
  }

  /**
   * Event handler for an HTTP POST request
   *
   * @gov XXX
   *
   * @param {string|Object} request - The request body as a String when Content-Type is
   *      text/plain; The request body as an Object when request Content-Type is application/json
   *
   * @return {string|Object} Returns a String when request Content-Type is text/plain;
   *      returns an Object when request Content-Type is application/json
   */
  function post(request) {
    // TODO
    const service = new apDocService()
    try {
      const requestObj =
        typeof request === 'string' ? JSON.parse(request) : request // Array Objects
      if(!isValidRequest(requestObj)){
        var errorResponse = new RestletResponse('', '')
        errorResponse.addError({
          errorCode: 'INVALID_REQUEST',
          errorMessage: 'The request is invalid'
        })
        return [errorResponse.getResponse()]
      }
      const results = requestObj.map((requestItem) => {
        const apDocObj = service.convertRestletRequestToApDocObj(requestItem.data)
        let restletResponse = new RestletResponse(apDocObj.transaction, apDocObj.uniqueId)
        restletResponse.setResponse(
          service.validateApDoc(apDocObj, restletResponse).getResponse()
        )
        if (restletResponse.isSuccess()) {
          const apDocRecordObj = service.convertApDocToRecordObj(apDocObj)
          restletResponse.setInternalId(service.insertRecord(apDocRecordObj))
        }
        return restletResponse.getResponse()
      })
      return results
    } catch (e) {
      var errorResponse = new RestletResponse('', '')
      errorResponse.addError({
        errorCode: 'UNEXPECTED_ERROR',
        errorMessage: e.message
      })
      return [errorResponse.getResponse()]
    }

  }
  function isValidRequest(req){
    return req && req.length > 0
  }

  /**
   * Event handler for an HTTP PUT request
   *
   * @gov XXX
   *
   * @param {string|Object} request - The request body as a String when Content-Type is
   *      text/plain; The request body as an Object when request Content-Type is application/json
   *
   * @return {string|Object} Returns a String when request Content-Type is text/plain;
   *      returns an Object when request Content-Type is application/json
   */
  function put(request) {
    // TODO
  }

  /**
   * Event handler for an HTTP DELETE request
   *
   * @gov XXX
   *
   * @param {Object} params - The parameters from the HTTP request URL.
   *
   * @return {string|Object} Returns a String when request Content-Type is text/plain;
   *      returns an Object when request Content-Type is application/json
   */
  function _delete(params) {
    // TODO
  }

  exports.get = _get
  exports.post = gwWrapper.logWrapper(post)
  exports.put = put
  exports.delete = _delete
  return exports
})
