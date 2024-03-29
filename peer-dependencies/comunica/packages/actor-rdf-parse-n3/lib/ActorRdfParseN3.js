"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfParseN3 = void 0;
const bus_rdf_parse_1 = require("@comunica/bus-rdf-parse");
const n3_1 = require("n3");
/**
 * An N3 RDF Parse actor that listens on the 'rdf-parse' bus.
 *
 * It is able to parse N3-based RDF serializations and announce the presence of them by media type.
 */
class ActorRdfParseN3 extends bus_rdf_parse_1.ActorRdfParseFixedMediaTypes {
    constructor(args) {
        super(args);
    }
    async runHandle(action, mediaType, context) {
        action.input.on('error', error => quads.emit('error', error));
        // console.log('before n3 parse');
        const quads = action.input.pipe(new n3_1.StreamParser({ baseIRI: action.baseIRI }));
        // console.log('after n3 parse');
        return {
            quads,
            triples: mediaType === 'text/turtle' ||
                mediaType === 'application/n-triples' ||
                mediaType === 'text/n3',
        };
    }
}
exports.ActorRdfParseN3 = ActorRdfParseN3;
//# sourceMappingURL=ActorRdfParseN3.js.map