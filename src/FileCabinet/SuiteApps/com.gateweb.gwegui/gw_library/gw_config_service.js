define(['N/search', 'N/record'], function (search, record) {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2020 Gateweb
   * @author Sean Lin <seanlin816@gmail.com>
   *
   * @NApiVersion 2.0
   * @NModuleScope Public

   */
  var exports = {}
  var config = null

  function initializeDecorator(func) {
    return function () {
      if (!config) {
        initializeConfig()
      }
      const result = func.apply(this, arguments)
      return result
    }
  }

  function initializeConfig() {
    var config_search_id = 'customsearch_gw_config_search'
    var configSearch = search.load({
      id: config_search_id,
    })
    var resultSet = configSearch.run()
    var columns = resultSet.columns
    log.debug({ title: 'columns count', details: columns.length })
    var allConfigs = []
    resultSet.each(function (result) {
      var tempConfig = {}
      columns.forEach(function (column) {
        tempConfig[column.name] = result.getValue({
          name: column.name,
        })
      })
      allConfigs.push(tempConfig)
      return true
    })
    if (allConfigs.length > 1) {
      allConfigs = allConfigs.filter(function (confObj) {
        return (
          confObj['custrecord_gw_conf_turnkey_base_url'] ===
          'https://sstest.gwis.com.tw:443'
        )
      })
    }
    config = allConfigs[0]
  }

  function getDownloadBaseUrl() {
    return config['custrecord_gw_config_dl_base_url']
  }

  function getPrintBaseUrl() {
    return config['custrecord_gw_conf_print_base_url']
  }

  function getTurnkeyBaseUrl() {
    return config['custrecord_gw_conf_turnkey_base_url']
  }

  function getConfig() {
    return config
  }

  exports.getConfig = initializeDecorator(getConfig)
  exports.getDownloadBaseUrl = initializeDecorator(getDownloadBaseUrl)
  exports.getPrintBaseUrl = initializeDecorator(getPrintBaseUrl)
  exports.getTurnkeyBaseUrl = initializeDecorator(getTurnkeyBaseUrl)

  return exports
})
