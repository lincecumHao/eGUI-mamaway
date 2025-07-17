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
], (
    gwLibApIntegration,
) => {

    let exports = {};

    function post(request) {
        log.audit({title: 'post - request', details: request})

        try {
            request = request.map(function (eachTransactionObj) {
                log.debug({title: 'post - eachTransactionObj', details: eachTransactionObj})
                if(eachTransactionObj.isValid ||
                    (eachTransactionObj.action && eachTransactionObj.action === 'createTransaction')) {
                    // TODO - create ap transaction
                    const response = gwLibApIntegration.createAccountPayableTransaction(eachTransactionObj)
                    return Object.assign(eachTransactionObj, response);
                }
                return eachTransactionObj;
            })
        } catch (e) {
            log.error({
                title: 'post error',
                details: e
            })
        }
        return request
    }

    exports.post = post
    return exports
});
