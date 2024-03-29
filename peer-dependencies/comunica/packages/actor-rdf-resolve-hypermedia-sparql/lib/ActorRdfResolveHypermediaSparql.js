"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfResolveHypermediaSparql = void 0;
const bus_rdf_resolve_hypermedia_1 = require("@comunica/bus-rdf-resolve-hypermedia");
const RdfSourceSparql_1 = require("./RdfSourceSparql");
/**
 * A comunica SPARQL RDF Resolve Hypermedia Actor.
 */
class ActorRdfResolveHypermediaSparql extends bus_rdf_resolve_hypermedia_1.ActorRdfResolveHypermedia {
    constructor(args) {
        super(args, 'sparql');
    }
    async testMetadata(action) {
        if (!action.forceSourceType && !action.metadata.sparqlService &&
            !(this.checkUrlSuffix && action.url.endsWith('/sparql'))) {
            throw new Error(`Actor ${this.name} could not detect a SPARQL service description or URL ending on /sparql.`);
        }
        return { filterFactor: 1 };
    }
    async run(action) {
        this.logInfo(action.context, `Identified as sparql source: ${action.url}`);
        const source = new RdfSourceSparql_1.RdfSourceSparql(action.metadata.sparqlService || action.url, action.context, this.mediatorHttp);
        return { source };
    }
}
exports.ActorRdfResolveHypermediaSparql = ActorRdfResolveHypermediaSparql;
//# sourceMappingURL=ActorRdfResolveHypermediaSparql.js.map