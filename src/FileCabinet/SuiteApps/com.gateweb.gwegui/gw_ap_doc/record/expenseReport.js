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
        Employee: {
            internalId: 'entity',
            isHeader: true,
            isLine: false
        },
        Date: {
            internalId: 'trandate',
            isHeader: true,
            isLine: false
        },
        DueDate: {
            internalId: 'duedate',
            isHeader: true,
            isLine: false
        },
        Currency: {
            internalId: 'currency',
            isHeader: true,
            isLine: false
        },
        Memo: {
            internalId: 'memo',
            isHeader: true,
            isLine: false
        },
        Advance: {
            internalId: 'advance',
            isHeader: true,
            isLine: false
        },
        Complete: {
            internalId: 'complete',
            isHeader: true,
            isLine: false
        },
        SupervisorApproval: {
            internalId: 'supervisorapproval',
            isHeader: true,
            isLine: false
        },
        AccountingApproval: {
            internalId: 'accountingapproval',
            isHeader: true,
            isLine: false
        },
        ExpenseDate: {
            internalId: 'expensedate',
            isHeader: false,
            isLine: true
        },
        ExpenseAccount: {
            internalId: 'expenseaccount',
            isHeader: false,
            isLine: true
        },
        ExpenseCurrency: {
            internalId: 'currency',
            isHeader: false,
            isLine: true
        },
        ExpenseExRate: {
            internalId: 'exchangerate',
            isHeader: false,
            isLine: true
        },
        TaxCode: {
            internalId: 'taxcode',
            isHeader: false,
            isLine: true
        },
        ExpenseAmount: {
            internalId: 'amount',
            isHeader: false,
            isLine: true
        },
        Department: {
            internalId: 'department',
            isHeader: false,
            isLine: true
        },
        Class: {
            internalId: 'class',
            isHeader: false,
            isLine: true
        },
        Location: {
            internalId: 'location',
            isHeader: false,
            isLine: true
        },
        ExpenseMemo: {
            internalId: 'memo',
            isHeader: false,
            isLine: true
        },
        BPMNumber: {
            internalId: 'custbody_gw_reference_number',
            isHeader: true,
            isLine: false
        },
    }

    exports.fields = fieldConfig
    exports.allHeaderFields = Object.keys(fieldConfig).filter(function(key) {
        if(fieldConfig[key].isHeader) {
            return key
        }
    })
    exports.allLineFields = Object.keys(fieldConfig).filter(function(key) {
        if(fieldConfig[key].isLine) {
            return key
        }
    })

    return exports
})
