define(['../library/gw_lib_search', 'N/runtime'], function (
  searchLib,
  runtime
) {
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

  class UserSessionService {
    constructor() {
      this.currentSession = runtime.getCurrentSession()
    }

    isRecordRefreshRequired(recordId) {
      return (
        !this.getCachedRecordValue(recordId) ||
        this.getRefreshedRequiredRecordList().indexOf(recordId) > -1
      )
    }

    getRefreshedRequiredRecordList() {
      return this.get('refresh', [])
    }

    getCachedRecordValue(recordId) {
      return this.get(recordId)
    }

    getCachedRecord(recordId, func) {
      if (this.isRecordRefreshRequired(recordId)) {
        this.recordRefreshed(recordId, func.apply(this, arguments))
      }
      return this.get(recordId)
    }

    addRefreshRecordId(recordId) {
      this.set(
        'refresh',
        JSON.stringify(this.getRefreshedRequiredRecordList().push(recordId))
      )
    }

    recordRefreshed(recordId, value) {
      this.set(recordId, JSON.stringify(value))
      var refreshList = this.getRefreshedRequiredRecordList()
      refreshList.splice(refreshList.indexOf(recordId), 1)
      this.set('refresh', JSON.stringify(refreshList))
      return value
    }

    set(key, value) {
      this.currentSession.set({ name: key, value: value })
    }

    get(key, defaultValue) {
      var cachedValue = JSON.parse(
        this.currentSession.get({
          name: key,
        })
      )
      if (!cachedValue && defaultValue) {
        this.set(key, JSON.stringify(defaultValue))
        return defaultValue
      }
      return cachedValue
    }
  }

  var sessionService = new UserSessionService()

  class DataAccessObject {
    constructor(recordTypeId, fieldConfig) {
      this.fieldConfig = fieldConfig
      this.recordTypeId = recordTypeId
      this.allOptions = sessionService.isRecordRefreshRequired(recordTypeId)
        ? sessionService.recordRefreshed(recordTypeId, this.getAllOptions())
        : sessionService.getCachedRecordValue(recordTypeId)
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
      return this.allOptions
    }

    getById(id) {
      return this.allOptions.filter(function (option) {
        return parseInt(option.id) === parseInt(id)
      })[0]
    }

    getByValue(value) {
      return this.allOptions.filter(function (option) {
        return option.value.toString() === value.toString()
      })[0]
    }

    getByText(text) {
      return this.allOptions.filter(function (option) {
        return option.text.toString() === text.toString()
      })[0]
    }
  }

  exports.DataAccessObject = DataAccessObject

  return exports
})
