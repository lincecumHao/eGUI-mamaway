define([
  '../../../library/ramda.min',
  '../../../library/gw_date_util',
  '../gw_mapping_util',
  '../../domain/vo/allowance/gw_allowance_main_fields',
  '../../domain/vo/allowance/gw_allowance_line_fields',
  '../../../gw_dao/settings/gw_dao_egui_config_21',
  '../../../gw_dao/busEnt/gw_dao_business_entity_21',
  '../../../gw_dao/guiType/gw_dao_egui_type_21',
  '../../../gw_dao/applyPeriod/gw_dao_apply_period_21',
  '../../../gw_dao/docFormat/gw_dao_doc_format_21',
  '../../../gw_dao/taxCalcMethod/gw_dao_tax_calc_method_21',
  '../../../gw_dao/taxType/gw_dao_tax_type_21',
], (
  ramda,
  dateUtil,
  gwObjectMappingUtil,
  mainFields,
  lineFields,
  gwEguiConfigDao,
  gwBusinessEntityDao,
  gwGuiTypeDao,
  gwApplyPeriodDao,
  gwDocFormatDao,
  gwTaxCalculationDao,
  gwTaxTypeDao
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
  function transformLines(tranLines) {
    return ramda.map((line) => {
      var allowanceLine = gwObjectMappingUtil.mapFrom(line, lineFields)
      allowanceLine['taxRate'] = line['rate.taxItem']
      return allowanceLine
    }, tranLines)
  }

  function updateBodyValues(allowanceMain) {
    var configuration = gwEguiConfigDao.getConfig()
    var allowanceMainObj = JSON.parse(JSON.stringify(allowanceMain))
    log.debug({
      title: 'updateBodyValues allowanceMain',
      details: allowanceMainObj,
    })
    allowanceMainObj.isNotUploadEGui = 'T'
    allowanceMainObj.isUploadEGui = 'F'
    var seller = gwBusinessEntityDao.getBySubsidiary(
      allowanceMainObj.subsidiaryId.toString()
    )
    log.debug({ title: 'updateBodyValues seller', details: seller })
    allowanceMainObj['sellerTaxId'] = seller.taxId
    allowanceMainObj['sellerName'] = seller.title
    allowanceMainObj['sellerAddress'] = `${seller.city.text}${seller.address}`
    allowanceMainObj['documentType'] = mainFields.voucherType.ALLOWANCE
    allowanceMainObj['documentTime'] = '23:59:59'
    allowanceMainObj['guiType'] = seller.isNonValueAdded
      ? gwGuiTypeDao.getSpecialGuiType()
      : gwGuiTypeDao.getRegularGuiType()
    allowanceMainObj['sellerProfile'] = seller
    allowanceMainObj.documentDate = allowanceMainObj.documentDate
      ? allowanceMainObj.documentDate
      : allowanceMainObj.tranDate
    allowanceMainObj['documentPeriod'] = allowanceMainObj.documentPeriod
      ? allowanceMainObj.documentPeriod
      : dateUtil.getGuiPeriod(allowanceMainObj.documentDate)
    allowanceMainObj['taxApplyPeriod'] = allowanceMainObj['taxApplyPeriod']
      ? allowanceMainObj.taxApplyPeriod
      : gwApplyPeriodDao.getByText(allowanceMainObj.documentPeriod)
    allowanceMainObj['taxCalculationMethod'] = allowanceMainObj[
      'taxCalculationMethod'
    ]
      ? allowanceMainObj['taxCalculationMethod']
      : gwTaxCalculationDao.getById(configuration.taxCalcMethod.value)

    allowanceMainObj['documentStatus'] = getDocumentStatus(
      allowanceMainObj['isIssueEgui'],
      allowanceMainObj['isNotUploadEGui']
    )
    allowanceMainObj['documentUploadStatus'] = 'A'
    allowanceMainObj['needUploadMig'] = 'NONE'

    allowanceMainObj['docFormat'] = allowanceMainObj['docFormat']
      ? allowanceMainObj['docFormat']
      : gwDocFormatDao.getDefaultArAllowanceFormat()

    allowanceMainObj['isTransactionLocked'] = 'T'

    log.debug({ title: 'allowanceObj', details: allowanceMainObj })
    return allowanceMainObj
  }

  function updateLines(allowanceLines) {
    var lineSeq = 1
    return ramda.map((allowanceLine) => {
      var line = updateLine(allowanceLine)
      line['lineSeq'] = lineSeq
      lineSeq++
      return line
    }, allowanceLines)
  }

  function updateLine(allowanceLine) {
    var line = JSON.parse(JSON.stringify(allowanceLine))
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

  function calculateLines(allowanceLines) {
    var summary = {
      lineSumSalesAmt: 0,
      lineSumTaxExemptedSalesAmt: 0,
      lineSumTaxZeroSalesAmt: 0,
      lineSumTaxAmtAmt: 0,
      lineSumTotalAmt: 0,
      taxType: [],
      taxRate: [],
      transactions: [],
    }
    var taxTypeCalculateRoute = {
      1: 'lineSumSalesAmt',
      2: 'lineSumTaxExemptedSalesAmt',
      3: 'lineSumTaxZeroSalesAmt',
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
      allowanceLines
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

  function updateLineSummaryToMain(allowanceMain, lineSummary) {
    var allowanceMainObj = ramda.mergeRight(
      JSON.parse(JSON.stringify(allowanceMain)),
      lineSummary
    )
    var nsSalesAmt = parseFloat(allowanceMainObj['nsSalesAmt'])
    var nsTaxAmt = parseFloat(allowanceMainObj['nsTaxAmt'])
    var nsTotalAmt = parseFloat(allowanceMainObj['nsTotalAmt'])
    var lineSumSalesAmt = parseFloat(allowanceMainObj['lineSumSalesAmt'])
    var taxExemptedSalesAmt = parseFloat(
      allowanceMainObj['lineSumTaxExemptedSalesAmt']
    )
    var zeroTaxSalesAmt = parseFloat(allowanceMainObj['lineSumTaxZeroSalesAmt'])
    var salesAmt = nsSalesAmt - taxExemptedSalesAmt - zeroTaxSalesAmt
    var taxAmt = parseFloat(allowanceMainObj['taxRate']) * salesAmt
    var totalAmt = salesAmt + taxAmt + taxExemptedSalesAmt + zeroTaxSalesAmt
    allowanceMainObj['calculatedSalesAmt'] = salesAmt
    allowanceMainObj['calculatedTaxExemptedSalesAmt'] = taxExemptedSalesAmt
    allowanceMainObj['calculatedZeroTaxSalesAmt'] = zeroTaxSalesAmt
    allowanceMainObj['calculatedTaxAmt'] = taxAmt
    allowanceMainObj['calculatedTotalAmt'] = totalAmt

    allowanceMainObj['salesAmt'] = Math.round(salesAmt)
    allowanceMainObj['taxExemptedSalesAmt'] = Math.round(taxExemptedSalesAmt)
    allowanceMainObj['zeroTaxSalesAmt'] = Math.round(zeroTaxSalesAmt)
    allowanceMainObj['taxAmt'] = isCalculateByNs()
      ? Math.round(nsTaxAmt)
      : Math.round(taxAmt)
    allowanceMainObj['totalAmt'] = isCalculateByNs()
      ? Math.round(nsTotalAmt)
      : Math.round(totalAmt)
    allowanceMainObj['transactions'] = ramda.uniq(lineSummary['transactions'])
    return allowanceMainObj
  }

  function isCalculateByNs() {
    var configuration = gwEguiConfigDao.getConfig()
    return (
      gwTaxCalculationDao.getById(configuration.taxCalcMethod.value).value ===
      'NETSUITE'
    )
  }

  function getDocumentStatus(isIssueAllowance, isNotUploadAllowance) {
    var issueAllowance = isIssueAllowance === 'T'
    var uploadAllowance = isNotUploadAllowance === 'F'
    if (issueAllowance && uploadAllowance)
      return mainFields.voucherStatus.VOUCHER_ISSUE
    if (issueAllowance && !uploadAllowance)
      return mainFields.voucherStatus.VOUCHER_SUCCESS
  }

  class CreditMemoToAllowanceMapper {
    constructor(cmObj) {
      this.creditMemo = cmObj
    }

    transform() {
      var allowance = gwObjectMappingUtil.mapFrom(this.creditMemo, mainFields)
      var lines = transformLines(this.creditMemo.lines)
      allowance = updateBodyValues(allowance)
      lines = updateLines(lines)
      this.egui = this.calculateLinesAndMergeToMain(allowance, lines)
      return this.egui
    }

    calculateLinesAndMergeToMain(allowanceMain, allowanceLines) {
      var allowanceMainObj = JSON.parse(JSON.stringify(allowanceMain))
      var allowanceLinesObj = JSON.parse(JSON.stringify(allowanceLines))
      var lineSummary = calculateLines(allowanceLinesObj)
      allowanceMainObj = updateLineSummaryToMain(allowanceMainObj, lineSummary)
      allowanceMainObj.lines = allowanceLinesObj
      return allowanceMainObj
    }
  }

  return CreditMemoToAllowanceMapper
})
