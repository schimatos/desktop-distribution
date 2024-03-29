"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfResolveHypermedia = void 0;
const core_1 = require("@comunica/core");
/**
 * A comunica actor for rdf-resolve-hypermedia bus.
 *
 * Actor types:
 * * Input:  IActionRdfResolveHypermedia:      The metadata in the document and a query operation.
 * * Test:   <none>
 * * Output: IActorRdfResolveHypermediaOutput: An RDF source.
 *
 * @see IActionRdfResolveQuadPattern
 * @see IActorRdfResolveQuadPatternOutput
 */
class ActorRdfResolveHypermedia extends core_1.Actor {
    constructor(args, sourceType) {
        super(args);
        this.sourceType = sourceType;
    }
    async test(action) {
        if (action.forceSourceType && this.sourceType !== action.forceSourceType) {
            throw new Error(`Actor ${this.name} is not able to handle source type ${action.forceSourceType}.`);
        }
        return this.testMetadata(action);
    }
}
exports.ActorRdfResolveHypermedia = ActorRdfResolveHypermedia;
//# sourceMappingURL=ActorRdfResolveHypermedia.js.map