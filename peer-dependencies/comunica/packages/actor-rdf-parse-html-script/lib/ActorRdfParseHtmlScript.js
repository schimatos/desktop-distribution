"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfParseHtmlScript = void 0;
const bus_rdf_parse_html_1 = require("@comunica/bus-rdf-parse-html");
const HtmlScriptListener_1 = require("./HtmlScriptListener");
/**
 * A HTML script RDF Parse actor that listens on the 'rdf-parse' bus.
 *
 * It is able to extract and parse any RDF serialization from script tags in HTML files
 * and announce the presence of them by media type.
 */
class ActorRdfParseHtmlScript extends bus_rdf_parse_html_1.ActorRdfParseHtml {
    constructor(args) {
        super(args);
    }
    async test(action) {
        return true;
    }
    async run(action) {
        const supportedTypes = (await this.mediatorRdfParseMediatypes
            .mediate({ context: action.context, mediaTypes: true })).mediaTypes;
        const htmlParseListener = new HtmlScriptListener_1.HtmlScriptListener(this.mediatorRdfParseHandle, action.emit, action.error, action.end, supportedTypes, action.context, action.baseIRI, action.headers);
        return { htmlParseListener };
    }
}
exports.ActorRdfParseHtmlScript = ActorRdfParseHtmlScript;
//# sourceMappingURL=ActorRdfParseHtmlScript.js.map