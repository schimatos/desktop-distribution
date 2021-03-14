"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfSourceIdentifierSparql = void 0;
const bus_rdf_source_identifier_1 = require("@comunica/bus-rdf-source-identifier");
/**
 * A comunica SPARQL RDF Source Identifier Actor.
 */
class ActorRdfSourceIdentifierSparql extends bus_rdf_source_identifier_1.ActorRdfSourceIdentifier {
    constructor(args) {
        super(args);
    }
    async test(action) {
        const sourceUrl = this.getSourceUrl(action);
        const url = `${sourceUrl}?query=${encodeURIComponent('ASK { ?s a ?o }')}`;
        const headers = new Headers();
        headers.append('Accept', 'application/sparql-results+json');
        const httpAction = { context: action.context, input: url, init: { headers, method: 'GET' } };
        const httpResponse = await this.mediatorHttp.mediate(httpAction);
        // No need to process the body. (HEAD requests would be better, but not all endpoints implement that properly)
        if (httpResponse.body) {
            await httpResponse.body.cancel();
        }
        const contentType = httpResponse.headers.get('Content-Type');
        if (!httpResponse.ok || !contentType || !contentType.includes('application/sparql-results+json')) {
            throw new Error(`${sourceUrl} is not a SPARQL endpoint`);
        }
        return { priority: this.priority };
    }
    async run(action) {
        return { sourceType: 'sparql' };
    }
}
exports.ActorRdfSourceIdentifierSparql = ActorRdfSourceIdentifierSparql;
//# sourceMappingURL=ActorRdfSourceIdentifierSparql.js.map