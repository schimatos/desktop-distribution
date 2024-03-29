"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorQueryOperationTyped = exports.KEY_CONTEXT_QUERYOPERATION = void 0;
const ActorQueryOperation_1 = require("./ActorQueryOperation");
/**
 * @type {string} Context entry for the current query operation.
 */
exports.KEY_CONTEXT_QUERYOPERATION = '@comunica/bus-query-operation:operation';
/**
 * A base implementation for query operation actors for a specific operation type.
 */
class ActorQueryOperationTyped extends ActorQueryOperation_1.ActorQueryOperation {
    constructor(args, operationName) {
        super(Object.assign(Object.assign({}, args), { operationName }));
        if (!this.operationName) {
            throw new Error('A valid "operationName" argument must be provided.');
        }
    }
    async test(action) {
        if (!action.operation) {
            throw new Error('Missing field \'operation\' in a query operation action.');
        }
        if (action.operation.type !== this.operationName) {
            throw new Error(`Actor ${this.name} only supports ${this.operationName} operations, but got ${action.operation.type}`);
        }
        const operation = action.operation;
        return this.testOperation(operation, action.context);
    }
    async run(action) {
        const operation = action.operation;
        const subContext = action.context && action.context.set(exports.KEY_CONTEXT_QUERYOPERATION, operation);
        const output = await this.runOperation(operation, subContext);
        if (output.metadata) {
            output.metadata =
                ActorQueryOperation_1.ActorQueryOperation.cachifyMetadata(output.metadata);
        }
        return output;
    }
}
exports.ActorQueryOperationTyped = ActorQueryOperationTyped;
//# sourceMappingURL=ActorQueryOperationTyped.js.map