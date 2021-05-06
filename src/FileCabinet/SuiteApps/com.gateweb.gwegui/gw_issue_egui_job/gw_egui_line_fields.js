define(['../library/ramda.min'], function (ramda) {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2021 Gateweb
   * @author Sean Lin <sean.hyl@gmail.com>
   *
   * @NApiVersion 2.0
   * @NModuleScope Public

   */
  var exports = {}
  var fieldConfig = {
    itemId: {
      id: 'itemId',
      sourceField: 'item.value',
      outputField: '',
    },
    itemName: {
      id: 'itemName',
      sourceField: 'item.text',
      outputField: '',
    },
    itemDescription: {
      id: 'itemDescription',
      sourceField: 'memo',
      outputField: '',
    },
    unitPrice: {
      id: 'unitPrice',
      sourceField: 'rate',
      outputField: '',
    },
    unitPriceForeign: {
      id: 'unitPriceForeign',
      sourceField: 'fxrate',
      outputField: '',
    },
    quantity: {
      id: 'quantity',
      sourceField: 'quantity',
      outputField: '',
    },
    unit: {
      id: 'unit',
      sourceField: 'unitabbreviation',
      outputField: '',
    },
    nsAmt: {
      id: 'nsAmt',
      sourceField: 'netamountnotax',
      outputField: '',
    },
    nsTaxAmt: {
      id: 'nsTaxAmt',
      sourceField: 'taxtotal',
      outputField: '',
    },
    nsTotalAmt: {
      id: 'nsTotalAmt',
      sourceField: 'total',
      outputField: '',
    },
    nsLineSeq: {
      id: 'nsLineSeq',
      sourceField: 'linesequencenumber',
      outputField: '',
    },
    nsLine: {
      id: 'nsLine',
      sourceField: 'line',
      outputField: '',
    },
    itemType: {
      id: 'itemType',
      sourceField: 'itemtype',
      outputField: '',
    },
    itemMemo: {
      id: 'itemMemo',
      sourceField: 'custcol_gw_item_memo',
      outputField: '',
    },
    itemRateAfterTax: {
      id: 'itemRateAfterTax',
      sourceField: 'custcol_gw_item_unit_amt_inc_tax',
      outputField: '',
    },
    taxCode: {
      id: 'taxCode',
      sourceField: 'taxcode',
      outputField: '',
    },
    buyerTaxId: {
      id: 'buyerTaxId',
      sourceField: 'custbody_gw_tax_id_number',
      outputField: '',
    },
  }

  var inputMapping = (fieldConfig) => {
    return ramda.reduce(
      function (result, fieldId) {
        var fieldObj = fieldConfig[fieldId]
        if (fieldObj.sourceField) {
          result[fieldId] = fieldObj.sourceField
        }
        return result
      },
      {},
      Object.keys(fieldConfig)
    )
  }

  var outputMapping = (fieldConfig) => {
    return ramda.reduce(
      function (result, fieldId) {
        var fieldObj = fieldConfig[fieldId]
        if (fieldObj.outputField) {
          result[fieldId] = fieldObj.outputField
        }
        return result
      },
      {},
      Object.keys(fieldConfig)
    )
  }

  exports.fieldInputMapping = inputMapping(fieldConfig)
  exports.fieldOnputMapping = outputMapping(fieldConfig)
  exports.fields = fieldConfig
  return exports
})
