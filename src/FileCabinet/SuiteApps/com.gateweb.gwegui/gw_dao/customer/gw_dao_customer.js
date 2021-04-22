define(['../../library/gw_lib_search', './gw_customer_fields'], function (
  GwSearch,
  fieldConfig
) {
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

  var allOptions = []

  function constructorWrapper(func) {
    return function () {
      if (allOptions.length === 0) {
        getAllOptions()
      }
      return func.apply(this, arguments)
    }
  }

  function getOptionById(id) {
    return allOptions.filter(function (option) {
      return parseInt(option.id) === parseInt(id)
    })[0]
  }

  function getAllOptions() {
    var columns = fieldConfig.allFieldIds
    allOptions = GwSearch.runSearch(
      'customer',
      JSON.parse(JSON.stringify(columns))
    )
    return allOptions
  }

  function getCustomerByIds(customerIds) {
    var columns = fieldConfig.allFieldIds
    var searchFilters = []
    searchFilters.push(['internalid', 'anyof', customerIds])
    return GwSearch.runSearch(
      'customer',
      JSON.parse(JSON.stringify(columns)),
      searchFilters
    )
  }

  function getAllCustomers() {
    return allOptions
  }

  function getCustomerFields(id, fields) {
    var result = GwSearch.lookupFields('customer', id, fields)
    result.id = id
    return result
  }

  exports.getAllCustomers = constructorWrapper(getAllCustomers)
  exports.getCustomerById = constructorWrapper(getOptionById)
  exports.getCustomerFields = getCustomerFields
  exports.getCustomerByIds = getCustomerByIds

  return exports
})
