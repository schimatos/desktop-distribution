"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorOptimizeQueryOperationJoinBgp = void 0;
const bus_optimize_query_operation_1 = require("@comunica/bus-optimize-query-operation");
const sparqlalgebrajs_1 = require("sparqlalgebrajs");
/**
 * A comunica Join BGP Optimize Query Operation Actor.
 */
class ActorOptimizeQueryOperationJoinBgp extends bus_optimize_query_operation_1.ActorOptimizeQueryOperation {
    constructor(args) {
        super(args);
    }
    async test(action) {
        return true;
    }
    async run(action) {
        const operation = sparqlalgebrajs_1.Util.mapOperation(action.operation, {
            join(op, factory) {
                if (op.left.type === 'bgp' && op.right.type === 'bgp') {
                    return {
                        recurse: false,
                        result: factory.createBgp(op.left.patterns.concat(op.right.patterns)),
                    };
                }
                return {
                    recurse: false,
                    result: op,
                };
            },
        });
        return { operation };
    }
}
exports.ActorOptimizeQueryOperationJoinBgp = ActorOptimizeQueryOperationJoinBgp;
//# sourceMappingURL=ActorOptimizeQueryOperationJoinBgp.js.map