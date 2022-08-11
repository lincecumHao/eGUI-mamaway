require([
  'SuiteApps/com.gateweb.gwegui/gw_ap_doc/field_validation/gw_lib_field_validation_gui_number'
], (guiNumberValidator) => {
  const docType = 23
  const guiNumber = 'PM03372350'
  const currentSublistApDocRecord = { id: 0 }
  const isGuiNumberDuplicated = guiNumberValidator.isGuiNumberDuplicated(
    guiNumber,
    currentSublistApDocRecord.id,
    parseInt(docType)
  )
  log.debug({ title: 'isGuiNumberDuplicated', details: isGuiNumberDuplicated })
  log.debug({ title: 'Execution end' })
})
