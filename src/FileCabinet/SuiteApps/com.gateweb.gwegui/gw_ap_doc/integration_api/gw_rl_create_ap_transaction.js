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
            request.forEach(function (eachTransactionObj) {
                log.debug({title: 'post - eachTransactionObj', details: eachTransactionObj})
                if(eachTransactionObj.isValid) {
                    // TODO - create ap transaction
                    gwLibApIntegration.createAccountPayableTransaction(eachTransactionObj)
                }
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
