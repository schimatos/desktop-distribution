"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorSparqlParseAlgebra = void 0;
const bus_sparql_parse_1 = require("@comunica/bus-sparql-parse");
const sparqlalgebrajs_1 = require("sparqlalgebrajs");
const sparqljs_1 = require("sparqljs");
/**
 * A comunica Algebra SPARQL Parse Actor.
 */
class ActorSparqlParseAlgebra extends bus_sparql_parse_1.ActorSparqlParse {
    constructor(args) {
        super(args);
        this.prefixes = Object.freeze(this.prefixes);
    }
    async test(action) {
        if (action.queryFormat && action.queryFormat !== 'sparql') {
            throw new Error('This actor can only parse SPARQL queries');
        }
        return true;
    }
    async run(action) {
        const parser = new sparqljs_1.Parser({ prefixes: this.prefixes, baseIRI: action.baseIRI });
        // Resets the identifier counter used for blank nodes
        // provides nicer and more consistent output if there are multiple calls
        parser._resetBlanks();
        const parsedSyntax = parser.parse(action.query);
        const baseIRI = parsedSyntax.type === 'query' ? parsedSyntax.base : undefined;
        return {
            baseIRI,
            operation: sparqlalgebrajs_1.translate(parsedSyntax, { quads: true, prefixes: this.prefixes, blankToVariable: true, baseIRI: action.baseIRI }),
        };
    }
}
exports.ActorSparqlParseAlgebra = ActorSparqlParseAlgebra;
//# sourceMappingURL=ActorSparqlParseAlgebra.js.map