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
        var featureRecObj = config.load({
            type: config.Type.FEATURES
        });

        var isMultipleSubCustomerEnable = featureRecObj.getValue({
            fieldId: 'multisubsidiarycustomer'
        })

        return typeof isMultipleSubCustomerEnable === 'boolean'
    }

    function companyDateFormat() {
        var companyPreferencesRecObj = config.load({
            type: config.Type.COMPANY_PREFERENCES
        });
        var dateFormat = companyPreferencesRecObj.getValue({
            fieldId: 'DATEFORMAT'
        })

        log.debug({
            title: 'companyDateFormat - dateFormat',
            details: dateFormat
        })

        return dateFormat
    }

    exports.isOneWorldAccount = isOneWorldVersion
    exports.companyDateFormat = companyDateFormat
    return exports;
});
