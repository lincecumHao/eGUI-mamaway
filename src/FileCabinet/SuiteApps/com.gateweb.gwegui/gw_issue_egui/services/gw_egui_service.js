define([
  'N/url',
  'N/runtime',
  'N/file',
  'N/render',
  '../../gw_dao/migType/gw_dao_mig_type'
], (url, runtime, file, render, gwMigTypeDao) => {
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
      id: getXmlTemplateFilePath(guiRecord.migTypeOption)
    })
    var xmlRenderer = render.create()
    var templateContent = xmlTmplFile.getContents()
    log.debug({
      title: 'template content',
      details: templateContent
    })
    xmlRenderer.templateContent = templateContent
    xmlRenderer.addCustomDataSource({
      format: render.DataSource.OBJECT,
      alias: 'guiData',
      data: guiRecord
    })
    var xmlString = xmlRenderer.renderAsString()
    log.debug({ title: 'xml output', details: xmlString })
    return xmlString
  }

  function genHash(stringValue) {
    var hash = 7,
      i,
      chr
    if (stringValue.length === 0) return hash
    for (i = 0; i < stringValue.length; i++) {
      chr = stringValue.charCodeAt(i)
      hash = (hash << 5) - hash + chr
      hash |= 0 // Convert to 32bit integer
    }
    return hash
  }

  function genRandomNumber(stringValue) {
    return (Math.abs(genHash(stringValue)) % 10000).toString().padStart(4, '0')
  }

  function getXmlTemplateFilePath(migTypeObj) {
    var fileName = migTypeObj.xmlFileName
    var folder = '../../gw_mig_xml/'
    if (runtime.executionContext === runtime.ContextType.DEBUGGER) {
      folder = 'SuiteApps/com.gateweb.gwegui/gw_mig_xml/'
    }
    return folder + fileName
  }

  exports.genXml = genXml
  exports.genRandomNumber = genRandomNumber
  return exports
})
