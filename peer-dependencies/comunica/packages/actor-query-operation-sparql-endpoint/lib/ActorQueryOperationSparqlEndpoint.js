"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorQueryOperationSparqlEndpoint = void 0;
const bus_query_operation_1 = require("@comunica/bus-query-operation");
const bus_rdf_resolve_quad_pattern_1 = require("@comunica/bus-rdf-resolve-quad-pattern");
const utils_datasource_1 = require("@comunica/utils-datasource");
const asynciterator_1 = require("asynciterator");
const fetch_sparql_endpoint_1 = require("fetch-sparql-endpoint");
const rdf_string_1 = require("rdf-string");
const sparqlalgebrajs_1 = require("sparqlalgebrajs");
/**
 * A comunica SPARQL Endpoint Query Operation Actor.
 */
class ActorQueryOperationSparqlEndpoint extends bus_query_operation_1.ActorQueryOperation {
    constructor(args) {
        super(args);
        this.endpointFetcher = new fetch_sparql_endpoint_1.SparqlEndpointFetcher({
            fetch: (input, init) => this.mediatorHttp.mediate({ input, init, context: this.lastContext }),
            prefixVariableQuestionMark: true,
        });
    }
    async test(action) {
        if (!action.operation) {
            throw new Error('Missing field \'operation\' in a query operation action.');
        }
        const source = await utils_datasource_1.DataSourceUtils.getSingleSource(action.context);
        if (source && bus_rdf_resolve_quad_pattern_1.getDataSourceType(source) === 'sparql') {
            return { httpRequests: 1 };
        }
        throw new Error(`${this.name} requires a single source with a 'sparql' endpoint to be present in the context.`);
    }
    async run(action) {
        const source = await utils_datasource_1.DataSourceUtils.getSingleSource(action.context);
        if (!source) {
            throw new Error('Illegal state: undefined sparql endpoint source.');
        }
        const endpoint = bus_rdf_resolve_quad_pattern_1.getDataSourceValue(source);
        this.lastContext = action.context;
        // Determine the full SPARQL query that needs to be sent to the endpoint
        // Also check the type of the query (SELECT, CONSTRUCT (includes DESCRIBE) or ASK)
        let query;
        let type;
        let variables;
        try {
            query = sparqlalgebrajs_1.toSparql(action.operation);
            // This will throw an error in case the result is an invalid SPARQL query
            type = this.endpointFetcher.getQueryType(query);
        }
        catch (_a) {
            // Ignore errors
        }
        // If the input is an sub-query, wrap this in a SELECT
        if (!type || type === 'UNKNOWN') {
            variables = sparqlalgebrajs_1.Util.inScopeVariables(action.operation);
            query = sparqlalgebrajs_1.toSparql(ActorQueryOperationSparqlEndpoint.FACTORY.createProject(action.operation, variables));
            type = 'SELECT';
        }
        // Execute the query against the endpoint depending on the type
        switch (type) {
            case 'SELECT':
                if (!variables) {
                    variables = sparqlalgebrajs_1.Util.inScopeVariables(action.operation);
                }
                return this.executeQuery(endpoint, query, false, variables);
            case 'CONSTRUCT':
                return this.executeQuery(endpoint, query, true);
            case 'ASK':
                return {
                    type: 'boolean',
                    booleanResult: this.endpointFetcher.fetchAsk(endpoint, query),
                };
        }
    }
    /**
     * Execute the given SELECT or CONSTRUCT query against the given endpoint.
     * @param endpoint A SPARQL endpoint URL.
     * @param query A SELECT or CONSTRUCT query.
     * @param quads If the query returns quads, i.e., if it is a CONSTRUCT query.
     * @param variables Variables for SELECT queries.
     */
    executeQuery(endpoint, query, quads, variables) {
        const inputStream = quads ?
            this.endpointFetcher.fetchTriples(endpoint, query) :
            this.endpointFetcher.fetchBindings(endpoint, query);
        let totalItems = 0;
        const stream = asynciterator_1.wrap(inputStream, { autoStart: false, maxBufferSize: Infinity })
            .map(rawData => {
            totalItems++;
            return quads ? rawData : bus_query_operation_1.Bindings(rawData);
        });
        inputStream.then(subStream => subStream.on('end', () => stream.emit('metadata', { totalItems })), () => {
            // Do nothing
        });
        const metadata = ActorQueryOperationSparqlEndpoint.cachifyMetadata(() => new Promise((resolve, reject) => {
            stream._fillBuffer();
            stream.on('error', reject);
            stream.on('end', () => reject(new Error('No metadata was found')));
            stream.on('metadata', resolve);
        }));
        if (quads) {
            return {
                type: 'quads',
                quadStream: stream,
                metadata,
            };
        }
        return {
            type: 'bindings',
            bindingsStream: stream,
            metadata,
            variables: variables.map(x => rdf_string_1.termToString(x)),
            canContainUndefs: true,
        };
    }
}
exports.ActorQueryOperationSparqlEndpoint = ActorQueryOperationSparqlEndpoint;
ActorQueryOperationSparqlEndpoint.FACTORY = new sparqlalgebrajs_1.Factory();
//# sourceMappingURL=ActorQueryOperationSparqlEndpoint.js.map