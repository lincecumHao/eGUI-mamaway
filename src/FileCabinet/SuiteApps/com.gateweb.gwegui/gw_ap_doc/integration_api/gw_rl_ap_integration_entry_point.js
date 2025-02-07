/**
 *
 * @copyright 2025 GateWeb
 * @author Chesley Lo <chesleylo@gateweb.com.tw>
 *
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define([
    './gw_lib_ap_integration',
    '../../ap-integration/infrastructure/gw_vo_response'
], (
    gwLibApIntegration,
    RestletResponse,
) => {

    let exports = {};

    function isValidRequest(req){
        return req && req.length > 0
    }

    function isNeedToCreateTransaction() {
        let flag = true
        return flag
    }

    function post(request) {
        log.audit({title: 'post - request', details: request})

        try {
            //TODO - validate request params
            const requestObj = typeof request === 'string' ? JSON.parse(request) : request // Array Objects
            if(!isValidRequest(requestObj)){
                var errorResponse = new RestletResponse('', '')
                errorResponse.addError({
                    errorCode: 'INVALID_REQUEST',
                    errorMessage: 'The request is invalid'
                })
                return [errorResponse.getResponse()]
            }

            //TODO - call validation Restlet
            const validateResult = gwLibApIntegration.callApValidation(request)
            log.debug({title: 'post - validateResult', details: validateResult})
            // return validateResult.body
            //TODO - call create transaction Restlet
            if(isNeedToCreateTransaction()) {
                const response = gwLibApIntegration.createTransaction(JSON.parse(validateResult.body))
                //TODO - call create ap doc record Restlet
                const createAccountPayableVoucherResult = gwLibApIntegration.createAccountPayableVoucher(JSON.parse(response.body))
                const consolidateResultObject = gwLibApIntegration.getConsolidatedResultObject(createAccountPayableVoucherResult)
                // return response.body
                return JSON.stringify(consolidateResultObject)
            }


        } catch (e) {
            log.error({
                title: 'post error',
                details: e
            })
        }
    }

    exports.post = post
    return exports
});
