/**
 *String GW API Tool
 *gwAPIUtility.js
 *@NApiVersion 2.x
 */
define(['N/https'], function (https) {
  var _gw_url = 'https://sstest.gwis.com.tw:443'
  var _gw_version = 'v1'
  var _gw_api = 'ns/turnkey/mig'

  var _gw_public_key =
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDfE4A5Qvng1F4FMOpsWZpYJ/p98SCFouUKoPd9JXQcfpczThrVgSpXSeFOhD9J6nXkORbD6NEJy/Dei0USZeVw4tuuQSPlult7+6qVXk6wKgYDnbji89pQSUZZL8gkEgX1P7RINUTrwnqIBIM8CoOrc29Z/M9uuExVlrpPMkidBwIDAQAB'

  var _gw_ns_auth =
    'lVM3wFlV0bMNi0/lNq/PV/0JTbxLQN03ldmd6T/6rkQhfOUZZbV/1aT1Q9UUTh7PcHnghZjsgtiCsy41fi1TnWlR6UC+AVTg36NDMni5LfaR/7uDPXAgOyhHlb8Y3NHmrjtq2hRf9hO1/f58LLltmFtnVJFAzNazeX839lXSQA0='

  //'https://sstest.gwis.com.tw:443/v1/ns/turnkey/mig?migType=C0401&filename=NS-C0401-PP123445678.xml';
  function uploadXmlToGW(mig_type, xml, file_name) {
    var _obj
    try {
      var _headerObj = {
        gw_ns_auth: _gw_ns_auth,
        'Content-Type': 'application/xml',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      }

      var _urlString = _gw_url
      _urlString += '/' + _gw_version
      _urlString += '/' + _gw_api

      _urlString += '?migType=' + mig_type
      _urlString += '&filename=' + file_name

      var _response = https.post({
        url: _urlString,
        headers: _headerObj,
        body: xml,
      })

      var _response_code = _response.code // see https.ClientResponse.code
      var _response_body = _response.body // see https.ClientResponse.body

      log.debug(
        'Get From GW',
        '_response_code=' + _response_code + ' ,response_body=' + _response_body
      )

      _obj = JSON.parse(_response_body)
    } catch (e) {
      log.debug(e.name, e.message)
    }
    return _obj
  }

  function downloadVoucherStatusFromGW(file_name) {
    var _obj
    try {
      var _headerObj = {
        gw_ns_auth: _gw_ns_auth,
        'Content-Type': 'application/xml',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      }

      var _urlString = _gw_url
      _urlString += '/' + _gw_version
      _urlString += '/' + _gw_api

      _urlString += '?filename=' + file_name

      var _response = https.get({
        url: _urlString,
        headers: _headerObj,
      })

      var _response_code = _response.code // see https.ClientResponse.code
      var _response_body = _response.body // see https.ClientResponse.body

      log.debug(
        'Get From GW',
        '_response_code=' + _response_code + ' ,response_body=' + _response_body
      )

      _obj = JSON.parse(_response_body)
    } catch (e) {
      log.debug(e.name, e.message)
    }
    return _obj
  }

  return {
    uploadXmlToGW: uploadXmlToGW,
    downloadVoucherStatusFromGW: downloadVoucherStatusFromGW,
  }
})
