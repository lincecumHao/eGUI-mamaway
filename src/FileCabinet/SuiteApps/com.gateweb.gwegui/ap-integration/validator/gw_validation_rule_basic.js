define([], () => {
  /**
     * Module Description...
     *
     * @type {Object} module-name
     *
     * @copyright 2022 Gateweb
     * @author Sean  <seanlin@gateweb.com.tw>
     *
     * @NApiVersion 2.1
     * @NModuleScope Public

     */
  let exports = {}
  const required = (apDocObj, fieldName, result) => {
    if (isFieldValueEmptyOrNull(apDocObj[fieldName])) {
      result.addError({
        errorCode: 'FIELD_IS_REQUIRED',
        errorMessage: `${fieldName} is required`
      })
    }
    return result
  }
  const mustNotHave = (apDocObj, fieldName, result) => {
    const value = apDocObj[fieldName]
    if (
      (typeof value === 'number' && value !== 0) ||
      (typeof value !== 'number' &&
        !isFieldValueEmptyOrNull(apDocObj[fieldName]))
    ) {
      result.addError({
        errorCode: 'FIELD_MUST_BE_EMPTY',
        errorMessage: `${fieldName} must be empty`
      })
    }
    return result
  }

  const canOnlyHaveOneField = (apDocObj, fieldNames, result) => {
    let containsValueCount = 0
    for (let idx = 0; idx < fieldNames.length; idx++) {
      let hasValue = !isFieldValueEmptyOrNull(apDocObj)
      containsValueCount = hasValue ? containsValueCount++ : containsValueCount
    }
    if (containsValueCount > 1) {
      result.failed()
      result.addError({
        errorCode: 'ONLY_ONE_FIELD',
        errorMessage: `Only one filed can have value among fields ${fieldNames.join(
          ','
        )}`
      })
      return result
    }
    if (!containsValueCount) {
      result.failed()
      result.addError({
        errorCode: 'ONLY_ONE_FIELD_NONE',
        errorMessage: `Must have one field value among fields ${fieldNames.join(
          ','
        )}`
      })
    }
    return result
  }

  const validateValues = (allowedValues, fieldValue, fieldName, result) => {
    if (allowedValues.indexOf(fieldValue) === -1) {
      result.addError({
        errorCode: 'VALUE_NOT_VALID',
        errorMessage: `${fieldName} should be ${allowedValues.join(',')}`
      })
    }
    return result
  }

  const isFieldValueEmptyOrNull = (fieldValue) => {
    if (typeof fieldValue === 'boolean') {
      return false
    }
    return (
      typeof fieldValue === 'undefined' ||
      fieldValue === null ||
      fieldValue === ''
    )
  }

  const isBothFieldValueExists = (value1, value2) => {
    return !isFieldValueEmptyOrNull(value1) && !isFieldValueEmptyOrNull(value2)
  }

  const isBothFieldValueNotExists = (value1, value2) => {
    return isFieldValueEmptyOrNull(value1) && isFieldValueEmptyOrNull(value2)
  }

  const isEitherOneFieldValueExists = (value1, value2) => {
    return (
      !isBothFieldValueExists(value1, value2) &&
      !isBothFieldValueNotExists(value1, value2)
    )
  }

  const isValueLengthExceed = (value, length) => {
    return value.toString().length > parseInt(length)
  }

  const isValueLengthMatch = (value, length) => {
    return value.toString().length === parseInt(length)
  }

  const isValueLengthLess = (value, length) => {
    return value.toString().length < parseInt(length)
  }
  const isValueLengthInRange = (value, minLength, maxLength) => {
    value = isFieldValueEmptyOrNull(value) ? '' : value
    return (
      value.toString().length <= parseInt(maxLength) &&
      value.toString().length >= parseInt(minLength)
    )
  }

  const isNumberValueInRange = (value, minLength, maxLength) => {
    return (
      parseInt(value) <= parseInt(maxLength) &&
      parseInt(value) >= parseInt(minLength)
    )
  }

  exports.required = required
  exports.canOnlyHaveOneField = canOnlyHaveOneField
  exports.mustNotHave = mustNotHave
  exports.isFieldValueEmptyOrNull = isFieldValueEmptyOrNull
  exports.isBothFieldValueExists = isBothFieldValueExists
  exports.isBothFieldValueNotExists = isBothFieldValueNotExists
  exports.isEitherOneFieldValueExists = isEitherOneFieldValueExists
  exports.isValueLengthExceed = isValueLengthExceed
  exports.isValueLengthMatch = isValueLengthMatch
  exports.isValueLengthLess = isValueLengthLess
  exports.isValueLengthInRange = isValueLengthInRange
  exports.validateValues = validateValues
  exports.isNumberValueInRange = isNumberValueInRange

  return exports
})
