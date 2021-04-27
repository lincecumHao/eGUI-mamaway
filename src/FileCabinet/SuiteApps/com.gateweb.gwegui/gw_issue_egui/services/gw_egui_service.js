define(['../../gw_dao/migType/gw_dao_mig_type'], (gwMigTypeDao) => {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2021 Gateweb
   * @author Sean Lin <sean.hyl@gmail.com>
   *
   * @NApiVersion 2.1
   * @NModuleScope Public

   */
  let exports = {}

  function genXml(guiRecord) {
    log.debug({ title: 'guiRecord', details: guiRecord })
    var xmlTmplFile = file.load({
      id: getXmlTemplateFilePath(guiRecord.migType),
    })
    var xmlRenderer = render.create()
    var templateContent = xmlTmplFile.getContents()
    log.debug({
      title: 'template content',
      details: templateContent,
    })
    xmlRenderer.templateContent = templateContent
    xmlRenderer.addCustomDataSource({
      format: render.DataSource.OBJECT,
      alias: 'guiData',
      data: guiRecord,
    })
    var xmlString = xmlRenderer.renderAsString()
    log.debug({ title: 'xml output', details: xmlString })
    return xmlString
  }

  function genRandomNumber() {
    var max = 9999
    var min = 1000
    var range = max - min
    var rand = Math.random()
    var result = min + Math.round(rand * range)
    return result.toString()
  }

  function getXmlTemplateFilePath(migTypeObj) {
    var fileName = migTypeObj.xmlFileName
    var folder = '../gw_mig_xml/'
    if (runtime.executionContext === runtime.ContextType.DEBUGGER) {
      folder = 'SuiteApps/com.gateweb.gwegui/gw_issue_egui/gw_mig_xml/'
    }
    return folder + fileName
  }

  exports.genXml = genXml
  exports.genRandomNumber = genRandomNumber
  return exports
})
