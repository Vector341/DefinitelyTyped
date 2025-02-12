// https://docs.newrelic.com/docs/agents/nodejs-agent/api-guides/nodejs-agent-api

/**
 * Give the current transaction a custom name.
 *
 * Overrides any New Relic naming rules set in configuration or from New Relic's servers.
 *
 * IMPORTANT: this function must be called when a transaction is active. New
 * Relic transactions are tied to web requests, so this method may be called
 * from within HTTP or HTTPS listener functions, Express routes, or other
 * contexts where a web request or response object are in scope.
 *
 * The `name` will be prefixed with 'Custom/' when sent.
 */
export function setTransactionName(name: string): void;

/**
 * Returns a handle on the currently executing transaction.
 *
 * This handle can then be used to end or ignore a given transaction safely from any context.
 * It is best used with newrelic.startWebTransaction() and newrelic.startBackgroundTransaction().
 */
export function getTransaction(): TransactionHandle;

/**
 * Specify the `Dispatcher` and `Dispatcher Version` environment values.
 *
 * A dispatcher is typically the service responsible for brokering
 * the request with the process responsible for responding to the
 * request.  For example Node's `http` module would be the dispatcher
 * for incoming HTTP requests.
 */
export function setDispatcher(name: string, version?: string): void;

/**
 * Give the current transaction a name based on your own idea of what
 * constitutes a controller in your Node application. Also allows you to
 * optionally specify the action being invoked on the controller. If the action
 * is omitted, then the API will default to using the HTTP method used in the
 * request (e.g. GET, POST, DELETE). Overrides any New Relic naming rules set
 * in configuration or from New Relic's servers.
 *
 * IMPORTANT: this function must be called when a transaction is active. New
 * Relic transactions are tied to web requests, so this method may be called
 * from within HTTP or HTTPS listener functions, Express routes, or other
 * contexts where a web request or response object are in scope.
 *
 * The `name` will be prefixed with 'Controller/' when sent.
 * The `action` defaults to the HTTP method used for the request.
 */
export function setControllerName(name: string, action: string): void;

/**
 * Add a custom attribute to the current transaction.
 *
 * Some attributes are reserved (see CUSTOM_BLACKLIST in the docs for the current, very short list), and
 * as with most API methods, this must be called in the context of an
 * active transaction.
 *
 * Most recently set value wins.
 */
export function addCustomAttribute(key: string, value: string | number | boolean): void;

/**
 * Adds all custom attributes in an object to the current transaction.
 *
 * See documentation for `addCustomAttribute` for more information on setting custom attributes.
 */
export function addCustomAttributes(atts: { [key: string]: string | number | boolean }): void;

/**
 * Add a custom attribute to the the currently executing span.
 *
 * Some attributes are reserved (see CUSTOM_BLACKLIST in the docs for the current, very short list), and
 * as with most API methods, this must be called in the context of an active segment/span.
 *
 * Most recently set value wins.
 */
export function addCustomSpanAttribute(key: string, value: string | number | boolean): void;

/**
 * Adds all custom attributes in an object to the the currently executing span.
 *
 * See documentation for `addCustomSpanAttribute` for more information on setting custom attributes.
 */
export function addCustomSpanAttributes(atts: { [key: string]: string | number | boolean }): void;

/**
 * Send errors to New Relic that you've already handled yourself.
 *
 * NOTE: Errors that are recorded using this method do _not_ obey the `ignore_status_codes` configuration.
 */
export function noticeError(error: Error, expected?: boolean): void;

/**
 * Send errors to New Relic that you've already handled yourself.
 *
 * NOTE: Errors that are recorded using this method do _not_ obey the `ignore_status_codes` configuration.
 *
 *  Optional. Any custom attributes to be displayed in the New Relic UI.
 */
export function noticeError(
    error: Error,
    customAttributes?: { [key: string]: string | number | boolean },
    expected?: boolean,
): void;

/**
 * This method lets you define a custom callback to generate error group names, which will be used by
 * errors inbox to group similar errors together via the error.group.name agent attribute.
 *
 * Calling this function multiple times will replace previously defined versions of this callback function.
 */
export function setErrorGroupCallback(
    callback: (metadata: {
        customAttributes: { [key: string]: string | number | boolean };
        "request.uri": string;
        "http.statusCode": string;
        "http.method": string;
        error?: Error;
        "error.expected": boolean;
    }) => string,
): void;

/**
 * Sends an application log message to New Relic. The agent already
 * automatically does this for some instrumented logging libraries,
 * but in case you are using another logging method that is not
 * already instrumented by the agent, you can use this function
 * instead.
 *
 * If application log forwarding is disabled in the agent
 * configuration, this function does nothing.
 *
 * An example of using this function is
 *
 *    newrelic.recordLogEvent({
 *       message: 'cannot find file',
 *       level: 'ERROR',
 *       error: new SystemError('missing.txt')
 *    })
 */
