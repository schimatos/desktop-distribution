"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorSparqlSerializeRdf = void 0;
const bus_sparql_serialize_1 = require("@comunica/bus-sparql-serialize");
/**
 * A comunica RDF SPARQL Serialize Actor.
 *
 * It serializes quad streams (for example resulting from a CONSTRUCT query)
 * to an RDF syntax.
 */
class ActorSparqlSerializeRdf extends bus_sparql_serialize_1.ActorSparqlSerialize {
    constructor(args) {
        super(args);
    }
    async testHandle(action, mediaType, context) {
        // Check if we are provided with a quad stream
        if (action.type !== 'quads') {
            throw new Error(`Actor ${this.name} can only handle quad streams`);
        }
        // Check if the given media type can be handled
        const { mediaTypes } = await this.mediatorMediaTypeCombiner.mediate({ context, mediaTypes: true });
        if (!(mediaType in mediaTypes)) {
            throw new Error(`Actor ${this.name} can not handle media type ${mediaType}. All available types: ${Object.keys(mediaTypes)}`);
        }
        return true;
    }
    async runHandle(action, mediaType, context) {
        // Delegate handling to the mediator
        return (await this.mediatorRdfSerialize.mediate({
            context,
            handle: action,
            handleMediaType: mediaType,
        })).handle;
    }
    async testMediaType(context) {
        return true;
    }
    async getMediaTypes(context) {
        return (await this.mediatorMediaTypeCombiner.mediate({ context, mediaTypes: true })).mediaTypes;
    }
    async testMediaTypeFormats(context) {
        return true;
    }
    async getMediaTypeFormats(context) {
        return (await this.mediatorMediaTypeFormatCombiner.mediate({ context, mediaTypeFormats: true })).mediaTypeFormats;
    }
}
exports.ActorSparqlSerializeRdf = ActorSparqlSerializeRdf;
//# sourceMappingURL=ActorSparqlSerializeRdf.js.map