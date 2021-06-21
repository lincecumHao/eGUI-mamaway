define([
  '../library/ramda.min',
  '../gw_dao/voucher/gw_dao_voucher',
  './services/mapper/CmToAllowance/gw_service_map_cm_allowance',
  '../gw_dao/migType/gw_dao_mig_type_21',
  './services/upload/gw_service_upload_allowance',
  './gw_credit_memo_service'
], (
  ramda,
  gwVoucherDao,
  gwCmAllowanceMapper,
  gwMigTypeDao,
  gwAllowanceUploadService,
  gwCreditMemoService
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

  function getAllowanceNumber() {
    var timestamp = '20210518081205'
    var deductEguiNum = 'EH12345678'
    return `ALW${timestamp}${deductEguiNum}`
  }

  class AllowanceService {
    constructor(cmObj) {
      if (cmObj) {
        this.creditMemo = cmObj
        this.allowance = new gwCmAllowanceMapper(this.creditMemo).transform()
      }
    }

    getAllowance() {
      return this.allowance
    }

    issueAllowance() {
      return this.createAllowance()
    }

    createAllowance() {
      var allowanceObj = JSON.parse(JSON.stringify(this.allowance))
      allowanceObj['migType'] = gwMigTypeDao.getIssueAllowanceMigType(
        gwMigTypeDao.businessTranTypeEnum.B2C
      )
      allowanceObj.documentNumber = getAllowanceNumber()
      allowanceObj.randomNumber = getRandomNumber()
      this.allowance = allowanceObj
      var voucherId = gwVoucherDao.saveAllowanceToRecord(this.allowance)
      gwCreditMemoService.cmIssued(allowanceObj, voucherId)
      return voucherId
    }

    // Not done in this service
    // uploadAllowance(voucherId) {
    //   var allowanceObj = gwVoucherDao.getAllowanceByVoucherId(voucherId)
    //   log.debug({
    //     title: 'allowanceService uploadAllowance allowanceObj',
    //     details: allowanceObj,
    //   })
    //   var filename = `${allowanceObj.migTypeOption.migType}-${allowanceObj.documentNumber}-${voucherId}.xml`
    //   var xmlString = gwAllowanceUploadService.getXmlString(allowanceObj)
    //   log.debug({ title: 'xmlString', details: xmlString })
    //   var result = gwAllowanceUploadService.sendToGw(xmlString, filename)
    //   log.debug({ title: 'result', details: result })
    //   if (result.code === 200) {
    //     gwVoucherDao.eguiUploaded(voucherId, result)
    // } else {
    // }
    // return result
    // }

    getFromRecord(recordId) {}
  }

  return AllowanceService
})
