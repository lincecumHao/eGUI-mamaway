/**
 * GW Message
 *gwmessage.js
 *@NApiVersion 2.x
 */
define(['N/ui/message'], function (message) {
  var _duration_seconds = 30000

  function showConfirmationMessage(showTitle, showMessage) {
    var _msg = message.create({
      title: showTitle,
      message: showMessage,
      type: message.Type.CONFIRMATION,
      duration: _duration_seconds,
    })
    _msg.show()
  }

  function showInformationMessage(showTitle, showMessage) {
    var _msg = message.create({
      title: showTitle,
      message: showMessage,
      type: message.Type.INFORMATION,
      duration: _duration_seconds,
    })
    _msg.show()
  }

  function showWarningMessage(showTitle, showMessage) {
    var _msg = message.create({
      title: showTitle,
      message: showMessage,
      type: message.Type.WARNING,
      duration: _duration_seconds,
    })
    _msg.show()
  }

  function showErrorMessage(showTitle, showMessage) {
    var _msg = message.create({
      title: showTitle,
      message: showMessage,
      type: message.Type.ERROR,
      duration: _duration_seconds,
    })
    _msg.show()
  }

  return {
    showConfirmationMessage: showConfirmationMessage,
    showInformationMessage: showInformationMessage,
    showWarningMessage: showWarningMessage,
    showErrorMessage: showErrorMessage,
  }
})
