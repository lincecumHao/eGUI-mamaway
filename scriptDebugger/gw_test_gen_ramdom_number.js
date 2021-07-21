require([], function () {
  function genHash(stringValue) {
    var hash = 7,
      i,
      chr
    if (stringValue.length === 0) return hash
    for (i = 0; i < stringValue.length; i++) {
      chr = stringValue.charCodeAt(i)
      hash = (hash << 5) - hash + chr
      hash |= 0 // Convert to 32bit integer
    }
    return hash
  }

  function genRandomNumber(stringValue) {
    return (Math.abs(genHash(stringValue)) % 10000).toString()
  }

  var hashValue = genHash('PH3977104724549210')
  log.debug({ title: 'hashValue', details: hashValue })
  var randomNumber = genRandomNumber('PH3977104724549210')
  log.debug({ title: 'randomNumber', details: randomNumber })
  log.debug({ title: 'Execution end' })
})
