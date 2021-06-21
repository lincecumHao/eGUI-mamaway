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
  let exports = {}

  // Fill in values in body if field is missing
  function updateBodyValues(eguiMain) {
    var configuration = gwEguiConfigDao.getConfig()
    var eguiMainObj = JSON.parse(JSON.stringify(eguiMain))
    var seller = gwBusinessEntityDao.getByTaxId(eguiMainObj.sellerTaxId)
    eguiMainObj = updateSeller(eguiMainObj, seller)
    eguiMainObj = updateCarrierAndDonation(eguiMainObj)
    eguiMainObj = updateMiscFields(eguiMainObj, configuration)
    eguiMainObj = updateGuiNumber(eguiMainObj)
    log.debug({ title: 'eguiMainObj', details: eguiMainObj })
    return eguiMainObj
  }

  function updateSeller(eguiMainObj, seller) {
    var eguiMain = JSON.parse(JSON.stringify(eguiMainObj))
    eguiMain.sellerName = 'TestName'
    eguiMain.sellerAddress = 'TestAddress'
    eguiMain.guiType = gwGuiTypeDao.getRegularGuiType()
    return eguiMain
  }

  function updateBuyer() {}

  function updateGuiNumber(eguiMainObj) {
    var eguiMain = JSON.parse(JSON.stringify(eguiMainObj))
    eguiMain.manualGuiNumber = eguiMain.eguiNumStart
    eguiMain.documentNumber = eguiMain.eguiNumStart
    return eguiMain
  }

  function updateCarrierAndDonation(eguiMainObj) {
    var eguiMain = JSON.parse(JSON.stringify(eguiMainObj))
    eguiMain['needUploadMig'] =
      eguiMain['isNotUploadEGui'] === 'F' ? 'ALL' : 'NONE'
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
      ? eguiMain.taxApplyPeriod
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
      ? eguiMain['docFormat']
      : gwDocFormatDao.getDefaultArGuiFormat(eguiMain['guiType'].value)
    // eguiMain['isTransactionLocked'] = 'T'
    return eguiMain
  }

  // TBD: more scenarios might be applicable
  function getDocumentStatus(isIssueEgui, isNotUploadEgui) {
    var issueEgui = isIssueEgui === 'T'
    var uploadEgui = isNotUploadEgui === 'F'
    if (issueEgui && uploadEgui) return mainFields.voucherStatus.VOUCHER_ISSUE
    if (issueEgui && !uploadEgui)
      return mainFields.voucherStatus.VOUCHER_SUCCESS
  }

  function transformLines(tranLines) {
    return ramda.map((line) => {
      var eguiLine = gwObjectMappingUtil.mapFrom(line, lineFields)
      eguiLine['taxRate'] = line['rate.taxItem']
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

  //calculate line tax amount and total amount
  function updateLine(eguiLine) {
    var line = JSON.parse(JSON.stringify(eguiLine))
    var taxRate = parseFloat(
      parseInt(line['taxRate'].replace('%', ''), 10) / 100
    )
    line['taxRate'] = taxRate
    line['taxType'] = gwTaxTypeDao.getTaxTypeByTaxCode(line['taxCode'].value)

    var salesAmt = parseFloat(line['nsAmt'])
    var taxAmt = parseFloat(salesAmt * taxRate)
    var totalAmt = salesAmt + taxAmt
    line['calculatedSalesAmt'] = salesAmt
    line['calculatedTaxAmt'] = taxAmt
    line['calculatedTotalAmt'] = totalAmt
    line['salesAmt'] = isCalculateByNs() ? parseFloat(line['nsAmt']) : salesAmt
    line['taxAmt'] = isCalculateByNs() ? parseFloat(line['nsTaxAmt']) : taxAmt
    line['totalAmt'] = isCalculateByNs()
      ? parseFloat(line['nsTotalAmt'])
      : totalAmt

    return line
  }

  // Sum all lines
  function calculateLines(eguiLines) {
    var summary = {
      lineSumSalesAmt: 0,
      lineSumTaxExemptedSalesAmt: 0,
      lineSumTaxZeroSalesAmt: 0,
      lineSumTaxAmtAmt: 0,
      lineSumTotalAmt: 0,
      taxType: [],
      taxRate: [],
      transactions: []
    }
    var taxTypeCalculateRoute = {
      1: 'lineSumSalesAmt',
      2: 'lineSumTaxExemptedSalesAmt',
      3: 'lineSumTaxZeroSalesAmt'
    }
    var summaryResult = ramda.reduce(
      (result, line) => {
        log.debug({ title: 'summaryResult line', details: line })
        var summaryFieldId = taxTypeCalculateRoute[line['taxType'].value]
        result[summaryFieldId] += parseFloat(line['salesAmt'])
        result['lineSumTaxAmtAmt'] += parseFloat(line['taxAmt'])
        result['lineSumTotalAmt'] += parseFloat(line['totalAmt'])
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
      summary,
      eguiLines
    )
    // Update and validate tax type
    if (summaryResult.taxType.length > 2) throw 'Incorrect Tax Type'
    if (summaryResult.taxType.length === 1)
      summaryResult['taxType'] = gwTaxTypeDao.getByValue(
        summaryResult['taxType'][0]
      )
    else if (
      summaryResult.taxType.length === 2 &&
      gwTaxTypeDao.isMixedTaxType(summaryResult.taxType)
    ) {
      summaryResult.taxType = gwTaxTypeDao.getByValue(9)
    }

    // Update and validate tax rate
    if (summaryResult.taxRate.length > 2) throw 'taxRate invalid'
    if (
      summaryResult.taxRate.length === 2 &&
      summaryResult.taxType.value !== '9'
    )
      throw 'not mix tax can only have 1 tax rate'
    if (
      summaryResult.taxRate.length === 2 &&
      summaryResult.taxType.value === '9'
    ) {
      if (
        !(
          summaryResult.taxRate.indexOf(0) > -1 &&
          summaryResult.taxRate.indexOf(0.05) > -1
        )
      ) {
        throw 'mix tax rate can only have 0 and 0.05'
      } else {
        summaryResult.taxRate = 0.05
      }
    }

    if (summaryResult.taxRate.length === 1)
      summaryResult.taxRate = summaryResult.taxRate[0]
    // log.debug({ title: 'summaryResult', details: summaryResult })
    return summaryResult
  }

  function updateLineSummaryToMain(eguiMain, lineSummary) {
    var eguiMainObj = ramda.mergeRight(
      JSON.parse(JSON.stringify(eguiMain)),
      lineSummary
    )
    var nsSalesAmt = parseFloat(eguiMainObj['nsSalesAmt'])
    var nsTaxAmt = parseFloat(eguiMainObj['nsTaxAmt'])
    var nsTotalAmt = parseFloat(eguiMainObj['nsTotalAmt'])
    var lineSumSalesAmt = parseFloat(eguiMainObj['lineSumSalesAmt'])
    var taxExemptedSalesAmt = parseFloat(
      eguiMainObj['lineSumTaxExemptedSalesAmt']
    )
    var zeroTaxSalesAmt = parseFloat(eguiMainObj['lineSumTaxZeroSalesAmt'])
    var salesAmt = nsSalesAmt - taxExemptedSalesAmt - zeroTaxSalesAmt
    var taxAmt = parseFloat(eguiMainObj['taxRate']) * salesAmt
    var totalAmt = salesAmt + taxAmt + taxExemptedSalesAmt + zeroTaxSalesAmt
    eguiMainObj['calculatedSalesAmt'] = salesAmt
    eguiMainObj['calculatedTaxExemptedSalesAmt'] = taxExemptedSalesAmt
    eguiMainObj['calculatedZeroTaxSalesAmt'] = zeroTaxSalesAmt
    eguiMainObj['calculatedTaxAmt'] = taxAmt
    eguiMainObj['calculatedTotalAmt'] = totalAmt

    eguiMainObj['salesAmt'] = Math.round(salesAmt)
    eguiMainObj['taxExemptedSalesAmt'] = Math.round(taxExemptedSalesAmt)
    eguiMainObj['zeroTaxSalesAmt'] = Math.round(zeroTaxSalesAmt)
    eguiMainObj['taxAmt'] = isCalculateByNs()
      ? Math.round(nsTaxAmt)
      : Math.round(taxAmt)
    eguiMainObj['totalAmt'] = isCalculateByNs()
      ? Math.round(nsTotalAmt)
      : Math.round(totalAmt)
    eguiMainObj['transactions'] = ramda.uniq(lineSummary['transactions'])
    return eguiMainObj
  }

  function isCalculateByNs() {
    var configuration = gwEguiConfigDao.getConfig()
    return (
      gwTaxCalculationDao.getById(configuration.taxCalcMethod.value).value ===
      'NETSUITE'
    )
  }

  class InvoiceToEguiMapper {
    constructor(invObj) {
      this.invoice = invObj
    }

    transform() {
      var eguiMain = gwObjectMappingUtil.mapFrom(this.invoice, mainFields)
      log.debug({
        title: 'InvoiceToGuiMapper transform eguiMain',
        details: eguiMain
      })
      var lines = transformLines(this.invoice.lines)
      var taxLines = transformLines(this.invoice.taxLines)
      eguiMain = updateBodyValues(eguiMain)
      lines = updateLines(lines)
      this.egui = this.calculateLinesAndMergeToMain(eguiMain, lines)

      return this.egui
    }

    calculateLinesAndMergeToMain(eguiMain, eguiLines) {
      var eguiMainObj = JSON.parse(JSON.stringify(eguiMain))
      var eguiLinesObj = JSON.parse(JSON.stringify(eguiLines))
      var lineSummary = calculateLines(eguiLinesObj)
      eguiMainObj = updateLineSummaryToMain(eguiMainObj, lineSummary)
      eguiMainObj.lines = eguiLinesObj
      return eguiMainObj
    }
  }

  return InvoiceToEguiMapper
})
