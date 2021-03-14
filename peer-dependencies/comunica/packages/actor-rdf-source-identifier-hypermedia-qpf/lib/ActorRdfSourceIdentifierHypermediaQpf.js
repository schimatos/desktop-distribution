"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfSourceIdentifierHypermediaQpf = void 0;
const bus_http_1 = require("@comunica/bus-http");
const bus_rdf_source_identifier_1 = require("@comunica/bus-rdf-source-identifier");
require("cross-fetch/polyfill");
/**
 * A comunica Hypermedia Qpf RDF Source Identifier Actor.
 */
class ActorRdfSourceIdentifierHypermediaQpf extends bus_rdf_source_identifier_1.ActorRdfSourceIdentifier {
    constructor(args) {
        super(args);
    }
    async test(action) {
        const sourceUrl = this.getSourceUrl(action);
        const headers = new Headers();
        headers.append('Accept', this.acceptHeader);
        const httpAction = { context: action.context, input: sourceUrl, init: { headers } };
        const httpResponse = await this.mediatorHttp.mediate(httpAction);
        if (httpResponse.ok && httpResponse.body) {
            const stream = bus_http_1.ActorHttp.toNodeReadable(httpResponse.body);
            const body = await require('stream-to-string')(stream);
            // Check if body contains all required things
            let valid = true;
            for (const line of this.toContain) {
                if (!body.includes(line)) {
                    valid = false;
                    break;
                }
            }
            if (valid) {
                return { priority: this.priority };
            }
        }
        // Avoid memory leaks
        if (httpResponse.body) {
            await httpResponse.body.cancel();
        }
        throw new Error(`${sourceUrl} is not a (QPF) hypermedia interface`);
    }
    async run(action) {
        return { sourceType: 'hypermedia' };
    }
}
exports.ActorRdfSourceIdentifierHypermediaQpf = ActorRdfSourceIdentifierHypermediaQpf;
//# sourceMappingURL=ActorRdfSourceIdentifierHypermediaQpf.js.map