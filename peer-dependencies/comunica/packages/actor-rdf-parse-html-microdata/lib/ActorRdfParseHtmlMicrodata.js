"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfParseHtmlMicrodata = void 0;
const bus_rdf_parse_html_1 = require("@comunica/bus-rdf-parse-html");
const microdata_rdf_streaming_parser_1 = require("microdata-rdf-streaming-parser");
/**
 * A comunica Microdata RDF Parse Html Actor.
 */
class ActorRdfParseHtmlMicrodata extends bus_rdf_parse_html_1.ActorRdfParseHtml {
    constructor(args) {
        super(args);
    }
    async test(action) {
        return true;
    }
    async run(action) {
        const mediaType = action.headers ? action.headers.get('content-type') : null;
        const xmlMode = mediaType === null || mediaType === void 0 ? void 0 : mediaType.includes('xml');
        const htmlParseListener = new microdata_rdf_streaming_parser_1.MicrodataRdfParser({ baseIRI: action.baseIRI, xmlMode });
        htmlParseListener.on('error', action.error);
        htmlParseListener.on('data', action.emit);
        const onTagEndOld = htmlParseListener.onEnd;
        htmlParseListener.onEnd = () => {
            onTagEndOld.call(htmlParseListener);
            action.end();
        };
        return { htmlParseListener };
    }
}
exports.ActorRdfParseHtmlMicrodata = ActorRdfParseHtmlMicrodata;
//# sourceMappingURL=ActorRdfParseHtmlMicrodata.js.map