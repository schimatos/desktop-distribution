"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfSourceIdentifier = void 0;
const core_1 = require("@comunica/core");
/**
 * A comunica actor for rdf-source-identifier events.
 *
 * Actor types:
 * * Input:  IActionRdfSourceIdentifier:      The source value to discover the type of.
 * * Test:   <none>
 * * Output: IActorRdfSourceIdentifierOutput: The identified source type.
 *
 * @see IActionRdfSourceIdentifier
 * @see IActorRdfSourceIdentifierOutput
 */
class ActorRdfSourceIdentifier extends core_1.Actor {
    constructor(args) {
        super(args);
    }
    getSourceUrl(action) {
        if (!action.sourceValue.startsWith('http')) {
            throw new Error(`Actor ${this.name} can only detect sources hosted via HTTP(S).`);
        }
        return action.sourceValue.replace(/#.*/u, '');
    }
}
exports.ActorRdfSourceIdentifier = ActorRdfSourceIdentifier;
//# sourceMappingURL=ActorRdfSourceIdentifier.js.map