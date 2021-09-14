<?xml version="1.0" encoding="utf-8"?>
<CancelInvoice xmlns="urn:GEINV:eInvoiceMessage:C0501:3.1">
    <CancelInvoiceNumber>${invoiceCancelEntity.cancelInvoiceNumber}</CancelInvoiceNumber>
    <InvoiceDate>${invoiceCancelEntity.invoiceDate}</InvoiceDate>
    <BuyerId>${invoiceCancelEntity.buyerId}</BuyerId>
    <SellerId>${invoiceCancelEntity.sellerId}</SellerId>
    <CancelDate>${invoiceCancelEntity.cancelDate}</CancelDate>
    <CancelTime>${invoiceCancelEntity.cancelTime}</CancelTime>
    <CancelReason>${invoiceCancelEntity.cancelReason}</CancelReason>
</CancelInvoice>