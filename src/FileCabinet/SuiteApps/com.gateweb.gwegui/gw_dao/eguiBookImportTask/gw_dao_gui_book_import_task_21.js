define([
  './gw_record_fields',
  'N/record',
  '../../library/ramda.min',
  '../eguiBook/gw_dao_egui_book',
], (fieldConfig, record, ramda, gwGuiBookDao) => {
  class EguiBookImportTask {
    save(recordObj) {
      var newRecord = record.create({
        type: fieldConfig.recordId,
      })
      Object.keys(recordObj).forEach(function (sourceFieldId) {
        var fieldId = fieldConfig.fieldInputMapping[sourceFieldId]
        if (fieldId) {
          newRecord.setValue({
            fieldId: fieldId,
            value: recordObj[sourceFieldId],
          })
        }
      })
      return newRecord.save()
    }

    load(internalId) {
      return record.load({
        type: fieldConfig.recordId,
        id: internalId,
        isDynamic: true,
      })
    }

    addBooks(taskId, eguiBooks) {
      var taskRecord = this.load(taskId)
      eguiBooks.forEach(function (bookObj) {
        var recordObj = gwGuiBookDao.transformBookToRecordObj(bookObj)
        addNewLine(taskRecord, fieldConfig.sublists.eguiBook, recordObj)
      })
      taskRecord.save()

      function addNewLine(taskRecord, sublistId, lineObj) {
        taskRecord.selectNewLine({
          sublistId: sublistId,
        })
        Object.keys(lineObj).forEach(function (fieldId) {
          taskRecord.setCurrentSublistValue({
            sublistId: sublistId,
            fieldId: fieldId,
            value: lineObj[fieldId],
          })
        })
        taskRecord.commitLine({
          sublistId: sublistId,
        })
      }
    }
  }

  return new EguiBookImportTask()
})
