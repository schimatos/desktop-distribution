"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfJoinQuadsDelegateCombine = void 0;
const bus_rdf_join_quads_1 = require("@comunica/bus-rdf-join-quads");
/**
 * A comunica Delegate Combine RDF Join Quads Actor.
 */
class ActorRdfJoinQuadsDelegateCombine extends bus_rdf_join_quads_1.ActorRdfJoinQuads {
    constructor(args) {
        super(args);
    }
    async getCombineInput(action) {
        let quadStreamUpdates = [];
        for (const quadStream of action.quadStreams) {
            if (quadStream) {
                quadStreamUpdates.push({ type: 'insert', quadStream });
            }
        }
        return {
            trackChanges: false,
            maintainOrder: false,
            avoidDuplicates: true,
            quadStreamUpdates
        };
    }
    async test(action) {
        const published = await this.mediatorRdfCombineQuads.mediateResult(await this.getCombineInput(action));
        this.delegatedActor = published.actor;
        return published.reply;
    }
    async run(action) {
        if (this.delegatedActor) {
            return this.delegatedActor.run(await this.getCombineInput(action));
        }
        return this.mediatorRdfCombineQuads.mediate(await this.getCombineInput(action));
    }
}
exports.ActorRdfJoinQuadsDelegateCombine = ActorRdfJoinQuadsDelegateCombine;
//# sourceMappingURL=ActorRdfJoinQuadsDelegateCombine.js.map