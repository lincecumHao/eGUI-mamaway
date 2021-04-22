define([
  'N/record',
  '../gw_abstract_dao',
  './gw_record_fields',
  '../eguiBookStatus/gw_dao_egui_book_status_21',
  '../eguiBookType/gw_dao_egui_book_type_21',
  '../../library/gw_lib_search',
  '../../library/ramda.min',
], (
  record,
  gwDao,
  fieldConfig,
  gwEguiBookStatusDao,
  gwBookTypeDao,
  gwSearchLib,
  ramda
) => {
  class EguiBook extends gwDao.DataAccessObject {
    getAllOptions() {
      log.debug({ title: 'GuiBook Dao getAllOptions overwrite' })
    }

    /**
     *
     * @param searchParams {{taxId:string, taxPeriod: string, department?: string, classification?: string, bookType?: string}}
     * @return {Array}
     */
    getBooks(searchParams) {
      function searchBooks() {
        const inputMapping = fieldConfig.fieldInputMapping
        var filters = []
        if (!searchParams.taxId) throw 'Business Tax Id is not defined'
        if (!searchParams.taxPeriod) throw 'Tax Period is not defined'
        if (!searchParams.bookType)
          searchParams.bookType = gwBookTypeDao.getDefaultBookType().id
        filters.push([inputMapping.businessTaxId, 'is', searchParams.taxId])
        filters.push('AND')
        filters.push([inputMapping.bookTaxPeriod, 'is', searchParams.taxPeriod])
        filters.push('AND')
        filters.push([inputMapping.type, 'is', searchParams.bookType])
        filters.push('AND')
        filters.push([
          inputMapping.bookStatus,
          'anyOf',
          [
            gwEguiBookStatusDao.getUnusedStatus().id,
            gwEguiBookStatusDao.getInUseStatus().id,
          ],
        ])
        // filters.push(inputMapping.type, 'is', searchParams.taxId)
        if (searchParams.department) {
          filters.push('AND')
          filters.push([inputMapping.department, 'is', searchParams.department])
        }
        if (searchParams.classification) {
          filters.push('AND')
          filters.push([
            inputMapping.classification,
            'is',
            searchParams.classification,
          ])
        }
        log.debug({ title: 'filters', details: filters })
        const result = gwSearchLib.runSearch(
          fieldConfig.recordId,
          JSON.parse(JSON.stringify(fieldConfig.allFieldIds)),
          filters
        )

        return sortByTypeThenByNumber(result)
      }

      const sortByTypeThenByNumber = ramda.pipe(
        ramda.map((item) => {
          item.custrecord_gw_gb_start_num = parseInt(
            item.custrecord_gw_gb_start_num,
            10
          )
          return item
        }),
        ramda.sortWith([
          ramda.descend(ramda.path(['custrecord_gw_gb_book_status', 'value'])),
          ramda.ascend(ramda.prop('custrecord_gw_gb_start_num')),
        ])
      )

      return searchBooks()
    }

    guiNumberPicked(books) {
      var updateRecords = ramda.map((book) => {
        return {
          id: book.id,
          values: {
            custrecord_gw_gb_book_status: book.custrecord_gw_gb_book_status.id
              ? book.custrecord_gw_gb_book_status.id
              : book.custrecord_gw_gb_book_status,
            custrecord_gw_gb_last_gui_number:
              book.custrecord_gw_gb_last_gui_number,
            custrecord_gw_gb_last_gui_date: book.custrecord_gw_gb_last_gui_date,
            custrecord_gw_gb_used_count: book.custrecord_gw_gb_used_count,
          },
        }
      }, books)
      updateRecords.forEach((updatedRecord) => {
        record.submitFields({
          type: fieldConfig.recordId,
          id: updatedRecord.id,
          values: updatedRecord.values,
        })
      })
    }
  }

  return new EguiBook()
})
