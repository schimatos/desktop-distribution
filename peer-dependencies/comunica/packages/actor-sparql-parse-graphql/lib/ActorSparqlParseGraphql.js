"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorSparqlParseGraphql = void 0;
const bus_sparql_parse_1 = require("@comunica/bus-sparql-parse");
const graphql_to_sparql_1 = require("graphql-to-sparql");
/**
 * A comunica GraphQL SPARQL Parse Actor.
 */
class ActorSparqlParseGraphql extends bus_sparql_parse_1.ActorSparqlParse {
    constructor(args) {
        super(args);
        this.graphqlToSparql = new graphql_to_sparql_1.Converter({ requireContext: true });
    }
    async test(action) {
        if (action.queryFormat !== 'graphql') {
            throw new Error('This actor can only parse GraphQL queries');
        }
        return true;
    }
    async run(action) {
        const context = action.context && action.context.has('@context') ? action.context.get('@context') : {};
        const options = {
            singularizeVariables: action.context && action.context.get('@comunica/actor-init-sparql:singularizeVariables'),
        };
        return { operation: await this.graphqlToSparql.graphqlToSparqlAlgebra(action.query, context, options) };
    }
}
exports.ActorSparqlParseGraphql = ActorSparqlParseGraphql;
//# sourceMappingURL=ActorSparqlParseGraphql.js.map