export function recordLogEvent(logEvent: LogEvent): void;

/**
 * If the URL for a transaction matches the provided pattern, name the
 * transaction with the provided name.
 *
 * If there are capture groups in the pattern (which is a standard JavaScript regular expression,
 * and can be passed as either a RegExp or a string), then the substring matches ($1, $2,
 * etc.) are replaced in the name string. BE CAREFUL WHEN USING SUBSTITUTION.
 * If the replacement substrings are highly variable (i.e. are identifiers,
 * GUIDs, or timestamps), the rule will generate too many metrics and
 * potentially get your application blacklisted by New Relic.
 *
 * An example of a good rule with replacements:
 *
 *   newrelic.addNamingRule('^/storefront/(v[1-5])/(item|category|tag)', 'CommerceAPI/$1/$2')
 *
 * An example of a bad rule with replacements:
 *
 *   newrelic.addNamingRule('^/item/([0-9a-f]+)', 'Item/$1')
 *
 * Keep in mind that the original URL and any query parameters will be sent
 * along with the request, so slow transactions will still be identifiable.
 *
 * Naming rules can not be removed once added. They can also be added via the
 * agent's configuration. See configuration documentation for details.
 */
export function addNamingRule(pattern: RegExp | string, name: string): void;

/**
 * If the URL for a transaction matches the provided pattern, ignore the transaction attached to that URL.
 *
 * Useful for filtering socket.io connections and other long-polling requests out of your agents to keep
 * them from distorting an app's apdex or mean response time.
 *
 * Example:
 *
 *   newrelic.addIgnoringRule('^/socket\\.io/')
 */
export function addIgnoringRule(pattern: RegExp | string): void;

/**
 * Get the <script>...</script> header necessary for Browser Monitoring.
 *
 * This script must be manually injected into your templates, as high as possible
 * in the header, but _after_ any X-UA-COMPATIBLE HTTP-EQUIV meta tags.
 * Otherwise you may hurt IE!
 *
 * This method must be called _during_ a transaction, and must be called every
 * time you want to generate the headers.
 *
 * Do *not* reuse the headers between users, or even between requests.
 */
export function getBrowserTimingHeader(options?: {
    nonce?: string;
    hasToRemoveScriptWrapper?: boolean;
    allowTransactionlessInjection?: boolean;
}): string;

/**
 * Instrument a particular method to improve visibility into a transaction,
 * or optionally turn it into a metric.
 *
 * The name defines a name for the segment. This name will be visible in transaction traces and
 * as a new metric in the New Relic UI.
 * The record flag defines whether the segment should be recorded as a metric.
 * The handler is the function you want to track as a segment.
 * The optional callback is a function passed to the handler to fire after its work is done.
 *
 * The agent begins timing the segment when startSegment is called.
 * The segment is ended when either the handler finishes executing, or callback is fired, if it is provided.
 * If a promise is returned from the handler, the segment's ending will be tied to that promise resolving or rejecting.
 */
export function startSegment<T, C extends (...args: any[]) => any>(
    name: string,
    record: boolean,
    handler: (cb?: C) => T,
    callback?: C,
): T;

/**
 * Instrument a particular callback to improve visibility into a transaction.
 *
 * Use this API call to improve instrumentation of a particular method, or to track work across asynchronous
 * boundaries by calling createTracer() in both the target function and its parent asynchronous function.
 *
 * The name will be visible in transaction traces and as a new metric in the New Relic UI.
 *
 * The agent begins timing the segment when createTracer is called, and ends the segment when the callback
 * defined by the callback argument finishes executing.
 *
 * This method has been deprecated in favor of newrelic.startSegment()
 */
export function createTracer<T extends (...args: any[]) => any>(name: string, handle: T): T;

/**
 * Creates and starts a web transaction to record work done in the handle supplied.
 *
 * This transaction will run until the handle
 * synchronously returns UNLESS:
 * 1. The handle function returns a promise, where the end of the
 *    transaction will be tied to the end of the promise returned.
 * 2. `getTransaction` is called in the handle, flagging the
 *    transaction as externally handled.  In this case the transaction
 *    will be ended when `TransactionHandle#end` is called in the user's code.
 *
 * Example:
 * var newrelic = require('newrelic')
 * newrelic.startWebTransaction('/some/url/path', function() {
 *   var transaction = newrelic.getTransaction()
 *   setTimeout(function() {
 *     // do some work
 *     transaction.end()
 *   }, 100)
 * })
 *
 * The `url` is used to name and group related transactions in APM,
 * so it should be a generic name and not include any variable parameters.
 */
export function startWebTransaction<T>(url: string, handle: Promise<T>): Promise<T>;
export function startWebTransaction<T>(url: string, handle: (...args: any[]) => T): T;

