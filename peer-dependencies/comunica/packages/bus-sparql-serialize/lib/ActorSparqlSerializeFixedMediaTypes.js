"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorSparqlSerializeFixedMediaTypes = void 0;
const actor_abstract_mediatyped_1 = require("@comunica/actor-abstract-mediatyped");
/**
 * A base actor for listening to SPARQL serialize events that has fixed media types.
 *
 * Actor types:
 * * Input:  IActionSparqlSerializeOrMediaType:      A serialize input or a media type input.
 * * Test:   <none>
 * * Output: IActorSparqlSerializeOutputOrMediaType: The serialized quads.
 *
 * @see IActionInit
 */
class ActorSparqlSerializeFixedMediaTypes extends actor_abstract_mediatyped_1.ActorAbstractMediaTypedFixed {
    constructor(args) {
        super(args);
    }
    async testHandleChecked(action, context) {
        return true;
    }
}
exports.ActorSparqlSerializeFixedMediaTypes = ActorSparqlSerializeFixedMediaTypes;
//# sourceMappingURL=ActorSparqlSerializeFixedMediaTypes.js.map