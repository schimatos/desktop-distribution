"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfMetadataExtractSparqlService = void 0;
const bus_rdf_metadata_extract_1 = require("@comunica/bus-rdf-metadata-extract");
const relative_to_absolute_iri_1 = require("relative-to-absolute-iri");
/**
 * A comunica RDF Metadata Extract Actor for SPARQL service descriptions.
 */
class ActorRdfMetadataExtractSparqlService extends bus_rdf_metadata_extract_1.ActorRdfMetadataExtract {
    constructor(args) {
        super(args);
    }
    async test(action) {
        return true;
    }
    async run(action) {
        return new Promise((resolve, reject) => {
            // Forward errors
            action.metadata.on('error', reject);
            // Immediately resolve when a SPARQL service endpoint URL has been found
            const metadata = {};
            action.metadata.on('data', quad => {
                if (quad.predicate.value === 'http://www.w3.org/ns/sparql-service-description#endpoint' &&
                    (quad.subject.termType === 'BlankNode' || quad.subject.value === action.url)) {
                    metadata.sparqlService = quad.object.termType === 'Literal' ?
                        relative_to_absolute_iri_1.resolve(quad.object.value, action.url) :
                        quad.object.value;
                }
                else if (quad.predicate.value === 'http://www.w3.org/ns/sparql-service-description#defaultGraph') {
                    metadata.defaultGraph = quad.object.value;
                }
            });
            // If no value has been found, emit nothing.
            action.metadata.on('end', () => {
                resolve({ metadata });
            });
        });
    }
}
exports.ActorRdfMetadataExtractSparqlService = ActorRdfMetadataExtractSparqlService;
//# sourceMappingURL=ActorRdfMetadataExtractSparqlService.js.map