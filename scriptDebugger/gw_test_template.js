require([
    'SuiteApps/com.gateweb.gwegui/library/gw_date_util.js'
], (
    gwDateUtil
) => {
    log.debug({ title: 'Execution start...' })
    var result = gwDateUtil.getDateObject('01/22/2024')
    log.debug({ title: 'result', details: result })
    log.debug({ title: 'Execution end...' })
})
