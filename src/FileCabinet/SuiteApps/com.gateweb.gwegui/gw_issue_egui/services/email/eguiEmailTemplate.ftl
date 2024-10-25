<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>電子發票開立通知</title>
   <#--  style class in head can't work in netsuite preview, don't do this  -->
  <style>
  </style>
</head>

<body style="font-family: 'Microsoft JhengHei', 'helvetica', sans-serif;
                         font-weight: bold;
                         color: #3d5670;">
<div style="max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;">
  <div style="font-size: 20px;
            text-align: center;
            color: #1a202c;
            padding: 10px 0;">電子發票<#if guiData.migTypeOption.migType == 'C0401'>開立<#else>作廢</#if>通知
  </div>
  <div style="font-size: 14px;
            text-align: center;
            color: #bf0d32;
            padding: 10px 0;">本通知信是由「關網資訊 雲端電子發票系統」自動產生與發送，請勿直接回覆!
  </div>

  <div style=" padding: 10px 0;
            font-size: 14px;
            text-align: left;
            line-height: 1.6;">
    <p><strong style="color: #bf0d32;">請注意 :</strong></p>
    <ol style="line-height: 2;">
      <li>若有發票內容相關疑問，請洽開立此電子發票之<strong style="color: #bf0d32;">${guiData.sellerName}</strong>。<#if guiData.sellerTel != ''>聯絡電話： <span style="color:#bf0d32">${guiData.sellerTel}</span>。</#if></li>
      <li>若您為營業人：附件為<strong style="color: #bf0d32;">${guiData.sellerName}</strong>經由關網資訊雲端電子發票系統所開立之電子發票會計憑證圖檔。
      </li>
      <li>若您為消費者，本信件<strong style="color: #bf0d32;">無附送</strong>電子發票會計憑證圖檔。</li>
    </ol>
  </div>

  <table style="width: 100%;
            margin: 20px 0;
            border-collapse: collapse;
            table-layout: auto;">
    <tr>
      <td style="text-align: center;
            background-color: #f4f4f4;
            color: #000;
            padding: 8px;
            border: 1px solid #ddd;
            word-break: break-word;" colspan="2">發票資訊
      </td>
    </tr>
    <tr>
      <td style="padding: 8px;
            border: 1px solid #ddd;
            word-break: break-word;">發票號碼:
      </td>
      <td style="padding: 8px;
            border: 1px solid #ddd;
            word-break: break-word;">${guiData.documentNumber}
      </td>
    </tr>
    <tr>
      <td style="padding: 8px;
            border: 1px solid #ddd;
            word-break: break-word;">開立日期:
      </td>
      <td style="padding: 8px;
            border: 1px solid #ddd;
            word-break: break-word;">${guiData.documentDate}</td>
    </tr>
    <tr>
      <td style="padding: 8px;
            border: 1px solid #ddd;
            word-break: break-word;">發票隨機碼:
      </td>
      <td style="padding: 8px;
            border: 1px solid #ddd;
            word-break: break-word;">${guiData.randomNumber}</td>
    </tr>
    <tr>
      <td style="padding: 8px;
            border: 1px solid #ddd;
            word-break: break-word;">稅額:
      </td>
      <td style="padding: 8px;
            border: 1px solid #ddd;
            word-break: break-word;">${guiData.taxAmt}</td>
    </tr>
    <tr>
      <td style="padding: 8px;
            border: 1px solid #ddd;
            word-break: break-word;">消費金額:
      </td>
      <td style="padding: 8px;
            border: 1px solid #ddd;
            word-break: break-word;">${guiData.totalAmt}</td>
    </tr>
    <tr>
      <td style="padding: 8px;
            border: 1px solid #ddd;
            word-break: break-word;">載具代碼:
      </td>
      <td style="padding: 8px;
            border: 1px solid #ddd;
            word-break: break-word;">${guiData.carrierId1}</td>
    </tr>
  </table>

  <table style="width: 100%;
            margin: 20px 0;
            border-collapse: collapse;
            table-layout: auto;">
    <tr>
      <td style="text-align: center;
            background-color: #f4f4f4;
            color: #000;
            padding: 8px;
            border: 1px solid #ddd;
            word-break: break-word;" colspan="4">交易明細
      </td>
    </tr>
    <tr>
      <td style="padding: 8px;
            border: 1px solid #ddd;
            word-break: break-word;">品名
      </td>
      <td style="padding: 8px;
            border: 1px solid #ddd;
            word-break: break-word;">數量
      </td>
      <td style="padding: 8px;
            border: 1px solid #ddd;
            word-break: break-word;">單價
      </td>
      <td style="padding: 8px;
            border: 1px solid #ddd;
            word-break: break-word;">小計
      </td>
    </tr>
    <#list guiData.lines as guiLine>
    <tr>
      <td style="width: 50%; padding: 8px;
                 border: 1px solid #ddd;
                 word-break: break-word;">${guiLine.itemName}</td>
      <td style="width: 10%;padding: 8px;
                 border: 1px solid #ddd;
                 word-break: break-word;
                 text-align: right;">${guiLine.quantity}</td>
      <td style="width: 20%;padding: 8px;
                 border: 1px solid #ddd;
                 word-break: break-word;
                 text-align: right;">${guiLine.unitPrice}</td>
      <td style="width: 20%;padding: 8px;
                 border: 1px solid #ddd;
                 word-break: break-word;
                 text-align: right;">${guiLine.salesAmt}</td>
    </tr>
    </#list>
  </table>

  <div style="text-align: center;
            font-size: 14px;
            color: #a92432;
            padding: 20px 0;
            border-top: 1px dashed #000;">※ 發票資訊依財政部電子發票平台上資料為準，若此發票非您所有，請刪除此信件。
  </div>

  <div style=" padding: 10px 0;
            font-size: 14px;
            text-align: left;
            line-height: 1.6;">
    <p><strong style="color: #bf0d32;">補充說明 :</strong></p>
    <ol style="line-height: 2;">
      <li>若您為一般消費者，營業人開立電子發票的48小時後，您可於<a
        href="https://www.einvoice.nat.gov.tw/portal/btc/audit/btc601w/search"
        style="color:#740027; text-decoration:none;">「財政部電子發票平台 電子發票全民稽核」</a>頁面查詢本張電子發票。
      </li>
      <li>若您為營業人，購買勞務或貨物對象為「營業稅法」第6條第一/二/三款之境內 營業人，可自行登入<a
        style="text-decoration:none;color:#740027" href="https://www.einvoice.nat.gov.tw/">「財政部電子發票平台」</a>下載電子發票會計憑證，請至
        "營業人功能選單 \ 查詢與下載 \ 發票查詢/列印/下載" 查詢後，即可下載電子 發票會計憑證。
      </li>
      <li>若您為一般消費者，向「營業稅法」第6條第四款之境外電商購買國外勞務 者，為保障您的兌獎之權益，請至<a
        style="text-decoration:none;color:#740027" href="https://www.einvoice.nat.gov.tw/">「財政部電子發票平台」</a>將交易留存之
        E-mail 載具歸戶到手機條碼，並設定領獎金融帳戶，中獎獎金自動匯入。
      </li>
      <li>若您為營業人，向「營業稅法」第6條第四款之境外電商購買國外勞務者，應 依「營業稅法第36條」規定辦理。</li>
    </ol>
  </div>

  <div style=" text-align: center;
            padding: 20px;
            font-size: 14px;">
    <p>關網資訊股份有限公司 敬上</p>
  </div>

  <div style="text-align: center;
            padding: 20px 0;">
    <a style="text-decoration: none;" href="mailto:cs@gateweb.com.tw" target="_blank">
      <img style="border-radius: 10px;
            margin: 0 10px;" height="50" src="https://i.ibb.co/CW4Y8vn/email.png" width="50" alt="Email Icon"
           border="0">
    </a>
    <a style="text-decoration: none;" href="https://www.gateweb.com.tw/" target="_blank">
      <img style="border-radius: 10px;
            margin: 0 10px;" height="50" src="https://i.ibb.co/Fz383Rc/web.png" width="50" alt="Website Icon"
           border="0">
    </a>
    <a style="text-decoration: none;" href="https://www.facebook.com/gateweb888/" target="_blank">
      <img style="border-radius: 10px;
            margin: 0 10px;" height="50" src="https://i.ibb.co/R3vZgQQ/facebook.png" width="50" alt="Facebook Icon"
           border="0">
    </a>
  </div>
</div>
</body>
</html>
