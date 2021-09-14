require([
  'SuiteApps/com.gateweb.gwegui/domain/eGUI/gw_void_egui',
  'SuiteApps/com.gateweb.gwegui/domain/eGUI/gw_egui_voided',
  'N/file',
  'SuiteApps/com.gateweb.gwegui/domain/eGUI/void_list/gw_void_carrier_egui_numbers'
], (eguiVoidService, eguiVoided, file, voucherToBeVoided) => {
  var batch = voucherToBeVoided.batch30
  log.debug({ title: 'batch', details: batch })
  // batch.forEach(function (voucherId) {
  //   var service = new eguiVoidService(voucherId)
  //   var result = service.execute()
  //   var outputFile = file.create({
  //     name: result.filename,
  //     folder: 55047,
  //     contents: result.xmlContent,
  //     fileType: file.Type.XMLDOC
  //   })
  //   outputFile.save()
  // })

  // batch.forEach(function (eguiNumber) {
  //   var service = new eguiVoidService({eguiNumber: eguiNumber})
  //   var result = service.execute()
  //   log.debug({title:"execute result", details:result});
  //   var outputFile = file.create({
  //     name: result.filename,
  //     folder: 55047,
  //     contents: result.xmlContent,
  //     fileType: file.Type.XMLDOC
  //   })
  //   outputFile.save()
  // })

  var service = new eguiVoidService({ eguiNumbers: batch })
  var result = service.execute()
  result.forEach((fileResult) => {
    var outputFile = file.create({
      name: fileResult.filename,
      folder: 55054,
      contents: fileResult.xmlContent,
      fileType: file.Type.XMLDOC
    })
    outputFile.save()
  })
  log.debug({ title: 'result', details: result })
  log.debug({ title: 'Execution end' })
})
