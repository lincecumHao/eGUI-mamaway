define([], function () {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2021 Gateweb
   * @author Sean Lin <sean.hyl@gmail.com>
   *
   * @NApiVersion 2.0
   * @NModuleScope Public

   */
  var exports = {}

  function transformFromObj(inputObject, inputMapping) {
    var transformedObj = {}
    Object.keys(inputMapping).forEach(function (resultFieldId) {
      var sourceField = inputMapping[resultFieldId]
      if (sourceField) {
        transformedObj[fieldId] = getDataSourceValue(inputObject, sourceField)
      }
    })
    return transformedObj
  }

  function transformToObj(inputObject, outputMapping) {
    var transformedObj = {}
    Object.keys(outputMapping).forEach(function (sourceFieldId) {
      var outputFieldId = outputMapping[sourceFieldId]
      transformedObj[outputFieldId] = getDataSourceValue(
        inputObject,
        sourceFieldId
      )
    })
    return transformedObj
  }

  function transformRecordToObj(inputRecord, outputMapping) {
    var outputObj = {}
    ouputObj.id = inputRecord.id
    var columns = Object.keys(outputMapping)
    columns.forEach(function (columnId) {
      var value = inputRecord.getValue({
        fieldId: columnId,
      })
      var text = inputRecord.getText({
        fieldId: columnId,
      })
      if (text && value !== text) {
        value = { value: value, text: text }
      }
      var outputField = outputMapping[columnId]
      outputObj[outputField] = value
    })
    return outputObj
  }

  function transformRecordLineToObj(
    inputRecord,
    sublistId,
    line,
    outputMapping
  ) {
    var sublistFieldIds = Object.keys(outputMapping)
    var sublistObj = {}
    sublistFieldIds.forEach(function (fieldId) {
      var outputField = outputMapping[fieldId]
      var value = inputRecord.getSublistValue({
        sublistId: sublistId,
        fieldId: fieldId,
        line: line,
      })
      var text = inputRecord.getSublistText({
        sublistId: sublistId,
        fieldId: fieldId,
        line: line,
      })
      if (text && text !== value) {
        value = { value: value, text: text }
      }
      sublistObj[outputField] = value
    })
    return sublistObj
  }

  function getDataSourceValue(dataObj, dataSourceField) {
    var value = ''
    if (!dataSourceField) return value
    var fieldIds = dataSourceField.split('.')
    fieldIds.forEach(function (fieldId, key) {
      if (key === 0) {
        value = dataObj[fieldId]
      } else {
        value = value[fieldId]
      }
    })
    value = typeof value === 'boolean' ? value : value || ''
    return value
  }

  exports.transformFromObj = transformFromObj
  exports.transformToObj = transformToObj
  exports.transformRecordToObj = transformRecordToObj
  exports.transformRecordLineToObj = transformRecordLineToObj
  return exports
})
