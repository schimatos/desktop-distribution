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
exports.ActorQueryOperationFilterDirect = void 0;
const bus_query_operation_1 = require("@comunica/bus-query-operation");
const SparqlExpressionEvaluator = __importStar(require("./SparqlExpressionEvaluator"));
/**
 * A comunica Filter Direct Query Operation Actor.
 */
class ActorQueryOperationFilterDirect extends bus_query_operation_1.ActorQueryOperationTypedMediated {
    constructor(args) {
        super(args, 'filter');
    }
    async testOperation(pattern) {
        // Will throw error for unsupported operators
        SparqlExpressionEvaluator.createEvaluator(pattern.expression);
        return true;
    }
    async runOperation(pattern, context) {
        const output = bus_query_operation_1.ActorQueryOperation.getSafeBindings(await this.mediatorQueryOperation.mediate({ operation: pattern.input, context }));
        bus_query_operation_1.ActorQueryOperation.validateQueryOutput(output, 'bindings');
        const exprFunc = SparqlExpressionEvaluator.createEvaluator(pattern.expression);
        function filter(bindings) {
            try {
                const term = exprFunc(bindings);
                // eslint-disable-next-line no-implicit-coercion
                return !!term && term.value !== 'false' && term.value !== '0';
            }
            catch (error) {
                bindingsStream.emit('error', error);
                return false;
            }
        }
        const bindingsStream = output.bindingsStream.transform({ filter, autoStart: false });
        return {
            type: 'bindings',
            bindingsStream,
            metadata: output.metadata,
            variables: output.variables,
            canContainUndefs: output.canContainUndefs,
        };
    }
}
exports.ActorQueryOperationFilterDirect = ActorQueryOperationFilterDirect;
//# sourceMappingURL=ActorQueryOperationFilterDirect.js.map