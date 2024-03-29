"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfDereferencePaged = void 0;
const core_1 = require("@comunica/core");
/**
 * A base actor for dereferencing URLs to quad streams and following pages.
 *
 * Actor types:
 * * Input:  IActionRdfDereferencePaged:      A URL.
 * * Test:   <none>
 * * Output: IActorRdfDereferencePagedOutput: A quad data and optional metadata stream
 *
 * @see IActionRdfDereference
 * @see IActorRdfDereferenceOutput
 */
class ActorRdfDereferencePaged extends core_1.Actor {
    constructor(args) {
        super(args);
    }
}
exports.ActorRdfDereferencePaged = ActorRdfDereferencePaged;
//# sourceMappingURL=ActorRdfDereferencePaged.js.map