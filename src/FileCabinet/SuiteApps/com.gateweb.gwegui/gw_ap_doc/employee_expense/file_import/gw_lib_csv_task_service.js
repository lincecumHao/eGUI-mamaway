define([
  'N/record',
  '../../application/gw_lib_search',
  '../../application/lodash',
  '../../application/gw_lib_wrapper',
], function (record, searchLib, lodash, wrapperLib) {
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
  var currentAllTasks = []
  var queueTaskRecordTypeId = 'customrecord_gw_exp_csv_import_task'
  var columnMapping = {
    id: 'id',
    status: 'custrecord_exp_csv_task_status',
    params: 'custrecord_exp_csv_task_params',
    transaction: 'custrecord_exp_csv_task_transaction',
  }
  var taskStatus = {
    inQueue: '1',
    executing: '2',
    finish: '3',
    error: '4',
  }

  function initTasks() {
    var columns = [
      'custrecord_exp_csv_task_status',
      'custrecord_exp_csv_task_params',
      'custrecord_exp_csv_task_transaction',
    ]
    var filters = []
    filters.push(['custrecord_exp_csv_task_status', 'anyOf', ['1', '2']])
    var results = searchLib.search(queueTaskRecordTypeId, columns, filters)
    currentAllTasks = results.map(function (result) {
      return {
        id: result[columnMapping.id],
        status: result[columnMapping.status],
        params: JSON.parse(result[columnMapping.params]),
        transactionId: result[columnMapping.transaction],
      }
    })
  }

  function queueTask(applyPeriod, fileId, transactionId) {
    var inQueueStatus = '1'
    var paramObj = {
      applyPeriod: applyPeriod,
      fileId: fileId,
      transactionId: transactionId,
    }
    var queueRecord = record.create({
      type: queueTaskRecordTypeId,
    })
    queueRecord.setValue({
      fieldId: columnMapping.status,
      value: inQueueStatus,
    })
    queueRecord.setValue({
      fieldId: columnMapping.params,
      value: JSON.stringify(paramObj),
    })
    queueRecord.setValue({
      fieldId: columnMapping.transaction,
      value: transactionId.toString(),
    })
    var recordId = queueRecord.save()
    currentAllTasks.push({
      id: recordId,
      status: inQueueStatus,
      params: paramObj,
    })
  }

  function retrieveTask() {
    return currentAllTasks[0]
  }

  function getExecutingTask() {
    return lodash.filter(currentAllTasks, function (task) {
      return task.status === taskStatus.executing
    })
  }

  function getInQueueTasks() {
    return lodash.filter(currentAllTasks, function (task) {
      return task.status === taskStatus.inQueue
    })
  }

  function isTaskRemaining() {
    var remainingTasks = getInQueueTasks()
    return remainingTasks.length > 0
  }

  function isTaskExecuting() {
    var executingTasks = getExecutingTask()
    return executingTasks.length > 0
  }

  function taskFinished(internalId) {
    updateStatus(internalId, taskStatus.finish)
    // remove taks from all tasks
    lodash.remove(currentAllTasks, function (task) {
      return task.status === taskStatus.finish
    })
  }

  function taskStarted(internalId) {
    updateStatus(internalId, taskStatus.executing)

    log.debug({
      title: 'taskStarted currentAllTasks',
      details: currentAllTasks,
    })
  }

  function taskError(internalId) {
    updateStatus(internalId, taskStatus.error)
  }

  //region cache operation

  function updateStatus(internalId, status) {
    var values = {}
    values[columnMapping.status] = status
    record.submitFields({
      type: queueTaskRecordTypeId,
      id: internalId.toString(),
      values: values,
    })
    var task = lodash.find(currentAllTasks, function (task) {
      return parseInt(task.id) === parseInt(internalId)
    })
    task.status = status
  }

  function constructorWrapper(func) {
    return function () {
      if (currentAllTasks.length === 0) {
        initTasks()
      }
      lodash.orderBy(currentAllTasks, ['id'], ['asc'])
      var result = func.apply(this, arguments)
      return result
    }
  }

  exports.isTaskRemaining = constructorWrapper(
    wrapperLib.logWrapper(isTaskRemaining)
  )
  exports.taskStarted = constructorWrapper(wrapperLib.logWrapper(taskStarted))
  exports.taskFinished = constructorWrapper(wrapperLib.logWrapper(taskFinished))
  exports.taskError = constructorWrapper(wrapperLib.logWrapper(taskError))
  exports.retrieveTask = constructorWrapper(wrapperLib.logWrapper(retrieveTask))
  exports.queueTask = constructorWrapper(wrapperLib.logWrapper(queueTask))
  exports.getExecutingTask = constructorWrapper(
    wrapperLib.logWrapper(getExecutingTask)
  )
  exports.isTaskExecuting = constructorWrapper(
    wrapperLib.logWrapper(isTaskExecuting)
  )
  exports.initTasks = initTasks
  exports.taskStatus = taskStatus
  return exports
})
