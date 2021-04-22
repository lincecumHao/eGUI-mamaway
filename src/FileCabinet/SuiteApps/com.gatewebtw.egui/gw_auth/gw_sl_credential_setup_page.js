define([
  'N/https',
  'N/ui/serverWidget',
  'N/config',
  'N/runtime',
  'N/crypto',
  'N/encode',
  'N/record',
  './gw_cred_record_service',
], function (
  https,
  serverWidget,
  config,
  runtime,
  crypto,
  encode,
  record,
  GwCredentialService
) {
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

   * @NScriptType Suitelet
   */
  var exports = {}

  /**
   * onRequest event handler
   *
   * @gov XXX
   *
   * @param {Object} context
   * @param {ServerRequest} context.request - The incoming request object
   * @param {ServerResponse} context.response - The outgoing response object
   */
  function onRequest(context) {
    log.audit({ title: context.request.method + ' request received' })

    var eventRouter = {}
    eventRouter[https.Method.GET] = onGet
    eventRouter[https.Method.POST] = onPost

    try {
      eventRouter[context.request.method](context)
    } catch (e) {
      onError({ context: context, error: e })
    }

    log.audit({ title: 'Request complete.' })
  }

  /**
   * Event handler for HTTP GET request
   *
   * @gov XXX
   *
   * @param {Object} context
   * @param {ServerRequest} context.request - The incoming request object
   * @param {ServerResponse} context.response - The outgoing response object
   */
  function onGet(context) {
    // TODO
    var parameters = context.request.parameters
    var formData = null
    if (parameters.formData) {
      formData = JSON.parse(parameters.formData)
    } else {
      formData = initFormData()
    }

    context.response.writePage(createCredentialForm(formData))
  }

  /**
   * Event handler for HTTP POST request
   *
   * @gov XXX
   *
   * @param {Object} context
   * @param {ServerRequest} context.request - The incoming request object
   * @param {ServerResponse} context.response - The outgoing response object
   */
  function onPost(context) {
    // TODO
    var parameters = context.request.parameters
    var formData = {
      name: parameters.companyname,
      nsAccountId: parameters.nsaccountid,
      subsidiary: parameters.subsidiary,
      gui: parameters.taxid,
      email: parameters.email,
      passwordToken: parameters.password,
    }
    log.debug({ title: 'onPost formData', details: formData })
    var validatePasswordTokenResult = validatePasswordToken(
      formData.passwordToken
    )
    if (
      !validatePasswordTokenResult.success &&
      validatePasswordTokenResult.error.code === 'INVALID_SECRET_KEY_LENGTH'
    ) {
      formData.errorMessage = validatePasswordTokenResult.error.message
      context.response.sendRedirect({
        identifier: runtime.getCurrentScript().id,
        type: https.RedirectType.SUITELET,
        id: runtime.getCurrentScript().deploymentId,
        parameters: {
          formData: JSON.stringify(formData),
        },
      })
    } else {
      var newRecordId = saveCredentialRecord(formData)
      context.response.sendRedirect({
        identifier: 'customrecord_gw_master_credentials',
        type: https.RedirectType.RECORD,
        id: newRecordId,
      })
    }
  }

  /**
   * Error handler for Suitelet
   *
   * @gov XXX
   *
   * @param {Object} params
   * @param {Error} params.error - The error which triggered this handler
   * @param {Object} params.context
   * @param {ServerRequest} params.context.request - The incoming request object
   * @param {ServerResponse} params.context.response - The outgoing response object
   */
  function onError(params) {
    // TODO
    log.debug({ title: 'Error Occurs', details: params.error })
  }

  function getCompanyInfo() {
    var companyInfo = config.load({
      type: config.Type.COMPANY_INFORMATION,
    })
    var legalName = companyInfo.getValue({
      fieldId: 'legalname',
    })
    var accountId = companyInfo.getValue({
      fieldId: 'companyid',
    })
    var taxId = companyInfo.getValue({
      fieldId: 'employerid',
    })
    var email = companyInfo.getValue({
      fieldId: 'email',
    })
    return {
      name: legalName,
      nsAccountId: accountId,
      gui: taxId,
      email: email,
    }
  }

  function getUserInfo() {
    var user = runtime.getCurrentUser()
    return {
      subsidiary: user.subsidiary,
    }
  }

  function initFormData() {
    var companyInfo = getCompanyInfo()
    var userInfo = getUserInfo()
    var formData = {
      name: companyInfo.name,
      nsAccountId: companyInfo.nsAccountId,
      subsidiary: userInfo.subsidiary,
      gui: companyInfo.gui,
      email: companyInfo.email,
    }
    return formData
  }

  function validatePasswordToken(passwordToken) {
    log.debug({ title: 'validatePasswordToken', details: passwordToken })
    var validateResult = {
      success: true,
    }
    try {
      var inputString = 'YWJjZGVmZwo='
      var sKey = crypto.createSecretKey({
        guid: passwordToken,
        encoding: encode.Encoding.UTF_8,
      })
      var cipher = crypto.createCipher({
        algorithm: crypto.EncryptionAlg.AES,
        key: sKey,
        padding: crypto.Padding.PKCS5Padding,
      })
      cipher.update({
        input: inputString,
      })
      var cipherOut = cipher.final()

      log.debug({ title: 'validatePasswordToken', details: 'cipher finaled' })
    } catch (e) {
      log.debug({ title: 'validatePasswordToken error', details: e })
      validateResult.success = false
      validateResult.error = {}
      validateResult.error.code = e.name
      validateResult.error.message = e.message
    }
    return validateResult
  }

  function getApplicableScripts() {
    var currentScriptId = runtime.getCurrentScript().id
    var restrictToScriptIds = getScriptParameterValue(
      'custscript_gw_cred_setup_scripts'
    )
    if (restrictToScriptIds.indexOf(currentScriptId) < 0) {
      restrictToScriptIds.push(currentScriptId)
    }
    log.debug({
      title: 'getApplicableScripts restrictToScriptIds',
      details: restrictToScriptIds,
    })
    return restrictToScriptIds
  }

  function getApplicableDomains() {
    var restrictToDomains = getScriptParameterValue(
      'custscript_gw_cred_setup_domains'
    )

    log.debug({
      title: 'getApplicableDomains restrictToDomains',
      details: restrictToDomains,
    })
    return restrictToDomains
  }

  function getScriptParameterValue(parameterId) {
    var currentScript = runtime.getCurrentScript()
    var currentScriptId = currentScript.id
    var scriptParameterValues = currentScript.getParameter({
      name: parameterId,
    })
    var parameterValueArray = scriptParameterValues
      ? scriptParameterValues.split(',').map(function (item) {
          return item.trim()
        })
      : []

    return parameterValueArray
  }

  function createCredentialForm(formData) {
    var form = serverWidget.createForm({
      title: 'Create Master Credential',
    })
    if (formData.errorMessage) {
      log.debug({
        title: 'createForm errorMessage',
        details: formData.errorMessage,
      })
      form.addField({
        id: 'errormessage',
        label: 'Message',
        type: serverWidget.FieldType.INLINEHTML,
      }).defaultValue =
        '<span style="color: red; font-size: medium; font-weight: bold">' +
        formData.errorMessage +
        '</span>'
    }
    var restrictToScript = getApplicableScripts()
    var restrictToDomain = getApplicableDomains()
    form.addSecretKeyField({
      id: 'password',
      label: 'Please enter 16 characters password',
      restrictToCurrentUser: false,
      restrictToScriptIds: restrictToScript,
    })

    form.addField({
      id: 'nsaccountid',
      label: 'Account ID',
      type: serverWidget.FieldType.TEXT,
    }).defaultValue = formData.nsAccountId

    if (formData.subsidiary) {
      form.addField({
        id: 'subsidiary',
        label: 'Subsidiary',
        type: serverWidget.FieldType.INTEGER,
      }).defaultValue = formData.subsidiary
    }
    form.addField({
      id: 'taxid',
      label: 'Tax ID',
      type: serverWidget.FieldType.TEXT,
    }).defaultValue = formData.gui
    form.addField({
      id: 'companyname',
      label: 'Company Name',
      type: serverWidget.FieldType.TEXT,
    }).defaultValue = formData.name
    form.addField({
      id: 'email',
      label: 'E-Mail',
      type: serverWidget.FieldType.EMAIL,
    }).defaultValue = formData.email
    form.addSubmitButton({
      label: 'Submit',
    })
    return form
  }

  function saveCredentialRecord(formData) {
    var id = GwCredentialService.getIdByTaxId(formData.gui)
    if (id === 0) {
      id = GwCredentialService.create(formData)
    } else {
      id = GwCredentialService.update(id, formData)
    }

    return id
  }

  exports.onRequest = onRequest
  return exports
})
