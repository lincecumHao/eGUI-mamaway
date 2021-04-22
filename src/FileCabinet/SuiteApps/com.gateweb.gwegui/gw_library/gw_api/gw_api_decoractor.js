define(['./gw_api', '../moment-with-locales', 'N/runtime'], (
  GwApi,
  moment,
  runtime
) => {
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

  function getGuiStatus(filename) {}

  function uploadGuiXml(xmlString, filename) {
    var start = new moment()
    var startRemaining = runtime.getCurrentScript().getRemainingUsage()

    GwApi.uploadGuiXml(xmlString, filename)
    var end = new moment()
    var endRemaining = runtime.getCurrentScript().getRemainingUsage()
    var duration = moment.duration(end.diff(start))
    log.debug({
      title: 'uploadGuiXml duration',
      details: `${duration.asSeconds()} Seconds`,
    })
    log.debug({
      title: 'uploadFile usage',
      details: startRemaining - endRemaining,
    })
  }

  exports.getGuiStatus = getGuiStatus
  exports.uploadGuiXml = uploadGuiXml
  return exports
})
