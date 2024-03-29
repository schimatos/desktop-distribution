"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorQueryOperationBgpSingle = void 0;
const bus_query_operation_1 = require("@comunica/bus-query-operation");
/**
 * A comunica Query Operation Actor for BGPs with a single pattern.
 */
class ActorQueryOperationBgpSingle extends bus_query_operation_1.ActorQueryOperationTypedMediated {
    constructor(args) {
        super(args, 'bgp');
    }
    async testOperation(pattern, context) {
        if (pattern.patterns.length !== 1) {
            throw new Error(`Actor ${this.name} can only operate on BGPs with a single pattern.`);
        }
        return true;
    }
    runOperation(pattern, context) {
        // If we have parent metadata, extract the single parent metadata entry.
        if (context && context.has(bus_query_operation_1.KEY_CONTEXT_BGP_PARENTMETADATA)) {
            const metadatas = context.get(bus_query_operation_1.KEY_CONTEXT_BGP_PARENTMETADATA);
            context = context.delete(bus_query_operation_1.KEY_CONTEXT_BGP_PARENTMETADATA);
            context = context.set(bus_query_operation_1.KEY_CONTEXT_PATTERN_PARENTMETADATA, metadatas[0]);
        }
        return this.mediatorQueryOperation.mediate({ operation: pattern.patterns[0], context });
    }
}
exports.ActorQueryOperationBgpSingle = ActorQueryOperationBgpSingle;
//# sourceMappingURL=ActorQueryOperationBgpSingle.js.map