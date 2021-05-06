define(['./gw_transform_egui_service'], (gwTransformEguiService) => {
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

  class EGuiService {
    constructor(invObj) {
      this.invoice = invObj
    }

    issueEgui() {
      this.transformInvToEgui()
      this.saveToRecord()
      this.generateXml()
      this.sendToGw()
    }

    transformInvToEgui() {
      var transformService = new gwTransformEguiService()
      this.egui = transformService.transformInvToEgui(this.invoice, 'ISSUE')
      return this.egui
    }

    saveToRecord() {}

    generateXml() {}

    getFromRecord(recordId) {}

    sendToGw() {}
  }

  return EGuiService
})
