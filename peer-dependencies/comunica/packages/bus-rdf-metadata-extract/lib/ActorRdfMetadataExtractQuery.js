"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfMetadataExtractQuery = void 0;
const graphql_ld_1 = require("graphql-ld");
const rdf_store_stream_1 = require("rdf-store-stream");
const ActorRdfMetadataExtract_1 = require("./ActorRdfMetadataExtract");
const GraphQlQueryEngine_1 = require("./GraphQlQueryEngine");
/**
 * An {@link ActorRdfMetadataExtract} that extracts metadata based on a GraphQL-LD query.
 *
 * It exposes the {@link #queryData} method using which a query can be applied over the metadata stream.
 * For efficiency reasons, the query (and JSON-LD context) must be passed via the actor constructor
 * so that these can be pre-compiled.
 *
 * @see ActorRdfMetadataExtract
 */
class ActorRdfMetadataExtractQuery extends ActorRdfMetadataExtract_1.ActorRdfMetadataExtract {
    constructor(context, query, args) {
        super(args);
        // Pre-parse GraphQL-LD query
        this.graphqlClient = new graphql_ld_1.Client({
            context,
            queryEngine: new GraphQlQueryEngine_1.GraphQlQueryEngine(this.queryEngine),
        });
        this.sparqlOperation = this.graphqlClient.graphQlToSparql({ query });
    }
    /**
     * Execute the configured query on the given metadata stream.
     * @param {RDF.Stream} dataStream A quad stream to query on.
     * @return The GraphQL query results.
     */
    async queryData(dataStream, initialBindings) {
        // Load metadata quads into store
        const store = await rdf_store_stream_1.storeStream(dataStream);
        // Execute query against out in-memory store
        const { data } = await this.graphqlClient.query(Object.assign(Object.assign({}, await this.sparqlOperation), { queryEngineOptions: { source: { type: 'rdfjsSource', value: store }, initialBindings } }));
        return data;
    }
}
exports.ActorRdfMetadataExtractQuery = ActorRdfMetadataExtractQuery;
//# sourceMappingURL=ActorRdfMetadataExtractQuery.js.map