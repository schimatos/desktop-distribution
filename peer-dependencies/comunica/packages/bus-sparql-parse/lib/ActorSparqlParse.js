"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorSparqlParse = void 0;
const core_1 = require("@comunica/core");
/**
 * A comunica actor for sparql-parse events.
 *
 * Actor types:
 * * Input:  IActionSparqlParse:      A SPARQL query string.
 * * Test:   <none>
 * * Output: IActorSparqlParseOutput: A parsed query in SPARQL query algebra.
 *
 * @see IActionSparqlParse
 * @see IActorSparqlParseOutput
 */
class ActorSparqlParse extends core_1.Actor {
    constructor(args) {
        super(args);
    }
}
exports.ActorSparqlParse = ActorSparqlParse;
//# sourceMappingURL=ActorSparqlParse.js.map