"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorOptimizeQueryOperation = void 0;
const core_1 = require("@comunica/core");
/**
 * A comunica actor for optimize-query-operation events.
 *
 * Actor types:
 * * Input:  IActionOptimizeQueryOperation:      An incoming SPARQL operation.
 * * Test:   <none>
 * * Output: IActorOptimizeQueryOperationOutput: A (possibly optimized) outgoing SPARQL operation.
 *
 * @see IActionOptimizeQueryOperation
 * @see IActorOptimizeQueryOperationOutput
 */
class ActorOptimizeQueryOperation extends core_1.Actor {
    constructor(args) {
        super(args);
    }
}
exports.ActorOptimizeQueryOperation = ActorOptimizeQueryOperation;
//# sourceMappingURL=ActorOptimizeQueryOperation.js.map