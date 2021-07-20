require(['SuiteApps/com.gateweb.gwegui/gw_dao/voucher/gw_dao_voucher'], (
  gwVoucherDao
) => {
  const eguiObj = gwVoucherDao.getGuiByVoucherId(2252)
  log.debug({ title: 'eguiObj', details: eguiObj })
  log.debug({ title: 'Execution end' })
})
