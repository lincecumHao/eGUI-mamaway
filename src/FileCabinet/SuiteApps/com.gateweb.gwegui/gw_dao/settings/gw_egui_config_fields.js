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
  var recordId = 'customrecord_gw_egui_config'
  var fieldConfig = {
    name: {
      id: 'name',
      sourceField: '',
      outputField: 'name'
    },
    custrecord_gw_conf_ns_acct_id: {
      id: 'custrecord_gw_conf_ns_acct_id',
      sourceField: '',
      outputField: 'nsAcctId'
    },
    custrecord_gw_conf_print_base_url: {
      id: 'custrecord_gw_conf_print_base_url',
      sourceField: '',
      outputField: 'printBaseUrl'
    },
    custrecord_gw_config_dl_base_url: {
      id: 'custrecord_gw_config_dl_base_url',
      sourceField: '',
      outputField: 'downloadBaseUrl'
    },
    custrecord_gw_conf_turnkey_base_url: {
      id: 'custrecord_gw_conf_turnkey_base_url',
      sourceField: '',
      outputField: 'turkeyBaseUrl'
    },
    custrecord_gw_conf_active: {
      id: 'custrecord_gw_conf_active',
      sourceField: '',
      outputField: 'isActive'
    },
    custrecord_gw_conf_tax_calc_method: {
      id: 'custrecord_gw_conf_tax_calc_method',
      sourceField: '',
      outputField: 'taxCalcMethod'
    },
    custrecord_gw_conf_egui_init_fmt: {
      id: 'custrecord_gw_conf_egui_init_fmt',
      sourceField: '',
      outputField: 'defaultEGuiFormat'
    },
    custrecord_gw_conf_allowance_init_fmt: {
      id: 'custrecord_gw_conf_allowance_init_fmt',
      sourceField: '',
      outputField: 'defaultAllowanceFormat'
    },
    custrecord_gw_config_item_field: {
      id: 'custrecord_gw_config_item_field',
      sourceField: '',
      outputField: 'itemNameFieldId'
    },
    custrecord_gw_config_temp_folder_id: {
      id: 'custrecord_gw_config_temp_folder_id',
      sourceField: '',
      outputField: 'gwTempFolderId'
    },
    custrecord_gw_config_allowance_prefix: {
      id: 'custrecord_gw_config_allowance_prefix',
      sourceField: '',
      outputField: 'allowancePrefix'
    },
    custrecord_gw_conf_egui_department: {
      id: 'custrecord_gw_conf_egui_department',
      sourceField: '',
      outputField: 'isEGUIDepartment'
    },
    custrecord_gw_conf_egui_class: {
      id: 'custrecord_gw_conf_egui_class',
      sourceField: '',
      outputField: 'isEGUIClass'
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
  exports.recordId = recordId
  return exports
})
