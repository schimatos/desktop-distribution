"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KEY_CONTEXT_LENIENT = exports.KEY_CONTEXT_GRAPHQL_SINGULARIZEVARIABLES = exports.KEY_CONTEXT_QUERYFORMAT = exports.KEY_CONTEXT_INITIALBINDINGS = exports.ActorInitSparql = void 0;
const bus_init_1 = require("@comunica/bus-init");
const bus_query_operation_1 = require("@comunica/bus-query-operation");
const bus_rdf_resolve_quad_pattern_1 = require("@comunica/bus-rdf-resolve-quad-pattern");
const core_1 = require("@comunica/core");
const sparqlalgebrajs_1 = require("sparqlalgebrajs");
/**
 * A browser-safe comunica SPARQL Init Actor.
 */
class ActorInitSparql extends bus_init_1.ActorInit {
    constructor(args) {
        super(args);
    }
    /**
     * Add convenience methods to query results
     * @param {IActorQueryOperationOutput} results Basic query results.
     * @return {IQueryResult} Same query results with added fields.
     */
    static enhanceQueryResults(results) {
        // Set bindings
        if (results.bindingsStream) {
            results.bindings = () => new Promise((resolve, reject) => {
                const result = [];
                results.bindingsStream.on('data', data => {
                    result.push(data);
                });
                results.bindingsStream.on('end', () => {
                    resolve(result);
                });
                results.bindingsStream.on('error', reject);
            });
        }
        else if (results.quadStream) {
            results.quads = () => new Promise((resolve, reject) => {
                const result = [];
                results.quadStream.on('data', data => {
                    result.push(data);
                });
                results.quadStream.on('end', () => {
                    resolve(result);
                });
                results.quadStream.on('error', reject);
            });
        }
        return results;
    }
    async test(action) {
        return true;
    }
    /**
     * Evaluate the given query
     * @param {string | Algebra.Operation} query A query string or algebra.
     * @param context An optional query context.
     * @return {Promise<IActorQueryOperationOutput>} A promise that resolves to the query output.
     */
    async query(query, context) {
        context = context || {};
        // Expand shortcuts
        for (const key in context) {
            if (this.contextKeyShortcuts[key]) {
                const existingEntry = context[key];
                context[this.contextKeyShortcuts[key]] = existingEntry;
                delete context[key];
            }
        }
        // Set the default logger if none is provided
        if (!context[core_1.KEY_CONTEXT_LOG]) {
            context[core_1.KEY_CONTEXT_LOG] = this.logger;
        }
        if (!context[bus_query_operation_1.KEY_CONTEXT_QUERY_TIMESTAMP]) {
            context[bus_query_operation_1.KEY_CONTEXT_QUERY_TIMESTAMP] = new Date();
        }
        // Ensure sources are an async re-iterable
        if (Array.isArray(context[bus_rdf_resolve_quad_pattern_1.KEY_CONTEXT_SOURCES])) {
            // TODO: backwards compatibility
            context[bus_rdf_resolve_quad_pattern_1.KEY_CONTEXT_SOURCES].forEach((source) => {
                if (!bus_rdf_resolve_quad_pattern_1.isDataSourceRawType(source) && (source.type === 'auto' || source.type === 'hypermedia')) {
                    delete source.type;
                }
            });
        }
        // Prepare context
        context = core_1.ActionContext(context);
        let queryFormat = 'sparql';
        if (context && context.has(exports.KEY_CONTEXT_QUERYFORMAT)) {
            queryFormat = context.get(exports.KEY_CONTEXT_QUERYFORMAT);
            context = context.delete(exports.KEY_CONTEXT_QUERYFORMAT);
            if (queryFormat === 'graphql' && !context.has(exports.KEY_CONTEXT_GRAPHQL_SINGULARIZEVARIABLES)) {
                context = context.set(exports.KEY_CONTEXT_GRAPHQL_SINGULARIZEVARIABLES, {});
            }
        }
        let baseIRI;
        if (context && context.has(bus_query_operation_1.KEY_CONTEXT_BASEIRI)) {
            baseIRI = context.get(bus_query_operation_1.KEY_CONTEXT_BASEIRI);
        }
        // Pre-processing the context
        context = (await this.mediatorContextPreprocess.mediate({ context })).context;
        // Parse query
        let operation;
        if (typeof query === 'string') {
            const queryParseOutput = await this.mediatorSparqlParse.mediate({ context, query, queryFormat, baseIRI });
            operation = queryParseOutput.operation;
            // Update the baseIRI in the context if the query modified it.
            if (queryParseOutput.baseIRI) {
                context = context.set(bus_query_operation_1.KEY_CONTEXT_BASEIRI, queryParseOutput.baseIRI);
            }
        }
        else {
            operation = query;
        }
        // Apply initial bindings in context
        if (context.has(exports.KEY_CONTEXT_INITIALBINDINGS)) {
            const bindings = context.get(exports.KEY_CONTEXT_INITIALBINDINGS);
            operation = bus_query_operation_1.materializeOperation(operation, bus_query_operation_1.ensureBindings(bindings));
        }
        // Optimize the query operation
        operation = (await this.mediatorOptimizeQueryOperation.mediate({ context, operation })).operation;
        // Execute query
        const resolve = { context, operation };
        let output = await this.mediatorQueryOperation.mediate(resolve);
        output = ActorInitSparql.enhanceQueryResults(output);
        output.context = context;
        return output;
    }
    /**
     * @param context An optional context.
     * @return {Promise<{[p: string]: number}>} All available SPARQL (weighted) result media types.
     */
    async getResultMediaTypes(context) {
        return (await this.mediatorSparqlSerializeMediaTypeCombiner.mediate({ context, mediaTypes: true })).mediaTypes;
    }
    /**
     * @param context An optional context.
     * @return {Promise<{[p: string]: number}>} All available SPARQL result media type formats.
     */
    async getResultMediaTypeFormats(context) {
        return (await this.mediatorSparqlSerializeMediaTypeFormatCombiner.mediate({ context, mediaTypeFormats: true }))
            .mediaTypeFormats;
    }
    /**
     * Convert a query result to a string stream based on a certain media type.
     * @param {IActorQueryOperationOutput} queryResult A query result.
     * @param {string} mediaType A media type.
     * @param {ActionContext} context An optional context.
     * @return {Promise<IActorSparqlSerializeOutput>} A text stream.
     */
    async resultToString(queryResult, mediaType, context) {
        context = core_1.ActionContext(context);
        if (!mediaType) {
            switch (queryResult.type) {
                case 'bindings':
                    mediaType = 'application/json';
                    break;
                case 'quads':
                    mediaType = 'application/trig';
                    break;
                default:
                    mediaType = 'simple';
                    break;
            }
        }
        const handle = queryResult;
        handle.context = context;
        return (await this.mediatorSparqlSerialize.mediate({ context, handle, handleMediaType: mediaType })).handle;
    }
    /**
     * Invalidate all internal caches related to the given page URL.
     * If no page URL is given, then all pages will be invalidated.
     * @param {string} url The page URL to invalidate.
     * @return {Promise<any>} A promise resolving when the caches have been invalidated.
     */
    invalidateHttpCache(url) {
        return this.mediatorHttpInvalidate.mediate({ url });
    }
    async run(action) {
        throw new Error('ActorInitSparql#run is not supported in the browser.');
    }
}
exports.ActorInitSparql = ActorInitSparql;
ActorInitSparql.ALGEBRA_TYPES = Object.keys(sparqlalgebrajs_1.Algebra.types)
    .reduce((acc, key) => {
    acc[sparqlalgebrajs_1.Algebra.types[key]] = true;
    return acc;
}, {});
exports.KEY_CONTEXT_INITIALBINDINGS = '@comunica/actor-init-sparql:initialBindings';
exports.KEY_CONTEXT_QUERYFORMAT = '@comunica/actor-init-sparql:queryFormat';
exports.KEY_CONTEXT_GRAPHQL_SINGULARIZEVARIABLES = '@comunica/actor-init-sparql:singularizeVariables';
exports.KEY_CONTEXT_LENIENT = '@comunica/actor-init-sparql:lenient';
//# sourceMappingURL=ActorInitSparql-browser.js.map