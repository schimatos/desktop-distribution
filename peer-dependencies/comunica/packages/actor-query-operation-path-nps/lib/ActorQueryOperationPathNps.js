"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorQueryOperationPathNps = void 0;
const actor_abstract_path_1 = require("@comunica/actor-abstract-path");
const bus_query_operation_1 = require("@comunica/bus-query-operation");
const rdf_string_1 = require("rdf-string");
const sparqlalgebrajs_1 = require("sparqlalgebrajs");
/**
 * A comunica Path Nps Query Operation Actor.
 */
class ActorQueryOperationPathNps extends actor_abstract_path_1.ActorAbstractPath {
    constructor(args) {
        super(args, sparqlalgebrajs_1.Algebra.types.NPS);
    }
    async runOperation(path, context) {
        const predicate = path.predicate;
        const blank = this.generateVariable(path);
        const blankName = rdf_string_1.termToString(blank);
        const pattern = actor_abstract_path_1.ActorAbstractPath.FACTORY.createPattern(path.subject, blank, path.object, path.graph);
        const output = bus_query_operation_1.ActorQueryOperation.getSafeBindings(await this.mediatorQueryOperation.mediate({ operation: pattern, context }));
        // Remove the generated blank nodes from the bindings
        const bindingsStream = output.bindingsStream.transform({
            filter(bindings) {
                return !predicate.iris.some(iri => iri.equals(bindings.get(blankName)));
            },
            transform(item, next, push) {
                push(item.delete(blankName));
                next();
            },
        });
        return { type: 'bindings', bindingsStream, variables: output.variables, canContainUndefs: false };
    }
}
exports.ActorQueryOperationPathNps = ActorQueryOperationPathNps;
//# sourceMappingURL=ActorQueryOperationPathNps.js.map