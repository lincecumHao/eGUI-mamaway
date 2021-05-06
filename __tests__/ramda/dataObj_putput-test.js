import ramda from 'ramda'

describe('Basic jest test with simple assert', () => {
  it('should assert strings are equal', () => {
    const a = 'foobar'
    const b = 'foobar'
    expect(a).toMatch(b)
  })
})

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
