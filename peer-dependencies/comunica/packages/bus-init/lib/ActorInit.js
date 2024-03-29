"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorInit = void 0;
const core_1 = require("@comunica/core");
/**
 * A base actor for listening to init events.
 *
 * Actor types:
 * * Input:  IActionInit:      Contains process information
 *                             such as the list of arguments,
 *                             environment variables and input stream.
 * * Test:   <none>
 * * Output: IActorOutputInit: Contains process output streams.
 *
 * @see IActionInit
 */
class ActorInit extends core_1.Actor {
    constructor(args) {
        super(args);
    }
}
exports.ActorInit = ActorInit;
//# sourceMappingURL=ActorInit.js.map