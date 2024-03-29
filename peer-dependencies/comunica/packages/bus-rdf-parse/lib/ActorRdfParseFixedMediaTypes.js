"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfParseFixedMediaTypes = void 0;
const actor_abstract_mediatyped_1 = require("@comunica/actor-abstract-mediatyped");
/**
 * A base actor for listening to RDF parse events that has fixed media types.
 *
 * Actor types:
 * * Input:  IActionRdfParseOrMediaType:      A parse input or a media type input.
 * * Test:   <none>
 * * Output: IActorOutputRdfParseOrMediaType: The parsed quads.
 *
 * @see IActionInit
 */
class ActorRdfParseFixedMediaTypes extends actor_abstract_mediatyped_1.ActorAbstractMediaTypedFixed {
    constructor(args) {
        super(args);
    }
    async testHandleChecked(action) {
        return true;
    }
}
exports.ActorRdfParseFixedMediaTypes = ActorRdfParseFixedMediaTypes;
//# sourceMappingURL=ActorRdfParseFixedMediaTypes.js.map