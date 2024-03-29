"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorQueryOperationPathLink = void 0;
const actor_abstract_path_1 = require("@comunica/actor-abstract-path");
const sparqlalgebrajs_1 = require("sparqlalgebrajs");
/**
 * A comunica Path Link Query Operation Actor.
 */
class ActorQueryOperationPathLink extends actor_abstract_path_1.ActorAbstractPath {
    constructor(args) {
        super(args, sparqlalgebrajs_1.Algebra.types.LINK);
    }
    async runOperation(path, context) {
        const predicate = path.predicate;
        const operation = actor_abstract_path_1.ActorAbstractPath.FACTORY.createPattern(path.subject, predicate.iri, path.object, path.graph);
        return this.mediatorQueryOperation.mediate({ operation, context });
    }
}
exports.ActorQueryOperationPathLink = ActorQueryOperationPathLink;
//# sourceMappingURL=ActorQueryOperationPathLink.js.map