/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define([
  'N/runtime',
  './gw_ue_lib_ap_doc_import'
  ],
  (
    runtime,
    libApDocImport
  ) => {
    /**
     * Defines the function definition that is executed before record is loaded.
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
     * @param {Form} scriptContext.form - Current form
     * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
     * @since 2015.2
     */
    const beforeLoad = (scriptContext) => {
      log.debug({
        title: 'beforeLoad',
        details: {
          contextType: scriptContext.type,
          runtimeExecutionContext: runtime.executionContext
        }
      })

    }

    /**
     * Defines the function definition that is executed before record is submitted.
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
     * @since 2015.2
     */
    const beforeSubmit = (scriptContext) => {
      log.debug({ title: 'beforeSubmit - start', details: scriptContext.type })
      if (scriptContext.type !== scriptContext.UserEventType.CREATE) return
      libApDocImport.afterSubmitProcess(scriptContext)
    }

    /**
     * Defines the function definition that is executed after record is submitted.
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
     * @since 2015.2
     */
    const afterSubmit = (scriptContext) => {
      // if (scriptContext.type !== scriptContext.UserEventType.CREATE) return
      // log.debug({ title: 'afterSubmit - scriptContext', details: scriptContext })

      // libApDocImport.afterSubmitProcess(scriptContext)
    }

    return {beforeLoad, beforeSubmit, afterSubmit}

  });
