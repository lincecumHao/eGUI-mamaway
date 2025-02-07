/**
 *
 * @copyright 2025 GateWeb
 * @author Chesley Lo <chesleylo@gateweb.com.tw>
 *
 * @NApiVersion 2.1
 * @NModuleScope Public
 */
define([
    'N/https',
    'N/record',
    'N/search',
    '../../library/gw_date_util',
    '../record/vendorBill',
    '../record/vendorPrepayment',
    '../record/expenseReport'
], (
    https,
    record,
    search,
    dateUtil,
    vendorBill,
    vendorPrepayment,
    expenseReport
) => {

    let exports = {};

    const RECORD_ID_MAPPING = {
        1: 'vendorprepayment',
        2: 'vendorbill',
        3: 'expensereport'
    }

    function callApValidation (request) {
        log.audit({title: 'callApValidation - request', details: request})
        const scriptId = 'customscript_gw_rl_ap_validation'
        const deploymentId = 'customdeploy_gw_rl_ap_validation'
        const headers = {
            "Content-Type": "application/json",
        }
        return https.requestRestlet({
            scriptId,
            deploymentId,
            method: https.Method.POST,
            headers,
            body: JSON.stringify(request),
        })
    }

    function createTransaction (request) {
        log.audit({title: 'createTransaction - request', details: request})
        const scriptId = 'customscript_gw_rl_create_ap_transaction'
        const deploymentId = 'customdeploy_gw_rl_create_ap_transaction'
        const headers = {
            "Content-Type": "application/json",
        }
        return https.requestRestlet({
            scriptId,
            deploymentId,
            method: https.Method.POST,
            headers,
            body: JSON.stringify(request),
        })
    }

    function getCurrencyIdByCode(currencyCode) {
        const type = 'currency'
        let filters = []
        filters.push(['symbol', 'is', currencyCode])
        let columns = []
        columns.push('name')
        const currencySearchObj = search.create({type, filters, columns})
        let currencyId = null
        currencySearchObj.run().each(function(result){
            // .run().each has a limit of 4,000 results
            currencyId = result.id
            return true
        })

        log.debug({title: 'getCurrencyIdByCode - currencyId', details: currencyId})

        return currencyId
    }

    function createVendorPrepayment(transactionObject) {
        log.audit({title: 'createVendorPrepayment', details: 'start...'})
        let resultObject = {
            recordId: null,
            errorMessage: null
        }
        try {
            const recordObject = record.create({
                type: RECORD_ID_MAPPING[transactionObject.Type],
                isDynamic: true
            })

            vendorPrepayment.allFields.forEach(function (prop) {
                let fieldId = vendorPrepayment.fields[prop].internalId
                let value = transactionObject.transactions[prop]
                if(prop === 'Date') {
                    value = new Date(dateUtil.getDateWithFormat(
                        transactionObject.transactions[prop], 'YYYY-MM-DD', 'YYYY/MM/DD'
                    ))
                }
                recordObject.setValue({fieldId, value})
            })

            resultObject.recordId = recordObject.save({
                ignoreMandatoryFields: true,
                enableSourcing: true
            })
        } catch (e) {
            resultObject.errorMessage = e.message
        }

        log.audit({title: 'createVendorPrepayment - resultObject', details: resultObject})

        transactionObject.isValid = resultObject.recordId !== null
        transactionObject.transactions.recordId = resultObject.recordId
        transactionObject.transactions.errorMessage = resultObject.errorMessage
    }

    function createVendorBill(transactionObject) {
        log.audit({title: 'createVendorBill', details: 'start...'})
        let resultObject = {
            recordId: null,
            errorMessage: null
        }
        try {
            let recordObject = null
            if(transactionObject.transactions.POID) {
                recordObject = record.transform({
                    fromType: record.Type.PURCHASE_ORDER,
                    fromId: transactionObject.transactions.POID,
                    toType: RECORD_ID_MAPPING[transactionObject.Type],
                    isDynamic: true
                })
            } else {
                recordObject = record.create({
                    type: RECORD_ID_MAPPING[transactionObject.Type],
                    isDynamic: true
                })
            }

            vendorBill.allHeaderFields.forEach(function (prop) {
                let fieldId = vendorBill.fields[prop].internalId
                let value = transactionObject.transactions[prop]
                log.debug({
                    title: 'set header field value',
                    details: {
                        fieldId,
                        value
                    }
                })
                if(prop === 'Date' || prop === 'DueDate') {
                    value = new Date(dateUtil.getDateWithFormat(
                        transactionObject.transactions[prop], 'YYYY-MM-DD', 'YYYY/MM/DD'
                    ))
                }
                if(transactionObject.transactions[prop]) recordObject.setValue({fieldId, value})
            })

            if(transactionObject.transactions.POID &&
                transactionObject.transactions.BillItemDetail &&
                transactionObject.transactions.BillItemDetail.length > 0) {
                //TODO - update item line
                /**
                const itemSublistId = 'item'
                for (let itemLine = 0; itemLine < transactionObject.transactions.BillItemDetail.length; itemLine ++) {
                    recordObject.selectNewLine({sublistId: itemSublistId})
                    vendorBill.allItemLineFields.forEach(function (prop) {
                        let fieldId = vendorBill.fields[prop].internalId
                        let value = transactionObject.transactions.BillItemDetail[itemLine][prop]
                        log.debug({
                            title: 'adding item line',
                            details: {
                                fieldId,
                                value
                            }
                        })
                        recordObject.setCurrentSublistValue({
                            sublistId: itemSublistId,
                            fieldId,
                            value
                        })
                    })
                    recordObject.commitLine({sublistId: itemSublistId})
                }
                **/
            }
            if(!transactionObject.transactions.POID &&
                transactionObject.transactions.BillExpenseDetail &&
                transactionObject.transactions.BillExpenseDetail.length > 0) {
                //TODO - add expense line
                for (let expenseLine = 0; expenseLine < transactionObject.transactions.BillExpenseDetail.length; expenseLine ++) {
                    const expenseSublistId = 'expense'
                    recordObject.selectNewLine({sublistId: expenseSublistId})
                    vendorBill.allExpenseLineFields.forEach(function (prop) {
                        let fieldId = vendorBill.fields[prop].internalId
                        let value = transactionObject.transactions.BillExpenseDetail[expenseLine][prop]
                        log.debug({
                            title: 'adding expense line',
                            details: {
                                fieldId,
                                value
                            }
                        })
                        recordObject.setCurrentSublistValue({
                            sublistId: expenseSublistId,
                            fieldId,
                            value
                        })
                    })
                    recordObject.commitLine({sublistId: expenseSublistId})
                }
            }

            resultObject.recordId = recordObject.save({
                ignoreMandatoryFields: true,
                enableSourcing: true
            })

        } catch (e) {
            resultObject.errorMessage = e.message
        }

        transactionObject.isValid = resultObject.recordId !== null
        transactionObject.transactions.recordId = resultObject.recordId
        transactionObject.transactions.errorMessage = resultObject.errorMessage
    }

    function createExpenseReport(transactionObject) {
        log.audit({title: 'createExpenseReport', details: 'start...'})
        let resultObject = {
            recordId: null,
            errorMessage: null
        }
        try {
            const recordObject = record.create({
                type: RECORD_ID_MAPPING[transactionObject.Type],
                isDynamic: true
            })

            expenseReport.allHeaderFields.forEach(function (prop) {
                let fieldId = expenseReport.fields[prop].internalId
                let value = transactionObject.transactions[prop]
                if(prop === 'Date' || prop === 'DueDate') {
                    value = new Date(dateUtil.getDateWithFormat(
                        transactionObject.transactions[prop], 'YYYY-MM-DD', 'YYYY/MM/DD'
                    ))
                }
                if(prop === 'Currency') {
                    value = getCurrencyIdByCode(transactionObject.transactions[prop])
                }
                recordObject.setValue({fieldId, value})
            })

            if(transactionObject.transactions.Expenses && transactionObject.transactions.Expenses.length > 0) {
                //TODO - add item line
                const expenseSublistId = 'expense'
                for (let expenseLine = 0; expenseLine < transactionObject.transactions.Expenses.length; expenseLine ++) {
                    recordObject.selectNewLine({sublistId: expenseSublistId})
                    expenseReport.allLineFields.forEach(function (prop) {
                        let fieldId = expenseReport.fields[prop].internalId
                        let value = transactionObject.transactions.Expenses[expenseLine][prop]
                        if(prop === 'ExpenseDate') {
                            value = new Date(dateUtil.getDateWithFormat(
                                transactionObject.transactions.Expenses[expenseLine][prop], 'YYYY-MM-DD', 'YYYY/MM/DD'
                            ))
                        }
                        if(prop === 'ExpenseCurrency') {
                            value = getCurrencyIdByCode(transactionObject.transactions.Expenses[expenseLine][prop])
                        }
                        recordObject.setCurrentSublistValue({
                            sublistId: expenseSublistId,
                            fieldId,
                            value
                        })
                    })
                    recordObject.commitLine({sublistId: expenseSublistId})
                }
            }

            resultObject.recordId = recordObject.save({
                ignoreMandatoryFields: true,
                enableSourcing: true
            })

        } catch (e) {
            resultObject.errorMessage = e.message
        }

        transactionObject.isValid = resultObject.recordId !== null
        transactionObject.transactions.recordId = resultObject.recordId
        transactionObject.transactions.errorMessage = resultObject.errorMessage
    }

    function createAccountPayableTransaction (transactionObject) {
        log.audit({title: 'before - createAccountPayableTransaction - transactionObject', details: transactionObject})
        log.audit({
            title: 'before - createAccountPayableTransaction - RECORD_ID_MAPPING[transactionObject.Type]',
            details: RECORD_ID_MAPPING[transactionObject.Type]
        })
        switch (RECORD_ID_MAPPING[transactionObject.Type]) {
            case record.Type.VENDOR_PREPAYMENT:
                createVendorPrepayment(transactionObject)
                break;
            case record.Type.VENDOR_BILL:
                createVendorBill(transactionObject)
                break;
            case record.Type.EXPENSE_REPORT:
                createExpenseReport(transactionObject)
                break;
        }
        log.audit({title: 'after - createAccountPayableTransaction - transactionObject', details: transactionObject})
    }

    function createAccountPayableVoucher (request) {
        log.audit({title: 'createAccountPayableVoucher - request', details: request})
        const scriptId = 'customscript_gw_rl_ap_integration'
        const deploymentId = 'customdeploy_gw_rl_ap_integration'
        const headers = {
            "Content-Type": "application/json",
        }
        request.forEach(function (eachRequest) {
            let requestArrayObject = []
            if(eachRequest.isValid) {
                eachRequest.GUIs.forEach(function (eachGUI) {
                    delete eachGUI['docType']
                    eachGUI['transaction'] = eachRequest.transactions.recordId
                    log.audit({
                        title: 'createAccountPayableVoucher - eachGUI',
                        details: eachGUI
                    })
                    requestArrayObject.push({
                        data: eachGUI
                    })
                })

                const response =  https.requestRestlet({
                    scriptId,
                    deploymentId,
                    method: https.Method.POST,
                    headers,
                    body: JSON.stringify(requestArrayObject),
                })

                log.debug({
                    title: 'sendRequest - response.body',
                    details: response.body
                })

                const responseBody = JSON.parse(response.body)
                if(responseBody.length) {
                    responseBody.forEach(function (eachResultObject, index ) {
                        if(eachResultObject.status === '1') {
                            eachRequest.GUIs[index].voucherRecordId = eachResultObject.data.internalId
                        } else {
                            eachRequest.GUIs[index].errorMessage = eachResultObject.errors
                            eachRequest.isValid = false
                        }
                    })
                }

            }
        })

        return request
    }

    function getConsolidatedResultObject (resultArrayObject) {
        log.audit({title: 'getConsolidatedResultObject', details: 'start...'})
        let consolidateResultArrayObject = []
        resultArrayObject.forEach(function (eachObject) {
            let eachResultObject = {
                isSuccess: eachObject.isValid,
                transactionId: null,
                consolidateResult: [],
                consolidateErrorMessage: [],
                request: eachObject
            }
            if(eachObject.transactions.recordId) {
                if(!eachObject.isValid) {
                    // TODO - remove transaction
                    log.audit({title: 'getConsolidatedResultObject - delete transaction', details: 'proceed delete...'})
                    record.delete({
                        type: RECORD_ID_MAPPING[eachObject.Type],
                        id: eachObject.transactions.recordId
                    })
                } else {
                    eachResultObject.transactionId = eachObject.transactions.recordId
                }
            }

            eachObject.GUIs.forEach(function (eachGUI) {
                log.audit({title: 'getConsolidatedResultObject - eachObject', details: eachObject})
                let eachConsolidatedObject = {
                    guiNumber: eachGUI.guiNum,
                    commonNumber: eachGUI.commonNumber,
                    voucherRecordId: eachObject.isValid ? eachGUI.voucherRecordId : null,
                }
                if(!eachObject.isValid) {
                    if(eachGUI.errorMessage && eachGUI.errorMessage.length > 0) {
                        eachConsolidatedObject.errorMessage = eachGUI.errorMessage
                    } else if (eachObject.transactions.errorMessage && eachObject.transactions.errorMessage.length > 0){
                        eachConsolidatedObject.errorMessage = eachObject.transactions.errorMessage
                    }
                    eachResultObject.consolidateErrorMessage.push(eachConsolidatedObject)
                } else {
                    eachResultObject.consolidateResult.push(eachConsolidatedObject)
                }
            })

            log.audit({title: 'getConsolidatedResultObject - eachResultObject', details: eachResultObject})
            consolidateResultArrayObject.push(eachResultObject)
        })

        return consolidateResultArrayObject
    }

    exports.callApValidation = callApValidation
    exports.createTransaction = createTransaction
    exports.createAccountPayableTransaction = createAccountPayableTransaction
    exports.createAccountPayableVoucher = createAccountPayableVoucher
    exports.getConsolidatedResultObject = getConsolidatedResultObject
    return exports
});
