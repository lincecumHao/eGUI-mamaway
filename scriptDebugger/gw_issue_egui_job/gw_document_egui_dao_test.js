require(['SuiteApps/com.gateweb.gwegui/gw_dao/voucher/gw_dao_voucher'], (
  gwVoucherDao
) => {
  var results = gwVoucherDao.getGuiByVoucherId([1002])
  log.debug({ title: 'results', details: results })
  log.debug({ title: 'Execution end' })
})
