define([
  '../gw_dao/assignLog/gw_dao_assign_log_21',
  '../gw_dao/assignLog/gw_record_fields',
], (gwAssignLogDao, gwAssignLogFields) => {
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
  class EguiBookService {
    getEGuiNumber(
      invoice_type,
      taxId,
      dept_code,
      classification,
      year_month,
      assignLogType,
      voucher_date
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
        statusId: assignLogType === 'NONE' ? ['21', '22'] : ['11', '12'],
        eguiFormatValue: '32',
      }

      const eguiBooks = gwAssignLogDao.getAssignLogs(params)
      // TODO: 檢查日期資料(申請日期要大於字軌日期)

      var pickedNumbers = []
      var updatedBooks = []
      var bookIdx = 0
      for (var pickCount = 1; pickCount <= params.count; pickCount++) {
        var eguiBook = eguiBooks[bookIdx]
        eguiBook.custrecord_gw_assignlog_status =
          eguiBook.custrecord_gw_assignlog_status === '21'
            ? '22'
            : eguiBook.custrecord_gw_assignlog_status
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
          eguiBook.custrecord_gw_gb_track
        }${pickedNumber.toString().padStart(8, '0')}`
        pickedNumbers.push(guiNumber)

        // TODO 3: update used count
        eguiBook.custrecord_gw_gb_used_count = bookUsedCount + 1
        // TODO 2: update last invoice number (GUI Number)
        eguiBook.custrecord_gw_gb_last_gui_number = pickedNumber
        // TODO 4: update last invoice date
        eguiBook.custrecord_gw_gb_last_gui_date = new Date(
          gwDateUtil.getCurrentDateTime().date
        )
        if (pickedNumber === bookEndNumber) {
          // TODO 2: if is last one, change status to used
          eguiBook.custrecord_gw_assignlog_status = '23'
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
