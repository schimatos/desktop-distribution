"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorQueryOperationPathAlt = void 0;
const actor_abstract_path_1 = require("@comunica/actor-abstract-path");
const bus_query_operation_1 = require("@comunica/bus-query-operation");
const asynciterator_1 = require("asynciterator");
const sparqlalgebrajs_1 = require("sparqlalgebrajs");
/**
 * A comunica Path Alt Query Operation Actor.
 */
class ActorQueryOperationPathAlt extends actor_abstract_path_1.ActorAbstractPath {
    constructor(args) {
        super(args, sparqlalgebrajs_1.Algebra.types.ALT);
    }
    async runOperation(path, context) {
        const predicate = path.predicate;
        const subOperations = (await Promise.all([
            this.mediatorQueryOperation.mediate({
                context,
                operation: actor_abstract_path_1.ActorAbstractPath.FACTORY.createPath(path.subject, predicate.left, path.object, path.graph),
            }),
            this.mediatorQueryOperation.mediate({
                context,
                operation: actor_abstract_path_1.ActorAbstractPath.FACTORY.createPath(path.subject, predicate.right, path.object, path.graph),
            }),
        ])).map(op => bus_query_operation_1.ActorQueryOperation.getSafeBindings(op));
        const bindingsStream = new asynciterator_1.UnionIterator(subOperations.map(op => op.bindingsStream), { autoStart: false });
        const variables = [].concat
            .apply([], subOperations.map(op => op.variables));
        // @ts-ignore
        return { type: 'bindings', bindingsStream, variables: [...new Set(variables)], canContainUndefs: false };
    }
}
exports.ActorQueryOperationPathAlt = ActorQueryOperationPathAlt;
//# sourceMappingURL=ActorQueryOperationPathAlt.js.map