define([
  '../library/ramda.min',
  '../library/gw_date_util',
  '../gw_dao/assignLog/gw_dao_assign_log_21',
  '../gw_dao/assignLog/gw_record_fields',
], (ramda, gwDateUtil, gwAssignLogDao, gwAssignLogFields) => {
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

  function getEguiBookStatus(currentStatus) {
    if (currentStatus === '21') return '22'
    if (currentStatus === '11') return '12'
    return currentStatus
  }

  function getUsedEguiBookStatus(currentStatus) {
    if (currentStatus === '22' || currentStatus === '21') return '23'
    if (currentStatus === '12' || currentStatus === '11') return '13'
    return currentStatus
  }

  class EguiBookService {
    /**
     *
     * @param invoice_type string 07,08
     * @param taxId string
     * @param dept_code string
     * @param classification string
     * @param year_month string
     * @param voucher_date string
     * @param count int
     * @returns {*[]}
     */
    getNewEGuiNumber(
      invoice_type,
      taxId,
      dept_code,
      classification,
      year_month,
      voucher_date,
      count
    ) {
      var _resultNumber = ''
      // TODO: format code source
      /*_filterArray.push([
        'custrecord_gw_egui_format_code',
        search.Operator.IS,
        invoceFormatCode,
      ])
      _filterArray.push('and')*/

      const params = {
        taxId: taxId,
        departmentId: dept_code,
        classId: classification,
        yearMonth: year_month,
        guiType: invoice_type,
        statusId: ['11', '12'],
        eguiFormatValue: '35',
      }
      log.debug({ title: 'params', details: params })

      var eguiBooks = gwAssignLogDao.getAssignLogs(params)
      if (eguiBooks.length === 0) throw 'No available gui number found.'
      // TODO: 檢查日期資料(申請日期要大於字軌日期)
      var pickedNumbers = []
      var updatedBooks = []
      var bookIdx = 0
      for (var pickCount = 1; pickCount <= count; pickCount++) {
        var eguiBook = eguiBooks[bookIdx]
        eguiBook.custrecord_gw_assignlog_status = getEguiBookStatus(
          eguiBook.custrecord_gw_assignlog_status
        )
        var bookStartNumber = parseInt(
          eguiBook.custrecord_gw_assignlog_startno,
          10
        )
        var bookEndNumber = parseInt(eguiBook.custrecord_gw_assignlog_endno, 10)
        var bookUsedCount = parseInt(
          eguiBook.custrecord_gw_assignlog_usedcount,
          10
        )
        var pickedNumber = bookStartNumber + bookUsedCount
        var guiNumber = `${
          eguiBook.custrecord_gw_assignlog_invoicetrack
        }${pickedNumber.toString().padStart(8, '0')}`
        pickedNumbers.push(guiNumber)

        // TODO 3: update used count
        eguiBook.custrecord_gw_assignlog_usedcount = bookUsedCount + 1
        // TODO 2: update last invoice number (GUI Number)
        eguiBook.custrecord_gw_assignlog_lastinvnumbe = pickedNumber
        // TODO 4: update last invoice date
        eguiBook.custrecord_gw_last_invoice_date = gwDateUtil.getCurrentDateInYYYYMMDD()
        if (pickedNumber === bookEndNumber) {
          // TODO 2: if is last one, change status to used
          eguiBook.custrecord_gw_assignlog_status = getUsedEguiBookStatus(
            eguiBook.custrecord_gw_assignlog_status
          )
          updatedBooks.push(eguiBook)
          bookIdx++
        }
      }
      if (!ramda.contains(eguiBooks[bookIdx], updatedBooks))
        updatedBooks.push(eguiBooks[bookIdx])
      gwAssignLogDao.guiNumberPicked(updatedBooks)
      return pickedNumbers
    }
  }

  return new EguiBookService()
})
