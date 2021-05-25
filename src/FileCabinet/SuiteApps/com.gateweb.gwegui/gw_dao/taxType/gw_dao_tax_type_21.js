define([
  '../gw_abstract_dao',
  './gw_record_fields',
  '../../library/ramda.min'
], (gwDao, fieldConfig, ramda) => {
  class TaxType extends gwDao.DataAccessObject {
    constructor() {
      super(fieldConfig.recordId, fieldConfig)
    }

    isTaxable(value) {
      return parseInt(value) === 1
    }

    isTaxExempt(value) {
      return parseInt(value) === 3
    }

    isZeroTax(value) {
      return parseInt(value) === 2
    }

    isSpecialTax(value) {
      return parseInt(value) === 4
    }

    isMixedTaxType(values) {
      var taxTypes = ramda.sort((val1, val2) => {
        return val1 - val2
      }, values)
      return taxTypes[0] !== 1
        ? false
        : !(taxTypes[1] !== 2 && taxTypes[1] !== 3)
    }

    getTaxTypeByCsvValue(csvValue) {
      return this.getAll().filter(function (option) {
        return option.csvValue.split(',').indexOf(csvValue) > -1
      })[0]
    }

    getTaxTypeByTaxCode(taxCode) {
      return this.getAll().filter(function (option) {
        if (option.taxCodes) {
          return (
            option.taxCodes.value.split(',').indexOf(taxCode.toString()) > -1
          )
        }
        return false
      })[0]
    }
  }

  return new TaxType()
})
