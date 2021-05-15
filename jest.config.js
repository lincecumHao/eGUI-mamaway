const SuiteCloudJestConfiguration = require('@oracle/suitecloud-unit-testing/jest-configuration/SuiteCloudJestConfiguration')
const cliConfig = require('./suitecloud.config')

module.exports = SuiteCloudJestConfiguration.build({
  projectFolder: cliConfig.defaultProjectFolder,
  projectType: SuiteCloudJestConfiguration.ProjectType.SUITEAPP,
  customStubs: [
    {
      module: 'N/format',
      path: '<rootDir>/customStubs/format.js',
    },
    {
      module: 'N/config',
      path: '<rootDir>/customStubs/config.js',
    },
    {
      module: 'N/runtime',
      path: '<rootDir>/customStubs/runtime.js',
    },
    {
      module: 'N/search',
      path: '<rootDir>/customStubs/search.js',
    },
    {
      module: 'assignLogFields',
      path:
        '<rootDir>/src/FileCabinet/SuiteApps/com.gateweb.gwegui/gw_dao/assignLog/gw_record_fields',
    },
    {
      module: 'gwEguiConfigDao',
      path:
        '<rootDir>/src/FileCabinet/SuiteApps/com.gateweb.gwegui/gw_dao/settings/gw_dao_egui_config_21',
    },
    {
      module: 'businessEntityDao',
      path:
        '<rootDir>/src/FileCabinet/SuiteApps/com.gateweb.gwegui/gw_dao/busEnt/gw_dao_business_entity_21',
    },
    {
      module: 'guiTypeDao',
      path:
        '<rootDir>/src/FileCabinet/SuiteApps/com.gateweb.gwegui/gw_dao/guiType/gw_dao_egui_type_21',
    },
    {
      module: 'applyPeriodDao',
      path:
        '<rootDir>/src/FileCabinet/SuiteApps/com.gateweb.gwegui/gw_dao/applyPeriod/gw_dao_apply_period_21',
    },
    {
      module: 'docFormatDao',
      path:
        '<rootDir>/src/FileCabinet/SuiteApps/com.gateweb.gwegui/gw_dao/docFormat/gw_dao_doc_format_21',
    },
    {
      module: 'migTypeDao',
      path:
        '<rootDir>/src/FileCabinet/SuiteApps/com.gateweb.gwegui/gw_dao/migType/gw_dao_mig_type_21',
    },
    {
      module: 'taxCalcDao',
      path:
        '<rootDir>/src/FileCabinet/SuiteApps/com.gateweb.gwegui/gw_dao/taxCalcMethod/gw_dao_tax_calc_method_21',
    },
    {
      module: 'taxTypeDao',
      path:
        '<rootDir>/src/FileCabinet/SuiteApps/com.gateweb.gwegui/gw_dao/taxType/gw_dao_tax_type_21',
    },
    {
      module: 'gwDao',
      path:
        '<rootDir>/src/FileCabinet/SuiteApps/com.gateweb.gwegui/gw_dao/gw_abstract_dao',
    },
    {
      module: 'searchLib',
      path:
        '<rootDir>/src/FileCabinet/SuiteApps/com.gateweb.gwegui/library/gw_lib_search',
    },
    {
      module: 'consolidatePaymentCode',
      path:
        '<rootDir>/src/FileCabinet/SuiteApps/com.gateweb.gwegui/gw_dao/consolidatePaymentCode/gw_dao_consolidate_payment_code_21',
    },
    {
      module: 'gwEguiService',
      path:
        '<rootDir>/src/FileCabinet/SuiteApps/com.gateweb.gwegui/gw_issue_egui_job/gw_egui_service',
    },
    {
      module: 'gwInvoiceService',
      path:
        '<rootDir>/src/FileCabinet/SuiteApps/com.gateweb.gwegui/gw_issue_egui_job/gw_invoice_service',
    },
    {
      module: 'gwInvToGuiMapper',
      path:
        '<rootDir>/src/FileCabinet/SuiteApps/com.gateweb.gwegui/gw_issue_egui_job/services/mapper/gw_service_map_inv_egui',
    },
    {
      module: 'mapUtil',
      path:
        '<rootDir>/src/FileCabinet/SuiteApps/com.gateweb.gwegui/gw_issue_egui_job/services/gw_mapping_util',
    },
    {
      module: 'voucherMainFields',
      path:
        '<rootDir>/src/FileCabinet/SuiteApps/com.gateweb.gwegui/gw_dao/voucher/gw_dao_voucher_main_fields',
    },
    {
      module: 'voucherDetailFields',
      path:
        '<rootDir>/src/FileCabinet/SuiteApps/com.gateweb.gwegui/gw_dao/voucher/gw_dao_voucher_detail_fields',
    },
  ],
})
