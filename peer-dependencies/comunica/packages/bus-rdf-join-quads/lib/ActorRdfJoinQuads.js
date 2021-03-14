"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfJoinQuads = void 0;
const core_1 = require("@comunica/core");
/**
 * A comunica actor for rdf-join-quads events.
 *
 * Actor types:
 * * Input:  IActionRdfJoinQuads:      A list of Quadstreams to Join
 * * Test:   <none>
 * * Output: IActorRdfJoinQuadsOutput: The resultant stream of joined quads
 *
 * @see IActionRdfJoinQuads
 * @see IActorRdfJoinQuadsOutput
 */
class ActorRdfJoinQuads extends core_1.Actor {
    constructor(args) {
        super(args);
    }
}
exports.ActorRdfJoinQuads = ActorRdfJoinQuads;
//# sourceMappingURL=ActorRdfJoinQuads.js.map