"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorSparqlSerialize = void 0;
const actor_abstract_mediatyped_1 = require("@comunica/actor-abstract-mediatyped");
/**
 * A comunica actor for sparql-serialize events.
 *
 * Actor types:
 * * Input:  IActionSparqlSerialize:      SPARQL bindings or a quad stream.
 * * Test:   <none>
 * * Output: IActorSparqlSerializeOutput: A text stream.
 *
 * @see IActionSparqlSerialize
 * @see IActorSparqlSerializeOutput
 */
class ActorSparqlSerialize extends actor_abstract_mediatyped_1.ActorAbstractMediaTyped {
    constructor(args) {
        super(args);
    }
}
exports.ActorSparqlSerialize = ActorSparqlSerialize;
//# sourceMappingURL=ActorSparqlSerialize.js.map