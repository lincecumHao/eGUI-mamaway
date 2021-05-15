define(['../../../../library/ramda.min'], function (ramda) {
  /**
   * Module Description...
   *
   * @type {Object} module-name
   *
   * @copyright 2021 Gateweb
   * @author Sean Lin <sean.hyl@gmail.com>
   *
   * @NApiVersion 2.0
   * @NModuleScope Public

   */
  var exports = {}
  var fieldConfig = {
    internalId: {
      id: 'internalId',
      sourceField: 'internalId.value',
      outputField: '',
    },
    documentDate: {
      id: 'documentDate',
      sourceField: 'custbody_gw_gui_date',
      outputField: '',
    },
    tranDate: {
      id: 'tranDate',
      sourceField: 'trandate',
      outputField: '',
    },
    subsidiaryId: {
      id: 'subsidiaryId',
      sourceField: 'subsidiary.value',
      outputField: '',
    },
    subsidiaryName: {
      id: 'subsidiaryName',
      sourceField: 'subsidiary.text',
      outputField: '',
    },
    tranType: {
      id: 'tranType',
      sourceField: 'type.text',
      outputField: '',
    },
    tranid: {
      id: 'tranid',
      sourceField: 'tranid',
      outputField: '',
    },
    tranNum: {
      id: 'tranNum',
      sourceField: 'transactionnumber',
      outputField: '',
    },
    buyerId: {
      id: 'buyerId',
      sourceField: 'entity.value',
      outputField: '',
    },
    buyerTaxId: {
      id: 'buyerTaxId',
      sourceField: 'custbody_gw_tax_id_number',
      outputField: '',
    },
    buyerAddress: {
      id: 'buyerAddress',
      sourceField: 'custbody_gw_gui_address',
      outputField: '',
    },
    buyerTitle: {
      id: 'buyerTitle',
      sourceField: 'custbody_gw_gui_title',
      outputField: '',
    },
    guiMemo: {
      id: 'guiMemo',
      sourceField: 'custbody_gw_gui_main_memo',
      outputField: '',
    },
    nsSalesAmt: {
      id: 'nsSalesAmt',
      sourceField: 'netamountnotax',
      outputField: '',
    },
    nsSalesAmtTaxZero: {
      id: 'nsSalesAmtTaxZero',
      sourceField: '',
      outputField: '',
    },
    nsSalesAmtTaxExempt: {
      id: 'nsSalesAmtTaxExempt',
      sourceField: '',
      outputField: '',
    },
    nsTaxAmt: {
      id: 'nsTaxAmt',
      sourceField: 'taxtotal',
      outputField: '',
    },
    nsTotalAmt: {
      id: 'nsTotalAmt',
      sourceField: 'total',
      outputField: '',
    },
    taxType: {
      id: 'taxType',
      sourceField: '',
      outputField: '',
    },
    taxRate: {
      id: 'taxRate',
      sourceField: '',
      outputField: '',
    },
    departmentId: {
      id: 'departmentId',
      sourceField: 'custbody_gw_gui_department.value',
      outputField: '',
    },
    departmentName: {
      id: 'departmentName',
      sourceField: 'custbody_gw_gui_department.text',
      outputField: '',
    },
    classId: {
      id: 'classId',
      sourceField: 'custbody_gw_gui_class.value',
      outputField: '',
    },
    className: {
      id: 'classId',
      sourceField: 'custbody_gw_gui_class.text',
      outputField: '',
    },
    createdby: {
      id: 'createdby',
      sourceField: 'createdby.value',
      outputField: '',
    },
    guiTaxFileDate: {
      id: 'guiTaxFileDate',
      sourceField: 'custbody_gw_gui_tax_file_date',
      outputField: '',
    },
    isTransactionLocked: {
      id: 'isTransactionLocked',
      sourceField: 'custbody_gw_lock_transaction',
      outputField: '',
    },
    isNotUploadEGui: {
      id: 'isNotUploadEGui',
      sourceField: 'custbody_gw_gui_not_upload',
      outputField: '',
    },
    isIssueEgui: {
      id: 'isIssueEgui',
      sourceField: 'custbody_gw_is_issue_egui',
      outputField: '',
    },
    allowanceNumStart: {
      id: 'allowanceNumStart',
      sourceField: 'custbody_gw_allowance_num_start',
      outputField: '',
    },
    allowanceNumEnd: {
      id: 'allowanceNumEnd',
      sourceField: 'custbody_gw_allowance_num_end',
      outputField: '',
    },
    eguiNumStart: {
      id: 'eguiNumStart',
      sourceField: 'custbody_gw_gui_num_start',
      outputField: '',
    },
    eguiNumEnd: {
      id: 'eguiNumEnd',
      sourceField: 'custbody_gw_gui_num_end',
      outputField: '',
    },
    eguiMainMemo: {
      id: 'eguiMainMemo',
      sourceField: 'custbody_gw_gui_main_memo',
      outputField: '',
    },
    cmDeductList: {
      id: 'cmDeductList',
      sourceField: 'custbody_gw_creditmemo_deduction_list',
      outputField: '',
    },
    isDonate: {
      id: 'isDonate',
      sourceField: 'custbody_gw_gui_donation_mark',
      outputField: '',
    },
    donationCode: {
      id: 'donationCode',
      sourceField: 'custbody_gw_gui_donation_code',
      outputField: '',
    },
    carrierTypeId: {
      id: 'carrierType',
      sourceField: 'custbody_gw_gui_carrier_type.value',
      outputField: '',
    },
    carrierType: {
      id: 'carrierType',
      sourceField: 'custbody_gw_gui_carrier_type.text',
      outputField: '',
    },
    carrierId1: {
      id: 'carrierId1',
      sourceField: 'custbody_gw_gui_carrier_id_1',
      outputField: '',
    },
    carrierId2: {
      id: 'carrierId2',
      sourceField: 'custbody_gw_gui_carrier_id_2',
      outputField: '',
    },
    taxApplyPeriod: {
      id: 'taxApplyPeriod',
      sourceField: 'custbody_gw_gui_apply_period',
      outputField: '',
    },
    docFormat: {
      id: 'docFormat',
      sourceField: 'custbody_gw_gui_format',
      outputField: '',
    },
    customExportNum: {
      id: 'customExportNum',
      sourceField: 'custbody_gw_customs_export_no',
      outputField: '',
    },
    customExportCategory: {
      id: 'customExportCategory',
      sourceField: 'custbody_gw_customs_export_category',
      outputField: '',
    },
    customExportDate: {
      id: 'customExportDate',
      sourceField: 'custbody_gw_customs_export_date',
      outputField: '',
    },
    clearanceMark: {
      id: 'clearanceMark',
      sourceField: 'custbody_gw_egui_clearance_mark',
      outputField: '',
    },
    zeroTaxMark: {
      id: 'zeroTaxMark',
      sourceField: 'custbody_gw_applicable_zero_tax',
      outputField: '',
    },
    sellerProfile: {
      id: 'sellerProfile',
      sourceField: '',
      outputField: '',
    },
  }

  var inputMapping = (fieldConfig) => {
    return ramda.reduce(
      function (result, fieldId) {
        var fieldObj = fieldConfig[fieldId]
        if (fieldObj.sourceField) {
          result[fieldId] = fieldObj.sourceField
        }
        return result
      },
      {},
      Object.keys(fieldConfig)
    )
  }

  var outputMapping = (fieldConfig) => {
    return ramda.reduce(
      function (result, fieldId) {
        var fieldObj = fieldConfig[fieldId]
        if (fieldObj.outputField) {
          result[fieldId] = fieldObj.outputField
        }
        return result
      },
      {},
      Object.keys(fieldConfig)
    )
  }

  var voucherType = {
    EGUI: 'EGUI',
    ALLOWANCE: 'ALLOWANCE',
  }
  var uploadStatus = {
    PENDING_UPLOAD: 'A',
    UPLOADING: 'P',
    ISSUE_SUCCESS: 'C',
    ISSUE_FAILED: 'E',
    RESPONDED_ERROR: 'G',
    NOT_UPLOAD: 'M',
    DELETED: 'D',
  }
  var voucherStatus = {
    VOUCHER_ISSUE: 'VOUCHER_ISSUE',
    VOUCHER_SUCCESS: 'VOUCHER_SUCCESS',
    VOUCHER_ERROR: 'VOUCHER_ERROR',
    CANCEL_ISSUE: 'CANCEL_ISSUE',
    CANCEL_APPROVE: 'CANCEL_APPROVE',
    CANCEL_REJECT: 'CANCEL_REJECT',
    CANCEL_UPLOAD: 'CANCEL_UPLOAD',
    CANCEL_SUCCESS: 'CANCEL_SUCCESS',
    CANCEL_ERROR: 'CANCEL_ERROR',
  }
  var migType = {
    B2C: 'B2C',
    B2BS: 'B2BS',
    B2BE: 'B2BE',
  }

  exports.fieldInputMapping = inputMapping(fieldConfig)
  exports.fieldOnputMapping = outputMapping(fieldConfig)
  exports.fields = fieldConfig
  exports.migType = migType
  exports.voucherStatus = voucherStatus
  exports.uploadStatus = uploadStatus
  exports.voucherType = voucherType
  return exports
})
