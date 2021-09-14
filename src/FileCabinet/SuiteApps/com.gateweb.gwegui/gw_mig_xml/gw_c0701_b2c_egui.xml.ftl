<?xml version="1.0" encoding="utf-8"?>
<VoidInvoice xmlns="urn:GEINV:eInvoiceMessage:C0701:3.1">
    <VoidInvoiceNumber>${guiData.documentNumber}</VoidInvoiceNumber>
    <InvoiceDate>${guiData.documentDate}</InvoiceDate>
    <BuyerId>${guiData.buyerTaxId}</BuyerId>
    <SellerId>${guiData.sellerTaxId}</SellerId>
    <VoidDate>${guiData.voidDate}</VoidDate>
    <VoidTime>23:59:59</VoidTime>
    <VoidReason>作廢</VoidReason>
    <Remark/>
</VoidInvoice>