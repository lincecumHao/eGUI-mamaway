define([
  'N/runtime',
  'N/error',
  '../library/ramda.min',
  './gw_invoice_service',
  './gw_egui_service',
], (runtime, error, ramda, gwInvoiceService, gwEguiService) => {
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
    return gwInvoiceService.getInvoiceToIssueEguiSearch()
  }

  /**
   * map event handler
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
   * @param {string} context.value - The value to be processed during the stage.
   */
  function map(context) {
    var searchResult = JSON.parse(context.value)
    log.debug({ title: 'map stage searchResult', details: searchResult })
    context.write({
      key: searchResult.id,
      value: searchResult.values,
    })
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
    try {
      var searchResults = context.values.map((value) => {
        return JSON.parse(value)
      })
      gwInvoiceService.lockInvoice(context.key)
      var invoiceObj = gwInvoiceService.composeInvObj(searchResults)
      log.debug({ title: 'reduce invoiceObj', details: invoiceObj })
      var eguiService = new gwEguiService(invoiceObj)
      log.debug({ title: 'reduce eguiObj', details: eguiService.getEgui() })
      var voucherId = eguiService.issueEgui()
      log.debug({ title: 'reduce voucherId', details: voucherId })
      var uploadEguiResult = eguiService.uploadEgui(voucherId)
      log.debug({ title: 'eguiUploadResult', details: uploadEguiResult })
      context.write({
        key: voucherId,
      })
    } catch (e) {
      gwInvoiceService.unlockInvoice(context.key)
      throw e
    }

    // TODO
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
    createSummaryRecord(summary)
    // TODO
    log.audit({ title: 'Complete.' })
  }

  function createSummaryRecord(summary) {
    try {
      var seconds = summary.seconds
      var usage = summary.usage
      var yields = summary.yields
      log.debug({
        title: `Summary for M/R script: ${runtime.getCurrentScript().id}`,
        details: `time: ${seconds} seconds, usage: ${usage}, yields: ${yields}`,
      })
    } catch (e) {}
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
      errors.push(
        error.create({
          name: 'INPUT_STAGE_FAILED',
          message: inputSummary.error,
        })
      )
    }

    summary.mapSummary.errors.iterator().each((k, e) =>
      errors.push(
        error.create({
          name: 'MAP_STAGE_FAILED',
          message: `Failure on key ${k}, message: ${e}`,
        })
      )
    )
    summary.reduceSummary.errors.iterator().each((k, e) =>
      errors.push(
        error.create({
          name: 'REDUCE_STAGE_FAILED',
          message: `Failure on key ${k}, message: ${e}`,
        })
      )
    )

    return errors
  }

  exports.getInputData = getInputData
  exports.map = map
  exports.reduce = reduce
  exports.summarize = summarize
  return exports
})
