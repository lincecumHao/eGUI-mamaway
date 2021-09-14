define([
  '../../gw_dao/voucher/gw_dao_voucher',
  '../../gw_issue_egui_job/services/upload/gw_service_upload_egui',
  '../../gw_dao/migType/gw_dao_mig_type_21'
], (gwVoucherDao, gwEguiUploadService, gwMigTypeDao) => {
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
  function getVoidEGuiXml(eguiObj) {
    var xmlString = gwEguiUploadService.getVoidXmlString(eguiObj)
    return xmlString
  }

  function uploadXmlToGW(xmlContent, filename) {
    var result = gwEguiUploadService.sendToGw(xmlString, filename)
    return result
  }
  function getDateStr(dateStr) {
    var date = dateStr ? new Date(dateStr) : new Date()
    return (
      date.getFullYear().toString() +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      date.getDate().toString().padStart(2, '0')
    )
  }

  class eGUIVoidService {
    constructor(params) {
      const { voucherId,  voucherIds, eguiNumber, eguiNumbers } = params
      this.voucherId = voucherId
      this.eguiNumbers = eguiNumbers
      this.eguiNumber = eguiNumber
      this.voucherIds = voucherIds
    }

    execute(callback) {
      var eguiObjs = this.getEguiObjs()

      var results = eguiObjs.map((eguiObj) => {
        return this.generateVoidXml(eguiObj, callback)
      })
      log.debug({ title: 'void egui execute results', details: results })

      return results
    }

    generateVoidXml(eguiObj, callback) {
      var migTypeOption = gwMigTypeDao.getVoidEguiMigType(
        gwMigTypeDao.businessTranTypeEnum.B2C
      )
      eguiObj.migTypeOption = migTypeOption
      eguiObj.voidDate = getDateStr()
      var filename = `${migTypeOption.migType}-${
        eguiObj.documentNumber
      }-${new Date().getTime()}.xml`
      var xmlContent = getVoidEGuiXml(eguiObj)
      if (callback) {
        let callbackArgs = {
          voucherId: this.voucherId,
          eguiObj: eguiObj
        }
        callback(callbackArgs)
      }
      return { filename: filename, xmlContent: xmlContent }
    }

    getEguiObjs() {
      if (this.voucherId) {
        return [gwVoucherDao.getGuiByVoucherId(this.voucherId)]
      }
      if (this.eguiNumbers) {
        return gwVoucherDao.getGuiByGuiNumbers(this.eguiNumbers)
      }
      if (this.eguiNumber){
        return [gwVoucherDao.getGuiByGuiNumber(this.eguiNumber)]
      }
    }
  }

  return eGUIVoidService
})
