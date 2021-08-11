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

  function getRandomNumber(stringValue) {
    return (Math.abs(genHash(stringValue)) % 10000).toString().padStart(4, '0')
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

  function shouldIssueNewGui(eguiObj) {
    return !eguiObj.documentNumber
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
      var voucherId = this.createEgui()
      if (voucherId) {
        gwInvoiceService.eguiIssued(this.egui, voucherId)
      } else {
        gwInvoiceService.eguiIssueFailed(this.egui)
      }
      return voucherId
    }

    getNewGuiNumber(eguiObj) {
      var newEguiNumber = gwEguiBookService.getNewEGuiNumber(
        eguiObj.guiType.value,
        eguiObj.sellerTaxId,
        '',
        '',
        eguiObj.documentPeriod,
        eguiObj.documentDate,
        1
      )[0]
      return newEguiNumber
    }

    createEgui() {
      var eguiObj = JSON.parse(JSON.stringify(this.egui))
      var migTypeOption = gwMigTypeDao.getIssueEguiMigType(
        gwMigTypeDao.businessTranTypeEnum.B2C
      )
      eguiObj['migType'] = migTypeOption
      if (shouldIssueNewGui(eguiObj)) {
        eguiObj.documentNumber = this.getNewGuiNumber(eguiObj)
      }
      eguiObj.randomNumber = getRandomNumber(
        `${eguiObj.documentNumber}${eguiObj.sellerTaxId}`
      )
      eguiObj.uploadXmlFileName = `${migTypeOption.migType}-${
        eguiObj.documentNumber
      }-${new Date().getTime()}.xml`

      if (!eguiObj.transactions) eguiObj.transactions = [eguiObj.internalId]
      this.egui = eguiObj
      return gwVoucherDao.saveEguiToRecord(this.egui)
    }

    uploadEgui(voucherId) {
      var eguiObj = gwVoucherDao.getGuiByVoucherId(voucherId)
      log.debug({ title: 'eguiService uploadEgui eguiObj', details: eguiObj })
      var filename = eguiObj.uploadXmlFileName
      var xmlString = gwEguiUploadService.getXmlString(eguiObj)
      log.debug({ title: 'xmlString', details: xmlString })
      var result = gwEguiUploadService.sendToGw(xmlString, filename)
      log.debug({ title: 'result', details: result })
      gwVoucherDao.eguiUploaded(voucherId, result)
      if (result.code === 200) {
        log.debug({ title: 'update xml log' })
        gwUploadLogDao.eguiUploaded(eguiObj, voucherId, xmlString, result)
      }
      return result
    }
  }

  return EGuiService
})
