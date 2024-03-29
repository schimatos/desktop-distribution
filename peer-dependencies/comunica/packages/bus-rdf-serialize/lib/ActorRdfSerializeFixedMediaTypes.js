"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfSerializeFixedMediaTypes = void 0;
const actor_abstract_mediatyped_1 = require("@comunica/actor-abstract-mediatyped");
/**
 * A base actor for listening to RDF serialize events that has fixed media types.
 *
 * Actor types:
 * * Input:  IActionRdfSerializeOrMediaType:      A serialize input or a media type input.
 * * Test:   <none>
 * * Output: IActorRdfSerializeOutputOrMediaType: The serialized quads.
 *
 * @see IActionInit
 */
class ActorRdfSerializeFixedMediaTypes extends actor_abstract_mediatyped_1.ActorAbstractMediaTypedFixed {
    constructor(args) {
        super(args);
    }
    async testHandleChecked(action) {
        return true;
    }
}
exports.ActorRdfSerializeFixedMediaTypes = ActorRdfSerializeFixedMediaTypes;
//# sourceMappingURL=ActorRdfSerializeFixedMediaTypes.js.map