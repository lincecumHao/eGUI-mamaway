define([
  '../../../../library/ramda.min',
  '../../../../library/gw_date_util',
  '../../gw_mapping_util',
  '../../../../gw_dao/settings/gw_dao_egui_config_21',
  '../../../../gw_dao/busEnt/gw_dao_business_entity_21',
  '../../../../gw_dao/guiType/gw_dao_egui_type_21',
  '../../../../gw_dao/applyPeriod/gw_dao_apply_period_21',
  '../../../../gw_dao/docFormat/gw_dao_doc_format_21',
  '../../../../gw_dao/taxCalcMethod/gw_dao_tax_calc_method_21',
  '../../../../gw_dao/taxType/gw_dao_tax_type_21',
  '../../../../gw_dao/carrierType/gw_dao_carrier_type_21',
  '../../../domain/vo/egui/gw_egui_main_fields',
  '../../../domain/vo/egui/gw_egui_line_fields'
], (
  ramda,
  dateUtil,
  gwObjectMappingUtil,
  gwEguiConfigDao,
  gwBusinessEntityDao,
  gwGuiTypeDao,
  gwApplyPeriodDao,
  gwDocFormatDao,
  gwTaxCalculationDao,
  gwTaxTypeDao,
  gwCarrierTypeDao,
  mainFields,
  lineFields
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

  //region Fill in values in body if field is missing
  function updateBodyValues(eguiMain) {
    var configuration = gwEguiConfigDao.getConfig()
    var eguiMainObj = JSON.parse(JSON.stringify(eguiMain))
    var seller = eguiMainObj.sellerTaxId
      ? gwBusinessEntityDao.getByTaxId(eguiMainObj.sellerTaxId)
      : gwBusinessEntityDao.getBySubsidiary(eguiMainObj.subsidiaryId)
    eguiMainObj = updateSeller(eguiMainObj, seller)
    eguiMainObj = updateCarrierAndDonation(eguiMainObj)
    eguiMainObj = updateMiscFields(eguiMainObj, configuration)
    eguiMainObj = updateGuiNumber(eguiMainObj)
    return eguiMainObj
  }

  function updateSeller(eguiMainObj, seller) {
    var eguiMain = JSON.parse(JSON.stringify(eguiMainObj))
    eguiMain.sellerTaxId = seller.taxId
    eguiMain.sellerName = seller.title
    eguiMain.sellerAddress = `${seller.city.text}${seller.address}`
    eguiMain.guiType = seller.isNonValueAdded
      ? gwGuiTypeDao.getSpecialGuiType()
      : gwGuiTypeDao.getRegularGuiType()
    return eguiMain
  }

  function updateBuyer() {}

  function updateGuiNumber(eguiMainObj) {
    var eguiMain = JSON.parse(JSON.stringify(eguiMainObj))
    eguiMain.manualGuiNumber = eguiMain.eguiNumStart
    eguiMain.documentNumber = eguiMain.eguiNumStart
    return eguiMain
  }

  function getCheckboxValue(value) {
    if (typeof value === 'boolean') {
      return value
    }
    return value === 'T'
  }

  function updateCarrierAndDonation(eguiMainObj) {
    var eguiMain = JSON.parse(JSON.stringify(eguiMainObj))
    if (eguiMain['carrierType'] && eguiMain['carrierType'].value) {
      eguiMain['carrierType'] = gwCarrierTypeDao.getById(
        eguiMain['carrierType'].value
      )
    }
    eguiMain['needUploadMig'] = getCheckboxValue(eguiMain['isNotUploadEGui'])
      ? 'NONE'
      : 'ALL'
    eguiMain['printMark'] =
      !eguiMain['carrierType'] && !eguiMain['donationCode'] ? 'Y' : 'N'
    return eguiMain
  }

  function updateMiscFields(eguiMainObj, configuration) {
    var eguiMain = JSON.parse(JSON.stringify(eguiMainObj))
    eguiMain.documentType = mainFields.voucherType.EGUI
    eguiMain.documentTime = '23:59:59'
    eguiMain.documentDate = eguiMain.tranDate
    eguiMain.documentPeriod = eguiMain.guiPeriod
      ? eguiMain.guiPeriod
      : dateUtil.getGuiPeriod(eguiMain.documentDate)
    eguiMain.taxApplyPeriod = eguiMain.taxApplyPeriod
      ? gwApplyPeriodDao.getByText(eguiMain.taxApplyPeriod)
      : gwApplyPeriodDao.getByText(eguiMain.documentPeriod)
    eguiMain.taxCalculationMethod = eguiMain.taxCalculationMethod
      ? eguiMain.taxCalculationMethod
      : gwTaxCalculationDao.getById(configuration.taxCalcMethod.value)
    eguiMain.documentStatus = getDocumentStatus(
      eguiMain.isIssueEgui,
      eguiMain.isNotUploadEGui
    )
    eguiMain['documentUploadStatus'] =
      eguiMain.isUploadEGui === 'F'
        ? mainFields.uploadStatus.NOT_UPLOAD
        : mainFields.uploadStatus.PENDING_UPLOAD

    eguiMain['docFormat'] = eguiMain['docFormat']
      ? gwDocFormatDao.getById(eguiMain['docFormat'].value)
      : gwDocFormatDao.getDefaultArGuiFormat(eguiMain['guiType'].value)
    // eguiMain['isTransactionLocked'] = 'T'
    return eguiMain
  }

  // TBD: more scenarios might be applicable
  function getDocumentStatus(isIssueEgui, isNotUploadEgui) {
    var status = ''
    var issueEgui = getCheckboxValue(isIssueEgui)
    var uploadEgui = !getCheckboxValue(isNotUploadEgui)

    if (issueEgui && uploadEgui)
      status = mainFields.voucherStatus.VOUCHER_SUCCESS
    if (issueEgui && !uploadEgui)
      status = mainFields.voucherStatus.VOUCHER_SUCCESS
    return status
  }

  //endregion

  function transformLines(tranLines) {
    return ramda.map((line) => {
      var eguiLine = gwObjectMappingUtil.mapFrom(line, lineFields)
      eguiLine['taxRate'] = line['rate.taxItem'] || line['taxItem']['rate']
      eguiLine['itemDisplayName'] =
        line['displayname.item'] || line['item']['displayname']
      eguiLine['itemName'] = eguiLine['itemDisplayName']
      return eguiLine
    }, tranLines)
  }

  // Fill in values in lines if field is missing
  function updateLines(eguiLines) {
    var lineSeq = 1
    return ramda.map((eguiLine) => {
      var line = updateLine(eguiLine)
      line['lineSeq'] = lineSeq
      lineSeq++
      return line
    }, eguiLines)
  }

  function isDeductLine(line) {
    return (
      (!!line.quantity && parseFloat(line.quantity) < 0) ||
      parseFloat(line.nsTaxAmt) < 0
    )
  }

  function convertDeductLine(line) {
    line.quantity = line.quantity ? Math.abs(parseFloat(line.quantity)) : 1
    line.nsAmt = Math.abs(parseFloat(line.nsAmt)) * -1
    let taxAmt = line.nsTaxAmt ? parseFloat(line.nsTaxAmt) : 0
    line.nsTaxAmt = Math.abs(taxAmt) * -1
    return line
  }

  function updateLine(eguiLine) {
    var line = JSON.parse(JSON.stringify(eguiLine))

    line = isDeductLine(line) ? convertDeductLine(line) : line
    line = gwRecalculateLineTax(line)
    line.quantity = line.quantity ? Math.abs(parseFloat(line.quantity)) : 1
    line.nsAmt = parseFloat(line.nsAmt)
    line.nsTaxAmt = line.nsTaxAmt ? parseFloat(line.nsTaxAmt) : 0
    line.nsTotalAmt = line.nsAmt + line.nsTaxAmt
    var lineTaxRate = parseFloat(
      parseInt(line['taxRate'].replace('%', ''), 10) / 100
    )
    line.nsTaxExemptedSalesAmt = 0
    line.nsTaxZeroSalesAmt = 0
    if (lineTaxRate === 0) {
      if (line.taxType.value.toString() === '2') {
        line.nsTaxZeroSalesAmt = line.nsAmt
      }
      if (line.taxType.value.toString() === '3') {
        line.nsTaxExemptedSalesAmt = line.nsAmt
      }
      line.nsAmt = 0
    }
    line.salesAmt = isCalculateByNs() ? line.nsAmt : parseFloat(line.gwSalesAmt)
    line.taxAmt = isCalculateByNs() ? line.nsTaxAmt : line.gwTaxAmt
    line.totalAmt = isCalculateByNs() ? line.nsTotalAmt : line.gwTotalAmt
    line.taxZeroSalesAmt = isCalculateByNs()
      ? line.nsTaxZeroSalesAmt
      : line.gwTaxZeroSalesAmt
    line.taxExemptedSalesAmt = isCalculateByNs()
      ? line.nsTaxExemptedSalesAmt
      : line.gwTaxExemptedSalesAmt
    line.unitPrice = line.unitPrice
      ? line.unitPrice
      : line.salesAmt / line.quantity
    return line
  }

  function gwRecalculateLineTax(line) {
    var eguiLine = JSON.parse(JSON.stringify(line))
    var lineTaxRate = parseFloat(
      parseInt(eguiLine['taxRate'].replace('%', ''), 10) / 100
    )
    var lineTaxType = gwTaxTypeDao.getTaxTypeByTaxCode(line.taxCode.value)

    var gwSalesAmt = parseFloat(eguiLine.nsAmt)
    var gwTaxZeroSalesAmt = 0
    var gwTaxExemptedSalesAmt = 0
    if (lineTaxRate === 0) {
      gwSalesAmt = 0
      if (lineTaxType.value.toString() === '2') {
        gwTaxZeroSalesAmt = parseFloat(eguiLine.nsAmt)
      }
      if (lineTaxType.value.toString() === '3') {
        gwTaxExemptedSalesAmt = parseFloat(eguiLine.nsAmt)
      }
    }
    var gwTaxAmt = gwSalesAmt * lineTaxRate
    var gwTotalAmt = gwSalesAmt + gwTaxAmt
    eguiLine.taxType = lineTaxType
    eguiLine.gwSalesAmt = gwSalesAmt
    eguiLine.gwTaxExemptedSalesAmt = gwTaxExemptedSalesAmt
    eguiLine.gwTaxZeroSalesAmt = gwTaxZeroSalesAmt
    eguiLine.gwTaxAmt = gwTaxAmt
    eguiLine.gwTotalAmt = gwTotalAmt
    return eguiLine
  }

  function summaryLines(eguiLines) {
    var sumAmountFields = {
      sumNsSalesAmt: 'nsAmt',
      sumNsTaxExemptedSalesAmt: 'nsTaxExemptedSalesAmt',
      sumNsTaxZeroSalesAmt: 'nsTaxZeroSalesAmt',
      sumNsTaxAmt: 'nsTaxAmt',
      sumNsTotalAmt: 'nsTotalAmt',
      sumGwSalesAmt: 'gwSalesAmt',
      sumGwTaxExemptedSalesAmt: 'gwTaxExemptedSalesAmt',
      sumGwTaxZeroSalesAmt: 'gwTaxZeroSalesAmt',
      sumGwTaxAmt: 'gwTaxAmt',
      sumGwTotalAmt: 'gwTotalAmt',
      sumSalesAmt: 'salesAmt',
      sumTaxExemptedSalesAmt: 'taxExemptedSalesAmt',
      sumTaxZeroSalesAmt: 'taxZeroSalesAmt',
      sumTaxAmt: 'taxAmt',
      sumTotalAmt: 'totalAmt'
    }

    var summaryInitObj = ramda.reduce(
      (summary, amountField) => {
        summary[amountField] = 0
        return summary
      },
      {},
      ramda.keys(sumAmountFields)
    )
    summaryInitObj['taxType'] = []
    summaryInitObj['taxRate'] = []
    summaryInitObj['transactions'] = []
    var summary = ramda.reduce(
      (result, line) => {
        result = ramda.reduce(
          (sumObj, sumField) => {
            result[sumField] += line[sumAmountFields[sumField]]
            return result
          },
          result,
          ramda.keys(sumAmountFields)
        )
        if (result['taxType'].indexOf(parseInt(line['taxType'].value)) === -1) {
          result['taxType'].push(parseInt(line['taxType'].value, 10))
        }

        if (result['taxRate'].indexOf(parseFloat(line['taxRate'])) === -1) {
          result['taxRate'].push(parseFloat(line['taxRate']))
        }
        if (line['tranInternalId']) {
          result['transactions'].push(line['tranInternalId'])
        }
        return result
      },
      summaryInitObj,
      eguiLines
    )
    var taxType = getSummaryTaxType(summary.taxType)
    summary.taxType = taxType
    summary.taxRate = getSummaryTaxRate(summary.taxRate, taxType)
    return summary
  }

  function validateSummaryTaxType(lineSumTaxType) {
    var result = {
      isValid: true,
      errorCode: '',
      errorMessage: ''
    }
    if (lineSumTaxType.length > 2) {
      result.isValid = false
      result.errorCode = 'INCORRECT_TAX_TYPE'
      result.errorMessage = 'Incorrect Tax Type'
    }
    if (
      lineSumTaxType.length === 2 &&
      !gwTaxTypeDao.isMixedTaxType(lineSumTaxType)
    ) {
      result.isValid = false
      result.errorCode = 'INCORRECT_MIX_TAX_TYPE'
      result.errorMessage = 'Incorrect Mix Tax Type'
    }
    if (lineSumTaxType.length === 0 || !lineSumTaxType) {
      result.isValid = false
      result.errorCode = 'MISSING_TAX_TYPE'
      result.errorMessage = 'Missing Tax Type'
    }
    return result
  }

  function validateSummaryTaxRate(lineSummaryTaxRate, taxType) {
    var result = {
      isValid: true,
      errorCode: '',
      errorMessage: ''
    }
    if (lineSummaryTaxRate.length > 2) {
      result.isValid = false
      result.errorCode = 'INVALID_TAX_RATE_COUNT'
      result.errorMessage = 'Tax Rate can only contains up to 2 different rates'
    }
    if (lineSummaryTaxRate.length === 2) {
      if (taxType.value === 9) {
        // if special tax type are allowed, it can only contains one tax rate
        result.isValid = false
        result.errorCode = 'INVALID_TAX_RATE'
        result.errorMessage =
          'TaxRate for Special Tax Type can only contain one rate'
      } else {
        // Only 0 and 0.5 are allowed
        if (
          lineSummaryTaxRate.indexOf(0) === -1 ||
          lineSummaryTaxRate.indexOf(5) === -1
        ) {
          result.isValid = false
          result.errorCode = 'INVALID_TAX_RATE_COMBINATION'
          result.errorMessage =
            'TaxRate for Mixed Tax Type can only contain 0% and 5%'
        }
      }
    }

    return result
  }

  function getSummaryTaxRate(lineSummaryTaxRate, taxType) {
    var validateResult = validateSummaryTaxRate(lineSummaryTaxRate, taxType)
    if (validateResult.isValid) {
      var taxRate = lineSummaryTaxRate[0]
      if (lineSummaryTaxRate.length === 2) {
        taxRate = Math.max(lineSummaryTaxRate[0], lineSummaryTaxRate[1])
      }
      return taxRate
    }
    throw validateResult
  }

  function getSummaryTaxType(lineSummaryTaxType) {
    var validateResult = validateSummaryTaxType(lineSummaryTaxType)
    if (validateResult.isValid) {
      var taxType = gwTaxTypeDao.getByValue(lineSummaryTaxType[0])
      if (lineSummaryTaxType.length === 2) taxType = gwTaxTypeDao.getByValue(9)
      return taxType
    }
    throw validateResult
  }

  function isCalculateByNs() {
    var configuration = gwEguiConfigDao.getConfig()
    return (
      gwTaxCalculationDao.getById(configuration.taxCalcMethod.value).value ===
      'NETSUITE'
    )
  }

  function updateSummaryToMain(eguiMain, eguiLineSummary) {
    var eguiMainObj = JSON.parse(JSON.stringify(eguiMain))
    eguiMainObj['salesAmt'] = Math.round(eguiLineSummary.sumSalesAmt)
    eguiMainObj['taxExemptedSalesAmt'] = Math.round(
      eguiLineSummary.sumTaxExemptedSalesAmt
    )
    eguiMainObj['zeroTaxSalesAmt'] = Math.round(
      eguiLineSummary.sumTaxZeroSalesAmt
    )
    eguiMainObj['taxAmt'] = Math.round(eguiLineSummary.sumTaxAmt)
    eguiMainObj['totalAmt'] = Math.round(eguiLineSummary.sumTotalAmt)
    eguiMainObj['transactions'] = ramda.uniq(eguiLineSummary['transactions'])
    eguiMainObj.taxType = eguiLineSummary.taxType
    eguiMainObj.taxRate = parseFloat(eguiLineSummary.taxRate / 100)
    return eguiMainObj
  }

  class InvoiceToEguiMapper {
    constructor(invObj) {
      this.invoice = invObj
    }

    transform() {
      var eguiMain = gwObjectMappingUtil.mapFrom(this.invoice, mainFields)
      eguiMain['buyerEmail'] =
        this.invoice['email.customer'] || this.invoice['customer']['email']
      var lines = transformLines(this.invoice.lines)
      var taxLines = transformLines(this.invoice.taxLines)
      eguiMain = updateBodyValues(eguiMain)
      lines = updateLines(lines)
      var lineSummary = summaryLines(lines)
      eguiMain = updateSummaryToMain(eguiMain, lineSummary)
      eguiMain.lines = lines
      this.egui = eguiMain
      return this.egui
    }
  }

  return InvoiceToEguiMapper
})
