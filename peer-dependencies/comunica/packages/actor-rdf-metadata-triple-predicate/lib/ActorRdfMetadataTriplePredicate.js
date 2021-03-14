"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfMetadataTriplePredicate = void 0;
const bus_rdf_metadata_1 = require("@comunica/bus-rdf-metadata");
/**
 * An RDF Metadata Actor that splits off the metadata based on the existence of a preconfigured set of predicates
 * with the page url as subject.
 */
class ActorRdfMetadataTriplePredicate extends bus_rdf_metadata_1.ActorRdfMetadataQuadPredicate {
    constructor(args) {
        super(args);
    }
    async test(action) {
        return true;
    }
    isMetadata(quad, url, context) {
        if (quad.subject.value === url) {
            return true;
        }
        for (const regex of this.predicateRegexes) {
            // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
            if (quad.predicate.value.match(regex)) {
                return true;
            }
        }
        return false;
    }
}
exports.ActorRdfMetadataTriplePredicate = ActorRdfMetadataTriplePredicate;
//# sourceMappingURL=ActorRdfMetadataTriplePredicate.js.map