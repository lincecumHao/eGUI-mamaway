define(['N/runtime', 'N/search', 'N/query', 'N/record'], (
  runtime,
  search,
  query,
  record
) => {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2020 Gateweb
   * @author Sean Lin <seanlin816@gmail.com>
   *
   * @NApiVersion 2.1
   * @NModuleScope Public


   * @NScriptType MapReduceScript
   */
  var exports = {}

  /**
   * getInputData event handler
   *
   * @gov XXX
   *
   * @param {Object} context
   * @param {boolean} context.isRestarted - indicates whether the current invocation of the
   *      function represents a restart
   * @param {Object} context.ObjectRef - contains input data
   * @param {string|number} context.ObjectRef.id - The internal ID or script ID of the
   *      object; e.g. a Saved Search ID
   * @param {string} context.ObjectRef.string - The object's type
   *
   * @return {*[]|Object|search.Search|ObjectRef|file.File|query.Query} Data that will be used as
   *      input for the subsequent map or reduce
   */
  function getInputData(context) {
    log.audit({ title: 'Start ...' })
    let param = readParameters(runtime.getCurrentScript())
    var apDocSearch = search.create({
      type: 'customrecord_gw_ap_doc',
      columns: [],
    })
    if (param.transactionId) {
      var searchFilters = []
      searchFilters.push([
        'custrecord_gw_apt_doc_tran_id',
        'anyOf',
        [param.transactionId],
      ])
      apDocSearch.filterExpression = searchFilters
    }

    return apDocSearch
  }

  /**
   * readParameters function
   *
   * @gov XXX
   *
   * @param {Script} currentScript currentScript runtime context
   */
  function readParameters(currentScript) {
    // TODO - Read parameter content here
    // var applyPeriod = currentScript.getParameter({
    //   name: 'custscript_gw_mr_param_apply_period',
    // })
    // var file = currentScript.getParameter({
    //   name: 'custscript_gw_mr_param_file',
    // })
    var transactionId = currentScript.getParameter({
      name: 'custscript_gw_mr_param_rev_tranid',
    })
    return { transactionId }
  }

  /**
   * reduce event handler
   *
   * @gov XXX
   *
   * @param {Object} context
   * @param {boolean} context.isRestarted - Indicates whether the function has been invoked
   *      previously for the current key/value pair.
   * @param {number} context.executionNo - Indicates whether the current invocation of the
   *      function is the first or a subsequent invocation for the current key/value pair.
   * @param {string[]} context.errors - Holds serialized errors that were thrown during previous
   *      attempts to execute the function on the current key/value pair.
   * @param {string} context.key - The key to be processed during the stage.
   * @param {string[]} context.values - The value to be processed during the stage.
   */
  function reduce(context) {
    log.audit({ title: '[reduce] Processing Key:', details: context.key })
    log.debug({ title: 'reduce context', details: context })
    // TODO
    record.delete({
      type: 'customrecord_gw_ap_doc',
      id: JSON.parse(context.values[0]).id,
    })
  }

  /**
   * summarize event handler
   *
   * @gov XXX
   *
   * @param {Object} summary
   * @param {number} summary.concurrency - The maximum concurrency number when executing parallel
   *      tasks for the map/reduce script.
   * @param {Date} summary.dateCreated - The time and day when the map/reduce script began running
   * @param {InputSummary} summary.inputSummary - Holds statistics regarding the input stage.
   * @param {boolean} summary.isRestarted - Indicates whether the function has been invoked
   *      previously for the current key/value pair.
   * @param {MapSummary} summary.mapSummary - Holds statistics regarding the map stage.
   * @param {Iterator} summary.output - Iterator that provides keys and values that are saved as
   *      output during the reduce stage.
   * @param {ReduceSummary} summary.reduceSummary - Holds statistics regarding the reduce stage.
   * @param {number} summary.seconds - Total seconds elapsed when running the map/reduce script.
   * @param {number} summary.usage - Total number of usage units consumed when running the script.
   * @param {number} summary.yields - Total number of yields when running the map/reduce script.
   */
  function summarize(summary) {
    let errors = parseErrors(summary)

    // TODO

    log.audit({ title: 'Complete.' })
  }

  /**
   * Parses errors from all stages into a single list
   *
   * @gov 0
   *
   * @param {SummaryContext} summary - Holds statistics regarding execution of the script
   *
   * @returns {Object[]} list of errors encountered while running the script
   */
  function parseErrors(summary) {
    let errors = []

    if (summary.inputSummary.error) {
      errors.push(summary.inputSummary.error)
    }

    summary.mapSummary.errors.iterator().each((k, e) => errors.push(e))
    summary.reduceSummary.errors.iterator().each((k, e) => errors.push(e))

    return errors
  }

  exports.getInputData = getInputData
  exports.reduce = reduce
  exports.summarize = summarize
  return exports
})
