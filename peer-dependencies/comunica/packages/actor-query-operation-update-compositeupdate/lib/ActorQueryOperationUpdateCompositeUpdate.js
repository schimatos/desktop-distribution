"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorQueryOperationUpdateCompositeUpdate = void 0;
const bus_query_operation_1 = require("@comunica/bus-query-operation");
/**
 * A comunica Update CompositeUpdate Query Operation Actor.
 */
class ActorQueryOperationUpdateCompositeUpdate extends bus_query_operation_1.ActorQueryOperationTypedMediated {
    constructor(args) {
        super(args, 'compositeupdate');
    }
    async testOperation(pattern, context) {
        return true;
    }
    async runOperation(pattern, context) {
        // console.log("running composite update");
        // TODO: create transaction
        const updateResults = await Promise.all(pattern.updates
            .map(operation => this.mediatorQueryOperation.mediate({ operation, context })));
        const quadStreamsInserted = [];
        const quadStreamsDeleted = [];
        for (const update of updateResults) {
            const { quadStreamInserted, quadStreamDeleted } = bus_query_operation_1.ActorQueryOperation.getSafeUpdate(update);
            if (quadStreamInserted) {
                quadStreamsInserted.push(quadStreamInserted);
            }
            if (quadStreamDeleted) {
                quadStreamsDeleted.push(quadStreamDeleted);
            }
        }
        return {
            type: 'update',
            quadStreamInserted: (await this.mediatorJoinQuads.mediate({ quadStreams: quadStreamsInserted })).quads,
            quadStreamDeleted: (await this.mediatorJoinQuads.mediate({ quadStreams: quadStreamsDeleted })).quads,
        };
    }
}
exports.ActorQueryOperationUpdateCompositeUpdate = ActorQueryOperationUpdateCompositeUpdate;
//# sourceMappingURL=ActorQueryOperationUpdateCompositeUpdate.js.map