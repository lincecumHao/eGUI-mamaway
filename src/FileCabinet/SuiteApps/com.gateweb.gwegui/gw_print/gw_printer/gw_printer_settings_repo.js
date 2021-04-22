define(['N/record', 'N/search'], function (record, search) {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2020 Gateweb
   * @author Sean Lin <seanlin816@gmail.com>
   *
   * @NApiVersion 2.0
   * @NModuleScope Public

   */
  var exports = {}
  var AllSettings = []
  var printerRecordTypeId = 'customrecord_gw_printer_setting'

  function allSettingEmptyWrapper(func) {
    return function () {
      if (AllSettings.length === 0) {
        AllSettings = func.apply(this, arguments)
      }
      return AllSettings
    }
  }

  function allSettingEmptyWrapper2(func1, func2) {
    return function () {
      var result = []
      if (AllSettings.length === 0) {
        result = func1.apply(this, arguments)
      } else {
        result = func2.apply(this, arguments)
      }
      return result
    }
  }

  function searchAllPrinterSettings() {
    var settingsSearch = getSearchObject()
    var settings = runSearchResults(settingsSearch)
    return settings
  }

  function filterPrinterById(id) {
    log.debug({ title: 'filter Existing printer', details: id })
    var printerSetting = AllSettings.filter(function (setting) {
      return parseInt(setting.id) === id
    })
    return printerSetting
  }

  function lookUpPrinterById(id) {
    var settingRecord = {}
    var result = search.lookupFields({
      type: 'customrecord_gw_printer_setting',
      id: id,
      columns: [
        'name',
        'custrecord_gw_printer_agent_key',
        'custrecord_gw_printer_type',
        'custrecord_gw_printer_department',
        'custrecord_gw_printer_print_detail',
        'custrecord_gw_printer_print_contact',
        'custrecord_gw_printer_line_spacing',
      ],
    })
    log.debug({
      title: 'lookupPrinterById printerRecord',
      details: result,
    })
    settingRecord.id = id
    settingRecord.name = result.name
    settingRecord.printerKey = result.custrecord_gw_printer_agent_key
    settingRecord.printerType = { id: 0, text: '' }
    if (result.custrecord_gw_printer_type[0]) {
      settingRecord.printerType.id = parseInt(
        result.custrecord_gw_printer_type[0].value
      )
      settingRecord.printerType.text = result.custrecord_gw_printer_type[0].text
    }
    settingRecord.department = { id: 0, text: '' }
    if (result.custrecord_gw_printer_department[0]) {
      settingRecord.department.id = parseInt(
        result.custrecord_gw_printer_department[0].value
      )
      settingRecord.department.text =
        result.custrecord_gw_printer_department[0].text
    }
    settingRecord.printDetail = result.custrecord_gw_printer_print_detail
    settingRecord.lineSpacing = parseInt(
      result.custrecord_gw_printer_line_spacing
    )
    settingRecord.printContact = result.custrecord_gw_printer_print_contact
    // settings.push(settingRecord)
    log.debug({
      title: 'lookupPrinterById settingRecord',
      details: settingRecord,
    })
    return [settingRecord]
  }

  function getSearchObject(filters) {
    var settingsSearch = search.create({
      type: 'customrecord_gw_printer_setting',
      columns: [
        { name: 'name' },
        { name: 'custrecord_gw_printer_agent_key' },
        { name: 'custrecord_gw_printer_type' },
        { name: 'custrecord_gw_printer_department' },
        { name: 'custrecord_gw_printer_print_detail' },
        { name: 'custrecord_gw_printer_print_contact' },
        { name: 'custrecord_gw_printer_line_spacing' },
      ],
    })
    if (filters && filters.length > 0) {
      filters.forEach(function (filter) {
        var filterObj = search.createFilter({
          name: filter.name,
          operator: filter.operator,
          values: filter.values,
        })
        settingsSearch.filters.push(filterObj)
      })
    }
    return settingsSearch
  }

  function runSearchResults(settingsSearch) {
    var settings = []
    settingsSearch.run().each(function (result) {
      var settingRecord = {}
      settingRecord.id = parseInt(result.id)
      settingRecord.name = result.getValue({ name: 'name' })
      settingRecord.printerKey = result.getValue({
        name: 'custrecord_gw_printer_agent_key',
      })
      settingRecord.printerType = {}
      settingRecord.printerType.id =
        parseInt(
          result.getValue({
            name: 'custrecord_gw_printer_type',
          })
        ) || 0
      settingRecord.printerType.text =
        result.getText({
          name: 'custrecord_gw_printer_type',
        }) || ''
      settingRecord.department = {}
      settingRecord.department.id =
        parseInt(
          result.getValue({
            name: 'custrecord_gw_printer_department',
          })
        ) || 0
      settingRecord.department.text =
        result.getText({
          name: 'custrecord_gw_printer_department',
        }) || ''
      settingRecord.printDetail = result.getValue({
        name: 'custrecord_gw_printer_print_detail',
      })
      settingRecord.lineSpacing =
        parseInt(
          result.getValue({
            name: 'custrecord_gw_printer_line_spacing',
          })
        ) || 0
      settingRecord.printContact = result.getValue({
        name: 'custrecord_gw_printer_print_contact',
      })
      settings.push(settingRecord)
      log.debug({ title: 'search each', details: result })
      return true
    })
    return settings
  }

  /**
   *
   * @param {{id: int, name: string, printerKey: string, printerType: {id: int, text: string}, department: {id: int, text: string}, printDetail: boolean, lineSpacing: int, printContact: int }} printerSetting
   */
  function createPrinter(printerSetting) {
    log.debug({
      title: 'createPrinter printerSetting',
      details: printerSetting,
    })
    var printerRecord = record.create({
      type: printerRecordTypeId,
      isDynamic: false,
    })

    // Setting Values here
    printerRecord.setValue({ fieldId: 'name', value: printerSetting.name })
    printerRecord.setValue({
      fieldId: 'custrecord_gw_printer_key',
      value: printerSetting.printerKey,
    })
    if (printerSetting.department.id) {
      printerRecord.setValue({
        fieldId: 'custrecord_gw_printer_department',
        value: printerSetting.department.id,
      })
    }
    if (printerSetting.printerType.id) {
      printerRecord.setValue({
        fieldId: 'custrecord_gw_printer_type',
        value: printerSetting.printerType.id,
      })
    }
    var printDetail = convertCheckboxValueToBoolean(printerSetting.printDetail)
    log.debug({ title: 'createPrinter printDetail', details: printDetail })
    printerRecord.setValue({
      fieldId: 'custrecord_gw_printer_print_detail',
      value: printDetail,
    })
    var printContact = convertCheckboxValueToBoolean(
      printerSetting.printContact
    )
    log.debug({ title: 'createPrinter printContact', details: printContact })
    printerRecord.setValue({
      fieldId: 'custrecord_gw_printer_print_contact',
      value: printContact,
    })
    printerRecord.setValue({
      fieldId: 'custrecord_gw_printer_line_spacing',
      value: printerSetting.lineSpacing,
    })

    var internal_id_new = printerRecord.save({
      enableSourcing: false,
      ignoreMandatoryFields: true,
    })

    return internal_id_new
  }

  function convertCheckboxValueToBoolean(checkboxValue) {
    if (typeof checkboxValue === 'string' && checkboxValue === 'T') return true
    if (typeof checkboxValue === 'string' && checkboxValue === 'F') return false
    if (typeof checkboxValue === 'string' && checkboxValue === 'true')
      return true
    if (typeof checkboxValue === 'string' && checkboxValue === 'false')
      return false
    if (typeof checkboxValue === 'boolean') return checkboxValue
    return null
  }

  exports.getAllPrinterSettings = allSettingEmptyWrapper(
    searchAllPrinterSettings
  )
  exports.getPrinterById = allSettingEmptyWrapper2(
    lookUpPrinterById,
    filterPrinterById
  )
  exports.createPrinter = createPrinter
  return exports
})
