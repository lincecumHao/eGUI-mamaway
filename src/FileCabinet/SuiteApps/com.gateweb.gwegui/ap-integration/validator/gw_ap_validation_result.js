define(['../gw_vo_response_abstract'],

  (Response) => {

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
    class ValidationResult extends Response {
      constructor(transactionId, uniqueId) {
        super(transactionId, uniqueId)
      }
    }

    return ValidationResult
  })
