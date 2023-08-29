define(['N/url', 'N/https', 'N/runtime'], function (url, https, runtime) {
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
  var dlPdfSlId = 'customscript_gw_sl_download_pdf'
  var dlPdfSlDeploymentId = 'customdeploy_gw_sl_download_pdf'
  var printToPrinterSlId = 'customscript_gw_sl_print_printer'
  var printToPrinterSlDeploymentId = 'customdeploy_gw_sl_print_printer'
  var documentType = {
    INVOICE: 'invoice',
    ALLOWANCE: 'allowance',
  }

  var documentStatus = {
    issue: 2,
    cancel: 3,
    void: 4,
    reject: 5,
  }

  function getHeaders() {
    var headers = {
      Accept:
        'text/html, application/json, application/xhtml+xml, application/xml;q=0.9, image/webp, */*;q=0.8, application/pdf',
      'Accept-Language': 'en-us',
    }
    log.debug({ title: 'getHeaders headers', details: headers })
    return headers
  }

  /**
   *
   * @param {{filename: String, xml: String, docType: String}[]} xmlFileObjects
   */
  function downloadPdfs(xmlFileObjects) {
    xmlFileObjects.forEach(function (xmlFileObject) {
      downloadSinglePdf(xmlFileObject)
    })
  }

  /**
   *
   * @param {{filename: String, xml: String, docType: String}} params
   */
  function downloadSinglePdf(params) {
    var pdfFilename = params.filename.replace('.xml', '.pdf')
    var pdfUrl = url.resolveScript({
      scriptId: dlPdfSlId,
      deploymentId: dlPdfSlDeploymentId,
      returnExternalUrl: false,
    })
    var pdfResponse = https.post({
      url: pdfUrl,
      body: JSON.stringify(params),
      headers: getHeaders(),
    })
    downloadFile(pdfFilename, pdfResponse.body)
    console.log('response body', pdfResponse.body)
  }

  function downloadFile(filename, content) {
    var bytes = base64ToArrayBuffer(content)
    // const bytes = new TextEncoder().encode(content)
    var blob = new Blob([bytes], {
      type: 'application/pdf;charset=utf-8',
    })
    var link = document.createElement('a')
    var url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  function base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64) // Comment this if not using base64
    var bytes = new Uint8Array(binaryString.length)
    return bytes.map(function (byte, i) {
      return binaryString.charCodeAt(i)
    })
  }

  /**
   *
   * @param {{filename: String, xml: String, docType: String}[]} xmlFileObjects
   */
  function printToPrinter(xmlFileObjects) {
    console.log('gw client api printToPrinter')
    xmlFileObjects.forEach(function (xmlFileObject) {
      printSingleFile(xmlFileObject)
    })
  }

  /**
   *
   * @param {{filename: String, xml: String, docType: String}} xmlFileObject
   */
  function printSingleFile(xmlFileObject) {
    console.log('gw client api printSingleFile')
    var printUrl = url.resolveScript({
      scriptId: printToPrinterSlId,
      deploymentId: printToPrinterSlDeploymentId,
      returnExternalUrl: false,
    })
    console.log('gw client api printSingleFile, printUrl', printUrl)
    var printResponse = https.post({
      url: printUrl,
      body: JSON.stringify(xmlFileObject),
      headers: getHeaders(),
    })
    console.log('response body', printResponse.body)
  }

  function postToGwApi(xmlFileObjects) {}

  function getAllowanceContent(params) {
    log.debug({
      title: 'in getAllowanceContent - params',
      details: params
    });

    var pdfUrl = url.resolveScript({
      scriptId: dlPdfSlId,
      deploymentId: dlPdfSlDeploymentId,
      returnExternalUrl: true,
    });

    var response = https.post({
      url: pdfUrl,
      headers: getHeaders(),
      body: JSON.stringify(params)
    });

    log.debug({
      title: 'in getAllowanceContent - response',
      details: response
    });

    return response.body;
  }

  exports.downloadPdfs = downloadPdfs;
  exports.printToPrinter = printToPrinter;
  exports.DOCTYPE = documentType;
  exports.DOCSTATUS = documentStatus;
  exports.downloadSinglePdf = downloadSinglePdf;
  exports.getAllowanceContent = getAllowanceContent;
  return exports
})
