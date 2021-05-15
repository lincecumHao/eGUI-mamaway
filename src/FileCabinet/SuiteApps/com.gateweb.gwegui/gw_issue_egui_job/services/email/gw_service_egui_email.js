define(['N/runtime', 'N/file', 'N/render', 'N/email'], (
  runtime,
  file,
  render,
  email
) => {
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
  var debuggerPath =
    'SuiteApps/com.gateweb.gwegui/gw_issue_egui_job/services/email'
  function isInDebuggerMode() {
    return runtime.executionContext === runtime.ContextType.DEBUGGER
  }

  function getHtmlTemplateFile() {
    var filename = 'eguiEmailTemplate.ftl'
    return isInDebuggerMode() ? `${debuggerPath}/${filename}` : `./${filename}`
  }

  class EmailService {
    getEmailBody(eguiObj) {
      var htmlTemplateFile = file.load({
        id: getHtmlTemplateFile(),
      })
      var htmlRenderer = render.create()
      htmlRenderer.templateContent = htmlTemplateFile.getContents()
      htmlRenderer.addCustomDataSource({
        format: render.DataSource.OBJECT,
        alias: 'guiData',
        data: eguiObj,
      })
      return htmlRenderer.renderAsString()
    }

    send(eguiObj) {
      var emailContent = this.getEmailBody(eguiObj)
      return email.send({
        author: 12,
        body: emailContent,
        recipients: ['seanlin816@gmail.com'],
        subject: 'EGUI Test',
      })
    }
  }
  return new EmailService()
})
