define(['N/cache'], (cache) => {
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
  class CacheService {
    constructor(recordTypeId) {
      this.recordTypeId = recordTypeId
    }
    set(value) {
      this.getCacheObj().put({
        key: this.recordTypeId,
        value: JSON.stringify(value)
      })
      return value
    }

    get() {
      log.debug({
        title: 'getCacheData recordType',
        details: this.recordTypeId
      })
      var cachedValue = JSON.parse(
        this.getCacheObj().get({ key: this.recordTypeId })
      )
      log.debug({ title: 'get cached data cachedValue', details: cachedValue })
      return cachedValue
    }

    getCacheObj() {
      return cache.getCache({
        name: 'dataCache',
        scope: cache.Scope.PUBLIC
      })
    }
  }

  return CacheService
})
