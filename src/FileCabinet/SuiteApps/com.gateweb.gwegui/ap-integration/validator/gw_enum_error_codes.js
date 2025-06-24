define([], function () {
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
  exports.TaxTypeError = {
    errorCode: 'TAX_TYPE_NOT_VALID',
    errorMessage: 'Tax Type is not valid',
    errorChtMessage: '應稅類別錯誤',
  }

  //region GUI Number
  exports.GuiFormatError = {
    errorCode: 'IE0103',
    errorMessage:
      'GUI Format is incorrect, should be 2 capital letter and 8 digits of number',
    errorChtMessage: '發票號碼格式錯誤, 應為大寫英文字母2位及8位數字',
  }
  exports.GuiLengthError = {
    errorCode: 'IE0108',
    errorMessage:
      'GUI Length is 10 characters',
    errorChtMessage: '發票號碼長度限 10 位',
  }
  exports.GuiTrackError = {
    errorCode: 'IE0104',
    errorMessage: 'GUI Track letters is invalid',
    errorChtMessage: '發票字軌錯誤',
  }
  exports.GuiNumberCommonNumberConflictError = {
    errorCode: 'IE0201',
    errorMessage: 'GUI Number and Common number should choose 1',
    errorChtMessage: '發票號碼與其他憑證號碼請擇一輸入',
  }
  exports.GuiNumberMustNotHaveValueError = {
    errorCode: 'IE0102',
    errorMessage: 'GUI Number Cannot have value',
    errorChtMessage: '發票號碼不可填',
  }
  exports.GuiNumberRequired = {
    errorCode: 'IE0101',
    errorMessage: 'GUI Number Cannot have value',
    errorChtMessage: '發票號碼必填',
  }
  exports.GuiNumberDuplicated = {
    errorCode: 'IE0105',
    errorMessage: 'GUI Number already existed',
    errorChtMessage: '發票號碼重複',
  }
  exports.GuiVoided = {
    errorCode: 'GUI_VOIDED',
    errorMessage: 'GUI is voided',
    errorChtMessage: '發票已作廢',
  }
  //endregion

  //region Common Number
  exports.CommonNumberSimilarToGuiNumber = {
    errorCode: 'COMMON_NUMBER_SIMILAR_GUI_NUMBER',
    errorMessage: 'Common Number can not be similar to Gui Number',
    errorChtMessage: '其他憑證號碼不可與發票號碼格式相似 (2位英文字母與8位數字)',
  }

  exports.CommonNumberFormatError = {
    errorCode: 'IE0206',
    errorMessage: 'Common Number format error',
    errorChtMessage: '其他憑證號碼格式錯誤 (10位數字或英文)',
  }

  exports.CommonNumberRequired = {
    errorCode: 'COMMON_NUMBER_REQUIRED',
    errorMessage: 'Common Number Required',
    errorChtMessage: '其他憑證號碼必填',
  }

  exports.CommonNumberMustNotHave = {
    errorCode: 'IE0205',
    errorMessage: 'Common Number Must not have',
    errorChtMessage: '其他憑證號碼不可填',
  }

  exports.CommonNumberCustomLenthError = {
    errorCode: 'IE0206',
    errorMessage: 'Common Number Custom Length is incorrect',
    errorChtMessage: '長度錯誤, 其他憑證號碼應14碼進口海關代徵號, 碼格式為 3 碼大寫英文 + 11 碼數字',
  }
  //endregion

  //region buyer tax id
  exports.BuyerTaxIdRequired = {
    errorCode: 'BUYER_TAX_ID_REQUIRED',
    errorMessage: 'Buyer tax id is required',
    errorChtMessage: '買方統編必填',
  }
  exports.BuyerTaxIdNotValid = {
    errorCode: 'BUYER_TAX_ID_NOT_VALID',
    errorMessage: 'Buyer tax id not valid',
    errorChtMessage: '買方統編錯誤',
  }
  exports.BuyerTaxIdLengthNotValid = {
    errorCode: 'BUYER_TAX_ID_LENGTH_NOT_VALID',
    errorMessage: 'Buyer tax id length not valid',
    errorChtMessage: '買方統編長度不合, 應為8碼數字',
  }
  //endregion

  //region seller tax id
  exports.SellerTaxIdRequired = {
    errorCode: 'SELLER_TAX_ID_REQUIRED',
    errorMessage: 'Seller tax id is required',
    errorChtMessage: '賣方統編必填',
  }
  exports.SellerTaxIdMustNotHave = {
    errorCode: 'SELLER_TAX_ID_MUST_NOT_HAVE',
    errorMessage: 'Seller tax id must not have value',
    errorChtMessage: '賣方統編不可填',
  }
  exports.SellerTaxIdLengthError = {
    errorCode: 'SELLER_TAX_ID_LENGTH_ERROR',
    errorMessage: 'Seller tax id should be 8 digits of number',
    errorChtMessage: '賣方統編應為 8 位數字',
  }
  exports.SellerTaxIdValueError = {
    errorCode: 'SELLER_TAX_ID_NOT_VALID',
    errorMessage: 'Seller tax id is not a valid tax id',
    errorChtMessage: '賣方統編錯誤',
  }
  exports.SellerNameExceedLength = {
    errorCode: 'SELLER_NAME_LENGTH_EXCEED',
    errorMessage: 'Seller name lenth must under 60 character',
    errorChtMessage: '賣方名稱',
  }
  //endregion

  // Sales Amount
  exports.SalesAmtLengthError = {
    errorCode: 'LENGTH_ERROR',
    errorMessage: 'Sales amount should be less than 12 digits',
    errorChtMessage: '銷售額長度限長12位數',
  }
  exports.SalesAmtShouldBeZero = {
    errorCode: 'SHOULD_BE_ZERO',
    errorMessage: 'Sales amount should be 0',
    errorChtMessage: '銷售額應為 0',
  }
  exports.SalesAmtShouldBeGreaterThanZero = {
    errorCode: 'SHOULD_GREATER_THAN_ZERO',
    errorMessage: 'Sales amount should be less than 12 digits',
    errorChtMessage: '銷售額應大於 0',
  }

  // Tax Amount
  exports.TaxAmtLengthError = {
    errorCode: 'TAX_AMOUNT_LENGTH_ERROR',
    errorMessage: 'Tax amount should be less than 12 digits',
    errorChtMessage: '稅額長度限長12位數',
  }
  exports.TaxAmtOver5Error = {
    errorCode: 'TAX_AMOUNT_EXCEED_FIVE_DOLLAR',
    errorMessage: 'Tax amount is over 5 dollar range',
    errorChtMessage: '稅差超過5元',
  }
  exports.TaxAmtOver500Error = {
    errorCode: 'TAX_AMOUNT_EXCEED_FIVE_HUNDRED',
    errorMessage: 'Tax amount is over 500 dollar',
    errorChtMessage: '若憑證代號為26或27時則稅金不可超過500元',
  }

  // Tax ID
  exports.TaxIdLengthError = {
    errorCode: 'TAX_ID_LENGTH_ERROR',
    errorMessage: 'Tax id should be 8 digits of number',
    errorChtMessage: '統編應為 8 位數字或 10 位 0',
  }
  exports.TaxIdValueError = {
    errorCode: 'TAX_ID_NOT_VALID',
    errorMessage: 'Tax id is not a valid tax id',
    errorChtMessage: '非正確統編',
  }
  return exports
})
