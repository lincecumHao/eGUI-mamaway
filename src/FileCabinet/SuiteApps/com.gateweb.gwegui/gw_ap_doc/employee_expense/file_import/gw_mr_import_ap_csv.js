define([
  'N/record',
  'N/file',
  'N/task',
  'N/format',
  './gw_lib_ap_csv',
  '../../field_validation/gw_lib_error_messages',
  '../../vo/gw_ap_doc_fields',
  './gw_lib_csv_task_service',
], (
  record,
  file,
  task,
  format,
  apDocCsv,
  gwErrors,
  apDocFields,
  csvTaskService
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
    // TODO

    if (!csvTaskService.isTaskExecuting() && csvTaskService.isTaskRemaining()) {
      var nextTask = csvTaskService.retrieveTask()
      csvTaskService.taskStarted(nextTask.id)
      let params = nextTask.params
      return file.load({ id: params.fileId })
    } else {
      if (csvTaskService.isTaskExecuting()) {
        log.debug({ title: 'there is task executing' })
      }
      if (!csvTaskService.isTaskRemaining()) {
        log.debug({
          title: 'there is no task to run',
        })
      }
    }
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
    // let params = readParameters(runtime.getCurrentScript())
    var currentTask = csvTaskService.getExecutingTask()[0]
    let params = currentTask.params //e.g. {"applyPeriod":"10912","fileId":1457,"transactionId":"1372"}
    try {
      apDocCsv.setApplyPeriod(params.applyPeriod)
      if (parseInt(context.key) === 0) {
        apDocCsv.setHeaderCols(context.value)
      } else {
        var lineObj = apDocCsv.parseLine(context.value)
        lineObj[apDocFields.fields.applyPeriod.id] = params.applyPeriod
        lineObj[apDocFields.fields.transaction.id] = params.transactionId
        lineObj['line'] = context.key
        var guiStatus = lineObj[apDocFields.fields.guiStatus.id]
        var guiNumber = lineObj[apDocFields.fields.guiNum.id]
        var isGuiVoided = isGuiVoidedOrCanceled(guiStatus)
        var isGuiNumDuplicated = isGuiNumberDuplicated(guiNumber)
        if (isGuiVoided) {
          context.write({
            key: gwErrors.GuiVoided.code,
            value: {
              message: gwErrors.GuiVoided.chtMessage,
              lineData: lineObj,
            },
          })
        }
        if (isGuiNumDuplicated) {
          context.write({
            key: gwErrors.GuiNumberDuplicated.code,
            value: {
              message: gwErrors.GuiNumberDuplicated.chtMessage,
              lineData: lineObj,
            },
          })
        }
        if (!isGuiVoided && !isGuiNumDuplicated) {
          context.write({
            key: params.transactionId,
            value: lineObj,
          })
        }
      }
    } catch (e) {
      log.error({ title: '[map] Exception Occurs', details: e })
      log.error({
        title: '[map] Exception Occurs, key and value',
        details: {
          key: context.key,
          values: context.value,
        },
      })
    }

    // TODO
  }

  function isGuiVoidedOrCanceled(guiStatus) {
    return parseInt(guiStatus) === 2
  }

  function isGuiNumberDuplicated(guiNumber) {
    return apDocCsv.isGuiNumberDuplicated(guiNumber)
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
    var currentTask = csvTaskService.getExecutingTask()[0]
    try {
      switch (context.key) {
        case gwErrors.GuiVoided.code:
          log.error({ title: '[reduce] GUI Voided', details: context.values })
          break
        case gwErrors.GuiNumberDuplicated.code:
          log.error({
            title: '[reduce] GUI Number Duplicated',
            details: context.values,
          })
          csvTaskService.taskError(currentTask.id)
          break
        default:
          apDocCsv.insertExpenseSublistLines(context.key, context.values)
          file.delete({
            id: currentTask.params.fileId,
          })
          csvTaskService.taskFinished(currentTask.id)
          break
      }
    } catch (e) {
      log.error({ title: '[reduce] Exception Occurs', details: e })
      log.error({
        title: '[reduce] Exception Occurs, key and values',
        details: {
          key: context.key,
          values: context.values,
        },
      })
      csvTaskService.taskError(currentTask.id)
    }
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
    log.audit({ title: 'summarize summary', details: summary })
    var currentTask = csvTaskService.getExecutingTask()[0]
    let errors = parseErrors(summary)
    if (errors && errors.length > 0) {
      if (currentTask) {
        csvTaskService.taskError(currentTask.id)
      }
    } else {
      if (currentTask) {
        csvTaskService.taskFinished(currentTask.id)
      }
    }
    // TODO: ERROR HANDLING
    log.audit({ title: 'Complete.', details: errors })
    // ReExecuting Self
    if (csvTaskService.isTaskRemaining()) {
      executeMapReduceTask()
      log.debug({
        title: 'There is next task to execute',
        details: csvTaskService.retrieveTask(),
      })
    }
  }

  function executeMapReduceTask() {
    var csv_import_task = task.create({
      taskType: task.TaskType.MAP_REDUCE,
    })
    csv_import_task.scriptId = 'customscript_gw_mr_import_ap_csv'
    csv_import_task.deploymentId = 'customdeploy_gw_mr_import_ap_csv'
    var taskId = csv_import_task.submit()
    return taskId
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
