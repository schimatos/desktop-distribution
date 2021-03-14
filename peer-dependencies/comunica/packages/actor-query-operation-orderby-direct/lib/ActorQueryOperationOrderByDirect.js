"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorQueryOperationOrderByDirect = void 0;
const SparqlExpressionEvaluator = __importStar(require("@comunica/actor-query-operation-filter-direct"));
const bus_query_operation_1 = require("@comunica/bus-query-operation");
const rdf_string_1 = require("rdf-string");
const sparqlalgebrajs_1 = require("sparqlalgebrajs");
const SortIterator_1 = require("./SortIterator");
/**
 * A comunica OrderBy Direct Query Operation Actor.
 */
class ActorQueryOperationOrderByDirect extends bus_query_operation_1.ActorQueryOperationTypedMediated {
    constructor(args) {
        var _a;
        super(args, 'orderby');
        this.window = (_a = args.window) !== null && _a !== void 0 ? _a : Infinity;
    }
    async testOperation(pattern, context) {
        // Will throw error for unsupported operators
        for (let expr of pattern.expressions) {
            // Remove descending operator
            if (expr.expressionType === sparqlalgebrajs_1.Algebra.expressionTypes.OPERATOR) {
                const op = expr;
                if (op.operator === 'desc') {
                    expr = op.args[0];
                }
            }
            SparqlExpressionEvaluator.createEvaluator(expr);
        }
        return true;
    }
    async runOperation(pattern, context) {
        const output = bus_query_operation_1.ActorQueryOperation.getSafeBindings(await this.mediatorQueryOperation.mediate({ operation: pattern.input, context }));
        const options = { window: this.window };
        let { bindingsStream } = output;
        for (let expr of pattern.expressions) {
            let ascending = true;
            if (expr.expressionType === sparqlalgebrajs_1.Algebra.expressionTypes.OPERATOR) {
                const op = expr;
                if (op.operator === 'desc') {
                    ascending = false;
                    expr = op.args[0];
                }
            }
            const order = SparqlExpressionEvaluator.createEvaluator(expr);
            bindingsStream = new SortIterator_1.SortIterator(bindingsStream, (left, right) => {
                const orderA = rdf_string_1.termToString(order(left));
                const orderB = rdf_string_1.termToString(order(right));
                if (!orderA || !orderB) {
                    return 0;
                }
                return orderA > orderB === ascending ? 1 : -1;
            }, options);
        }
        return {
            type: 'bindings',
            bindingsStream,
            metadata: output.metadata,
            variables: output.variables,
            canContainUndefs: output.canContainUndefs,
        };
    }
}
exports.ActorQueryOperationOrderByDirect = ActorQueryOperationOrderByDirect;
//# sourceMappingURL=ActorQueryOperationOrderByDirect.js.map