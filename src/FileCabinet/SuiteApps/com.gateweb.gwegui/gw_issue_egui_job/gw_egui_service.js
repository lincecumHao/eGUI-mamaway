define([
  '../library/ramda.min',
  '../gw_dao/voucher/gw_dao_voucher',
  '../gw_dao/uploadLog/gw_dao_xml_upload_log',
  '../gw_dao/assignLog/gw_dao_assign_log_21',
  './services/mapper/InvToGui/gw_service_map_inv_egui',
  './gw_egui_book_service',
  '../gw_dao/migType/gw_dao_mig_type_21',
  './services/upload/gw_service_upload_egui',
  './gw_invoice_service',
  './services/gw_egui_factory'
], (
  ramda,
  gwVoucherDao,
  gwUploadLogDao,
  gwAssignLogDao,
  gwInvToGuiMapper,
  gwEguiBookService,
  gwMigTypeDao,
  gwEguiUploadService,
  gwInvoiceService,
  gwEguiFactory
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
    VOID: 'VOID'
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
      if (invObj) {
        this.invoice = invObj
        this.egui = gwEguiFactory.generate(invObj)
      }
    }

    getEgui() {
      return this.egui
    }

    issueEgui() {
      return this.createEgui()
    }

    createEgui() {
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
      var voucherId = gwVoucherDao.saveEguiToRecord(this.egui)
      gwInvoiceService.eguiIssued(eguiObj, voucherId)
      return voucherId
    }

    uploadEgui(voucherId) {
      var eguiObj = gwVoucherDao.getGuiByVoucherId(voucherId)
      log.debug({ title: 'eguiService uploadEgui eguiObj', details: eguiObj })
      var filename = `${eguiObj.migTypeOption.migType}-${eguiObj.documentNumber}-${voucherId}.xml`
      var xmlString = gwEguiUploadService.getXmlString(eguiObj)
      log.debug({ title: 'xmlString', details: xmlString })
      var result = gwEguiUploadService.sendToGw(xmlString, filename)
      log.debug({ title: 'result', details: result })
      gwVoucherDao.eguiUploaded(voucherId, result)
      if (result.code === 200) {
        gwUploadLogDao.eguiUploaded(eguiObj, voucherId, xmlString)
      }
      return result
    }

    getFromRecord(recordId) {}
  }

  return EGuiService
})
