define(['../../library/gw_lib_search'], function (GwSearch) {
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
      var result = func.apply(this, arguments)
      return result
    }
  }

  function getOptionById(id) {
    return allOptions.filter(function (option) {
      return parseInt(option.id) === parseInt(id)
    })[0]
  }

  function getOptionByValue(value) {
    return allOptions.filter(function (option) {
      return option.value.toString() === value.toString()
    })[0]
  }

  function getAllOptions() {
    var columns = [
      'companyname',
      'email',
      'entityid',
      'email',
      'custentity_gw_gui_address',
      'custentity_gw_gui_title',
      'custentity_gw_tax_id_number',
    ]
    allOptions = GwSearch.runSearch('customer', columns)
    return allOptions
  }

  function getCustomerByIds(customerIds) {
    var columns = [
      'companyname',
      'email',
      'entityid',
      'email',
      'custentity_gw_gui_address',
      'custentity_gw_gui_title',
      'custentity_gw_tax_id_number',
    ]
    var searchFilters = []
    searchFilters.push(['internalid', 'anyof', customerIds])
    return GwSearch.runSearch('customer', columns, searchFilters)
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
