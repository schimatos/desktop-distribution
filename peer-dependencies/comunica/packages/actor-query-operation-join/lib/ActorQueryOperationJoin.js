"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorQueryOperationJoin = void 0;
const bus_query_operation_1 = require("@comunica/bus-query-operation");
/**
 * A comunica Join Query Operation Actor.
 */
class ActorQueryOperationJoin extends bus_query_operation_1.ActorQueryOperationTypedMediated {
    constructor(args) {
        super(args, 'join');
    }
    async testOperation(pattern, context) {
        return true;
    }
    async runOperation(pattern, context) {
        const left = this.mediatorQueryOperation.mediate({ operation: pattern.left, context });
        const right = this.mediatorQueryOperation.mediate({ operation: pattern.right, context });
        return this.mediatorJoin.mediate({
            entries: [bus_query_operation_1.ActorQueryOperation.getSafeBindings(await left), bus_query_operation_1.ActorQueryOperation.getSafeBindings(await right)],
        });
    }
}
exports.ActorQueryOperationJoin = ActorQueryOperationJoin;
//# sourceMappingURL=ActorQueryOperationJoin.js.map