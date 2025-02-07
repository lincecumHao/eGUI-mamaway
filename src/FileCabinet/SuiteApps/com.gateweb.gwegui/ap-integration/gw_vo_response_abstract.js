define([], () => {
  /**
     * Module Description...
     *
     * @type {Object} module-name
     *
     * @copyright 2022 Gateweb
     * @author Sean Lin <seanlin@gateweb.com.tw>
     *
     * @NApiVersion 2.1
     * @NModuleScope Public

     */
  const responseInitObj = {
    status: '1',
    data: {
      uniqueId: '',
      transactionId: '',
      internalId: ''
    },
    errors: []
  }
  const status = {
    success: '1',
    failed: '-1'
  }

  class Response {
    constructor(transactionId, uniqueId) {
      this.responseObj = JSON.parse(JSON.stringify(responseInitObj))
      this.responseObj.data.transactionId = transactionId || ''
      this.responseObj.data.uniqueId = uniqueId || ''
      this.statusEnumObj = status
    }

    getResponse() {
      return this.responseObj
    }

    setInternalId(internalId) {
      this.responseObj.data.internalId = internalId.toString()
      return this.responseObj
    }

    reset() {
      let newResponse = JSON.parse(JSON.stringify(responseInitObj))
      newResponse.data.transactionId = this.responseObj.data.transactionId
      this.responseObj = newResponse
    }

    setResponse(responseObj) {
      this.responseObj = JSON.parse(JSON.stringify(responseObj))
    }

    isSuccess() {
      return this.responseObj.status === this.statusEnumObj.success
    }

    statusEnum() {
      return this.statusEnumObj
    }

    addError(errorObj) {
      this.responseObj.status = this.statusEnumObj.failed
      this.responseObj.errors.push(errorObj)
    }

    clearErrors() {
      this.responseObj.errors = []
    }

    failed() {
      this.responseObj.status = this.statusEnumObj.failed
    }
  }

  return Response
})
