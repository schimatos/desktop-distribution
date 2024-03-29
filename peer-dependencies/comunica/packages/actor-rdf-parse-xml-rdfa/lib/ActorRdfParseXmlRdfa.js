"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfParseXmlRdfa = void 0;
const bus_rdf_parse_1 = require("@comunica/bus-rdf-parse");
const rdfa_streaming_parser_1 = require("rdfa-streaming-parser");
/**
 * A comunica XML RDFa RDF Parse Actor.
 */
class ActorRdfParseXmlRdfa extends bus_rdf_parse_1.ActorRdfParseFixedMediaTypes {
    constructor(args) {
        super(args);
    }
    async runHandle(action, mediaType, context) {
        var _a;
        const language = (_a = (action.headers && action.headers.get('content-language'))) !== null && _a !== void 0 ? _a : undefined;
        action.input.on('error', error => quads.emit('error', error));
        const quads = action.input.pipe(new rdfa_streaming_parser_1.RdfaParser({ baseIRI: action.baseIRI, profile: 'xml', language }));
        return { quads, triples: true };
    }
}
exports.ActorRdfParseXmlRdfa = ActorRdfParseXmlRdfa;
//# sourceMappingURL=ActorRdfParseXmlRdfa.js.map