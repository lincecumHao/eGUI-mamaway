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
  class ApDoc24Validator extends ApDocValidatorBase {
    constructor(apDocObj) {
      super(apDocObj)
    }

    getName() {
      return 'ApDoc24Validator'
    }

    validateGuiNumber(result) {
      if (
        !validationRuleBasic.isEitherOneFieldValueExists(
          this.apDocObj.guiNum,
          this.apDocObj.commonNumber,
        )
      ) {
        result.addError({
          errorCode: 'EITHER_ONE_FIELD_EXIST',
          errorMessage: 'Either Gui Number or Common Number must have value',
        })
        return result
      }
      if (!validationRuleBasic.isFieldValueEmptyOrNull(this.apDocObj.guiNum)) {
        // Validate common number or eguiNumber
        // if Common number exist then no need to validate this
        return super.validateGuiNumber(result)
      }
      return result
    }

    validateCommonNumber(result) {
      if (
        !validationRuleBasic.isEitherOneFieldValueExists(
          this.apDocObj.guiNum,
          this.apDocObj.commonNumber,
        )
      ) {
        result.addError({
          errorCode: 'EITHER_ONE_FIELD_EXIST',
          errorMessage: 'Either Gui Number or Common Number must have value',
        })
        return result
      }
      if (
        !validationRuleBasic.isFieldValueEmptyOrNull(this.apDocObj.commonNumber)
      ) {
        // Validate common number or eguiNumber
        // if Common number exist then no need to validate this
        var commonInvalidFormat = /^([A-Z]{0,2})(\d{8})$/


        if (commonInvalidFormat.test(this.apDocObj.commonNumber)) {
          result.addError({
            errorCode: 'INVALID_FIELD_VALUE',
            errorMessage: 'commonNumber format is incorrect',
          })
        }
        return result
      }
      return result
    }

    validateSellerTaxId(result) {
      const fieldName = 'sellerTaxId'
      result = validationRuleBasic.required(this.apDocObj, fieldName, result)
      result = super.validateSellerTaxId(result)
      return result
    }

    validateSellerName(result) {
      const fieldName = 'sellerName'
      result = validationRuleBasic.required(this.apDocObj, fieldName, result)
      return result
    }

    validateTaxType(result) {
      const fieldName = 'taxType'
      const qualifiedValues = [1, 2, 3, 4]
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

  return ApDoc24Validator
})
