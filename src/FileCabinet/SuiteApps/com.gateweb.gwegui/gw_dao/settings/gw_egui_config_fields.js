define(['../../library/ramda.min'], function (ramda) {
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
    name: {
      id: 'name',
      sourceField: '',
      outputField: 'name',
    },
    custrecord_gw_ec_print_base_url: {
      id: 'custrecord_gw_ec_print_base_url',
      sourceField: '',
      outputField: 'printBaseUrl',
    },
    custrecord_gw_ec_dl_base_url: {
      id: 'custrecord_gw_ec_dl_base_url',
      sourceField: '',
      outputField: 'downloadBaseUrl',
    },
    custrecord_gw_ec_turnkey_base_url: {
      id: 'custrecord_gw_ec_turnkey_base_url',
      sourceField: '',
      outputField: 'turkeyBaseUrl',
    },
    custrecord_gw_ec_is_active: {
      id: 'custrecord_gw_ec_is_active',
      sourceField: '',
      outputField: 'isActive',
    },
    custrecord_gw_ec_ns_acct_id: {
      id: 'custrecord_gw_ec_ns_acct_id',
      sourceField: '',
      outputField: 'nsAcctId',
    },
    custrecord_gw_ec_env: {
      id: 'custrecord_gw_ec_env',
      sourceField: '',
      outputField: 'nam',
    },
    custrecord_gw_ec_tax_calc_method: {
      id: 'custrecord_gw_ec_tax_calc_method',
      sourceField: '',
      outputField: 'taxCalcMethod',
    },
  }

  var fieldInputMapping = ramda.reduce(
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

  var fieldOutputMapping = ramda.reduce(
    function (result, fieldId) {
      var fieldObj = fieldConfig[fieldId]
      if (fieldObj.outputField) {
        result[fieldObj.id] = fieldObj.outputField
      }
      return result
    },
    {},
    Object.keys(fieldConfig)
  )

  exports.fields = fieldConfig
  exports.allFieldIds = Object.keys(fieldConfig).map(function (key) {
    return key
  })
  exports.fieldOutputMapping = fieldOutputMapping
  exports.fieldInputMapping = fieldInputMapping
  return exports
})
