"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfJoinMultiSequential = void 0;
const bus_query_operation_1 = require("@comunica/bus-query-operation");
const bus_rdf_join_1 = require("@comunica/bus-rdf-join");
/**
 * A Multi Sequential RDF Join Actor.
 * It accepts 3 or more streams, joins the first two, and joins the result with the remaining streams.
 */
class ActorRdfJoinMultiSequential extends bus_rdf_join_1.ActorRdfJoin {
    constructor(args) {
        super(args, 3, true);
    }
    async getOutput(action) {
        // Join the two first streams, and then join the result with the remaining streams
        const firstEntry = await this.mediatorJoin.mediate({ entries: [action.entries[0], action.entries[1]] });
        const remainingEntries = action.entries.slice(1);
        remainingEntries[0] = firstEntry;
        return await this.mediatorJoin.mediate({ entries: remainingEntries });
    }
    async getIterations(action) {
        return (await Promise.all(action.entries.map(x => bus_query_operation_1.getMetadata(x))))
            .reduce((acc, value) => acc * value.totalItems, 1);
    }
}
exports.ActorRdfJoinMultiSequential = ActorRdfJoinMultiSequential;
//# sourceMappingURL=ActorRdfJoinMultiSequential.js.map