"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfMetadataExtract = void 0;
const core_1 = require("@comunica/core");
/**
 * A comunica actor for rdf-metadata-extract events.
 *
 * Actor types:
 * * Input:  IActionRdfMetadataExtract:      A metadata quad stream
 * * Test:   <none>
 * * Output: IActorRdfMetadataExtractOutput: A metadata hash.
 *
 * @see IActionRdfDereference
 * @see IActorRdfDereferenceOutput
 */
class ActorRdfMetadataExtract extends core_1.Actor {
    constructor(args) {
        super(args);
    }
}
exports.ActorRdfMetadataExtract = ActorRdfMetadataExtract;
//# sourceMappingURL=ActorRdfMetadataExtract.js.map