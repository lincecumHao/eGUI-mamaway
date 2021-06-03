define(['N/runtime'], (runtime) => {
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
  class UserSessionService {
    constructor() {}

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
      var currentCachedValue = this.getRefreshedRequiredRecordList()
      if (currentCachedValue.indexOf(recordId) === -1) {
        currentCachedValue.push(recordId)
        this.set('refresh', JSON.stringify(currentCachedValue))
      }
    }

    recordRefreshed(recordId, value) {
      this.set(recordId, JSON.stringify(value))
      var refreshList = this.getRefreshedRequiredRecordList()
      refreshList.splice(refreshList.indexOf(recordId), 1)
      this.set('refresh', JSON.stringify(refreshList))
      return value
    }

    set(key, value) {
      runtime.getCurrentSession().set({ name: key, value: value })
    }

    get(key, defaultValue) {
      var cachedValue = JSON.parse(
        runtime.getCurrentSession().get({
          name: key
        })
      )
      if (!cachedValue && defaultValue) {
        this.set(key, JSON.stringify(defaultValue))
        return defaultValue
      }
      return cachedValue
    }
  }
  return UserSessionService
})
