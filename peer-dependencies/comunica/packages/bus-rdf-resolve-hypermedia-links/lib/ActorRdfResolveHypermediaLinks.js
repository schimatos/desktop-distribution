"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfResolveHypermediaLinks = void 0;
const core_1 = require("@comunica/core");
/**
 * A comunica actor for rdf-resolve-hypermedia-links events.
 *
 * Actor types:
 * * Input:  IActionRdfResolveHypermediaLinks:      The metadata from which the links should be extracted.
 * * Test:   <none>
 * * Output: IActorRdfResolveHypermediaLinksOutput: The URLs that were detected.
 *
 * @see IActionRdfResolveHypermediaLinks
 * @see IActorRdfResolveHypermediaLinksOutput
 */
class ActorRdfResolveHypermediaLinks extends core_1.Actor {
    constructor(args) {
        super(args);
    }
}
exports.ActorRdfResolveHypermediaLinks = ActorRdfResolveHypermediaLinks;
//# sourceMappingURL=ActorRdfResolveHypermediaLinks.js.map