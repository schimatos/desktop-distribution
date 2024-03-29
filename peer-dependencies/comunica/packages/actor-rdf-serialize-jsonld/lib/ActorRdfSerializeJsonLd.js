"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfSerializeJsonLd = void 0;
const bus_rdf_serialize_1 = require("@comunica/bus-rdf-serialize");
const jsonld_streaming_serializer_1 = require("jsonld-streaming-serializer");
/**
 * A comunica Jsonld RDF Serialize Actor.
 */
class ActorRdfSerializeJsonLd extends bus_rdf_serialize_1.ActorRdfSerializeFixedMediaTypes {
    constructor(args) {
        super(args);
    }
    async runHandle(action, mediaType, context) {
        const data = new jsonld_streaming_serializer_1.JsonLdSerializer({ space: ' '.repeat(this.jsonStringifyIndentSpaces) }).import(action.quadStream);
        return { data };
    }
}
exports.ActorRdfSerializeJsonLd = ActorRdfSerializeJsonLd;
//# sourceMappingURL=ActorRdfSerializeJsonLd.js.map