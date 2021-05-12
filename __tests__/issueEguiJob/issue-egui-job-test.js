import * as mockData from '../../seed_data/mock_data'
import gwInvoiceService from 'gwInvoiceService'
import searchLib from 'searchLib'
import gwDao from 'gwDao'
import gwEguiService from 'gwEguiService'
import gwInvToGuiMapper from 'gwInvToGuiMapper'
jest.mock('searchLib')
jest.mock('gwDao')
jest.mock('gwInvToGuiMapper')
// jest.mock('gwEguiService')
// jest.mock('gwInvoiceService')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('convert invoice search result to egui object', () => {
  it('should return an egui object from array of search results', function () {
    var invoiceObj = gwInvoiceService.composeInvObj(
      mockData.invoiceSearchResult
    )
    // console.log(invoiceObj)
    expect(invoiceObj).toStrictEqual(mockData.invoice)
    var eGuiService = new gwEguiService(invoiceObj)
    console.log(eGuiService.getEgui())
  })
})
