define(['../../library/ramda.min'], function(ramda) {
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
  var sublists = ['item']
  var item = ['item',
    'olditemid',
    'quantityremaining',
    'quantity',
    'units',
    'unitslist',
    'unitconversionrate',
    'description',
    'altid',
    'isserialitem',
    'islotitem',
    'isserialorlotitem',
    'serialnumbersvalid',
    'serialnumbers',
    'price',
    'pricelevels',
    'rate',
    'rateschedule',
    'marginal',
    'oqpbucket',
    'amount',
    'amounthasbeenset',
    'taxcode',
    'taxrate1',
    'grossamt',
    'tax1amt',
    'refamt',
    'options',
    'costestimatetype',
    'costestimatetypelist',
    'costestimate',
    'excludefromraterequest',
    'custcol_gw_item_memo',
    'custcol_gw_item_unit_amt_inc_tax',
    'quantityavailable',
    'costestimaterate',
    'billvariancestatus',
    'billvariancestatusallbook',
    'initquantity',
    'initoqpbucket',
    'orderdoc',
    'orderline',
    'account',
    'line',
    'lineuniquekey',
    'discline',
    'printitems',
    'noprint',
    'ingroup',
    'includegroupwrapper',
    'groupsetup',
    'itemtype',
    'itemsubtype',
    'isnoninventory',
    'fulfillable',
    'mandatorytaxcode',
    'revrecdeferred',
    'id',
    'isposting',
    'minqty',
    'matrixtype',
    'linenumber',
    'ddistrib',
    'reorder',
    'onorder',
    'backordered']


  var fieldInputMapping = ramda.reduce(
    function(result, fieldId) {
      var fieldObj = fieldConfig[fieldId]
      if (fieldObj.sourceField) {
        result[fieldId] = fieldObj.sourceField
      }
      return result
    },
    {},
    Object.keys(fieldConfig),
  )

  var fieldOutputMapping = ramda.reduce(
    function(result, fieldId) {
      var fieldObj = fieldConfig[fieldId]
      if (fieldObj.outputField) {
        result[fieldObj.id] = fieldObj.outputField
      }
      return result
    },
    {},
    Object.keys(fieldConfig),
  )

  exports.fields = fieldConfig
  exports.allFieldIds = Object.keys(fieldConfig).map(function(key) {
    return key
  })
  exports.fieldOutputMapping = fieldOutputMapping
  exports.fieldInputMapping = fieldInputMapping
  exports.recordId = recordId
  return exports
})
