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
    constructor(recordTypeId) {
      this.recordTypeId = recordTypeId
    }

    set(value) {
      var cachingValue =
        typeof value === 'string' ? value : JSON.stringify(value)
      runtime
        .getCurrentSession()
        .set({ name: this.recordTypeId, value: cachingValue })
      return value
    }

    get() {
      return JSON.parse(
        runtime.getCurrentSession().get({
          name: this.recordTypeId
        })
      )
    }
  }
  return UserSessionService
})
