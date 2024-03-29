"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfParseHtml = void 0;
const core_1 = require("@comunica/core");
/**
 * A comunica actor for rdf-parse-html events.
 *
 * Actor types:
 * * Input:  IActionRdfParseHtml:      Callbacks for parsing results.
 * * Test:   <none>
 * * Output: IActorRdfParseHtmlOutput: An HTML event listeners.
 *
 * @see IActionRdfParseHtml
 * @see IActorRdfParseHtmlOutput
 */
class ActorRdfParseHtml extends core_1.Actor {
    constructor(args) {
        super(args);
    }
}
exports.ActorRdfParseHtml = ActorRdfParseHtml;
//# sourceMappingURL=ActorRdfParseHtml.js.map