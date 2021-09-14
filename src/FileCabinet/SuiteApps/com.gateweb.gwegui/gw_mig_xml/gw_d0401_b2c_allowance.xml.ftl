<?xml version="1.0" encoding="utf-8"?>
<Allowance xmlns="urn:GEINV:eInvoiceMessage:D0401:3.1">
    <Main>
        <AllowanceNumber>${AllowanceMain.allowanceNumber}</AllowanceNumber>
        <AllowanceDate>${AllowanceMain.allowanceDate}</AllowanceDate>
        <Seller>
            <Identifier>${AllowanceMain.sellerIdentifier}</Identifier>
            <Name>${AllowanceMain.sellerName}</Name>
            <EmailAddress>${AllowanceMain.sellerEmailAddress!""}</EmailAddress>
        </Seller>
        <Buyer>
            <Identifier>${AllowanceMain.buyerIdentifier}</Identifier>
            <#if AllowanceMain.buyerName?has_content>
                <Name>${AllowanceMain.buyerName}</Name>
            <#else>
                <Name>0000</Name>
            </#if>
            <EmailAddress>${AllowanceMain.buyerEmailAddress!""}</EmailAddress>
            <Address>${AllowanceMain.buyerAddress!""}</Address>
        </Buyer>
        <AllowanceType>${AllowanceMain.allowanceType}</AllowanceType>
    </Main>
    <Details>
        <#list AllowanceDetails as allowanceDetailEntity>
            <ProductItem>
                <OriginalInvoiceDate>${allowanceDetailEntity.originalInvoiceDate}</OriginalInvoiceDate>
                <OriginalInvoiceNumber>${allowanceDetailEntity.originalInvoiceNumber}</OriginalInvoiceNumber>
                <OriginalSequenceNumber>${allowanceDetailEntity.allowanceSequenceNumber}</OriginalSequenceNumber>
                <OriginalDescription>${allowanceDetailEntity.originalDescription}</OriginalDescription>
                <Quantity>${allowanceDetailEntity.quantity?string("#.##")}</Quantity>
                <UnitPrice>${allowanceDetailEntity.unitPrice?string("#.####")}</UnitPrice>
                <Amount>${allowanceDetailEntity.amount?string("#.####")}</Amount>
                <Tax>${allowanceDetailEntity.tax?string("#.####")}</Tax>
                <AllowanceSequenceNumber>${allowanceDetailEntity.allowanceSequenceNumber}</AllowanceSequenceNumber>
                <TaxType>${allowanceDetailEntity.taxType}</TaxType>
            </ProductItem>
        </#list>
    </Details>
    <Amount>
        <TaxAmount>${AllowanceMain.taxAmount?string("#")}</TaxAmount>
        <TotalAmount>${AllowanceMain.totalAmount?string("#")}</TotalAmount>
    </Amount>
</Allowance>