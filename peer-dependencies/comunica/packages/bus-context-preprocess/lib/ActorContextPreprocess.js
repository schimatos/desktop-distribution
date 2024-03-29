"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorContextPreprocess = void 0;
const core_1 = require("@comunica/core");
/**
 * A comunica actor for context-preprocess events.
 *
 * Actor types:
 * * Input:  IActionContextPreprocess:      A context that will be processed.
 * * Test:   <none>
 * * Output: IActorContextPreprocessOutput: The resulting context.
 *
 * @see IActionContextPreprocess
 * @see IActorContextPreprocessOutput
 */
class ActorContextPreprocess extends core_1.Actor {
    constructor(args) {
        super(args);
    }
}
exports.ActorContextPreprocess = ActorContextPreprocess;
//# sourceMappingURL=ActorContextPreprocess.js.map