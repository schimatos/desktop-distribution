"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfUpdateQuads = void 0;
const core_1 = require("@comunica/core");
/**
 * A comunica actor for rdf-update-quads events.
 *
 * Actor types:
 * * Input:  IActionRdfUpdateQuads:      Streams of quads to be inserted and deleted.
 * * Test:   <none>
 * * Output: IActorRdfUpdateQuadsOutput: Streams of quads that were inserted and deleted.
 *
 * @see IActionRdfUpdateQuads
 * @see IActorRdfUpdateQuadsOutput
 */
class ActorRdfUpdateQuads extends core_1.Actor {
    constructor(args) {
        super(args);
    }
    /**
     * Test function for update quad stream actors.
     */
    async test(action) {
        // If there are no updates to be made then this can be run trivially.
        if (!action.quadStreamInsert && !action.quadStreamDelete) {
            return true;
        }
        return await this.testOperation(action);
    }
    /**
     * Run function for update quad stream actors.
     */
    async run(action) {
        // There are no updates to be made.
        if (!action.quadStreamInsert && !action.quadStreamDelete) {
            return {};
        }
        return await this.runOperation(action);
    }
}
exports.ActorRdfUpdateQuads = ActorRdfUpdateQuads;
//# sourceMappingURL=ActorRdfUpdateQuads.js.map