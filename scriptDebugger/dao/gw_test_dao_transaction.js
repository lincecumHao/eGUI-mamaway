require([
  'SuiteApps/com.gateweb.gwegui/gw_dao/transaction/gw_dao_transaction_21',
], (gwTransactionDao) => {
  var allTrans = gwTransactionDao.getAll()
  log.debug({ title: 'allTrans', details: allTrans })
  log.debug({ title: 'Execution end' })
})
