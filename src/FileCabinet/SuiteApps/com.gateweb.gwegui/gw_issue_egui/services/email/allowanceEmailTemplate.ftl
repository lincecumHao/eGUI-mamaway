<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>折讓單開立通知信</title>
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
            padding: 10px 0;">折讓單<#if guiData.migTypeOption.migType == 'D0401'>開立<#else>作廢</#if>通知
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
      <li>附件為${guiData.sellerName}經由 關網資訊雲端電子發票系統 所開立、產生、寄送之電子發票折讓會計憑證圖檔。</li>
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
            word-break: break-word;" colspan="2">折讓單資訊
      </td>
    </tr>
    <tr>
      <td style="padding: 8px;
            border: 1px solid #ddd;
            word-break: break-word;">折讓單號碼:
      </td>
      <td style="padding: 8px;
            border: 1px solid #ddd;
            word-break: break-word;">${guiData.documentNumber}
      </td>
    </tr>
    <tr>
      <td style="padding: 8px;
            border: 1px solid #ddd;
            word-break: break-word;">折讓單開立日期:
      </td>
      <td style="padding: 8px;
            border: 1px solid #ddd;
            word-break: break-word;">${guiData.documentDate}</td>
    </tr>
    <tr>
      <td style="padding: 8px;
            border: 1px solid #ddd;
            word-break: break-word;">折讓金額:
      </td>
      <td style="padding: 8px;
            border: 1px solid #ddd;
            word-break: break-word;">${guiData.totalAmt}</td>
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
            word-break: break-word;" colspan="6">折讓單明細
      </td>
    </tr>
    <tr>
      <td style="padding: 8px;
            border: 1px solid #ddd;
            word-break: break-word;">原發票號
      </td>
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
            word-break: break-word;">未稅金額
      </td>
      <td style="padding: 8px;
            border: 1px solid #ddd;
            word-break: break-word;">稅額
      </td>
      <td style="padding: 8px;
            border: 1px solid #ddd;
            word-break: break-word;">小計
      </td>
    </tr>
    <#list guiData.lines as guiLine>
    <tr>
      <td style="width: 25%; padding: 8px;
                 border: 1px solid #ddd;
                 word-break: break-word;">${guiLine.appliedGui}</td>
      <td style="width: 25%; padding: 8px;
                 border: 1px solid #ddd;
                 word-break: break-word;">${guiLine.itemName}</td>
      <td style="width: 8%;padding: 8px;
                 border: 1px solid #ddd;
                 word-break: break-word;
                 text-align: right;">${guiLine.quantity}</td>
      <td style="width: 14%;padding: 8px;
                 border: 1px solid #ddd;
                 word-break: break-word;
                 text-align: right;">${guiLine.salesAmt}</td>
      <td style="width: 14%;padding: 8px;
                 border: 1px solid #ddd;
                 word-break: break-word;
                 text-align: right;">${guiLine.taxAmt}</td>
      <td style="width: 14%;padding: 8px;
                 border: 1px solid #ddd;
                 word-break: break-word;
                 text-align: right;">${guiLine.totalAmt}</td>                        
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
      <li>請依據營業稅申報相關規定進行申報。</li>
      <li>對於折讓單內容若有疑慮請與${guiData.sellerName}相關人員聯繫確認。</li>
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
