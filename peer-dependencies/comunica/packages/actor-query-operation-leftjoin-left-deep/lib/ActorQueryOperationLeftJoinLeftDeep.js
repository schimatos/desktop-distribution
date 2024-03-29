"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorQueryOperationLeftJoinLeftDeep = void 0;
const bus_query_operation_1 = require("@comunica/bus-query-operation");
const bus_rdf_join_1 = require("@comunica/bus-rdf-join");
const asynciterator_1 = require("asynciterator");
const sparqlalgebrajs_1 = require("sparqlalgebrajs");
/**
 * A comunica LeftJoin left-deep Query Operation Actor.
 */
class ActorQueryOperationLeftJoinLeftDeep extends bus_query_operation_1.ActorQueryOperationTypedMediated {
    constructor(args) {
        super(args, 'leftjoin');
    }
    /**
     * Create a new bindings stream
     * that takes every binding of the base stream,
     * materializes the remaining patterns with it,
     * and emits all bindings from this new set of patterns.
     * @param {BindingsStream} leftStream The base stream.
     * @param {Algebra.Operation} rightOperation The operation to materialize with each binding of the base stream.
     * @param {Algebra.Operation => Promise<BindingsStream>} operationBinder A callback to retrieve the bindings stream
     *                                                                       of an operation.
     * @return {BindingsStream}
     */
    static createLeftDeepStream(leftStream, rightOperation, operationBinder) {
        return new asynciterator_1.MultiTransformIterator(leftStream, {
            multiTransform(bindings) {
                const bindingsMerger = (subBindings) => subBindings.merge(bindings);
                return new asynciterator_1.TransformIterator(async () => (await operationBinder(bus_query_operation_1.materializeOperation(rightOperation, bindings)))
                    .map(bindingsMerger), { maxBufferSize: 128 });
            },
            optional: true,
        });
    }
    async testOperation(pattern, context) {
        return true;
    }
    async runOperation(pattern, context) {
        // Initiate left and right operations
        // Only the left stream will be used.
        // The right stream is ignored and only its metadata and variables are used.
        const left = bus_query_operation_1.ActorQueryOperation.getSafeBindings(await this.mediatorQueryOperation
            .mediate({ operation: pattern.left, context }));
        const right = bus_query_operation_1.ActorQueryOperation.getSafeBindings(await this.mediatorQueryOperation
            .mediate({ operation: pattern.right, context }));
        // Close the right stream, since we don't need that one
        right.bindingsStream.close();
        // If an expression was defined, wrap the right operation in a filter expression.
        const rightOperation = pattern.expression ?
            ActorQueryOperationLeftJoinLeftDeep.FACTORY.createFilter(pattern.right, pattern.expression) :
            pattern.right;
        // Create a left-deep stream with left and right.
        const bindingsStream = ActorQueryOperationLeftJoinLeftDeep.createLeftDeepStream(left.bindingsStream, rightOperation, async (operation) => bus_query_operation_1.ActorQueryOperation.getSafeBindings(await this.mediatorQueryOperation.mediate({ operation, context })).bindingsStream);
        // Determine variables and metadata
        const variables = bus_rdf_join_1.ActorRdfJoin.joinVariables({ entries: [left, right] });
        const metadata = () => Promise.all([left, right].map(x => bus_query_operation_1.getMetadata(x)))
            .then(metadatas => metadatas.reduce((acc, val) => acc * val.totalItems, 1))
            .catch(() => Infinity)
            .then(totalItems => ({ totalItems }));
        return { type: 'bindings', bindingsStream, metadata, variables, canContainUndefs: true };
    }
}
exports.ActorQueryOperationLeftJoinLeftDeep = ActorQueryOperationLeftJoinLeftDeep;
ActorQueryOperationLeftJoinLeftDeep.FACTORY = new sparqlalgebrajs_1.Factory();
//# sourceMappingURL=ActorQueryOperationLeftJoinLeftDeep.js.map