"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfJoinMultiSmallest = void 0;
const bus_query_operation_1 = require("@comunica/bus-query-operation");
const bus_rdf_join_1 = require("@comunica/bus-rdf-join");
/**
 * A Multi Smallest RDF Join Actor.
 * It accepts 3 or more streams, joins the smallest two, and joins the result with the remaining streams.
 */
class ActorRdfJoinMultiSmallest extends bus_rdf_join_1.ActorRdfJoin {
    constructor(args) {
        super(args, 3, true);
    }
    static getSmallestPatternId(totalItems) {
        let smallestId = -1;
        let smallestCount = Infinity;
        for (const [i, count] of totalItems.entries()) {
            if (count <= smallestCount) {
                smallestCount = count;
                smallestId = i;
            }
        }
        return smallestId;
    }
    async getOutput(action) {
        const entries = action.entries.slice();
        // Determine the two smallest streams by estimated count
        const entriesTotalItems = (await Promise.all(action.entries.map(x => bus_query_operation_1.getMetadata(x))))
            .map(metadata => 'totalItems' in metadata ? metadata.totalItems : Infinity);
        const smallestIndex1 = ActorRdfJoinMultiSmallest.getSmallestPatternId(entriesTotalItems);
        const smallestItem1 = entries.splice(smallestIndex1, 1)[0];
        const smallestCount1 = entriesTotalItems.splice(smallestIndex1, 1);
        const smallestIndex2 = ActorRdfJoinMultiSmallest.getSmallestPatternId(entriesTotalItems);
        const smallestItem2 = entries.splice(smallestIndex2, 1)[0];
        const smallestCount2 = entriesTotalItems.splice(smallestIndex2, 1);
        // Join the two selected streams, and then join the result with the remaining streams
        const firstEntry = await this.mediatorJoin.mediate({ entries: [smallestItem1, smallestItem2] });
        entries.push(firstEntry);
        return await this.mediatorJoin.mediate({ entries });
    }
    async getIterations(action) {
        return (await Promise.all(action.entries.map(x => bus_query_operation_1.getMetadata(x))))
            .reduce((acc, value) => acc * value.totalItems, 1);
    }
}
exports.ActorRdfJoinMultiSmallest = ActorRdfJoinMultiSmallest;
//# sourceMappingURL=ActorRdfJoinMultiSmallest.js.map