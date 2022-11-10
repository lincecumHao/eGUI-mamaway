import taxIdValidator from '../../src/FileCabinet/SuiteApps/com.gateweb.gwegui/gw_ap_doc/field_validation/gw_lib_field_validation_tax_id_number';

describe('test tax id', ()=>{
  it('should return true', function () {
    const taxId = '20874332'
    const result = taxIdValidator.isNumberCalculatedValid(taxId);
    expect(result).toBeTruthy()
  });
})