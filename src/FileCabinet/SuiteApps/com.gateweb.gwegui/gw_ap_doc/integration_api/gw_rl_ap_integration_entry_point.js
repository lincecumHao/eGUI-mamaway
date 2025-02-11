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

    const INTEGRATION_OPTION = {
        1: 'VALIDATION',
        2: 'VALIDATION_AND_CREATE_VOUCHER_RECORD',
        3: 'VALIDATION_AND_CREATE_TRANSACTION_AND_CREATE_VOUCHER_RECORD'
    }

    function isValidRequest(req){
        return req && req.length > 0
    }

    function isNeedToCreateTransaction() {
        let flag = false
        return flag
    }

    function post(request) {
        log.audit({title: 'post - request', details: request})

        try {
            //TODO - get integration setup
            const integrationOption = gwLibApIntegration.getSetupOption()
            if(!integrationOption) {
                var errorResponse = new RestletResponse('', '')
                errorResponse.addError({
                    errorCode: 'INTEGRATION_SETUP_OPTION_MISSING',
                    errorMessage: 'The integration setup option is invalid'
                })
                return [errorResponse.getResponse()]
            }
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

            let validationResponse = null
            let createTransactionResponse = null
            let createAccountPayableVoucherResponse = null
            let returnObject = null

            switch (gwLibApIntegration.integrationOptionMapping[integrationOption]) {
                case 'VALIDATION':
                    log.debug({title: 'in VALIDATION', details: 'start...'})
                    //TODO - validation - call validation Restlet
                    validationResponse = gwLibApIntegration.callApValidation(request)
                    log.debug({title: 'post - validateResult', details: validationResponse})
                    returnObject = gwLibApIntegration.getConsolidatedResultObject(JSON.parse(validationResponse.body), integrationOption)
                    break;
                case 'VALIDATION_AND_CREATE_TRANSACTION_AND_CREATE_VOUCHER_RECORD':
                    log.debug({title: 'in VALIDATION_AND_CREATE_TRANSACTION_AND_CREATE_VOUCHER_RECORD', details: 'start...'})
                    //TODO - validation & create transaction & create voucher record
                    validationResponse = gwLibApIntegration.callApValidation(request)
                    //TODO - call create transaction Restlet
                    createTransactionResponse = gwLibApIntegration.createTransaction(JSON.parse(validationResponse.body))
                    //TODO - call create ap doc record Restlet
                    createAccountPayableVoucherResponse = gwLibApIntegration.createAccountPayableVoucher(JSON.parse(createTransactionResponse.body))
                    returnObject = gwLibApIntegration.getConsolidatedResultObject(createAccountPayableVoucherResponse, integrationOption)
                    break;
                case 'VALIDATION_AND_CREATE_VOUCHER_RECORD':
                    log.debug({title: 'in VALIDATION_AND_CREATE_VOUCHER_RECORD', details: 'start...'})
                    //TODO - validation & create voucher record
                    validationResponse = gwLibApIntegration.callApValidation(request)
                    //TODO - call create ap doc record Restlet
                    createAccountPayableVoucherResponse = gwLibApIntegration.createAccountPayableVoucher(JSON.parse(validationResponse.body))
                    returnObject = gwLibApIntegration.getConsolidatedResultObject(createAccountPayableVoucherResponse, integrationOption)
                    break;
            }

            return JSON.stringify(returnObject)

            // if(INTEGRATION_OPTION[integrationOption] === 'VALIDATION') {
            //     return validationResponse.body
            // } else {
            //     return JSON.stringify(returnObject)
            // }

/**
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
            } else {
                return validateResult.body
            }
**/
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
