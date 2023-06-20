/**
 *Date Utility Tool
 *gwDateUtility.js
 *@NApiVersion 2.0
 */
define(['N/format'], function (format) {
  //取得當地時間
  function getLocalDate() {
    var _date = new Date()
    var _dateString = format.format({
      value: _date,
      type: format.Type.DATETIME,
      timezone: format.Timezone.ASIA_TAIPEI,
    }) //Returns "8/25/2015 9:27:16 am"

    return new Date(_dateString)
  }

  //取得Netsuite當地時間
  function getNetSuiteLocalDate() {
    var _date = new Date()
    
    var _formatDate = format.format({
      value: _date,
      type: format.Type.DATETIME,
      timezone: format.Timezone.ASIA_TAIPEI,
    }) //Returns "8/25/2015 9:27:16 am"

    return new Date(_formatDate)
  }

  //取得日期=20200709
  function getCompanyLocatDate() {
    var _date = getLocalDate()

    var _day = _date.getDate()
    if (_day < 10) {
      _day = '0' + _day
    }
    var _month = _date.getMonth() + 1
    if (_month < 10) {
      _month = '0' + _month
    }
    var _year = _date.getFullYear()

    return _year + '' + _month + '' + _day
  }

  //取得時間=09:10:25
  function getCompanyLocatTime() {
    var _date = getLocalDate()

    var _hours = _date.getHours()
    if (_hours < 10) {
      _hours = '0' + _hours
    }
    var _minutes = _date.getMinutes()
    if (_minutes < 10) {
      _minutes = '0' + _minutes
    }
    var _seconds = _date.getSeconds()
    if (_seconds < 10) {
      _seconds = '0' + _seconds
    }

    var _time = _hours + ':' + _minutes + ':' + _seconds

    return _time
  }

  //取得報稅期數
  function getTaxYearMonth() {
    var _date = getCompanyLocatDate() //20200901

    var _year = parseInt(_date.substring(0, 4)) - 1911
    var _month = parseInt(_date.substring(4, 6))
    if (_month % 2 != 0) _month = _month + 1
    if (_month < 10) {
      _month = '0' + _month
    }
    var _yearmonth = _year + '' + _month
    return _yearmonth
  }

  function getTaxYearMonthByDate(date) {
    var _dateString = format.format({
      value: date,
      type: format.Type.DATETIME,
      timezone: format.Timezone.ASIA_TAIPEI,
    })

    var _date = new Date(_dateString)

    var _month = _date.getMonth() + 1
    if (_month % 2 != 0) _month = _month + 1
    if (_month < 10) {
      _month = '0' + _month
    }
    var _year = _date.getFullYear() - 1911

    var _yearmonth = _year + '' + _month
    return _yearmonth
  }

  function getVoucherDateByDate(date) {
    var _dateString = format.format({
      value: date,
      type: format.Type.DATETIME,
      timezone: format.Timezone.ASIA_TAIPEI,
    })

    var _date = new Date(_dateString)

    var _year = _date.getFullYear()
    var _month = _date.getMonth() + 1
    if (_month % 2 != 0) _month = _month + 1
    if (_month < 10) {
      _month = '0' + _month
    }
    var _day = _date.getDate()
    if (_day < 10) {
      _day = '0' + _day
    }

    return _year + '' + _month + '' + _day
  }

  function getConvertDateByDate_Bak(date) {
	log.debug('getConvertDateByDate', 'tran_date='+date)	  
    var _dateString = format.format({
      value: date,
      type: format.Type.DATETIME,
      timezone: format.Timezone.ASIA_TAIPEI,
    })
 
    var _date = new Date(_dateString) 
 
    var _year = _date.getFullYear()
    var _month = _date.getMonth() + 1
    if (_month < 10) {
      _month = '0' + _month
    }
    var _day = _date.getDate()
    if (_day < 10) {
        _day = '0' + _day
    }

    return _year + '' + _month + '' + _day
  }
  
  function getConvertDateByDate(date) {
	log.debug('getConvertDateByDate', 'tran_date='+date)	  
    var _dateString = format.format({
      value: date,
      type: format.Type.DATETIME 
    })
 
    var _date = new Date(_dateString) 
 
    var _year = _date.getFullYear()
    var _month = _date.getMonth() + 1
    if (_month < 10) {
      _month = '0' + _month
    }
    var _day = _date.getDate()
    if (_day < 10) {
        _day = '0' + _day
    }
    log.debug('return_date', 'return_date='+_year+''+_month+''+_day)
    return _year + '' + _month + '' + _day
  }
    
  function getTaxYearMonthByDateObj(date) {
    var _month = date.getMonth() + 1
    if (_month % 2 != 0) _month = _month + 1
    if (_month < 10) {
      _month = '0' + _month
    }
    var _year = date.getFullYear() - 1911

    var _yearmonth = _year + '' + _month
    return _yearmonth
  }

  function getConvertDateByDateObj(date) {
    var _year = date.getFullYear()
    var _month = date.getMonth() + 1
    if (_month < 10) {
      _month = '0' + _month
    }
    var _day = date.getDate()
    if (_day < 10) {
      _day = '0' + _day
    }

    return _year + '' + _month + '' + _day
  }

  function getCompanyLocatDateForClient() {
    var _date = new Date()
    var _day = _date.getDate()
    if (_day < 10) {
      _day = '0' + _day
    }
    var _month = _date.getMonth() + 1
    if (_month < 10) {
      _month = '0' + _month
    }
    var _year = _date.getFullYear()

    return _year + '' + _month + '' + _day
  }

  function getCompanyLocatTimeForClient() {
    var _date = new Date()

    var _hours = _date.getHours()
    if (_hours < 10) {
      _hours = '0' + _hours
    }
    var _minutes = _date.getMinutes()
    if (_minutes < 10) {
      _minutes = '0' + _minutes
    }
    var _seconds = _date.getSeconds()
    if (_seconds < 10) {
      _seconds = '0' + _seconds
    }

    var _time = _hours + ':' + _minutes + ':' + _seconds

    return _time
  }

  //檢查日期是否超過報稅期(voucher_date_str : 20201113 21:59:59
  function checkVoucherEffectiveDate(voucher_date_str) {
    var _result = true
    try {
      var _voucher_date = voucher_date_str.substring(0, 8)
      var _voucher_year = parseInt(voucher_date_str.substring(0, 4))
      var _voucher_month = parseInt(voucher_date_str.substring(4, 6))

      if (_voucher_month % 2 != 0) {
        //單月
        _voucher_month = _voucher_month + 1
      }
      //單數月申報
      _voucher_month = _voucher_month + 1
      if (_voucher_month > 12) {
        _voucher_month = _voucher_month - 12
        _voucher_year = _voucher_year + 1
      }
      var _tax_return_month = '' + _voucher_month
      if (_voucher_month < 10) {
        _tax_return_month = '0' + _voucher_month
      }
      var _tax_return_date = _voucher_year + _tax_return_month + '15'

      var _today = getCompanyLocatDateForClient() //20201115
      if (parseInt(_today) > parseInt(_tax_return_date)) {
        _result = false
      }
    } catch (e) {
      console.log(e.name + ':' + e.message)
    }
    return _result
  }

  return {
    checkVoucherEffectiveDate: checkVoucherEffectiveDate,
    getCompanyLocatDateForClient: getCompanyLocatDateForClient,
    getCompanyLocatTimeForClient: getCompanyLocatTimeForClient,
    getConvertDateByDateObj: getConvertDateByDateObj,
    getTaxYearMonthByDateObj: getTaxYearMonthByDateObj,
    getConvertDateByDate: getConvertDateByDate,
    getNetSuiteLocalDate: getNetSuiteLocalDate,
    getTaxYearMonthByDate: getTaxYearMonthByDate,
    getVoucherDateByDate: getVoucherDateByDate,
    getCompanyLocatDate: getCompanyLocatDate,
    getCompanyLocatTime: getCompanyLocatTime,
    getTaxYearMonth: getTaxYearMonth,
  }
})
