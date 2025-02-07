define(['./gw_ap_list_validator', './gw_validation_rule_basic'], (
  ListValidator,
  validationRuleBasic
) => {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2022 Gateweb
   * @author Sean Lin <seanlin@gateweb.com.tw>
   *
   * @NApiVersion 2.1
   * @NModuleScope Public

   */

  class ApDocValidatorBase {
    constructor(apDocObj) {
      this.apDocObj = apDocObj
    }

    getName() {
      return 'ValidatorBase'
    }

    validate(result) {
      result = this.validateGuiNumber(result)
      result = this.validateCommonNumber(result)
      result = this.validateEguiStatus(result)
      result = this.validateInvoiceDate(result)
      result = this.validateBuyerTaxId(result)
      result = this.validateBuyerName(result)
      result = this.validateSellerTaxId(result)
      result = this.validateSellerName(result)
      result = this.validateSalesAmount(result)
      result = this.validateTaxAmount(result)
      result = this.validateTotalAmount(result)
      result = this.validateTaxType(result)
      result = this.validateFreeTaxSalesAmount(result)
      result = this.validateZeroTaxSalesAmount(result)
      result = this.validateDeductionCode(result)
      result = this.validateConsolidationMark(result)
      result = this.validateConsolidationQuantity(result)
      result = this.validateCustomClearanceMark(result)
      result = this.validateCurrency(result)
      result = this.validateZeroTaxMark(result)
      result = this.validateOutputDate(result)
      result = this.validateBusinessUnit(result)
      result = this.validateRelateNumber(result)
      result = this.validateApplyPeriod(result)
      result = this.validateSource(result)
      return result
    }

    validateGuiNumber(result) {
      const fieldName = 'guiNum'
      const length = 10
      const fieldValue = this.apDocObj[fieldName]
      if (!validationRuleBasic.isValueLengthMatch(fieldValue, 10)) {
        result.addError({
          errorCode: 'LENGTH_NOT_VALID',
          errorMessage: `${fieldName} length must be ${length}`
        })
      }
      const eguiFormat = /^([A-Z]{0,2})(\d{8})$/
      if (!eguiFormat.test(fieldValue)) {
        result.addError({
          errorCode: 'FORMAT_NOT_VALID',
          errorMessage: `${fieldName} format is incorrect`
        })
      }
      const eguiComponents = eguiFormat.exec(fieldValue.toString())

      return result
    }

    validateCommonNumber(result) {
      return result
    }

    validateEguiStatus(result) {
      const fieldName = 'guiStatus'
      result = validationRuleBasic.required(this.apDocObj, fieldName, result)
      if (result.isSuccess() && this.apDocObj[fieldName] === 0) {
        result.addError({
          errorCode: 'FIELD_IS_REQUIRED',
          errorMessage: `${fieldName} is required`
        })
      }
      if (
        !ListValidator.isListItemExists(fieldName, this.apDocObj[fieldName])
      ) {
        result.addError({
          errorCode: 'LIST_VALUE_NOT_VALID',
          errorMessage: `${fieldName}'s value is not a valid value`
        })
      }
      return result
    }

    validateInvoiceDate(result) {
      const fieldName = 'guiDate'
      result = validationRuleBasic.required(this.apDocObj, fieldName, result)
      const guiDateExpression = /^(\d{4})-?(\d{2})-?(\d{2})$/gm
      if (
        result.isSuccess() &&
        !guiDateExpression.test(this.apDocObj[fieldName])
      ) {
        result.addError({
          errorCode: 'FORMAT_NOT_VALID',
          errorMessage: `${fieldName} format is incorrect (YYYYMMDD or YYYY-MM-DD}`
        })
      }
      return result
    }

    validateBuyerTaxId(result) {
      const fieldName = 'buyerTaxId'
      const length = 8
      result = validationRuleBasic.required(this.apDocObj, fieldName, result)
      if (
        result.isSuccess() &&
        !validationRuleBasic.isValueLengthMatch(
          this.apDocObj[fieldName],
          length
        )
      ) {
        result.addError({
          errorCode: 'LENGTH_NOT_VALID',
          errorMessage: `${fieldName} length must be ${length}`
        })
      }
      return result
    }

    validateBuyerName(result) {
      const fieldName = 'buyerName'
      if (
        !validationRuleBasic.isValueLengthInRange(
          this.apDocObj[fieldName],
          0,
          60
        )
      ) {
        result.addError({
          errorCode: 'LENGTH_NOT_VALID',
          errorMessage: `${fieldName} length must be 0~60`
        })
      }
      return result
    }

    validateSellerTaxId(result) {
      const fieldName = 'sellerTaxId'
      const length = 8
      if (
        !validationRuleBasic.isValueLengthMatch(
          this.apDocObj[fieldName],
          length
        )
      ) {
        result.addError({
          errorCode: 'LENGTH_NOT_VALID',
          errorMessage: `${fieldName} length must be ${length}`
        })
      }

      return result
    }

    validateSellerName(result) {
      const fieldName = 'sellerName'
      if (
        !validationRuleBasic.isValueLengthInRange(
          this.apDocObj[fieldName],
          1,
          60
        )
      ) {
        result.addError({
          errorCode: 'LENGTH_NOT_VALID',
          errorMessage: `${fieldName} length must be 0~60`
        })
      }
      return result
    }

    validateSalesAmount(result) {
      const fieldName = 'salesAmt'
      const fieldValue = parseInt(this.apDocObj[fieldName])
      const fieldLength = 12
      if (validationRuleBasic.isValueLengthExceed(fieldValue, fieldLength)) {
        result.addError({
          errorCode: 'AMOUNT_LENGTH_EXCEEDED',
          errorMessage: `${fieldName} cannot exceed length of ${fieldLength}`
        })
      }
      const taxType = this.apDocObj['taxType']
      if (taxType === 1 || taxType === 9) {
        if (fieldValue <= 0) {
          result.addError({
            errorCode: 'SALES_AMOUNT_NOT_VALID',
            errorMessage: `For tax type ${taxType}, sales amount should greater than 0`
          })
        }
      }
      if (taxType === 2 || taxType === 3) {
        if (fieldValue > 0) {
          result.addError({
            errorCode: 'SALES_AMOUNT_NOT_VALID',
            errorMessage: `For tax type ${taxType}, sales amount should be zero`
          })
        }
      }
      return result
    }

    validateTaxAmount(result) {
      const fieldName = 'taxAmt'
      const fieldValue = parseInt(this.apDocObj[fieldName])
      const fieldLength = 10
      const taxType = this.apDocObj['taxType']
      const salesAmt = parseInt(this.apDocObj['salesAmt'])
      const expectedTaxAmt = Math.round(salesAmt * 0.05)
      const consolidationMark = this.apDocObj['consolidationMark']
      const consolidationQty = this.apDocObj['consolidationQty'] || 1
      const acceptableRange =
        parseInt(consolidationQty) === 1 ? 5 : parseInt(consolidationQty)
      if (validationRuleBasic.isValueLengthExceed(fieldValue, fieldLength)) {
        result.addError({
          errorCode: 'AMOUNT_LENGTH_EXCEEDED',
          errorMessage: `${fieldName} cannot exceed length of ${fieldLength}`
        })
      }
      if (
        (taxType === 1 || taxType === 9) &&
        Math.abs(expectedTaxAmt - fieldValue) > acceptableRange
      ) {
        result.addError({
          errorCode: 'AMOUNT_NOT_VALID',
          errorMessage: `${fieldName} is incorrect, should be ${expectedTaxAmt}`
        })
      }
      if ((taxType === 2 || taxType === 3) && fieldValue > 0) {
        result.addError({
          errorCode: 'TAX_AMOUNT_SHOULD_BE_ZERO',
          errorMessage: `${fieldName} should be 0 for tax type ${taxType},`
        })
      }
      return result
    }

    validateTotalAmount(result) {
      const fieldName = 'totalAmt'
      const fieldLength = 12
      const salesAmt = parseInt(this.apDocObj['salesAmt'])
      const totalAmt = parseInt(this.apDocObj[fieldName])
      const taxAmt = parseInt(this.apDocObj['taxAmt'])
      const taxExemptedSalesAmt = parseInt(this.apDocObj['taxExemptedSalesAmt'])
      const zeroTaxSalesAmt = parseInt(this.apDocObj['zeroTaxSalesAmt'])
      if (validationRuleBasic.isValueLengthExceed(totalAmt, fieldLength)) {
        result.addError({
          errorCode: 'AMOUNT_LENGTH_EXCEEDED',
          errorMessage: `${fieldName} cannot exceed length of ${fieldLength}`
        })
      }
      if (
        totalAmt !==
        salesAmt + taxAmt + taxExemptedSalesAmt + zeroTaxSalesAmt
      ) {
        result.addError({
          errorCode: 'AMOUNT_INCORRECT',
          errorMessage: 'Total Amount is incorrect'
        })
      }
      return result
    }

    validateTaxType(result) {
      const fieldName = 'taxType'
      result = validationRuleBasic.required(this.apDocObj, fieldName, result)
      return result
    }

    validateFreeTaxSalesAmount(result) {
      const fieldName = 'taxExemptedSalesAmt'
      const fieldValue = parseInt(this.apDocObj[fieldName])
      const fieldLength = 10
      if (validationRuleBasic.isValueLengthExceed(fieldValue, fieldLength)) {
        result.addError({
          errorCode: 'AMOUNT_LENGTH_EXCEEDED',
          errorMessage: `${fieldName} cannot exceed length of ${fieldLength}`
        })
      }
      return result
    }

    validateZeroTaxSalesAmount(result) {
      const fieldName = 'zeroTaxSalesAmt'
      const fieldValue = parseInt(this.apDocObj[fieldName])
      const fieldLength = 10
      if (validationRuleBasic.isValueLengthExceed(fieldValue, fieldLength)) {
        result.addError({
          errorCode: 'AMOUNT_LENGTH_EXCEEDED',
          errorMessage: `${fieldName} cannot exceed length of ${fieldLength}`
        })
      }
      return result
    }

    validateDeductionCode(result) {
      const fieldName = 'deductionCode'
      result = validationRuleBasic.required(this.apDocObj, fieldName, result)
      const taxType = parseInt(this.apDocObj['taxType'])
      const allowedValues = [3, 4]
      if (taxType === 1) {
        allowedValues.push(1)
        allowedValues.push(2)
      }
      result = validationRuleBasic.validateValues(
        allowedValues,
        parseInt(this.apDocObj[fieldName]),
        fieldName,
        result
      )
      return result
    }

    validateConsolidationMark(result) {
      return result
    }

    validateConsolidationQuantity(result) {
      return result
    }

    validateCustomClearanceMark(result) {
      result = validationRuleBasic.mustNotHave(
        this.apDocObj,
        'customClearanceMark',
        result
      )
      return result
    }

    validateCurrency(result) {
      // validate list
      const fieldName = 'currency'
      if (
        !ListValidator.isListItemExists(fieldName, this.apDocObj[fieldName])
      ) {
        result.addError({
          errorCode: 'LIST_VALUE_NOT_VALID',
          errorMessage: `${fieldName}'s value is not a valid value`
        })
      }
      return result
    }

    validateZeroTaxMark(result) {
      result = validationRuleBasic.mustNotHave(
        this.apDocObj,
        'zeroTaxMark',
        result
      )
      return result
    }

    validateOutputDate(result) {
      result = validationRuleBasic.mustNotHave(
        this.apDocObj,
        'outputDate',
        result
      )
      return result
    }

    validateBusinessUnit(result) {
      return result
    }

    validateRelateNumber(result) {
      return result
    }

    validateApplyPeriod(result) {
      // Validate List
      const fieldName = 'taxFilingPeriod'
      if (
        !ListValidator.isListItemExists(fieldName, this.apDocObj[fieldName])
      ) {
        result.addError({
          errorCode: 'LIST_VALUE_NOT_VALID',
          errorMessage: `${fieldName}'s value is not a valid value`
        })
      }
      return result
    }

    validateSource(result) {
      return result
    }
  }

  return ApDocValidatorBase
})
