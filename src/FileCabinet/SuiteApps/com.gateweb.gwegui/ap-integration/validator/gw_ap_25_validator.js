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
  class ApDoc25Validator extends ApDocValidatorBase {
    constructor(apDocObj) {
      super(apDocObj)
    }
    getName() {
      return 'ApDoc25Validator'
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
          this.apDocObj.commonNumber
        )
      ) {
        result.addError({
          errorCode: 'EITHER_ONE_FIELD_EXIST',
          errorMessage: 'Either Gui Number or Common Number must have value'
        })
        return result
      }
      if (
        !validationRuleBasic.isFieldValueEmptyOrNull(this.apDocObj.commonNumber)
      ) {
        // Validate common number or eguiNumber
        // if Common number exist then no need to validate this
        var commonFormat = /^(B{2})([A-Z,\d]{8})$/

        if (!commonFormat.test(this.apDocObj.commonNumber)) {
          result.addError({
            errorCode: 'INVALID_FIELD_VALUE',
            errorMessage: 'commonNumber format is incorrect'
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
  return ApDoc25Validator
})
