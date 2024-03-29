"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorQueryOperationTypedMediated = void 0;
const ActorQueryOperationTyped_1 = require("./ActorQueryOperationTyped");
/**
 * A base implementation for query operation actors for a specific operation type that have a query operation mediator.
 */
class ActorQueryOperationTypedMediated extends ActorQueryOperationTyped_1.ActorQueryOperationTyped {
    constructor(args, operationName) {
        super(args, operationName);
    }
}
exports.ActorQueryOperationTypedMediated = ActorQueryOperationTypedMediated;
//# sourceMappingURL=ActorQueryOperationTypedMediated.js.map