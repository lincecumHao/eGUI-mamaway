define(['../../library/ramda.min'], (ramda) => {
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
  let exports = {}

  function convertToFields(origObj, fieldObj, targetObj) {
    if (fieldObj.toField) {
      targetObj[fieldObj.toField] = getFieldValues(origObj, fieldObj.name)
    }
    return targetObj
  }

  function getFieldValues(dataObj, field) {
    const fields = field.split('.')
    let fieldValue = dataObj[fields[0]]
    if (isFieldValueEmptyOrNull(fieldValue)) return ''
    if (fields.length > 1) {
      for (let fieldIdx = 1; fieldIdx < fields.length; fieldIdx++) {
        fieldValue = fieldValue[fields[fieldIdx]]
        if (isFieldValueEmptyOrNull(fieldValue)) {
          return ''
        }
      }
    }
    return fieldValue
  }

  function isFieldValueEmptyOrNull(fieldValue) {
    if (typeof fieldValue === 'boolean') {
      return false
    }
    if (
      typeof fieldValue === 'undefined' ||
      fieldValue === null ||
      fieldValue === ''
    )
      return true
    return false
  }

  class Mapper {
    mapTo(fromObj, fieldConfig) {
      return ramda.reduce(
        function(result, fieldId) {
          return convertToFields(fromObj, fieldConfig.fields[fieldId], result)
        },
        {},
        Object.keys(fieldConfig.fieldOutputMapping),
      )
    }
  }

  return new Mapper()
})
