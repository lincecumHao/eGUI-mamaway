define([
  '../library/ramda.min',
  './gw_repo_voucher',
  '../gw_dao/assignLog/gw_dao_assign_log_21',
  './services/mapper/gw_service_map_inv_egui',
  './gw_egui_book_service',
  '../gw_dao/migType/gw_dao_mig_type_21',
], (
  ramda,
  gwVoucherRepo,
  gwAssignLogDao,
  gwInvToGuiMapper,
  gwEguiBookService,
  gwMigTypeDao
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
  let exports = {}
  const documentAction = {
    ISSUE: 'ISSUE',
    CANCEL: 'CANCEL',
    VOID: 'VOID',
  }

  function getRandomNumber() {
    var max = 9999
    var min = 1000
    var range = max - min
    var rand = Math.random()
    var result = min + Math.round(rand * range)
    return result.toString()
  }

  class EGuiService {
    constructor(invObj) {
      this.invoice = invObj
      this.egui = new gwInvToGuiMapper(this.invoice).transform()
    }

    getEgui() {
      return this.egui
    }

    issueEgui() {
      var eguiObj = JSON.parse(JSON.stringify(this.egui))
      eguiObj['migType'] = gwMigTypeDao.getIssueEguiMigType(
        gwMigTypeDao.businessTranTypeEnum.B2C
      )
      if (!eguiObj.documentNumber) {
        eguiObj.documentNumber = gwEguiBookService.getNewEGuiNumber(
          eguiObj.guiType.value,
          eguiObj.sellerTaxId,
          '',
          '',
          eguiObj.documentPeriod,
          eguiObj.documentDate,
          1
        )[0]
      }

      eguiObj.randomNumber = getRandomNumber()
      this.egui = eguiObj
      log.debug({ title: 'eguiObj', details: this.egui })
      return this.saveToVoucher(this.egui)
      // this.generateXml()
      // this.sendToGw()
    }

    // transformInvToEgui() {
    //   var transformService = new gwTransformEguiService()
    //   this.egui = transformService.transformInvToEgui(this.invoice, 'ISSUE')
    //   return this.egui
    // }

    saveToVoucher(eguiObj) {
      return gwVoucherRepo.saveToRecord(eguiObj)
    }

    generateXml() {}

    getFromRecord(recordId) {}

    sendToGw() {}
  }

  return EGuiService
})
