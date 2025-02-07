define(['./gw_ap_doc_validator_base', './gw_validation_rule_basic'], (
  ApDocValidatorBase,
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
  class ApDoc22Validator extends ApDocValidatorBase {
    constructor(apDocObj) {
      super(apDocObj)
    }
    getName() {
      return 'ApDoc22Validator'
    }
    validateGuiNumber(result) {
      if (
        !validationRuleBasic.isEitherOneFieldValueExists(
          this.apDocObj.guiNum,
          this.apDocObj.commonNumber
        )
      ) {
        result.addError({
          errorCode: 'EITHER_ONE_FIELD_EXIST',
          errorMessage: 'Either Gui Number or Common Number must have value'
        })
        return result
      }
      if (!validationRuleBasic.isFieldValueEmptyOrNull(this.apDocObj.guiNum)) {
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
      const consolidationMark = this.apDocObj['consolidationMark'] || 'S'
      if (consolidationMark === 'S') {
        result = super.validateSellerTaxId(result)
      }
      return result
    }
    validateSellerName(result) {
      const consolidationMark = this.apDocObj['consolidationMark'] || 'S'
      if (consolidationMark === 'S') {
        result = super.validateSellerName(result)
      }
      return result
    }
    validateTaxType(result) {
      const fieldName = 'taxType'
      const qualifiedValues = [1, 2, 3, 9]
      result = super.validateTaxType(result)
      if (result.isSuccess()) {
        result = validationRuleBasic.validateValues(
          qualifiedValues,
          parseInt(this.apDocObj[fieldName]),
          fieldName,
          result
        )
      }
      return result
    }

    validateConsolidationMark(result) {
      const fieldName = 'consolidationMark'
      const fieldValue = this.apDocObj[fieldName] || 'S'
      const allowedValues = ['A', 'B', 'S']
      result = validationRuleBasic.validateValues(
        allowedValues,
        fieldValue,
        fieldName,
        result
      )
      if (fieldValue === 'A'){
        result = validationRuleBasic.required(this.apDocObj['commonNumber'], result)
      }
      return result
    }
    validateConsolidationQuantity(result) {
      const fieldName = 'consolidationQty'
      const fieldValue = this.apDocObj[fieldName] || 1
      const consolidationMark = this.apDocObj['consolidationMark'] || 'S'

      if (
        consolidationMark === 'A' &&
        !validationRuleBasic.isNumberValueInRange(fieldValue, 2, 9999)
      ) {
        result.addError({
          errorCode: 'CONSOLIDATE_COUNT_INCORRECT',
          errorMessage: 'Consolidation count must between 2 to 9999'
        })
      }
      return result
    }
  }
  return ApDoc22Validator
})
