import * as mockData from '../../seed_data/mock_data'
import voucherRepo from 'voucherRepo'
describe('Basic jest test with simple assert', () => {
  it('should assert strings are equal', () => {
    const repo = new voucherRepo()
    const voucherMain = repo.transEGuiToVoucherMain(mockData.egui)
    console.log(voucherMain)
    const voucherDetail = repo.transEguiDetailToVoucherDetail(
      mockData.egui.lines
    )
    console.log(voucherDetail)
  })
})
