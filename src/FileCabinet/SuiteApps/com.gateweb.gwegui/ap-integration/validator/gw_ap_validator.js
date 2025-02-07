define([
  './gw_ap_validation_result',
  './gw_validation_rule_basic',
  './gw_ap_21_validator',
  './gw_ap_22_validator',
  './gw_ap_23_validator',
  './gw_ap_24_validator',
  './gw_ap_25_validator',
  './gw_ap_26_validator',
  './gw_ap_27_validator',
  './gw_ap_28_validator',
  './gw_ap_29_validator'
], (
  Result,
  validationRuleBasic,
  docType21Validator,
  docType22Validator,
  docType23Validator,
  docType24Validator,
  docType25Validator,
  docType26Validator,
  docType27Validator,
  docType28Validator,
  docType29Validator
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

  const validatorMap = {
    21: docType21Validator,
    22: docType22Validator,
    23: docType23Validator,
    24: docType24Validator,
    25: docType25Validator,
    26: docType26Validator,
    27: docType27Validator,
    28: docType28Validator,
    29: docType29Validator
  }

  class ApDocumentValidator {
    constructor(apDocObj) {
      this.apDocObj = apDocObj
      this.result = new Result(apDocObj.transaction, apDocObj.uniqueId)
      this.result = validationRuleBasic.required(
        apDocObj,
        'docType',
        this.result
      )
      if (!validatorMap[apDocObj.docType]) {
        this.result.addError({
          errorCode: 'FIELD_VALUE_INVALID',
          errorMessage: `docType value should be 21~29`
        })
      }
    }

    validate() {
      if (!this.result.isSuccess()) return this.result
      const docValidator = new validatorMap[this.apDocObj.docType](
        this.apDocObj
      )
      const validationResult = docValidator.validate(this.result)
      return validationResult
      // return validatorMap[this.apDocObj.docType](this.result, this.apDocObj)
    }
  }

  return ApDocumentValidator
})
