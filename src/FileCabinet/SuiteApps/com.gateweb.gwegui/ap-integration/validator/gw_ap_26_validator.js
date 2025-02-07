define(['./gw_ap_doc_validator_base', './gw_validation_rule_basic'], (ApDocValidatorBase, validationRuleBasic) => {
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
  class ApDoc26Validator extends ApDocValidatorBase {
    constructor(apDocObj) {
      super(apDocObj)
    }

    getName() {
      return 'ApDoc26Validator'
    }

    validateGuiNumber(result) {
      const fieldName = 'guiNum'
      result = validationRuleBasic.required(this.apDocObj, fieldName, result)
      if (result.isSuccess()) {
        return super.validateGuiNumber(result)
      }
      return result
    }

    validateCommonNumber(result) {
      const fieldName = 'commonNumber'
      result = validationRuleBasic.mustNotHave(this.apDocObj, fieldName, result)
      return result
    }

    validateSellerTaxId(result) {
      return result
    }

    validateSellerName(result) {
      return result
    }

    validateTaxType(result) {
      const fieldName = 'taxType'
      const qualifiedValues = [1, 2, 3]
      result = super.validateTaxType(result)
      if (result.isSuccess()) {
        result = validationRuleBasic.validateValues(
          qualifiedValues,
          parseInt(this.apDocObj[fieldName]),
          fieldName,
          result,
        )
      }
      return result
    }

    validateTaxAmount(result) {
      const fieldName = 'taxAmt'
      const fieldValue = parseInt(this.apDocObj[fieldName])
      const taxType = this.apDocObj['taxType']
      const consolidationQty = this.apDocObj['consolidationQty']
      const averageTaxAmount = Math.round(fieldValue / consolidationQty)
      if ((taxType === 1 || taxType === 9) && averageTaxAmount > 500) {
        result.addError({
          errorCode: 'AMOUNT_NOT_VALID',
          errorMessage: `average ${fieldName} should less than 500`,
        })
      }
      result = super.validateTaxAmount(result)
      return result
    }

    validateConsolidationMark(result) {
      const fieldName = 'consolidationMark'
      const fieldValue = this.apDocObj[fieldName] || 'S'
      const allowedValues = ['A']
      result = validationRuleBasic.validateValues(
        allowedValues,
        fieldValue,
        fieldName,
        result,
      )
      return result
    }

    validateConsolidationQuantity(result) {
      const fieldName = 'consolidationQty'
      const fieldValue = this.apDocObj[fieldName] || 1

      if (
        !validationRuleBasic.isNumberValueInRange(fieldValue, 2, 9999)
      ) {
        result.addError({
          errorCode: 'CONSOLIDATE_COUNT_INCORRECT',
          errorMessage: 'Consolidation count must between 2 to 9999',
        })
      }
      return result
    }
  }

  return ApDoc26Validator
})
