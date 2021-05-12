import * as mockData from '../../seed_data/mock_data'
import searchLib from 'searchLib'
import gwDao from 'gwDao'
import eguiTransformService from 'eguiTransformService'
import gwEguiConfigDao from 'gwEguiConfigDao'
import gwBusinessEntityDao from 'businessEntityDao'
import gwGuiTypeDao from 'guiTypeDao'
import gwApplyPeriodDao from 'applyPeriodDao'
import gwDocFormatDao from 'docFormatDao'
import gwMigTypeDao from 'migTypeDao'
import gwTaxCalculationDao from 'taxCalcDao'
import gwTaxTypeDao from 'taxTypeDao'
jest.mock('searchLib')
jest.mock('gwDao')
jest.mock('gwEguiConfigDao')
jest.mock('businessEntityDao')
jest.mock('guiTypeDao')
jest.mock('applyPeriodDao')
jest.mock('docFormatDao')
jest.mock('migTypeDao')
jest.mock('taxCalcDao')
jest.mock('taxTypeDao')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('Basic jest test with simple assert', () => {
  it('should assert strings are equal', () => {
    gwEguiConfigDao.getConfig.mockReturnValue(mockData.config)
    gwBusinessEntityDao.getBySubsidiary.mockReturnValue(mockData.businessEntity)
    gwGuiTypeDao.getRegularGuiType.mockReturnValue(mockData.regularGuiType)
    gwGuiTypeDao.getSpecialGuiType.mockReturnValue(mockData.specialGuiType)
    gwApplyPeriodDao.getByText.mockReturnValue(mockData.applyPeriod11004)
    gwDocFormatDao.getById.mockReturnValue(mockData.docFormatDefault)
    gwTaxCalculationDao.getById.mockReturnValue(mockData.taxCalculation)
    gwMigTypeDao.getIssueEguiMigType.mockReturnValue(mockData.migType)
    gwTaxTypeDao.getTaxTypeByTaxCode.mockReturnValue(mockData.taxableTaxType)
    gwTaxTypeDao.getByValue.mockReturnValue(mockData.taxableTaxType)
    const service = new eguiTransformService()
    const eguiObj = service.transformInvToEgui(mockData.invoice, 'ISSUE')
    console.log(JSON.stringify(eguiObj))
    expect(JSON.stringify(eguiObj)).toBe(JSON.stringify(mockData.egui))
  })
})
