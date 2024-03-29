"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfSourceIdentifierFileContentType = void 0;
const bus_rdf_source_identifier_1 = require("@comunica/bus-rdf-source-identifier");
/**
 * A comunica File Content Type RDF Source Identifier Actor.
 */
class ActorRdfSourceIdentifierFileContentType extends bus_rdf_source_identifier_1.ActorRdfSourceIdentifier {
    constructor(args) {
        super(args);
    }
    async test(action) {
        const sourceUrl = this.getSourceUrl(action);
        const headers = new Headers();
        headers.append('Accept', this.allowedMediaTypes.join(','));
        const httpAction = { context: action.context,
            init: { headers, method: 'HEAD' },
            input: sourceUrl };
        const httpResponse = await this.mediatorHttp.mediate(httpAction);
        if (!httpResponse.ok || (httpResponse.headers.has('Content-Type') &&
            !this.allowedMediaTypes.find((mediaType) => {
                const contentType = httpResponse.headers.get('Content-Type');
                return contentType && contentType.includes(mediaType);
            }))) {
            throw new Error(`${sourceUrl} (${httpResponse.headers.get('Content-Type')}) \
is not an RDF file of valid content type: ${this.allowedMediaTypes}`);
        }
        return { priority: this.priority };
    }
    async run(action) {
        return { sourceType: 'file' };
    }
}
exports.ActorRdfSourceIdentifierFileContentType = ActorRdfSourceIdentifierFileContentType;
//# sourceMappingURL=ActorRdfSourceIdentifierFileContentType.js.map