define(['N/record', './gw_lib_search', './gw_lib_wrapper'], function (
  record,
  GwSearch,
  wrapperLib
) {
    /**
     * Module Description...
     *
     * @type {Object} module-name
     *
     * @NApiVersion 2.0
     * @NModuleScope Public

     */
    var exports = {}
    var apDocExemptRecordTypeId = 'customrecord_gw_ap_doc_exempt_option'

    var allOptions = []

    function constructorWrapper(func) {
        return function () {
            if (allOptions.length === 0) {
                log.debug({ title: 'exempt constructor wrapper get all options' })
                getAllOptions()
            }
            var result = func.apply(this, arguments)
            return result
        }
    }

    function getOptionById(id) {
        var option = allOptions.filter(function (option) {
            return parseInt(option.id) === parseInt(id)
        })[0]
        return option
    }

    function getOptionByValue(value) {
        var option = allOptions.filter(function (option) {
            return option.value.toString() === value.toString()
        })[0]
        return option
    }

    function getAllOptions() {
        var columns = [
            'custrecord_gw_ap_doc_exempt_value',
            'custrecord_gw_ap_doc_exempt_text',
        ]
        var result = GwSearch.search(apDocExemptRecordTypeId, columns)
        allOptions = result.map(function (recordObj) {
            return {
                id: recordObj.id,
                value: parseInt(recordObj['custrecord_gw_ap_doc_exempt_value']),
                text: recordObj['custrecord_gw_ap_doc_exempt_text'],
            }
        })
        return allOptions
    }

    function getExemptValueByRecordId(id) {
        var option = getOptionById(id)
        return option ? option.value : ''
    }

    function getExemptRecordIdByValue(value) {
        var option = getOptionByValue(value)
        return option ? option.id : 0
    }


    exports.getExemptValueByRecordId = constructorWrapper(
      getExemptValueByRecordId
    )
    exports.getAllExempt = getAllOptions
    exports.getExemptRecordIdByValue = constructorWrapper(
      getExemptRecordIdByValue
    )
    return exports
})
