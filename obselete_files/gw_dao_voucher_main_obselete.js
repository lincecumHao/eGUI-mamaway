define([
  'N/record',
  'N/format',
  '../src/FileCabinet/SuiteApps/com.gateweb.gwegui/library/gw_lib_search',
  './gw_dao_voucher_main_fields',
  './gw_dao_voucher_detail_fields',
  '../docFormat/gw_dao_doc_format_options',
  '../taxType/gw_dao_tax_type_options',
  '../guiType/gw_dao_gui_type',
  '../migType/gw_dao_mig_type',
  '../taxCalcMethod/gw_dao_tax_calc_method',
  '../carrierType/gw_dao_carrier_type',
  '../docIssuanceStatus/gw_dao_doc_issuance_status',
], function (
  record,
  format,
  gwSearch,
  gwDocMainFields,
  gwDocDetailFields,
  gwDaoDocFormat,
  gwDaoTaxType,
  gwDaoGuiType,
  gwDaoMigType,
  gwDaoTaxCalcMethod,
  gwDaoCarrierType,
  gwDaoDocProcessStatus
) {
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
  var recordTypeId = 'customrecord_gw_voucher_main'
  var columnObj = gwDocMainFields.fieldIdMapping
  var columns = gwDocMainFields.allFieldIds
  var columnMap = gwDocMainFields.fieldOutputMapping

  function getDocuments(searchFilters) {
    var searchColumns = JSON.parse(JSON.stringify(gwDocMainFields.allFieldIds))
    var result = gwSearch.runSearch(recordTypeId, searchColumns, searchFilters)
    return result.map(function (recordObj) {
      return getSearchResultObj(recordObj)
    })
  }

  function getSearchResultObj(recordObj) {
    var optionObject = {}
    columns.forEach(function (columnId) {
      var attribute = columnMap[columnId]
      optionObject[attribute] = recordObj[columnId]
    })
    optionObject.id = recordObj.id
    return optionObject
  }

  function getDocumentsPendingUpload() {
    var searchFilters = []
    searchFilters.push(['isinactive', 'is', false])
    searchFilters.push('AND')
    searchFilters.push([
      columnObj.custrecord_gw_voucher_upload_status,
      'is',
      '',
    ])
    searchFilters.push('AND')
    searchFilters.push([columnObj.custrecord_gw_ed_status, 'is', '1'])
    return getDocuments(searchFilters)
  }

  function getDocumentByGuiNumber(guiNumber) {
    var searchFilters = []
    searchFilters.push(['isinactive', 'is', false])
    searchFilters.push('AND')
    searchFilters.push([columnObj.custrecord_gw_ed_number, 'is', guiNumber])
    return getDocuments(searchFilters)
  }

  function getDocumentById(id) {
    var searchFilters = []
    searchFilters.push(['isinactive', 'is', false])
    searchFilters.push('AND')
    searchFilters.push(['internalId', 'is', id])
    return getDocuments(searchFilters)
  }

  function createDocument(docMainObj) {
    log.debug({ title: 'createDocument', details: docMainObj })
    var newRecord = record.create({
      type: recordTypeId,
      isDynamic: true,
    })
    Object.keys(docMainObj).forEach(function (fieldId) {
      if (fieldId !== 'lines') {
        var fieldValue = docMainObj[fieldId]
        var fieldObj = gwDocMainFields.fields[fieldId]
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
    var sublistId = gwDocMainFields.sublists.detail
    docMainObj.lines.forEach(function (lineObj) {
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

  function loadDocuments(docIds) {}

  function loadDocument(id) {
    var docRecord = record.load({
      type: recordTypeId,
      id: id,
    })
    var mainObj = getRecord(docRecord)
    mainObj.lines = getSublistFields(docRecord)

    var docDateField = gwDocMainFields.fields.custrecord_gw_ed_date.outputField
    mainObj[docDateField] = mainObj[docDateField]['text']

    var guiTypeField =
      gwDocMainFields.fields.custrecord_gw_ed_gui_type.outputField
    mainObj[guiTypeField] = gwDaoGuiType.getGuiTypeById(
      mainObj[guiTypeField]['value']
    )

    var migTypeField =
      gwDocMainFields.fields.custrecord_gw_ed_mig_type.outputField
    mainObj[migTypeField] = gwDaoMigType.getById(mainObj[migTypeField]['value'])

    var docFormatField =
      gwDocMainFields.fields.custrecord_gw_ed_format_code.outputField
    mainObj[docFormatField] = gwDaoDocFormat.getDocTypeById(
      mainObj[docFormatField]['value']
    )

    var taxTypeField =
      gwDocMainFields.fields.custrecord_gw_ed_tax_type.outputField
    mainObj[taxTypeField] = gwDaoTaxType.getTaxTypeById(
      mainObj[taxTypeField]['value']
    )

    var calculationMethodField =
      gwDocMainFields.fields.custrecord_gw_ed_tax_calculation_method.outputField
    mainObj[calculationMethodField] = mainObj[calculationMethodField]
      ? gwDaoTaxCalcMethod.getById(mainObj[calculationMethodField]['value'])
      : ''

    var carrierTypeField =
      gwDocMainFields.fields.custrecord_gw_ed_carrier_type.outputField
    mainObj[carrierTypeField] = mainObj[carrierTypeField]
      ? gwDaoCarrierType.getById(mainObj[carrierTypeField]['value'])
      : ''

    // var processStatusField =
    //   gwDocMainFields.fields.custrecord_gw_ed_process_status.outputField
    // mainObj[processStatusField] = mainObj[processStatusField]
    //   ? gwDaoDocProcessStatus.getById(mainObj[processStatusField]['value'])
    //   : ''

    mainObj['donationMark'] = mainObj['isDonate']['value'] ? '1' : '0'

    mainObj['taxRate'] = mainObj['taxRate'] / 100

    return mainObj
  }

  function getRecord(docRecord) {
    var docRecordObj = {}
    docRecordObj.id = docRecord.id
    columns.forEach(function (columnId) {
      var value = docRecord.getValue({
        fieldId: columnId,
      })
      var text = docRecord.getText({
        fieldId: columnId,
      })
      if (text && !isValueAndTextSame(value, text)) {
        value = { value: value, text: text }
      }
      var outputField = gwDocMainFields.fieldOutputMapping[columnId]
      docRecordObj[outputField] = value
    })
    docRecordObj['buyerTel'] = ''
    return docRecordObj
  }

  function isValueAndTextSame(value, text) {
    var typeOfValue = typeof value
    if (typeOfValue === 'number') {
      value = parseFloat(value)
      text = parseFloat(text.replace(',', ''))
    }
    return value === text
  }

  /**
   *
   * @param docRecord {Record}
   */
  function getSublistFields(docRecord) {
    var sublistLines = []
    var sublistId = gwDocMainFields.sublists.detail
    var sublistFieldIds = gwDocDetailFields.allFieldIds
    var lineCount = docRecord.getLineCount({
      sublistId: sublistId,
    })
    for (var line = 0; line < lineCount; line++) {
      var sublistObj = {}
      sublistFieldIds.forEach(function (fieldId) {
        var outputField = gwDocDetailFields.fields[fieldId].outputField
        if (outputField) {
          var value = docRecord.getSublistValue({
            sublistId: sublistId,
            fieldId: fieldId,
            line: line,
          })
          var text = docRecord.getSublistText({
            sublistId: sublistId,
            fieldId: fieldId,
            line: line,
          })
          if (text && !isValueAndTextSame(value, text)) {
            value = { value: value, text: text }
          }
          sublistObj[outputField] = value
        }
      })
      sublistObj['lineSeq'] = line + 1
      sublistLines.push(sublistObj)
    }
    return sublistLines
  }

  function updateFields(recId, fieldValues) {
    return record.submitFields({
      id: recId,
      type: recordTypeId,
      values: fieldValues,
      options: { enablesourcing: false, ignoreMandatoryFields: true },
    })
  }

  exports.getDocumentByGuiNumber = getDocumentByGuiNumber
  exports.getDocumentsPendingUpload = getDocumentsPendingUpload
  exports.getDocumentById = getDocumentById
  exports.loadDocument = loadDocument
  exports.createDocument = createDocument
  exports.updateFields = updateFields
  return exports
})
