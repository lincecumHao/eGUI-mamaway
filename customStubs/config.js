/**
 * SuiteScript module
 *
 * @module N/config
 * @NApiVersion 2.x
 */
define([], function () {
  /**
   * @namespace config
   */
  var config = {}

  /**
   * Load a configuration object with a specific type
   * @governance 10 units
   * @restriction Server SuiteScript only
   *
   * @param {Object} options
   * @param {string} options.type one of the Type values
   * @param {boolean} options.isDynamic load record in dynamic or deferred dynamic mode
   * @return {Record}
   *
   * @throws {SuiteScriptError} INVALID_RCRD_TYPE Thrown if an invalid record type was provided.
   *
   * @since 2015.2
   */
  config.load = function (options) {}

  /**
   * Enum configuration type values.
   * @readonly
   * @enum {string}
   * @since 2015.2
   */
  function configType() {
    this.USER_PREFERENCES = 'userpreferences'
    this.COMPANY_INFORMATION = 'companyinformation'
    this.COMPANY_PREFERENCES = 'companypreferences'
    this.ACCOUNTING_PREFERENCES = 'accountingpreferences'
    this.ACCOUNTING_PERIODS = 'accountingperiods'
    this.TAX_PERIODS = 'taxperiods'
    this.FEATURES = 'companyfeatures'
    this.TIME_POST = 'timepost'
    this.TIME_VOID = 'timevoid'
  }

  config.Type = new configType()

  /**
   * Primary object used to encapsulate a record object.
   *
   * @protected
   * @param {Object} options
   * @param {Object} options.recordObj (server-generated object holding the full metadata and data for a record type,
   *     including all scripting and customization. See RecordSerializationKey.java)
   * @param {number} options.recordObj.id
   * @param {boolean} options.recordObj.isSubrecord = true if the record instance is a subrecord
   * @param {boolean} options.recordObj.isReadOnly = true if the record instance is read only instance
   * @param {boolean} options.recordObj.isDynamic = true if the record instance is a dynamic record
   * @param {boolean} options.recordObj.isCurrentRecord
   * @param {boolean} options.recordObj.isUserEvent
   * @param {Object} options.recordObj.recordContext
   * @param {Metadata} options.recordObj.metadata (record metadata data used to populate the model controller)
   * @param {ModelController} options.recordObj.data (record data used to populate the model)
   * @param {RecordStateController} options.recordObj.state (record state to use to pre-populate the model controller)
   * @return {Record} client-side record implementation
   * @constructor
   *
   * @since 2015.2
   */
  function Record() {
    /**
     * return array of names of all body fields, including machine header field and matrix header fields
     * @governance none
     * @return {string[]}
     *
     * @since 2015.2
     */
    this.getFields = function () {}

    /**
     * return array of names of all sublists
     * @governance none
     * @return {string[]}
     *
     * @since 2015.2
     */
    this.getSublists = function () {}

    /**
     * Returns the value of a field. Gets a numeric value for rate and ratehighprecision fields.
     * @governance none
     * @param {Object} options
     * @param {string} options.fieldId The internal ID of a standard or custom body field.
     * @return {(number|Date|string|Array|boolean)}
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if fieldId is missing or undefined
     * @throws {SuiteScriptError} SSS_INVALID_API_USAGE if invoked after using setText
     *
     * @since 2015.2
     */
    this.getValue = function (options) {}

    /**
     * set value of the field
     * @governance none
     * @param {Object} options
     * @param {string} options.fieldId The internal ID of a standard or custom body field.
     * @param {number|Date|string|Array|boolean} options.value The value to set the field to.
     * @param {boolean} [options.ignoreFieldChange=false] Ignore the field change script
     * @return {Record} same record, for chaining
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if fieldId is missing or undefined
     *
     * @since 2015.2
     */
    this.setValue = function (options) {}

    /**
     * get value of the field in text representation
     * @governance none
     * @param {Object} options
     * @param {string} options.fieldId The internal ID of a standard or custom body field.
     * @return {string}
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if fieldId is missing or undefined
     *
     * @since 2015.2
     */
    this.getText = function (options) {}

    /**
     * set value of the field by text representation
     * @governance none
     * @param {Object} options
     * @param {string} options.fieldId The internal ID of a standard or custom body field.
     * @param {string} options.text ----- The text or texts to change the field value to.
     *    If the field type is multiselect: - This parameter accepts an array of string values. - This parameter accepts a
     *     null value. Passing in null deselects all currentlsy selected values. If the field type is not multiselect: this
     *     parameter accepts only a single string value.
     * @param {boolean} [options.ignoreFieldChange=false] ignore field change script and slaving event if set to true
     * @return {Record} same record, for chaining
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if fieldId is missing or undefined
     *
     * @since 2015.2
     */
    this.setText = function (options) {}

    /**
     * return the line number for the first occurrence of a field value in a sublist and return -1 if not found
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId The internal ID of the sublist.
     * @param {string} options.fieldId
     * @param {(number|Date|string|Array|boolean)} options.value
     * @return {number}
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if sublistId or field is missing
     *
     * @since 2015.2
     */
    this.findSublistLineWithValue = function (options) {}

    /**
     * return value of a sublist field
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @param {string} options.fieldId
     * @param {number} options.line
     * @return {(number|Date|string|Array|boolean)}
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if sublistId, fieldId, or line is missing
     * @throws {SuiteScriptError} SSS_INVALID_SUBLIST_OPERATION if invalid sublist id, field id, or line number
     * @throws {SuiteScriptError} SSS_INVALID_API_USAGE if invoked after using setSublistText
     *
     * @since 2015.2
     */
    this.getSublistValue = function (options) {}

    /**
     * set the value of a sublist field (available for deferred dynamic only)
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @param {string} options.fieldId
     * @param {number} options.line
     * @param {(number|Date|string|Array|boolean)} options.value
     * @return {Record} same record, for chaining
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if sublistId, fieldId, or line is missing
     * @throws {SuiteScriptError} SSS_INVALID_SUBLIST_OPERATION if invalid sublist id, field id, or line number
     *
     * @since 2015.2
     */
    this.setSublistValue = function (options) {}

    /**
     * return value of a sublist field in text representation
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @param {string} options.fieldId
     * @param {number} options.line
     * @return {string}
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if sublistId, fieldId, or line is missing
     * @throws {SuiteScriptError} SSS_INVALID_SUBLIST_OPERATION if invalid sublist id, field id, or line number
     * @throws {SuiteScriptError} SSS_INVALID_API_USAGE if invoked prior using setSublistText
     *
     * @since 2015.2
     */
    this.getSublistText = function (options) {}

    /**
     * set the value of a sublist field in text representation (available for deferred dynamic only)
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @param {string} options.fieldId
     * @param {number} options.line
     * @param {string} options.text
     * @return {Record} same record, for chaining
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if sublistId, fieldId, or line is missing
     * @throws {SuiteScriptError} SSS_INVALID_SUBLIST_OPERATION if invalid sublist id, field id, or line number
     *
     * @since 2015.2
     */
    this.setSublistText = function (options) {}

    /**
     * return line count of sublist
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @return {number}
     *
     * @since 2015.2
     */
    this.getLineCount = function (options) {}

    /**
     * insert a sublist line
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @param {number} options.line
     * @param {string} options.beforeLineInstanceId
     * @param {boolean} [ignoreRecalc=false] options.ignoreRecalc ignore recalc scripting
     * @return {Line} [new line object]
     * @throws {SuiteScriptError} MUTUALLY_EXCLUSIVE_ARGUMENTS if both line and beforeLineInstanceId are provided
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if sublistId is missing or both line and beforeLineInstanceId
     *     are missing
     * @throws {SuiteScriptError} SSS_INVALID_SUBLIST_OPERATION if sublistId or line index is invalid or if machine is not
     *     editable or before exists and before is an instanceId that does not point to a line in the sublist.
     *
     * @since 2015.2
     */
    this.insertLine = function (options) {}

    /**
     * remove a sublist line
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @param {number} options.line
     * @param {string} options.lineInstanceId
     * @param {boolean} [ignoreRecalc=false] options.ignoreRecalc ignore recalc scripting
     * @return {Record} same record, for chaining
     * @throws {SuiteScriptError} MUTUALLY_EXCLUSIVE_ARGUMENTS if both line and lineInstanceId are provided
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if sublistId is missing or both line and lineInstanceId are
     *     missing
     * @throws {SuiteScriptError} SSS_INVALID_SUBLIST_OPERATION if sublistId or line index is invalid or if machine is not
     *     editable
     *
     * @since 2015.2
     */
    this.removeLine = function (options) {}

    /**
     * select a new line at the end of sublist
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @return {Line} [new line object]
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if sublistId is missing or undefined
     * @throws {SuiteScriptError} SSS_INVALID_SUBLIST_OPERATION if invalid sublist id or sublist is not editable
     * @restriction only available in dynamic record
     *
     * @since 2015.2
     */
    this.selectNewLine = function (options) {}

    /**
     * cancel the current selected line
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @return {Record} same record, for chaining
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if sublistId is missing or undefined
     * @throws {SuiteScriptError} SSS_INVALID_SUBLIST_OPERATION if sublistId is invalid or if machine is not editable
     * @restriction only available in dynamic record
     *
     * @since 2015.2
     */
    this.cancelLine = function (options) {}

    /**
     * commit the current selected line
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @return {Record} same record, for chaining
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if sublistId is missing or undefined
     * @throws {SuiteScriptError} SSS_INVALID_SUBLIST_OPERATION if invalid sublist id
     * @restriction only available in dynamic record
     *
     * @since 2015.2
     */
    this.commitLine = function (options) {}

    /**
     * return value of a sublist field on the current selected sublist line
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @param {string} options.fieldId
     * @return {(number|Date|string|Array|boolean)}
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if sublistId or fieldId is missing
     * @throws {SuiteScriptError} SSS_INVALID_SUBLIST_OPERATION if invalid sublist id or field id
     * @restriction only available in dynamic record
     *
     * @since 2015.2
     */
    this.getCurrentSublistValue = function (options) {}

    /**
     * set the value for field in the current selected line
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @param {string} options.fieldId
     * @param {(number|Date|string|Array|boolean)} options.value
     * @param {boolean} [options.ignoreFieldChange=false] ignore field change script and slaving event if set to true
     * @return {Record} same record, for chaining
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if sublistId or fieldId is missing
     * @throws {SuiteScriptError} A_SCRIPT_IS_ATTEMPTING_TO_EDIT_THE_1_SUBLIST_THIS_SUBLIST_IS_CURRENTLY_IN_READONLY_MODE_AND_CANNOT_BE_EDITED_CALL_YOUR_NETSUITE_ADMINISTRATOR_TO_DISABLE_THIS_SCRIPT_IF_YOU_NEED_TO_SUBMIT_THIS_RECORD
     *     if user tries to edit readonly sublist field
     *
     * @since 2015.2
     */
    this.setCurrentSublistValue = function (options) {}

    /**
     * return the value for field in the current selected line by text representation
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @param {string} options.fieldId
     * @return {(number|Date|string|Array|boolean)}
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if sublistId or fieldId is missing
     * @throws {SuiteScriptError} SSS_INVALID_SUBLIST_OPERATION if invalid sublist id or field id
     * @restriction only available in dynamic record
     *
     * @since 2015.2
     */
    this.getCurrentSublistText = function (options) {}

    /**
     * set the value for field in the current selected line by text representation
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @param {string} options.fieldId
     * @param {(number|Date|string|Array|boolean)} options.text
     * @param {boolean} [options.ignoreFieldChange=false] ignore field change script and slaving event if set to true
     * @return {Record} same record, for chaining
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if sublistId or fieldId is missing
     * @throws {SuiteScriptError} A_SCRIPT_IS_ATTEMPTING_TO_EDIT_THE_1_SUBLIST_THIS_SUBLIST_IS_CURRENTLY_IN_READONLY_MODE_AND_CANNOT_BE_EDITED_CALL_YOUR_NETSUITE_ADMINISTRATOR_TO_DISABLE_THIS_SCRIPT_IF_YOU_NEED_TO_SUBMIT_THIS_RECORD
     *     if user tries to edit readonly sublist field
     * @restriction only available in dynamic record
     *
     * @since 2015.2
     */
    this.setCurrentSublistText = function (options) {}

    /**
     * save record updates to the system
     * @governance 20 units for transactions, 4 for custom records, 10 for all other records
     *
     * @param {Object} options
     * @param {boolean} [options.enableSourcing=false] enable sourcing during record update
     * @param {boolean} [options.ignoreMandatoryFields=false] ignore mandatory field during record submission
     * @return {number} id of submitted record
     *
     * @since 2015.2
     */
    this.save = function (options) {}
    this.save.promise = function (options) {}

    /**
     * return a value indicating if the field has a subrecord
     * @governance none
     * @param {Object} options
     * @param {string} options.fieldId
     * @return {boolean}
     *
     * @since 2015.2
     */
    this.hasSubrecord = function (options) {}

    /**
     * get the subrecord for the associated field
     * @governance none
     * @param {Object} options
     * @param {string} options.fieldId
     * @return {Record} [client-side subrecord implementation]
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if options.fieldId is missing or undefined
     * @throws {SuiteScriptError} FIELD_1_IS_NOT_A_SUBRECORD_FIELD if field is not a subrecord field
     * @throws {SuiteScriptError} FIELD_1_IS_DISABLED_YOU_CANNOT_APPLY_SUBRECORD_OPERATION_ON_THIS_FIELD if field is disable
     *
     * @since 2015.2
     */
    this.getSubrecord = function (options) {}

    /**
     * remove the subrecord for the associated field
     * @governance none
     * @param {Object} options
     * @param {string} options.fieldId
     * @return {Record} same record, for chaining
     *
     * @2015.2
     */
    this.removeSubrecord = function (options) {}

    /**
     * return a value indicating if the associated sublist field has a subrecord
     * @goverannce 0
     * @param {Object} options
     * @param {string} options.sublistId
     * @param {string} options.fieldId
     * @param {number} options.line
     * @restriction only available in deferred dynamic record
     * @return {boolean}
     *
     * @since 2015.2
     */
    this.hasSublistSubrecord = function (options) {}

    /**
     * get the subrecord for the associated sublist field
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @param {string} options.fieldId
     * @param {number} options.line
     * @restriction only available in deferred dynamic record
     * @return {Record} [client-side subrecord implementation]
     *
     * @since 2015.2
     */
    this.getSublistSubrecord = function (options) {}

    /**
     * remove the subrecord for the associated sublist field
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @param {string} options.fieldId
     * @param {number} options.line
     * @restriction only available in deferred dynamic record
     * @return {Record} same record, for chaining
     *
     * @since 2015.2
     */
    this.removeSublistSubrecord = function (options) {}

    /**
     * return a value indicating if the associated sublist field has a subrecord on the current line
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @param {string} options.fieldId
     * @restriction only available in dynamic record
     * @return {boolean}
     *
     * @2015.2
     */
    this.hasCurrentSublistSubrecord = function (options) {}

    /**
     * get the subrecord for the associated sublist field on the current line
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @param {string} options.fieldId
     * @restriction only available in dynamic record
     * @return {Record} [client-side subrecord implementation]
     *
     * @since 2015.2
     */
    this.getCurrentSublistSubrecord = function (options) {}

    /**
     * remove the subrecord for the associated sublist field on the current line
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @param {string} options.fieldId
     * @restriction only available in dynamic record
     * @return {Record} same record, for chaining
     *
     * @since 2015.2
     */
    this.removeCurrentSublistSubrecord = function (options) {}

    /**
     * returns the specified sublist
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @return {Sublist} [requested sublist]
     *
     * @since 2015.2
     */
    this.getSublist = function (options) {}

    /**
     * return array of names of all fields in a sublist
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @return {Array}
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if options.sublistId is missing or undefined
     *
     * @since 2015.2
     */
    this.getSublistFields = function (options) {}

    /**
     * return field object from record
     * @governance none
     * @param {Object} options
     * @param {string} options.fieldId
     * @return {Field}
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if options.fieldId is missing or undefined
     *
     * @since 2015.2
     */
    this.getField = function (options) {}

    /**
     * return field object from record's sublist
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @param {string} options.fieldId
     * @param {number} options.line
     * @return {Field} [requested field]
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if sublistId or fieldId is missing
     * @throws {SuiteScriptError} SSS_INVALID_SUBLIST_OPERATION if line number is invalid
     *
     * @since 2015.2
     */
    this.getSublistField = function (options) {}

    /**
     * return field object from record's sublist current line
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @param {string} options.fieldId
     * @return {Field}
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if sublistId or fieldId is missing
     * @restriction only available in dynamic record
     *
     * @since 2015.2
     */
    this.getCurrentSublistField = function (options) {}

    /**
     * set the value for the associated header in the matrix
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId the id of sublist in which the matrix is in.
     * @param {string} options.fieldId the id of the matrix field
     * @param {number} options.column the column number for the field
     * @param {string} options.value the value to set it to
     * @param {boolean} [options.ignoreFieldChange] Ignore the field change script (default false)
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if any required values are missing
     * @return {Record} same record, for chaining
     *
     * @since 2015.2
     */
    this.setMatrixHeaderValue = function (options) {}

    /**
     * get the value for the associated header in the matrix
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId the id of sublist in which the matrix is in.
     * @param {string} options.fieldId the id of the matrix field
     * @param {number} options.column the column number for the field
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if any required values are missing
     * @return {number|Date|string}
     *
     * @since 2015.2
     */
    this.getMatrixHeaderValue = function (options) {}

    /**
     * set the value for the associated field in the matrix
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId the id of sublist in which the matrix is in.
     * @param {string} options.fieldId the id of the matrix field
     * @param {number} options.line the line number for the field
     * @param {number} options.column the column number for the field
     * @param {string} options.value the value to set it to
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if any required values are missing
     * @restriction only available in deferred dynamic record
     * @return {Record} same record, for chaining
     *
     * @since 2015.2
     */
    this.setMatrixSublistValue = function (options) {}

    /**
     * get the value for the associated field in the matrix
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId the id of sublist in which the matrix is in.
     * @param {string} options.fieldId the id of the matrix field
     * @param {number} options.line the line number for the field
     * @param {number} options.column the column number for the field
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if any required values are missing
     * @return {number|Date|string}
     *
     * @since 2015.2
     */
    this.getMatrixSublistValue = function (options) {}

    /**
     * get the field for the specified header in the matrix
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId the id of sublist in which the matrix is in.
     * @param {string} options.fieldId the id of the matrix field
     * @param {number} options.column the column number for the field
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if any required values are missing
     * @return {Field} [requested field]
     *
     * @since 2015.2
     */
    this.getMatrixHeaderField = function (options) {}

    /**
     * get the field for the specified sublist in the matrix
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId the id of sublist in which the matrix is in.
     * @param {string} options.fieldId the id of the matrix field
     * @param {number} options.column the column number for the field
     * @param {number} options.line the line number for the field
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if any required values are missing
     * @return {Field} [requested field]
     *
     * @since 2015.2
     */
    this.getMatrixSublistField = function (options) {}

    /**
     * returns the line number of the first line that contains the specified value in the specified column of the matrix
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId the id of sublist in which the matrix is in.
     * @param {string} options.fieldId the id of the matrix field
     * @param {number} options.value the column number for the field
     * @param {number} options.column the line number for the field
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if any required values are missing
     * @return {number}
     *
     * @since 2015.2
     */
    this.findMatrixSublistLineWithValue = function (options) {}

    /**
     * returns the number of columns for the specified matrix.
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId the id of sublist in which the matrix is in.
     * @param {string} options.fieldId the id of the matrix field
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if any required values are missing
     * @return {number}
     *
     * @since 2015.2
     */
    this.getMatrixHeaderCount = function (options) {}

    /**
     * set the value for the line currently selected in the matrix
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId - the id of sublist in which the matrix is in.
     * @param {string} options.fieldId - the id of the matrix field
     * @param {number} options.column - the column number for the field
     * @param {string} options.value - the value to set it to
     * @param {boolean} options.ignoreFieldChange (optional) - Ignore the field change script (default false)
     * @param {boolean} options.fireSlavingSync (optional) - Flag to perform slaving synchronously (default false)
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if any required values are missing
     * @restriction only available in dynamic record
     * @return {Record} same record, for chaining
     *
     * @since 2015.2
     */
    this.setCurrentMatrixSublistValue = function (options) {}

    /**
     * get the value for the line currently selected in the matrix
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId - the id of sublist in which the matrix is in.
     * @param {string} options.fieldId - the id of the matrix field
     * @param {number} options.column - the column number for the field
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if any required values are missing
     * @restriction only available in dynamic record
     * @return {number|Date|string}
     *
     * @since 2015.2
     */
    this.getCurrentMatrixSublistValue = function (options) {}
  }

  /**
   * Primary object used to encapsulate a record sublist line object.
   *
   * @protected
   * @param {Object} options
   * @param {Record} options.unproxiedRecord - Instance of recordDefinition that owns the Line object.
   * @param {string} options.sublistId
   * @param {string} options.lineInstanceId
   * @param {boolean} options.fromBuffer
   * @param {boolean} options.isReadOnly
   * @return {Line}
   * @constructor
   */
  function Line() {}

  /**
     * Return a new instance of sublist object
     *
     * @param {Object} sublist
     * @param {string} sublist.type type of sublist
     * @param {SublistState} sublist.sublistState SublistState
    
     * @return {Sublist}
     * @constructor
     *
     * @since 2015.2
     */
  function Sublist() {
    /**
     * The name of the sublist.
     * @name Sublist#name
     * @type string
     * @readonly
     */
    this.getName = function () {}

    /**
     * The type of the sublist.
     * @name Sublist#type
     * @type string
     * @readonly
     */
    this.getType = function () {}

    /**
     * The sublist is changed
     * @name Sublist#isChanged
     * @type boolean
     * @readonly
     */
    this.isChanged = function () {}

    /**
     * The sublist is hidden
     * @name Sublist#isHidden
     * @type boolean
     * @readonly
     */
    this.isHidden = function () {}

    /**
     * The sublist is display
     * @name Sublist#isDisplay
     * @type boolean
     * @readonly
     */
    this.isDisplay = function () {}

    /**
     * A flag to indicate whether or not the sublist supports multi-line buffer feature.
     * @name Sublist#isMultilineEditable
     * @type boolean
     * @readonly
     */
    this.isMultilineEditable = function () {}

    /**
     * Returns the object type name (sublist.Sublist)
     * @returns {string}
     */
    this.toString = function () {}

    /**
     * JSON.stringify() implementation.
     * @returns {{id: string, type: string, isChanged: boolean, isDisplay: boolean}}
     */
    this.toJSON = function () {}
  }

  /**
   * @protected
   * @constructor
   */
  function Field() {
    /**
     * Return label of the field
     * @name Field#label
     * @type string
     * @readonly
     * @since 2015.2
     */
    this.label = undefined
    /**
     * Return id of the field
     * @name Field#id
     * @type string
     * @readonly
     * @since 2015.2
     */
    this.id = undefined
    /**
     * Disabled state of the field
     * @name Field#isDisabled
     * @type boolean
     * @since 2015.2
     */
    this.isDisabled = undefined
    /**
     * Display state of the field
     * @name Field#isDisplay
     * @type boolean
     * @since 2015.2
     */
    this.isDisplay = undefined
    /**
     * Mandatory state of the field
     * @name Field#isMandatory
     * @type boolean
     * @since 2015.2
     */
    this.isMandatory = undefined
    /**
     * Read Only state of the field
     * @name Field#isReadOnly
     * @type boolean
     * @since 2015.2
     */
    this.isReadOnly = undefined
    /**
     * Visible state of the field
     * @name Field#isVisible
     * @type boolean
     * @since 2015.2
     */
    this.isVisible = undefined
    /**
     * Return type of the field
     * @name Field#type
     * @type string
     * @readonly
     * @since 2015.2
     */
    this.type = undefined
    /**
     * Return the sublistId of the field
     * @name Field#sublistId
     * @type string
     * @readonly
     * @since 2015.2
     */
    this.sublistId = undefined
    /**
     * Returns if the field is a popup
     * @name Field#isPopup
     * @type boolean
     * @readonly
     * @since 2015.2
     */
    this.isPopup = undefined
    /**
     * get JSON format of the object
     * @return {{id: *, label: *, type: *}}
     *
     */
    this.toJSON = function () {}

    /**
     * @return {string}
     *
     */
    this.toString = function () {}
  }

  // N.config = config;

  /**
   * @exports N/config
   */
  return config
})
