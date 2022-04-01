require([
  'SuiteApps/com.gateweb.gwegui/gw_dao/assignLogTrack/gw_dao_assign_log_track_21'
], (gwAssignLogTrackDao) => {
  const availableGuiTrack = gwAssignLogTrackDao.getAvailableGuiTrack(
    25,
    '11104',
    'YF'
  )
  // const busEntByTax = gwBusinessEntDao.getByTaxId()
  log.debug({ title: 'availableGuiTrack', details: availableGuiTrack })
  log.debug({ title: 'Execution end' })
})
