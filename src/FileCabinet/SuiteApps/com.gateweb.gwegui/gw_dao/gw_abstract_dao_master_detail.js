define(['N/record', '../library/gw_lib_search'], function(record, searchLib) {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2021 Gateweb
   * @author Sean Lin <sean.hyl@gmail.com>
   *
   * @NApiVersion 2.1
   * @NModuleScope Public

   */
  var exports = {}

  // TODO: not finished
  class DataAccessObject {
    constructor(recordTypeId, masterFieldConfig, detailFieldConfig) {
      this.masterFieldConfig = masterFieldConfig
      this.detailFieldConfig = detailFieldConfig
      this.recordTypeId = recordTypeId
    }

    loadRecord(id) {
      var docRecord = record.load({
        type: this.recordTypeId,
        id: id,
      })
      var mainObj = this.getRecord(docRecord, this.masterFieldConfig)
      var sublistId = this.masterFieldConfig.sublists.detail
      mainObj.lines = this.getSublistFields(
        docRecord,
        sublistId,
        this.detailFieldConfig,
      )
    }

    getRecord(docRecord, recFieldConfig) {
      var docRecordObj = {}
      docRecordObj.id = docRecord.id
      columns.forEach(function(columnId) {
        var value = docRecord.getValue({
          fieldId: columnId,
        })
        var text = docRecord.getText({
          fieldId: columnId,
        })
        if (text && !isValueAndTextSame(value, text)) {
          value = { value: value, text: text }
        }
        var outputField = recFieldConfig.fieldOutputMapping[columnId]
        docRecordObj[outputField] = value
      })
      docRecordObj['buyerTel'] = ''
      return docRecordObj
    }

    getSublistFields(docRecord, sublistId, recFieldConfig) {
      var sublistLines = []
      var sublistFieldIds = recFieldConfig.allFieldIds
      var lineCount = docRecord.getLineCount({
        sublistId: sublistId,
      })
      for (var line = 0; line < lineCount; line++) {
        var sublistObj = {}
        sublistFieldIds.forEach(function(fieldId) {
          var outputField = recFieldConfig.fields[fieldId].outputField
          if (outputField) {
            var value = docRecord.getSublistValue({
              sublistId: sublistId,
              fieldId: fieldId,
              line: line,
            })
            var text = docRecord.getSublistText({
              sublistId: sublistId,
              fieldId: fieldId,
              line: line,
            })
            if (text && !this.isValueAndTextSame(value, text)) {
              value = { value: value, text: text }
            }
            sublistObj[outputField] = value
          }
        })
        sublistObj['lineSeq'] = line + 1
        sublistLines.push(sublistObj)
      }
      return sublistLines
    }

    isValueAndTextSame(value, text) {
      var typeOfValue = typeof value
      if (typeOfValue === 'number') {
        value = parseFloat(value)
        text = parseFloat(text.replace(',', ''))
      }
      return value === text
    }

    getAllOptions() {
      var columns = this.fieldConfig.allFieldIds
      var searchColumns = JSON.parse(JSON.stringify(columns))
      var result = searchLib.runSearch(this.recordTypeId, searchColumns)
      const fieldOutputMapping = this.fieldConfig.fieldOutputMapping
      this.allOptions = result.map(function(recordObj) {
        var optionObject = {}
        columns.forEach(function(columnId) {
          var attribute = fieldOutputMapping[columnId]
          optionObject[attribute] = recordObj[columnId]
        })
        optionObject.id = recordObj.id
        return optionObject
      })
      return this.allOptions
    }

    getAll() {
      return this.allOptions
    }

    getById(id) {
      return this.allOptions.filter(function(option) {
        return parseInt(option.id) === parseInt(id)
      })[0]
    }

    getByValue(value) {
      log.debug({ title: 'getValue this.allOptions', details: this.allOptions })
      return this.allOptions.filter(function(option) {
        return option.value.toString() === value.toString()
      })[0]
    }

    getByText(text) {
      return this.allOptions.filter(function(option) {
        return option.text.toString() === text.toString()
      })[0]
    }
  }

  exports.DataAccessObject = DataAccessObject

  return exports
})
