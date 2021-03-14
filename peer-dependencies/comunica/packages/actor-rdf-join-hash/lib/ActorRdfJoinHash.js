"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfJoinHash = void 0;
const bus_query_operation_1 = require("@comunica/bus-query-operation");
const bus_rdf_join_1 = require("@comunica/bus-rdf-join");
const asyncjoin_1 = require("asyncjoin");
/**
 * A comunica Hash RDF Join Actor.
 */
class ActorRdfJoinHash extends bus_rdf_join_1.ActorRdfJoin {
    constructor(args) {
        super(args, 2);
    }
    /**
     * Creates a hash of the given bindings by concatenating the results of the given variables.
     * This function will not sort the variables and expects them to be in the same order for every call.
     * @param {Bindings} bindings
     * @param {string[]} variables
     * @returns {string}
     */
    static hash(bindings, variables) {
        return variables.map(variable => bindings.get(variable)).join('');
    }
    async getOutput(action) {
        const variables = bus_rdf_join_1.ActorRdfJoin.overlappingVariables(action);
        const join = new asyncjoin_1.HashJoin(action.entries[0].bindingsStream, action.entries[1].bindingsStream, entry => ActorRdfJoinHash.hash(entry, variables), bus_rdf_join_1.ActorRdfJoin.join);
        return {
            type: 'bindings',
            bindingsStream: join,
            variables: bus_rdf_join_1.ActorRdfJoin.joinVariables(action),
            canContainUndefs: false,
        };
    }
    async getIterations(action) {
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        return (await bus_query_operation_1.getMetadata(action.entries[0])).totalItems + (await bus_query_operation_1.getMetadata(action.entries[1])).totalItems;
    }
}
exports.ActorRdfJoinHash = ActorRdfJoinHash;
//# sourceMappingURL=ActorRdfJoinHash.js.map