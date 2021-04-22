define([], function () {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2020 Gateweb
   * @author Sean Lin <seanlin816@gmail.com>
   *
   * @NApiVersion 2.0
   * @NModuleScope Public

   */
  var exports = {}
  var businessVAT = ''
  var sequenceNumber = 0

  //稅籍編號
  function setBuId(value) {
    businessVAT = value
  }

  function setSequenceNumber(value) {
    sequenceNumber = value
  }

  function genTxtApLineCore(apData) {
    var value = {
      docType: genDocType(apData),
      buTaxId: genBuTaxId(),
      sequenceNumber: 0,
      applyPeriod: genApplyPeriod(apData),
      buyerTaxIdOrGuiNumberStart: genBuyerOrEndGuiNum(apData),
      sellerTaxIdOrConsolidateCount: genSellerTaxId(apData),
      guiNumberOrCommonNumber: genGuiNumber(apData),
      salesAmt: genSalesAmt(apData),
      taxType: genTaxType(apData),
      taxAmt: genTaxAmt(apData),
      deductionCode: prependSpace('', 1), //扣抵代號[73]
      empty: prependSpace('', 5), //空白[74-78]
      specialTaxRate: prependSpace('', 1), //特種稅率[79]
      consolidationMark: prependSpace('', 1), //彙加或分攤註記[80]
      customClearanceMark: genCustomClearanceMark(apData),
    }
    return value
  }

  var genTxtApLine = genTxtApLineCore

  function genAllTxtLines(apDataArr) {
    return apDataArr.map(function (apData, idx) {
      return genTxtApLine(apData)
    })
  }

  //格式代號[1~2]
  function genDocTypeCore(apData) {
    var length = 2
    var docTypeId = apData['custrecord_gw_voucher_format_code']
    var value = docTypeId

    return { value: value, length: length }
  }

  var genDocType = prependSpaceWrapper(genDocTypeCore)

  //稅籍編號[3-11]
  function genBuTaxIdCore() {
    var length = 9
    var value = businessVAT
    return { value: value, length: length }
  }

  var genBuTaxId = prependSpaceWrapper(genBuTaxIdCore)

  //流水號[12-18]
  function genSequenceNumberCore(seqNumber) {
    var length = 7
    var value = seqNumber ? seqNumber : sequenceNumber
    return { value: value, length: length }
  }

  var genSequenceNumber = prependZeroWrapper(genSequenceNumberCore)

  //資料所屬年月[19-23] yyyMM
  function genApplyPeriodCore(apDoc) {
    var length = 5
    var value = apDoc['custrecord_gw_voucher_yearmonth']
    return { value: value, length: length }
  }

  var genApplyPeriod = prependSpaceWrapper(genApplyPeriodCore)

  //買受人統編[24-31]
  function genBuyerTaxIdCore(apDoc) {
    var length = 8
    var value = apDoc['custrecord_gw_buyer'] || ''
    if (value === '0000000000') {
      value = ''
    }
    return { value: value, length: length }
  }

  var genBuyerTaxId = prependSpaceWrapper(genBuyerTaxIdCore)

  function genBuyerOrEndGuiNum(apDoc) {
    return genBuyerTaxId(apDoc)
  }

  //銷售人統編[32-39]
  function genSellerTaxIdCore(apDoc) {
    var length = 8
    var value = apDoc['custrecord_gw_seller']
    return { value: value, length: length }
  }

  var genSellerTaxId = prependSpaceWrapper(genSellerTaxIdCore)

  //發票號碼[40-49]
  function genGuiNumberCore(apDoc) {
    var length = 10
    var value = apDoc['custrecord_gw_voucher_number']
    return { value: value, length: length }
  }

  var genGuiNumber = prependZeroWrapper(genGuiNumberCore)

  //region common number
  function genCommonNumberCore(apDoc) {
    var docType = genDocTypeCore(apDoc).value.toString()
    var length = 10
    if (docType === '28' || docType === '29') {
      length = 14
    }
    var value = apDoc[apDocFields.fields.commonNumber.id]
    return { value: value, length: length }
  }

  var genCommonNumber = prependSpaceWrapper(genCommonNumberCore)
  //endregion

  //銷售金額[50-61]
  function genSalesAmtCore(apDoc) {
    var length = 12
    var taxType = apDoc['custrecord_gw_tax_type']
      ? parseInt(apDoc['custrecord_gw_tax_type'])
      : 0
    var salesAmt = apDoc['custrecord_gw_sales_amount'] || '0'
    var freeTaxSalesAmt = apDoc['custrecord_gw_free_sales_amount'] || '0'
    var zeroSalesAmt = apDoc['custrecord_gw_zero_sales_amount'] || '0'
    var value = 0
    switch (taxType) {
      case 3:
        value = parseInt(freeTaxSalesAmt)
        break
      case 2:
        value = parseInt(zeroSalesAmt)
        break
      case 1:
        value = parseInt(salesAmt)
        break
      default:
        break
    }
    return { value: value, length: length }
  }

  var genSalesAmt = prependZeroWrapper(genSalesAmtCore)

  //課稅別[61]
  function genTaxTypeCore(apDoc) {
    var length = 1
    var value = apDoc['custrecord_gw_tax_type']
    return { value: value, length: length }
  }

  var genTaxType = prependSpaceWrapper(genTaxTypeCore)

  //營業稅額[63-72]
  function genTaxAmtCore(apDoc) {
    var length = 10
    var taxAmtValue = apDoc['custrecord_gw_tax_amount'] || '0'
    var value = parseInt(taxAmtValue)
    return { value: value, length: length }
  }

  var genTaxAmt = prependZeroWrapper(genTaxAmtCore)

  function genDeductionCodeCore(apDoc) {
    var length = 1
    var deductionCodeOptionsId = parseInt(
      apDoc[apDocFields.fields.deductionCode.id]
    )
    var value = apDocDeductionCodeService
      .getDeductionCodeValueByRecordId(deductionCodeOptionsId)
      .toString()
    return { value: value, length: length }
  }

  var genDeductionCode = prependSpaceWrapper(genDeductionCodeCore)

  function genConsolidationMarkCore(apDoc) {
    var length = 1
    var consolidationMarkFieldValue =
      apDoc[apDocFields.fields.consolidationMark.id]
    var consolidationMark = apDocConsolidationMarkService.getConsolidateMarkValueByRecordId(
      consolidationMarkFieldValue
    )
    var value =
      consolidationMark === 'A' || consolidationMark === 'B'
        ? consolidationMark
        : ''
    return { value: value, length: length }
  }

  var genConsolidationMark = prependSpaceWrapper(genConsolidationMarkCore)

  //通關方式[81-81]
  function genCustomClearanceMarkCore(apDoc) {
    var length = 1
    var value = apDoc['custrecord_gw_clearance_mark'] || ''
    return { value: value, length: length }
  }

  var genCustomClearanceMark = prependSpaceWrapper(genCustomClearanceMarkCore)

  //endregion
  function prependSpaceWrapper(func) {
    return function () {
      var result = func.apply(this, arguments)
      return prependSpace(result.value, result.length)
    }
  }

  function prependZeroWrapper(func) {
    return function () {
      var result = func.apply(this, arguments)
      return prependZero(result.value, result.length)
    }
  }

  function prependSpace(value, totalLength) {
    var padChar = ' '
    return value.toString().padStart(totalLength, padChar)
    // return padStartHelp(value, totalLength, padChar)
  }

  function prependZero(value, totalLength) {
    var padChar = '0'
    return value.toString().padStart(totalLength, padChar)
    // return padStartHelp(value, totalLength, padChar)
  }

  function padStartHelp(value, totalLength, padChar) {
    var _result_value = value
    if (value.length < totalLength) {
      for (var i = 0; i < totalLength - value.length; i++) {
        _result_value += padChar
      }
    }

    return _result_value
  }

  exports.genAllTxtLines = genAllTxtLines
  exports.setBuId = setBuId

  return exports
})
