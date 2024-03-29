"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorQueryOperationPathInv = void 0;
const actor_abstract_path_1 = require("@comunica/actor-abstract-path");
const sparqlalgebrajs_1 = require("sparqlalgebrajs");
/**
 * A comunica Path Inv Query Operation Actor.
 */
class ActorQueryOperationPathInv extends actor_abstract_path_1.ActorAbstractPath {
    constructor(args) {
        super(args, sparqlalgebrajs_1.Algebra.types.INV);
    }
    async runOperation(path, context) {
        const predicate = path.predicate;
        const invPath = actor_abstract_path_1.ActorAbstractPath.FACTORY.createPath(path.object, predicate.path, path.subject, path.graph);
        return this.mediatorQueryOperation.mediate({ operation: invPath, context });
    }
}
exports.ActorQueryOperationPathInv = ActorQueryOperationPathInv;
//# sourceMappingURL=ActorQueryOperationPathInv.js.map