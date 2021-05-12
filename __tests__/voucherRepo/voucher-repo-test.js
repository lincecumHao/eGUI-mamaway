import * as mockData from '../../seed_data/mock_data'
import voucherRepo from 'voucherRepo'

describe('Basic jest test with simple assert', () => {
  it('should assert strings are equal', () => {
    const voucherRecordObj = voucherRepo.transEgui(mockData.egui)
    console.log(voucherRecordObj)
  })
})
