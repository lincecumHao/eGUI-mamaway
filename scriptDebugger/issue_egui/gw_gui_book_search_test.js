require([
  'SuiteApps/com.gateweb.egui/library/gw_lib_search',
  'SuiteApps/com.gateweb.egui/dao/eguiBook/gw_record_fields',
], (gwSearchLib, fieldConfig) => {
  // Test Import

  var filters = [
    'custrecord_gw_gb_company_tax_id',
    'is',
    '24549210',
    'AND',
    'custrecord_gw_gb_book_status',
    'anyOf',
    ['1', '2'],
  ]
  const result = gwSearchLib.runSearch(
    fieldConfig.recordId,
    JSON.parse(JSON.stringify(fieldConfig.allFieldIds)),
    filters
  )
  log.debug({ title: 'result', details: result })
  log.debug({ title: 'Execution end' })
})
