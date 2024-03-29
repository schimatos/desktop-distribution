"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfMetadata = void 0;
const core_1 = require("@comunica/core");
/**
 * A comunica actor for rdf-metadata events.
 *
 * Actor types:
 * * Input:  IActionRdfMetadata:      An RDF quad stream.
 * * Test:   <none>
 * * Output: IActorRdfMetadataOutput: An RDF quad data stream and RDF quad metadata stream.
 *
 * @see IActionRdfDereference
 * @see IActorRdfDereferenceOutput
 */
class ActorRdfMetadata extends core_1.Actor {
    constructor(args) {
        super(args);
    }
}
exports.ActorRdfMetadata = ActorRdfMetadata;
//# sourceMappingURL=ActorRdfMetadata.js.map