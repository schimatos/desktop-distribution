"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorQueryOperationService = void 0;
const bus_query_operation_1 = require("@comunica/bus-query-operation");
const bus_rdf_resolve_quad_pattern_1 = require("@comunica/bus-rdf-resolve-quad-pattern");
const core_1 = require("@comunica/core");
const asynciterator_1 = require("asynciterator");
/**
 * A comunica Service Query Operation Actor.
 * It unwraps the SERVICE operation and executes it on the given source.
 */
class ActorQueryOperationService extends bus_query_operation_1.ActorQueryOperationTypedMediated {
    constructor(args) {
        super(args, 'service');
    }
    async testOperation(pattern, context) {
        if (pattern.name.termType !== 'NamedNode') {
            throw new Error(`${this.name} can only query services by IRI, while a ${pattern.name.termType} was given.`);
        }
        return true;
    }
    async runOperation(pattern, context) {
        const endpoint = pattern.name.value;
        // Adjust our context to only have the endpoint as source
        context = context || core_1.ActionContext({});
        let subContext = context.delete(bus_rdf_resolve_quad_pattern_1.KEY_CONTEXT_SOURCE).delete(bus_rdf_resolve_quad_pattern_1.KEY_CONTEXT_SOURCES);
        const sourceType = this.forceSparqlEndpoint ? 'sparql' : 'auto';
        subContext = subContext.set(bus_rdf_resolve_quad_pattern_1.KEY_CONTEXT_SOURCES, [{ type: sourceType, value: endpoint }]);
        // Query the source
        let output;
        try {
            output = bus_query_operation_1.ActorQueryOperation.getSafeBindings(await this.mediatorQueryOperation.mediate({ operation: pattern.input, context: subContext }));
        }
        catch (error) {
            if (pattern.silent) {
                // Emit a single empty binding
                output = {
                    bindingsStream: new asynciterator_1.SingletonIterator(bus_query_operation_1.Bindings({})),
                    type: 'bindings',
                    variables: [],
                    canContainUndefs: false,
                };
            }
            else {
                throw error;
            }
        }
        return output;
    }
}
exports.ActorQueryOperationService = ActorQueryOperationService;
//# sourceMappingURL=ActorQueryOperationService.js.map