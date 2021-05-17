define(['N/record'], (record) => {
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
  var recordId = 'customrecord_gw_xml_upload_log'
  class XmlUploadLog {
    eguiUploaded(eguiObj, voucherId, xmlString) {
      var xmlLog = record.create({
        type: recordId,
      })
      xmlLog.setValue({
        fieldId: 'custrecord_gw_upload_voucher',
        value: voucherId,
      })
      xmlLog.setValue({
        fieldId: 'custrecord_gw_upload_voucher_xml',
        value: xmlString,
      })
      return xmlLog.save()
    }
  }
  return new XmlUploadLog()
})