/**
 * Creates and starts a background transaction to record work done in the handle supplied.
 *
 * This transaction will run until the handle
 * synchronously returns UNLESS:
 * 1. The handle function returns a promise, where the end of the
 *    transaction will be tied to the end of the promise returned.
 * 2. `API#getTransaction` is called in the handle, flagging the
 *    transaction as externally handled.  In this case the transaction
 *    will be ended when `TransactionHandle#end` is called in the user's code.
 *
 * Example:
 * var newrelic = require('newrelic')
 * newrelic.startBackgroundTransaction('Red October', 'Subs', function() {
 *   var transaction = newrelic.getTransaction()
 *   setTimeout(function() {
 *     // do some work
 *     transaction.end()
 *   }, 100)
 * })
 *
 * The `url` is used to name and group related transactions in APM,
 * so it should be a generic name and not include any variable parameters.
 *
 * The optional `group can be used for grouping background transactions in APM.
 * For more information see:
 *  https://docs.newrelic.com/docs/apm/applications-menu/monitoring/transactions-page#txn-type-dropdown
 */
export function startBackgroundTransaction<T>(name: string, handle: Promise<T>): Promise<T>;
export function startBackgroundTransaction<T>(name: string, handle: (...args: any[]) => T): T;
export function startBackgroundTransaction<T>(name: string, group: string, handle: Promise<T>): Promise<T>;
export function startBackgroundTransaction<T>(name: string, group: string, handle: (...args: any[]) => T): T;

/**
 * End the current web or background custom transaction.
 *
 * This method requires being in the correct transaction context when called.
 */
export function endTransaction(): void;

/**
 * Record an event-based metric, usually associated with a particular duration.
 *
 * The `name` must be a string following standard metric naming rules. The `value` will
 * usually be a number, but it can also be an object.
 *   * When `value` is a numeric value, it should represent the magnitude of a measurement
 *     associated with an event; for example, the duration for a particular method call.
 *   * When `value` is an object, it must contain count, total, min, max, and sumOfSquares
 *     keys, all with number values. This form is useful to aggregate metrics on your own
 *     and report them periodically; for example, from a setInterval. These values will
 *     be aggregated with any previously collected values for the same metric. The names
 *     of these keys match the names of the keys used by the platform API.
 */
export function recordMetric(name: string, value: number | Metric): void;

/**
 * Update a metric that acts as a simple counter.
 *
 * The count of the selected metric will be incremented by the specified amount, defaulting to 1.
 */
export function incrementMetric(name: string, value?: number): void;

/**
 * Record an event-based metric, usually associated with a particular duration.
 *
 * `eventType` must be an alphanumeric string less than 255 characters.
 * The keys of `attributes` must be shorter than 255 characters.
 */
export function recordCustomEvent(
    eventType: string,
    attributes: { [keys: string]: boolean | number | string },
): undefined | false;

/**
 * Registers an instrumentation function.
 *
 * The provided onRequire callback will be fired when the given module is loaded with require.
 * The moduleName parameter should be the string that will be passed to require;
 * for example, 'express' or 'amqplib/callback_api'.
 *
 * The optional onError callback is called if the onRequire parameters throws an error.
 * This is useful for debugging your instrumentation.
 *
 * Use this method to:
 * - Add instrumentation for modules not currently instrumented by New Relic.
 * - Instrument your own code.
 * - Replace the Node.js agent's built-in instrumentation with your own.
 */
export const instrument: Instrument;

/**
 * Sets an instrumentation callback for a datastore module.
 *
 * This method is just like `instrument`, except it provides a datastore-service-specialized shim.
 */
export const instrumentDatastore: Instrument;

/**
 * The instrumentLoadedModule method allows you to add stock instrumentation to specific modules
 * in situations where it's impossible to have require('newrelic'); as the first line of your app's main module.
 */
export function instrumentLoadedModule(moduleName: string, moduleInstance: any): boolean;

/**
 * Sets an instrumentation callback for a web framework module.
 *
 * This method is just like `instrument`, except it provides a web-framework-specialized  shim.
 */
export const instrumentWebframework: Instrument;

/**
 * Sets an instrumentation callback for a message service client module.
 *
 * This method is just like `instrument`, except it provides a message-service-specialized shim.
 */
export const instrumentMessages: Instrument;

/**
 * This method gives you a way to associate a unique identifier with a transaction event,
 * transaction trace and errors within transaction. A new property, `enduser.id`, will be
 * added to the error and reported to errors inbox.
 */
export function setUserID(userID: string): void;

/**
 * Gracefully shuts down the agent.
 *
 * If `collectPendingData` is true, the agent will send any pending data to the collector
 * before shutting down. Defaults to `false`.
 */
