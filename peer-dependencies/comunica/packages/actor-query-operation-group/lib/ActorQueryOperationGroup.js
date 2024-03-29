"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorQueryOperationGroup = void 0;
const bus_query_operation_1 = require("@comunica/bus-query-operation");
const asynciterator_1 = require("asynciterator");
const rdf_string_1 = require("rdf-string");
const sparqlee_1 = require("sparqlee");
const GroupsState_1 = require("./GroupsState");
/**
 * A comunica Group Query Operation Actor.
 */
class ActorQueryOperationGroup extends bus_query_operation_1.ActorQueryOperationTypedMediated {
    constructor(args) {
        super(args, 'group');
    }
    async testOperation(pattern, context) {
        for (const aggregate of pattern.aggregates) {
            // Will throw for unsupported expressions
            const _ = new sparqlee_1.SyncEvaluator(aggregate.expression);
        }
        return true;
    }
    async runOperation(pattern, context) {
        // Get result stream for the input query
        const { input, aggregates } = pattern;
        const outputRaw = await this.mediatorQueryOperation.mediate({ operation: input, context });
        const output = bus_query_operation_1.ActorQueryOperation.getSafeBindings(outputRaw);
        // The variables in scope are the variables on which we group, i.e. pattern.variables.
        // For 'GROUP BY ?x, ?z', this is [?x, ?z], for 'GROUP by expr(?x) as ?e' this is [?e].
        // But also in scope are the variables defined by the aggregations, since GROUP has to handle this.
        const variables = pattern.variables
            .map(x => rdf_string_1.termToString(x))
            .concat(aggregates.map(agg => rdf_string_1.termToString(agg.variable)));
        const sparqleeConfig = Object.assign({}, bus_query_operation_1.ActorQueryOperation.getExpressionContext(context));
        // Return a new promise that completes when the stream has ended or when
        // an error occurs
        return new Promise((resolve, reject) => {
            const groups = new GroupsState_1.GroupsState(pattern, sparqleeConfig);
            // Phase 2: Collect aggregator results
            // We can only return when the binding stream ends, when that happens
            // we return the identified groups. Which are nothing more than Bindings
            // of the grouping variables merged with the aggregate variables
            output.bindingsStream.on('end', () => {
                try {
                    const bindingsStream = new asynciterator_1.ArrayIterator(groups.collectResults(), { autoStart: false });
                    const { metadata } = output;
                    resolve({ type: 'bindings', bindingsStream, metadata, variables, canContainUndefs: output.canContainUndefs });
                }
                catch (error) {
                    reject(error);
                }
            });
            // Make sure to propagate any errors in the binding stream
            output.bindingsStream.on('error', reject);
            // Phase 1: Consume the stream, identify the groups and populate the aggregators.
            // We need to bind this after the 'error' and 'end' listeners to avoid the
            // stream having ended before those listeners are bound.
            output.bindingsStream.on('data', bindings => {
                try {
                    groups.consumeBindings(bindings);
                }
                catch (error) {
                    reject(error);
                }
            });
        });
    }
}
exports.ActorQueryOperationGroup = ActorQueryOperationGroup;
//# sourceMappingURL=ActorQueryOperationGroup.js.map