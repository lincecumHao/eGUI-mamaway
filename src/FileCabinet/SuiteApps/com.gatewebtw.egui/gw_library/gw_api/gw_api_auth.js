define(['N/runtime'], (runtime) => {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2020 Gateweb
   * @author Sean Lin <seanlin816@gmail.com>
   *
   * @NApiVersion 2.1
   * @NModuleScope Public

   */
  let exports = {}
  // let publicKey =
  //   'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDfE4A5Qvng1F4FMOpsWZpYJ/p98SCFouUKoPd9JXQcfpczThrVgSpXSeFOhD9J6nXkORbD6NEJy/Dei0USZeVw4tuuQSPlult7+6qVXk6wKgYDnbji89pQSUZZL8gkEgX1P7RINUTrwnqIBIM8CoOrc29Z/M9uuExVlrpPMkidBwIDAQAB'
  let token =
    'lVM3wFlV0bMNi0/lNq/PV/0JTbxLQN03ldmd6T/6rkQhfOUZZbV/1aT1Q9UUTh7PcHnghZjsgtiCsy41fi1TnWlR6UC+AVTg36NDMni5LfaR/7uDPXAgOyhHlb8Y3NHmrjtq2hRf9hO1/f58LLltmFtnVJFAzNazeX839lXSQA0='

  function generateToken(companyName, companyGui, printerKey) {
    return token
  }

  function genAuthHeader(companyName, companyGui, printerKey) {
    // var authContent = {
    //   name: companyName,
    //   gui: companyGui,
    //   printerkey: printerKey,
    // }
    return {
      gw_ns_auth: generateToken(companyName, companyGui, printerKey),
    }
    // return output
  }

  exports.genAuthHeader = genAuthHeader

  return exports
})
