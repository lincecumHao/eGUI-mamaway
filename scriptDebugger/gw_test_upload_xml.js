require([
  'SuiteApps/com.gateweb.gwegui/gw_dao/voucher/gw_dao_voucher',
  'SuiteApps/com.gateweb.gwegui/gw_issue_egui_job/services/upload/gw_service_upload_egui',
  'N/file'
], (gwVoucherDao, gwEguiUploadService, file) => {
  var freeTaxEguiNumbers = {
    batch1: [
      'QY29319311', 'QY29319457',
      'QY29319652', 'QY29319764',
      'QY29320528', 'QY29320531',
      'QY29320872', 'QY29320903',
      'QY29321015', 'QY29321045',
      'QY29321064', 'QY29321086',
      'QY29321140', 'QY29321154',
      'QY29321155', 'QY29321156',
      'QY29321157', 'QY29321158',
      'QY29321159', 'QY29321160',
      'QY29321161', 'QY29321192',
      'QY29321319', 'QY29321328',
      'QY29321329'
    ],
    batch2: [
      'QY29321330', 'QY29321331',
      'QY29321332', 'QY29321333',
      'QY29321334', 'QY29321351',
      'QY29321352', 'QY29321353',
      'QY29321354', 'QY29321357',
      'QY29321369', 'QY29321370',
      'QY29321371', 'QY29321372',
      'QY29321373', 'QY29321388',
      'QY29321389', 'QY29321390',
      'QY29321391', 'QY29321399',
      'QY29321400', 'QY29321401',
      'QY29321402', 'QY29321403',
      'QY29321404'
    ],
    batch3: [
      'QY29321405', 'QY29321422',
      'QY29321423', 'QY29321435',
      'QY29321436', 'QY29321437',
      'QY29322026', 'QY29322027',
      'QY29322028', 'QY29322029',
      'QY29322030', 'QY29322031',
      'QY29322035', 'QY29322037',
      'QY29322038', 'QY29322039',
      'QY29322042', 'QY29322045',
      'QY29322046', 'QY29322047',
      'QY29322048', 'QY29322049',
      'QY29322051', 'QY29322052',
      'QY29322053'
    ],
    batch4: [
      'QY29322055', 'QY29322057',
      'QY29322058', 'QY29322064',
      'QY29322066', 'QY29322067',
      'QY29322068', 'QY29322069',
      'QY29322070', 'QY29322071',
      'QY29322073', 'QY29322074',
      'QY29322075', 'QY29322077',
      'QY29322078', 'QY29322081',
      'QY29322082', 'QY29322083',
      'QY29322086', 'QY29322087',
      'QY29322088', 'QY29322089',
      'QY29322090', 'QY29322091',
      'QY29322093'
    ],
    batch5: [
      'QY29322095', 'QY29322097',
      'QY29322098', 'QY29322100',
      'QY29322102', 'QY29322103',
      'QY29322106', 'QY29322107',
      'QY29322108', 'QY29322109',
      'QY29322111', 'QY29322112',
      'QY29322113', 'QY29322114',
      'QY29322116', 'QY29322119',
      'QY29322120', 'QY29322121',
      'QY29322122', 'QY29322123',
      'QY29322124', 'QY29322125',
      'QY29322127', 'QY29322143',
      'QY29322156'
    ],
    batch6: [
      'QY29322157',
      'QY29322158',
      'QY29322159',
      'QY29322368',
      'QY29322375',
      'QY29322398',
      'QY29322403',
      'QY29322408'
    ]
  }
  var mixTypeEguiNumber=['QY29322032',
    'QY29322033',
    'QY29322034',
    'QY29322036',
    'QY29322041',
    'QY29322043',
    'QY29322050',
    'QY29322054',
    'QY29322056',
    'QY29322059',
    'QY29322060',
    'QY29322062',
    'QY29322063',
    'QY29322065',
    'QY29322072',
    'QY29322076',
    'QY29322079',
    'QY29322080',
    'QY29322094',
    'QY29322096',
    'QY29322099',
    'QY29322105',
    'QY29322115',
    'QY29322117',
    'QY29322118',
    'QY29322126']
  var batch = freeTaxEguiNumbers.batch1
  var eguiObjs = gwVoucherDao.getGuiByGuiNumbers(batch)
  eguiObjs.forEach((eguiObj)=>{
    var xmlString = gwEguiUploadService.getXmlString(eguiObj)
    var filename =`C0401-${
      eguiObj.documentNumber
    }-${new Date().getTime()}.xml`
    var outputFile = file.create({
      name: filename,
      folder: 55051,
      contents: xmlString,
      fileType: file.Type.XMLDOC
    })
    outputFile.save()
    log.debug({ title: 'eguiObj', details: eguiObj })
    log.debug({ title: 'xmlString', details: xmlString })
  })

  log.debug({ title: 'Execution end' })
})
