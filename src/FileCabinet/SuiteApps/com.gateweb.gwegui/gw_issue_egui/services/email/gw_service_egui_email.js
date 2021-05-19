define([
  'N/runtime',
  'N/file',
  'N/render',
  'N/email',
  '../../../library/ramda.min',
  '../../../gw_dao/voucher/gw_dao_voucher',
], (runtime, file, render, email, ramda, gwVoucherDao) => {
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
  var debuggerPath = 'SuiteApps/com.gateweb.gwegui/gw_issue_egui/services/email'

  function isInDebuggerMode() {
    return runtime.executionContext === runtime.ContextType.DEBUGGER
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  function getHtmlTemplateFile() {
    var filename = 'eguiEmailTemplate.ftl'
    return isInDebuggerMode() ? `${debuggerPath}/${filename}` : `./${filename}`
  }

  function updateEguiObj(eguiObj) {
    var eguiObjClone = JSON.parse(JSON.stringify(eguiObj))
    eguiObjClone.lines = ramda.map((line) => {
      line.unitPrice = Math.round(parseInt(line.unitPrice))
      line.salesAmt = Math.round(parseInt(line.salesAmt))
      return line
    }, eguiObjClone.lines)
    return eguiObjClone
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

    sendByVoucherId(subject, voucherId) {
      var eguiObj = gwVoucherDao.getGuiByVoucherId(voucherId)
      this.send(subject, eguiObj)
    }

    send(subject, eguiObj) {
      var eguiObjUpdated = updateEguiObj(eguiObj)
      var buyerEmail = eguiObjUpdated.buyerEmail || 'se10@gateweb.com.tw'
      var emailContent = this.getEmailBody(eguiObjUpdated)
      return email.send({
        author: eguiObjUpdated.sellerProfile.contactEmployee.value,
        body: emailContent,
        recipients: [buyerEmail],
        subject: subject,
      })
    }
  }

  return new EmailService()
})
