"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorQueryOperationAsk = void 0;
const bus_query_operation_1 = require("@comunica/bus-query-operation");
/**
 * A comunica Ask Query Operation Actor.
 */
class ActorQueryOperationAsk extends bus_query_operation_1.ActorQueryOperationTypedMediated {
    constructor(args) {
        super(args, 'ask');
    }
    async testOperation(pattern, context) {
        return true;
    }
    async runOperation(pattern, context) {
        // Call other query operations like this:
        const output = await this.mediatorQueryOperation.mediate({ operation: pattern.input, context });
        const bindings = bus_query_operation_1.ActorQueryOperation.getSafeBindings(output);
        const booleanResult = new Promise((resolve, reject) => {
            // Resolve to true if we find one element, and close immediately
            bindings.bindingsStream.once('data', () => {
                resolve(true);
                bindings.bindingsStream.close();
            });
            // If we reach the end of the stream without finding anything, resolve to false
            bindings.bindingsStream.on('end', () => resolve(false));
            // Reject if an error occurs in the stream
            bindings.bindingsStream.on('error', reject);
        });
        return { type: 'boolean', booleanResult };
    }
}
exports.ActorQueryOperationAsk = ActorQueryOperationAsk;
//# sourceMappingURL=ActorQueryOperationAsk.js.map