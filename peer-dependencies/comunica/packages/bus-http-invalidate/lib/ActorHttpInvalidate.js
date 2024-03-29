"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorHttpInvalidate = void 0;
const core_1 = require("@comunica/core");
/**
 * A comunica actor for http-invalidate events.
 *
 * Actor types:
 * * Input:  IActionHttpInvalidate:      An action for invalidating the cached contents of given URL.
 * * Test:   <none>
 * * Output: IActorHttpInvalidateOutput: An empty response.
 *
 * @see IActionHttpInvalidate
 * @see IActorHttpInvalidateOutput
 */
class ActorHttpInvalidate extends core_1.Actor {
    constructor(args) {
        super(args);
    }
}
exports.ActorHttpInvalidate = ActorHttpInvalidate;
//# sourceMappingURL=ActorHttpInvalidate.js.map