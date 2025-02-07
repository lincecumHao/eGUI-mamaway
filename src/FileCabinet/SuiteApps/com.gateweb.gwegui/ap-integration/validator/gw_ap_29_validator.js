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
  class ApDoc29Validator extends ApDocValidatorBase {
    constructor(apDocObj) {
      super(apDocObj)
    }

    getName() {
      return 'ApDoc29Validator'
    }

    validateGuiNumber(result) {
      const fieldName = 'guiNum'
      result = validationRuleBasic.mustNotHave(this.apDocObj,fieldName, result)
      return result
    }

    validateCommonNumber(result) {
      const fieldName = 'commonNumber'
      const fieldValue = this.apDocObj[fieldName]
      const fieldLength = 14
      result = validationRuleBasic.required(this.apDocObj, fieldName, result)
      if (result.isSuccess() && !validationRuleBasic.isValueLengthMatch(fieldValue, fieldLength)){
        result.addError({
          errorCode: 'COMMON_NUMBER_LENGTH_NOT_VALID',
          errorMessage: `${fieldName} length is ${fieldLength}`
        })
      }
      return result
    }

    validateSellerTaxId(result) {
      const fieldName = 'sellerTaxId'
      result = validationRuleBasic.mustNotHave(this.apDocObj, fieldName, result)
      return result
    }
    validateSellerName(result) {
      const fieldName = 'sellerName'
      result = validationRuleBasic.mustNotHave(this.apDocObj, fieldName, result)
      return result
    }

    validateTaxType(result) {
      const fieldName = 'taxType'
      const qualifiedValues = [1]
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

    validateConsolidationMark(result) {
      const fieldName = 'consolidationMark'
      const fieldValue = this.apDocObj[fieldName] || 'S'
      const allowedValues = ['S']
      result = validationRuleBasic.validateValues(
        allowedValues,
        fieldValue,
        fieldName,
        result
      )
      return result
    }

    validateConsolidationQuantity(result) {
      const fieldName = 'consolidationQty'
      result = validationRuleBasic.mustNotHave(this.apDocObj, fieldName, result)
      return result
    }
  }

  return ApDoc29Validator
})
