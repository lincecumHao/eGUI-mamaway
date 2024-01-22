/**
 *
 * @copyright 2024 Gateweb
 * @author Chesley Lo <chesleylo@gateweb.com.tw>
 *
 * @NApiVersion 2.1
 * @NModuleScope Public
 */
define([
    'N/config'
], (
    config
) => {

    var exports = {};

    function logger(str) {
        str.match(/.{1,3000}/g).forEach(function(smallString, idx) {
            log.debug('part' + idx, smallString);
        });
    }

    function isOneWorldVersion() {
        var configRecObj = config.load({
            type: config.Type.FEATURES
        });

        var isMultipleSubCustomerEnable = configRecObj.getValue({
            fieldId: 'multisubsidiarycustomer'
        })

        return typeof isMultipleSubCustomerEnable === 'boolean'
    }
    exports.isOneWorldAccount = isOneWorldVersion
    return exports;
});
