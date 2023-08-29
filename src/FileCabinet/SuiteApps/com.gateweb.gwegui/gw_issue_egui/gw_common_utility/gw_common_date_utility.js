/**
 *Date Utility Tool
 *gwDateUtility.js
 *@NApiVersion 2.0
 */
define(['N/format'], function (format) {
  //取得當地時間
  function getLocalDate() {
	/**  
    var _date = new Date()
    var _dateString = format.format({
      value: _date,
      type: format.Type.DATETIME,
      timezone: format.Timezone.ASIA_TAIPEI,
    }) //Returns "8/25/2015 9:27:16 am"

    return new Date(_dateString)
    */
	var _date = new Date(new Date().toLocaleString('zh', {timeZone: 'Asia/Taipei'}))
	
	return _date  
  }

  //取得Netsuite當地時間
  function getNetSuiteLocalDate() {
	/**  
    var _date = new Date()
    
    var _formatDate = format.format({
      value: _date,
      type: format.Type.DATETIME,
      timezone: format.Timezone.ASIA_TAIPEI,
    }) //Returns "8/25/2015 9:27:16 am"
    return new Date(_formatDate)
    */
    var _date = new Date(new Date().toLocaleString('zh', {timeZone: 'Asia/Taipei'}))
     
    return _date
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
  
  function getTaxYearMonthByYYYYMMDD(voucher_date){
     //voucher_date=20230619  
	 var _year_month_num = parseInt(voucher_date.substr(0,6))-191100  
	  
	 if (_year_month_num % 2 !=0){
	     return (_year_month_num+1)+''
	 }else{
	    return _year_month_num+''
	 } 
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
  
 
  function getConvertVoucherDateByDate(date) {     
    var _date = new Date(date.toLocaleString('zh', {timeZone: 'Asia/Taipei'}))

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
  
  function getConvertVoucherDateByDate_BAK(date) {
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
   

  function getConvertDateByDate_Bak(date) { 
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
  
  function getNextYearMonthByYYYYMMDD(voucher_date, add_period){ 
	var _year = parseInt(voucher_date.substring(0, 4)) 
    var _month = parseInt(voucher_date.substring(4, 6)) 
	if (_month % 2 != 0) _month = _month + 1
	
    var _timestamp = Date.parse(_year+'/'+_month+'/01')
    var _date = new Date(_timestamp)
	_date.setMonth(_date.getMonth()+add_period*2)
	 
    var _next_year = _date.getFullYear()-1911 
	var _next_month = _date.getMonth()+1 
	if(_next_month<10)_next_month='0'+_next_month
	else _next_month=_next_month+''
	 
	return _next_year+_next_month	  
  }
  
  function getMonthPeriodDiff(voucher_date1, voucher_date2, add_period){ 
	var _year1 = parseInt(voucher_date1.substring(0, 4)) 
    var _month1 = parseInt(voucher_date1.substring(4, 6)) 
	if (_month1 % 2 != 0) _month1 = _month1 + 1
	 
    var _timestamp1 = Date.parse(_year1+'/'+_month1+'/01')
    var _date1 = new Date(_timestamp1)
	
	var _year2 = parseInt(voucher_date2.substring(0, 4)) 
    var _month2 = parseInt(voucher_date2.substring(4, 6)) 
	if (_month2 % 2 != 0) _month2 = _month2 + 1
	
    var _timestamp2 = Date.parse(_year2+'/'+_month2+'/01')
    var _date2 = new Date(_timestamp2)
	 
	var _month_diff = _date2.getMonth()-_date1.getMonth()+(12 * (_date2.getFullYear() - _date1.getFullYear()))	  
	  
	return (_month_diff/2 != add_period && _month_diff != 0)?false:true
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
    getConvertVoucherDateByDate: getConvertVoucherDateByDate,
    getCompanyLocatDate: getCompanyLocatDate,
    getCompanyLocatTime: getCompanyLocatTime,
    getTaxYearMonthByYYYYMMDD: getTaxYearMonthByYYYYMMDD,
    getNextYearMonthByYYYYMMDD: getNextYearMonthByYYYYMMDD,
    getMonthPeriodDiff: getMonthPeriodDiff,
    getTaxYearMonth: getTaxYearMonth,
  }
})
