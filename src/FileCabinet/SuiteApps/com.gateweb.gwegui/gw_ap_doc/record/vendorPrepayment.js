/**
 *
 * @copyright 2025 GateWeb
 * @author Chesley Lo <chesleylo@gateweb.com.tw>
 *
 * @NApiVersion 2.1
 * @NModuleScope Public
 */
define([
    '../../library/ramda.min'
], (
    ramda
) => {

    let exports = {};

    let fieldConfig = {
        Entity: {
            internalId: 'entity',
        },
        POID: {
            internalId: 'purchaseorder'
        },
        Account: {
            internalId: 'account',
        },
        ExchangeRate: {
            internalId: 'exchangerate',
        },
        Date: {
            internalId: 'trandate',
        },
        Amount: {
            internalId: 'payment',
        },
        Memo: {
            internalId: 'memo',
        },
        Location: {
            internalId: 'location',
        },
        Department: {
            internalId: 'department',
        },
        Class: {
            internalId: 'class',
        },
        BPMNumber: {
            internalId: 'custbody_gw_reference_number',
        },
    }

    exports.fields = fieldConfig
    exports.allFields = Object.keys(fieldConfig).map(function(key) {
        return key
    })

    return exports
})
