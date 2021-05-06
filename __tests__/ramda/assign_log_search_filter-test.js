import fieldConfig from 'assignLogFields'
import ramda from 'ramda'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('parameters should return an array of search filter objects', () => {
  it('should return an array', () => {
    const params = {
      taxId: '24549210',
      departmentId: '',
      classId: '',
      yearMonth: '11004',
      guiType: '07',
      statusId: ['11', '12'],
    }
    const expectResult = [
      ['custrecord_gw_assignlog_businessno', 'is', '24549210'],
      ['custrecord_gw_assignlog_deptcode', 'isEmpty', ''],
      ['custrecord_gw_assignlog_classification', 'isEmpty', ''],
      ['custrecord_gw_assignlog_yearmonth', 'is', '11004'],
      ['custrecord_gw_assignlog_invoicetype', 'is', '07'],
      [
        ['custrecord_gw_assignlog_status', 'is', '11'],
        'OR',
        ['custrecord_gw_assignlog_status', 'is', '12'],
      ],
    ]
    const expectResultWithAnd = [
      ['custrecord_gw_assignlog_businessno', 'is', '24549210'],
      'AND',
      ['custrecord_gw_assignlog_deptcode', 'isEmpty', ''],
      'AND',
      ['custrecord_gw_assignlog_classification', 'isEmpty', ''],
      'AND',
      ['custrecord_gw_assignlog_yearmonth', 'is', '11004'],
      'AND',
      ['custrecord_gw_assignlog_invoicetype', 'is', '07'],
      'AND',
      [
        ['custrecord_gw_assignlog_status', 'is', '11'],
        'OR',
        ['custrecord_gw_assignlog_status', 'is', '12'],
      ],
    ]

    const searchFilterObjs = convertParamsToSearchFilters(params)
    console.log(searchFilterObjs)
    expect(searchFilterObjs).toEqual(expectResult)
    var searchFilters = insertAndOperators(expectResult)
    expect(searchFilters).toEqual(expectResultWithAnd)
  })
})

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
