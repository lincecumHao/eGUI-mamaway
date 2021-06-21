define([
  'N/config',
  'N/record',
  './mapper/InvToGui/gw_service_map_inv_egui',
  './mapper/InvToGui/gw_service_map_different_currency_inv_egui'
], (config, record, gwInvToGuiMapper, gwDifferentCurrencyInvToGuiMapper) => {
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

  function getBaseCurrency() {
    var conpanyuInfo = config.load({
      type: config.Type.COMPANY_INFORMATION
    })
    return conpanyuInfo.getValue({
      fieldId: 'basecurrency'
    })
  }

  function getSubsidiaryCurrency(subsidiaryId) {
    var subsidiary = record.load({
      type: record.Type.SUBSIDIARY,
      id: subsidiaryId
    })
    return subsidiary.getValue({ fieldId: 'currency' })
  }

  function isInvCurrencyBaseCurrency(subsidiaryId) {
    return getBaseCurrency() === getSubsidiaryCurrency(subsidiaryId)
  }

  class EguiFactory {
    generate(invObj) {
      if (isInvCurrencyBaseCurrency(invObj.subsidiary.value)) {
        return new gwInvToGuiMapper(invObj).transform()
      } else {
        return new gwDifferentCurrencyInvToGuiMapper(invObj).transform()
      }
    }
  }

  return new EguiFactory()
})
