"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfResolveHypermediaLinksNext = void 0;
const bus_rdf_resolve_hypermedia_links_1 = require("@comunica/bus-rdf-resolve-hypermedia-links");
/**
 * A comunica Next RDF Resolve Hypermedia Links Actor.
 */
class ActorRdfResolveHypermediaLinksNext extends bus_rdf_resolve_hypermedia_links_1.ActorRdfResolveHypermediaLinks {
    constructor(args) {
        super(args);
    }
    async test(action) {
        if (!action.metadata.next) {
            throw new Error(`Actor ${this.name} requires a 'next' metadata entry.`);
        }
        return true;
    }
    async run(action) {
        return { urls: [action.metadata.next] };
    }
}
exports.ActorRdfResolveHypermediaLinksNext = ActorRdfResolveHypermediaLinksNext;
//# sourceMappingURL=ActorRdfResolveHypermediaLinksNext.js.map