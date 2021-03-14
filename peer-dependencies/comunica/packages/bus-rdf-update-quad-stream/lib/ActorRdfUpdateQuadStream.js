"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfUpdateQuadStream = void 0;
const core_1 = require("@comunica/core");
/**
 * A comunica actor for rdf-update-quads events.
 *
 * Actor types:
 * * Input:  IActionRdfUpdateQuads:      Primary quad stream and streams of quads to be inserted and deleted.
 * * Test:   <none>
 * * Output: IActorRdfUpdateQuadsOutput: Streams of quads that were inserted and deleted.
 *
 * @see IActionRdfUpdateQuads
 * @see IActorRdfUpdateQuadsOutput
 */
class ActorRdfUpdateQuadStream extends core_1.Actor {
    constructor(args) {
        super(args);
    }
}
exports.ActorRdfUpdateQuadStream = ActorRdfUpdateQuadStream;
//# sourceMappingURL=ActorRdfUpdateQuadStream.js.map