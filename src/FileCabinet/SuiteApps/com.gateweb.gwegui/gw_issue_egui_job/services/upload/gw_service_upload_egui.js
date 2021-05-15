define([
  'N/file',
  'N/render',
  'N/runtime',
  'N/https',
  '../../../gw_dao/voucher/gw_dao_voucher',
  '../../../gw_dao/settings/gw_dao_egui_config_21',
], (file, render, runtime, https, gwVoucherDao, gwSystemConfig) => {
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
  function getXmlTemplateFilePath(migTypeObj) {
    var fileName = migTypeObj.xmlFileName
    var folder = '../gw_mig_xml/'
    if (runtime.executionContext === runtime.ContextType.DEBUGGER) {
      folder = 'SuiteApps/com.gateweb.gwegui/gw_issue_egui_job/gw_mig_xml/'
    }
    return folder + fileName
  }

  function getFilenameParts(filename) {
    log.debug({ title: 'getFilenameParts filename', details: filename })
    var fileNameRegEx = /^((\w\d+)-(\w+\d+)-\d+)(.xml)$/gm
    var regExGroupResult = fileNameRegEx.exec(filename)
    log.debug({ title: 'regExpGroupResult', details: regExGroupResult })
    return {
      input: regExGroupResult[0], // Original input
      filename: regExGroupResult[1], // Filename without extension
      migType: regExGroupResult[2], // Mig type
      extension: regExGroupResult[4], // file extension
    }
  }

  class EguiUploadService {
    getXmlString(eguiObj) {
      log.debug({ title: 'Upload Service eguiObj', details: eguiObj })
      var xmlTmplFile = file.load({
        id: getXmlTemplateFilePath(eguiObj.migTypeOption),
      })
      var xmlRenderer = render.create()
      xmlRenderer.templateContent = xmlTmplFile.getContents()
      xmlRenderer.addCustomDataSource({
        format: render.DataSource.OBJECT,
        alias: 'guiData',
        data: eguiObj,
      })
      return xmlRenderer.renderAsString()
    }

    uploadEgui(eguiObj) {
      var xml = this.getXmlString(eguiObj)
      return this.sendToGw(xml)
    }

    sendToGw(xmlString, filename) {
      var systemConfig = gwSystemConfig.getConfig()
      var responseObj = {
        code: 0,
        body: '',
      }
      var filenameParts = getFilenameParts(filename)
      var turnkeyBaseUrl = systemConfig.turkeyBaseUrl
      var url = `${turnkeyBaseUrl}/v1/ns/turnkey/mig?migType=${filenameParts.migType}&filename=${filenameParts.filename}`
      var headers = {
        Accept:
          'text/html, application/json, application/xhtml+xml, application/xml;q=0.9, image/webp, */*;q=0.8, application/pdf',
        'Accept-Language': 'en-us',
        gw_ns_auth:
          'lVM3wFlV0bMNi0/lNq/PV/0JTbxLQN03ldmd6T/6rkQhfOUZZbV/1aT1Q9UUTh7PcHnghZjsgtiCsy41fi1TnWlR6UC+AVTg36NDMni5LfaR/7uDPXAgOyhHlb8Y3NHmrjtq2hRf9hO1/f58LLltmFtnVJFAzNazeX839lXSQA0=',
      }
      log.debug({ title: 'uploadGuiXml headers', details: headers })
      var response = https.post({
        url: url,
        body: xmlString,
        headers: headers,
      })
      responseObj.code = response.code
      if (response.code !== 200) {
        responseObj.body = 'Error Occurs: ' + response.body
      }
      log.debug({ title: 'uploadGuiXml responseCode', details: responseObj })

      return responseObj
    }
  }

  return new EguiUploadService()
})
