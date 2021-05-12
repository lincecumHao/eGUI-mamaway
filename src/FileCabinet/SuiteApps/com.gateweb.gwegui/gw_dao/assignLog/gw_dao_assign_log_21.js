define([
  'N/record',
  './gw_record_fields',
  '../../library/ramda.min',
  '../../library/gw_lib_search',
], (record, fieldConfig, ramda, searchLib) => {
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
  function getSearchFilters(params) {
    return insertAndOperators(convertParamsToSearchFilters(params))
  }

  function convertParamsToSearchFilters(params) {
    return ramda.map((key) => {
      let filterObj = []
      const fieidMapping = ramda.invertObj(fieldConfig.fieldOutputMapping)
      const fieldId = fieidMapping[key]
      const value = params[key]
      filterObj.push(fieldId)
      if (value) {
        if (typeof value === 'object') {
          // means value is an array
          filterObj = getMultiStringOptionsFilters(value, fieldId)
        } else {
          filterObj.push('is')
          filterObj.push(value)
        }
      } else {
        filterObj.push('isEmpty')
        filterObj.push('')
      }
      return filterObj
    }, ramda.keys(params))
  }

  function getMultiStringOptionsFilters(value, fieldId) {
    let filterObj = []
    value.forEach(function (val) {
      var tempFilterObj = []
      tempFilterObj.push(fieldId)
      tempFilterObj.push('is')
      tempFilterObj.push(val)
      filterObj.push(tempFilterObj)
      filterObj.push('OR')
    })
    filterObj.pop()
    return filterObj
  }

  function insertAndOperators(searchFilterObjs) {
    let result = ramda.reduce(
      (result, filterObj) => {
        result.push(filterObj)
        result.push('AND')
        return result
      },
      [],
      searchFilterObjs
    )
    result.pop()
    return result
  }

  function getResultOutput(resultObjs) {
    const fieldOutputMapping = fieldConfig.fieldOutputMapping
    return resultObjs.map(function (recordObj) {
      var optionObject = {}
      fieldConfig.allFieldIds.forEach(function (columnId) {
        var attribute = fieldOutputMapping[columnId]
        optionObject[attribute] = recordObj[columnId]
      })
      optionObject.id = recordObj.id
      return optionObject
    })
  }

  class AssignLog {
    constructor() {}

    /**
     *
     * @param params {{taxId:string, departmentId:string, classId: string, yearMonth:string, guiType: string, statusId: string}}
     */
    getAssignLogs(params) {
      const searchColumns = JSON.parse(JSON.stringify(fieldConfig.allFieldIds))
      const searchFilters = getSearchFilters(params)
      return searchLib.runSearch(
        fieldConfig.recordId,
        searchColumns,
        searchFilters
      )
    }

    guiNumberPicked(books) {
      var updateRecords = ramda.map((book) => {
        log.debug({ title: 'guiNumberPicked book', details: book })
        return {
          id: book.id,
          values: {
            custrecord_gw_assignlog_status: book.custrecord_gw_assignlog_status,
            custrecord_gw_assignlog_lastinvnumbe:
              book.custrecord_gw_assignlog_lastinvnumbe,
            custrecord_gw_last_invoice_date:
              book.custrecord_gw_last_invoice_date,
            custrecord_gw_assignlog_usedcount:
              book.custrecord_gw_assignlog_usedcount,
          },
        }
      }, books)
      updateRecords.forEach((updatedRecord) => {
        record.submitFields({
          type: fieldConfig.recordId,
          id: updatedRecord.id,
          values: updatedRecord.values,
        })
      })
    }
  }

  return new AssignLog()
})
