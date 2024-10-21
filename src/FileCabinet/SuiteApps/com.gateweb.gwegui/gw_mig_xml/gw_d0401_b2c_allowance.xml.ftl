<?xml version="1.0" encoding="utf-8"?>
<Allowance xmlns="urn:GEINV:eInvoiceMessage:D0401:3.1">
    <Main>
        <AllowanceNumber>${guiData.documentNumber}</AllowanceNumber>
        <AllowanceDate>${guiData.documentDate}</AllowanceDate>
        <Seller>
            <Identifier>${guiData.sellerTaxId}</Identifier>
            <Name>${guiData.sellerName}</Name>
            <#if guiData.sellerProfile.repEmail != ''>
                <EmailAddress>${guiData.sellerProfile.repEmail}</EmailAddress>
            </#if>
        </Seller>
        <Buyer>
            <Identifier>${guiData.buyerTaxId}</Identifier>
            <Name>${guiData.buyerName}</Name>
            <#if guiData.buyerName !=''>
                <Name>${guiData.buyerName}</Name>
            <#else>
                <Name>0000</Name>
            </#if>
            <#if guiData.buyerEmail !=''>
                <EmailAddress>${guiData.buyerEmail}</EmailAddress>
            </#if>
            <Address>${guiData.buyerAddress}</Address>
        </Buyer>
        <AllowanceType>2</AllowanceType>
    </Main>
    <Details>
        <#list guiData.lines as allowanceDetailEntity>
            <ProductItem>
			    <OriginalInvoiceDate>${allowanceDetailEntity.appliedGuiDate}</OriginalInvoiceDate>
			    <OriginalInvoiceNumber>${allowanceDetailEntity.appliedGui}</OriginalInvoiceNumber>
			    <OriginalSequenceNumber>${allowanceDetailEntity.lineSeq}</OriginalSequenceNumber>
			    <OriginalDescription>${allowanceDetailEntity.itemName}</OriginalDescription>
			    <Quantity>${allowanceDetailEntity.quantity}</Quantity>
			    <Unit/>
			    <UnitPrice>${allowanceDetailEntity.unitPrice}</UnitPrice>
			    <Amount>${allowanceDetailEntity.totalAmt}</Amount>
			    <Tax>${allowanceDetailEntity.taxAmt}</Tax>
			    <AllowanceSequenceNumber>${allowanceDetailEntity.lineSeq}1</AllowanceSequenceNumber>
			    <TaxType>${allowanceDetailEntity.taxType}</TaxType>
		        </ProductItem>
        </#list>
    </Details>
    <Amount>
        <TaxAmount>${guiData.taxAmt}</TaxAmount>
        <TotalAmount>${guiData.totalAmt}</TotalAmount>
    </Amount>
</Allowance>