export function shutdown(cb?: (error?: Error) => void): void;
export function shutdown(
    options?: {
        collectPendingData?: boolean | undefined;
        timeout?: number | undefined;
        waitForIdle?: boolean | undefined;
    },
    cb?: (error?: Error) => void,
): void;

/**
 * Returns key/value pairs which can be used to link traces or entities.
 * It will only contain items with meaningful values. For instance, if distributed tracing is disabled,
 * trace.id will not be included.
 */
export function getLinkingMetadata(omitSupportability?: boolean): LinkingMetadata;

/**
 * Returns and object containing the current trace ID and span ID.
 * This API requires distributed tracing to be enabled or an empty object will be returned.
 */
export function getTraceMetadata(): TraceMetadata;

/**
 * Wraps an AWS Lambda function with NewRelic instrumentation and returns the wrapped function.
 *
 * The handler should be an AWS Lambda handler function.
 * Returns a function with identical signature to the provided handler function.
 */
export function setLambdaHandler<T extends (...args: any[]) => any>(handler: T): T;

/**
 * Obfuscates SQL for a given database engine.
 */
export function obfuscateSql(sql: string, dialect?: "mysql" | "postgres" | "cassandra" | "oracle"): string;

export interface Instrument {
    (opts: { moduleName: string; onRequire: () => void; onError?: ((err: Error) => void) | undefined }): void;
    (moduleName: string, onRequire: () => void, onError?: (err: Error) => void): void;
}

export interface Metric {
    count: number;
    total: number;
    min: number;
    max: number;
    sumOfSquares: number;
}

export interface DistributedTracePayload {
    /**
     * The base64 encoded JSON representation of the distributed trace payload.
     */
    text(): string;

    /**
     * The base64 encoded JSON representation of the distributed trace payload.
     */
    httpSafe(): string;
}

export type DistributedTraceHeaders = Record<string, number | string | string[] | undefined>;

export interface TransactionHandle {
    /**
     * End the transaction.
     */
    end(callback?: () => any): void;

    /**
     * Mark the transaction to be ignored.
     */
    ignore(): void;

    /**
     * Modifies the headers map that is passed in by adding W3C Trace Context headers
     * and New Relic Distributed Trace headers.
     */
    insertDistributedTraceHeaders(headers: DistributedTraceHeaders): void;

    /**
     * Used to instrument the called service for inclusion in a distributed trace.
     *
     * Links the spans in a trace by accepting a payload generated by `insertDistributedTraceHeaders`
     * or generated by some other W3C Trace Context compliant tracer. This method accepts the headers
     * of an incoming request, looks for W3C Trace Context headers, and if not found, falls back to
     * New Relic distributed trace headers.
     *
     * Check the docs for valid transport types. If an invalid type is provided, it will fall back to "Unknown".
     */
    acceptDistributedTraceHeaders(transportType: string, headers: DistributedTraceHeaders): void;

    /**
     * Return whether this Transaction is being sampled
     */
    isSampled(): boolean;
}

export interface LinkingMetadata {
    /**
     * The current trace ID
     */
    "trace.id"?: string | undefined;

    /**
     * The current span ID
     */
    "span.id"?: string | undefined;

    /**
     * The application name specified in the connect request as
     * app_name. If multiple application names are specified this will only be
     * the first name
     */
    "entity.name": string;

    /**
     * The string "SERVICE"
     */
    "entity.type": string;

    /**
     * The entity ID returned in the connect reply as entity_guid
     */
    "entity.guid"?: string | undefined;

    /**
     * The hostname as specified in the connect request as
     * utilization.full_hostname. If utilization.full_hostname is null or empty,
     * this will be the hostname specified in the connect request as host.
     */
    hostname: string;
}

export interface LogEvent {
    /**
     * The log message
     */
    message: string;

    /**
     * The log level severity. If this key is missing, it will default to "UNKNOWN"
     */
    level?: string | undefined;

    /**
     * ECMAScript epoch number denoting the time that this log message was produced. If this key is missing, it will default to the output of `Date.now()`
     */
    timestamp?: number | undefined;

    /**
     * Error associated to this log event. Ignored if missing.
     */
    error?: Error | undefined;
}

export interface TraceMetadata {
    /**
     * The current trace ID
     */
    traceId?: string | undefined;

    /**
     * The current span ID
     */
    spanId?: string | undefined;
}
/**
 * Run a function with the passed in LLM context as the active context and return its return value.
 *
 * See documentation for `withLlmCustomAttributes` for more information on setting custom attributes.
 */

export function withLlmCustomAttributes<T>(
    attrs: Record<string, number | string | boolean>,
    cb: (...args: any[]) => T,
): T;

/**
 * Registers a callback which will be used for calculating token counts on Llm events when they are not available.
 *
 * See documentation for `setLlmTokenCountCallback` for more information on setting custom attributes.
 */

export function setLlmTokenCountCallback<T>(
    cb: (...args: any[]) => T,
): T;
