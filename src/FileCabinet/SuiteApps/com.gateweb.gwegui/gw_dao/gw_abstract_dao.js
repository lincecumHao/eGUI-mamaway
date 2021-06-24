define([
  '../library/gw_lib_search',
  './gw_dao_cache',
  './gw_dao_session'
], function (searchLib, dataCacheService, dataSessionService) {
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

  class DataAccessObject {
    constructor(recordTypeId, fieldConfig) {
      this.fieldConfig = fieldConfig
      this.recordTypeId = recordTypeId
      this.cacheService = new dataCacheService(
        this.recordTypeId,
        this.fieldConfig
      )
      this.sessionService = new dataSessionService(this.recordTypeId)
    }

    getAllOptions() {
      var columns = this.fieldConfig.allFieldIds
      var searchColumns = JSON.parse(JSON.stringify(columns))
      var result = searchLib.runSearch(this.recordTypeId, searchColumns)
      const fieldOutputMapping = this.fieldConfig.fieldOutputMapping
      this.allOptions = result.map(function (recordObj) {
        var optionObject = {}
        columns.forEach(function (columnId) {
          var attribute = fieldOutputMapping[columnId]
          optionObject[attribute] = recordObj[columnId]
        })
        optionObject.id = recordObj.id
        return optionObject
      })
      return this.allOptions
    }

    getAll() {
      this.allOptions = this.sessionService.get()
        ? this.sessionService.get()
        : this.sessionService.set(this.getAllOptions())
      return this.allOptions
    }

    getById(id) {
      return this.getAll().filter(function (option) {
        return parseInt(option.id) === parseInt(id)
      })[0]
    }

    getByValue(value) {
      return this.getAll().filter(function (option) {
        return option.value.toString() === value.toString()
      })[0]
    }

    getByText(text) {
      return this.getAll().filter(function (option) {
        return option.text.toString() === text.toString()
      })[0]
    }
  }

  exports.DataAccessObject = DataAccessObject

  return exports
})
