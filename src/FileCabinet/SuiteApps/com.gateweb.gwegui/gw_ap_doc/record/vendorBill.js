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
            isHeader: true,
            isItemLine: false,
            isExpenseLine: false
        },
        Account: {
            internalId: 'account',
            isHeader: true,
            isItemLine: false,
            isExpenseLine: true
        },
        Date: {
            internalId: 'trandate',
            isHeader: true,
            isItemLine: false,
            isExpenseLine: false
        },
        DueDate: {
            internalId: 'duedate',
            isHeader: true,
            isItemLine: false,
            isExpenseLine: false
        },
        Memo: {
            internalId: 'memo',
            isHeader: true,
            isItemLine: false,
            isExpenseLine: true
        },
        Location: {
            internalId: 'location',
            isHeader: true,
            isItemLine: false,
            isExpenseLine: false
        },
        // ItemCode: {
        //     internalId: 'item',
        //     isHeader: false,
        //     isItemLine: true,
        //     isExpenseLine: false
        // },
        Quantity: {
            internalId: 'quantity',
            isHeader: false,
            isItemLine: true,
            isExpenseLine: false
        },
        TaxCode: {
            internalId: 'taxcode',
            isHeader: false,
            isItemLine: true,
            isExpenseLine: true
        },
        Amount: {
            internalId: 'amount',
            isHeader: false,
            isItemLine: false,
            isExpenseLine: true
        },
        TaxAmount: {
            internalId: 'tax1amt',
            isHeader: false,
            isItemLine: false,
            isExpenseLine: true
        },
        CrossAmount: {
            internalId: 'grossamt',
            isHeader: false,
            isItemLine: false,
            isExpenseLine: true
        },
        Department: {
            internalId: 'department',
            isHeader: false,
            isItemLine: false,
            isExpenseLine: true
        },
        Class: {
            internalId: 'class',
            isHeader: false,
            isItemLine: false,
            isExpenseLine: true
        },
        BPMNumber: {
            internalId: 'custbody_gw_reference_number',
            isHeader: true,
            isItemLine: false,
            isExpenseLine: false
        },
    }

    exports.fields = fieldConfig
    exports.allHeaderFields = Object.keys(fieldConfig).filter(function(key) {
        if(fieldConfig[key].isHeader) {
            return key
        }
    })
    exports.allItemLineFields = Object.keys(fieldConfig).filter(function(key) {
        if(fieldConfig[key].isItemLine) {
            return key
        }
    })
    exports.allExpenseLineFields = Object.keys(fieldConfig).filter(function(key) {
        if(fieldConfig[key].isExpenseLine) {
            return key
        }
    })

    return exports
})
