define([
  'N/runtime',
  '../../domain/eGUI/void_list/gw_void_egui_voucher_id_all'
], (runtime, voidVoucherId) => {
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

    // TODO
    let params = readParameters(runtime.getCurrentScript())

    return voidVoucherId.b2cVoucherIds
  }

  function readParameters(currentScript) {
    var folderId = currentScript.getParameter({
      name: 'custscript_gw_mr_param_folder_id'
    })
    return { folderId: folderId }
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
    log.audit({ title: '[map] Processing Key:', details: context.key })
    log.audit({ title: '[map] Processing value:', details: context.value })

    let value = JSON.parse(context.value)

    // TODO
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

    let values = context.values.map(JSON.parse)

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
  exports.map = map
  exports.reduce = reduce
  exports.summarize = summarize
  return exports
})
