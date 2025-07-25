define([
  'N/record',
  '../migType/gw_dao_mig_type_21',
  '../busEnt/gw_dao_business_entity_21',
  './gw_service_map_egui_voucher',
  './gw_service_map_voucher_egui',
  './gw_dao_voucher_main_fields',
  './gw_dao_voucher_detail_fields',
  '../../library/gw_lib_search',
  '../../library/ramda.min',
  './gw_service_map_allowance_voucher',
  './gw_service_map_voucher_allowance',
], (
  record,
  gwMigTypeDao,
  gwBusinessEntityDao,
  gwEguiVoucherMapper,
  gwVoucherEguiMapper,
  mainFields,
  detailFields,
  searchLib,
  ramda,
  gwAllowanceVoucherMapper,
  gwVoucherAllowanceMapper
) => {
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

  function getDateStr(dateStr) {
    var date = new Date(dateStr)
    return (
      date.getFullYear().toString() +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      date.getDate().toString().padStart(2, '0')
    )
  }

  function updateAllowanceVoucherRecordObj(voucherMain, voucherDetail) {
    var mainObj = JSON.parse(JSON.stringify(voucherMain))
    mainObj['name'] = mainObj['custrecord_gw_voucher_number']
    mainObj['custrecord_gw_voucher_date'] = getDateStr(
      mainObj['custrecord_gw_voucher_date']
    )
    mainObj['custrecord_gw_voucher_sales_tax_apply'] =
      mainObj['custrecord_gw_voucher_sales_tax_apply'] === 'T'
    mainObj['custrecord_gw_tax_rate'] =
      parseFloat(mainObj['custrecord_gw_tax_rate']) * 100
    mainObj['custrecord_gw_dm_seller_profile'] =
      mainObj['custrecord_gw_dm_seller_profile'].id
    mainObj['custrecord_gw_lock_transaction'] = true
    mainObj['custrecord_gw_is_completed_detail'] = true
    mainObj['lines'] = ramda.map((detail) => {
      detail['name'] = 'VoucherDetailRecord'
      detail['custrecord_gw_dtl_voucher_type'] =
        mainObj['custrecord_gw_voucher_type']
      detail['custrecord_gw_dtl_item_tax_rate'] =
        parseFloat(detail['custrecord_gw_dtl_item_tax_rate']) * 100
      detail['custrecord_gw_dtl_voucher_apply_period'] =
        mainObj['custrecord_voucher_sale_tax_apply_period']
      // detail['custrecord_gw_dtl_voucher_number']
      detail['custrecord_gw_dtl_voucher_date'] =
        mainObj['custrecord_gw_voucher_date']
      detail['custrecord_gw_dtl_voucher_time'] =
        mainObj['custrecord_gw_voucher_time']
      detail['custrecord_gw_dtl_voucher_yearmonth'] =
        mainObj['custrecord_gw_voucher_yearmonth']
      return detail
    }, voucherDetail)
    log.debug({ title: 'mainObj lines', details: mainObj['lines'] })
    return mainObj
  }

  function createRecord(voucherObj) {
    var recordTypeId = 'customrecord_gw_voucher_main'
    var newRecord = record.create({
      type: recordTypeId,
      isDynamic: true,
    })
    Object.keys(voucherObj).forEach(function (fieldId) {
      if (fieldId !== 'lines') {
        var fieldValue = voucherObj[fieldId]
        var fieldObj = mainFields.fields[fieldId]
        if (fieldObj.dataType === 'int') {
          fieldValue = Math.round(fieldValue)
        }
        newRecord.setValue({
          fieldId: fieldId,
          value: fieldValue,
        })
      }
    })
    // Some default Values

    // add line
    var sublistId = mainFields.sublists.detail
    voucherObj.lines.forEach(function (lineObj) {
      newRecord.selectNewLine({
        sublistId: sublistId,
      })
      Object.keys(lineObj).forEach(function (sublistFieldId) {
        newRecord.setCurrentSublistValue({
          sublistId: sublistId,
          fieldId: sublistFieldId,
          value: lineObj[sublistFieldId],
        })
      })
      newRecord.commitLine({
        sublistId: sublistId,
      })
    })
    return newRecord.save()
  }

  function updateEguiObj(eguiObj) {
    var egui = JSON.parse(JSON.stringify(eguiObj))
    log.debug({ title: 'UpdateEguiObj', details: egui })
    egui.migTypeOption = gwMigTypeDao.getById(egui.migTypeOption.value)
    egui.taxRate = parseFloat(egui.taxRate) / 100
    egui.sellerProfile = gwBusinessEntityDao.getById(egui.sellerProfile.value)
    return egui
  }

  function updateAllowanceObj(allowanceObj) {
    var allowance = JSON.parse(JSON.stringify(allowanceObj))
    log.debug({ title: 'UpdateAllowanceObj', details: allowance })
    allowance.migTypeOption = gwMigTypeDao.getById(
      allowance.migTypeOption.value
    )
    allowance.taxRate = parseFloat(allowance.taxRate) / 100
    allowance.sellerProfile = gwBusinessEntityDao.getById(
      allowance.sellerProfile.value
    )
    return egui
  }

  class VoucherDao {
    searchVoucherByIds(internalIds) {
      var searchFilters = []
      var internalIdFilters = ramda.reduce(
        (result, internalId) => {
          result.push(['internalId', 'is', internalId])
          result.push('OR')
          return result
        },
        [],
        internalIds
      )
      internalIdFilters.pop()
      log.debug({ title: 'internalIdFilters', details: internalIdFilters })
      searchFilters.push(internalIdFilters)
      var searchResults = searchLib.runSavedSearch(
        'customsearch_gw_voucher_main_search',
        internalIdFilters
      )
      return searchResults
      // return ramda.map((eguiObj) => {
      //   return updateEguiObj(eguiObj)
      // }, gwVoucherEguiMapper.transformSearchResults(searchResults))
    }

    getGuiByVoucherId(voucherId) {
      var results = this.searchVoucherByIds([voucherId])
      return ramda.map((eguiObj) => {
        return updateEguiObj(eguiObj)
      }, gwVoucherEguiMapper.transformSearchResults(results))[0]
    }

    getAllowanceByVoucherId(voucherId) {
      var results = this.searchVoucherByIds([voucherId])
      return ramda.map((allowanceObj) => {
        return updateAllowanceObj(allowanceObj)
      }, gwVoucherAllowanceMapper.transformSearchResults(results))[0]
    }

    searchVoucher(searchFilters) {
      return searchLib.runSavedSearch(
        'customsearch_gw_voucher_main_search',
        searchFilters
      )
    }

    saveEguiToRecord(eguiObj) {
      log.debug({ title: 'eguiObj', details: eguiObj })
      var voucherRecordObj = gwEguiVoucherMapper.transform(eguiObj)
      voucherRecordObj = updateEguiVoucherRecordObj(
        voucherRecordObj,
        voucherRecordObj.lines
      )
      var id = createRecord(voucherRecordObj)
      // this.recordSaved(eguiObj)
      return id
    }

    saveAllowanceToRecord(allowanceObj) {
      log.debug({ title: 'allowanceObj', details: allowanceObj })
      var voucherRecordObj = gwAllowanceVoucherMapper.transform(allowanceObj)
      voucherRecordObj = updateAllowanceVoucherRecordObj(
        voucherRecordObj,
        voucherRecordObj.lines
      )
      var id = createRecord(voucherRecordObj)
      // this.recordSaved(eguiObj)
      return id
    }

    eguiUploaded(voucherId, result) {
      var updateValue = {}
      var isSuccess = result.code === 200
      updateValue[
        mainFields.fields.custrecord_gw_voucher_upload_status.id
      ] = isSuccess ? 'P' : 'E'
      updateValue[
        mainFields.fields.custrecord_gw_uploadstatus_messag.id
      ] = isSuccess ? result.code : result.body
      record.submitFields({
        type: 'customrecord_gw_voucher_main',
        id: voucherId,
        values: updateValue,
      })
    }

    allowanceUploaded(voucherId) {}
  }

  return new VoucherDao()
})
