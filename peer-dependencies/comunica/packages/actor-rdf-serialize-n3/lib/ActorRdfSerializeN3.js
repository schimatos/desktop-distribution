"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfSerializeN3 = void 0;
const bus_rdf_serialize_1 = require("@comunica/bus-rdf-serialize");
const n3_1 = require("n3");
/**
 * A comunica N3 RDF Serialize Actor.
 */
class ActorRdfSerializeN3 extends bus_rdf_serialize_1.ActorRdfSerializeFixedMediaTypes {
    constructor(args) {
        super(args);
    }
    async runHandle(action, mediaType, context) {
        // console.log("inside n3 runhandle");
        const data = new n3_1.StreamWriter({ format: mediaType }).import(action.quadStream);
        return { data,
            triples: mediaType === 'text/turtle' ||
                mediaType === 'application/n-triples' ||
                mediaType === 'text/n3' };
    }
}
exports.ActorRdfSerializeN3 = ActorRdfSerializeN3;
//# sourceMappingURL=ActorRdfSerializeN3.js.map