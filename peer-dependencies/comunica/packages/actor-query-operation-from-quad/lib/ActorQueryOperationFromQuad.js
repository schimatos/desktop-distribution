"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorQueryOperationFromQuad = void 0;
const bus_query_operation_1 = require("@comunica/bus-query-operation");
const sparqlalgebrajs_1 = require("sparqlalgebrajs");
/**
 * A comunica From Query Operation Actor.
 */
class ActorQueryOperationFromQuad extends bus_query_operation_1.ActorQueryOperationTypedMediated {
    constructor(args) {
        super(args, 'from');
    }
    /**
     * Create a deep copy of the given operation.
     * @param {Operation} operation An operation.
     * @param {(subOperation: Operation) => Operation} recursiveCb A callback for recursive operation calls.
     * @return {Operation} The copied operation.
     */
    static copyOperation(operation, recursiveCb) {
        const copiedOperation = {};
        for (const key of Object.keys(operation)) {
            if (Array.isArray(operation[key])) {
                if (key === 'variables') {
                    copiedOperation[key] = operation[key];
                }
                else {
                    copiedOperation[key] = operation[key].map(recursiveCb);
                }
            }
            else if (ActorQueryOperationFromQuad.ALGEBRA_TYPES.includes(operation[key].type)) {
                copiedOperation[key] = recursiveCb(operation[key]);
            }
            else {
                copiedOperation[key] = operation[key];
            }
        }
        return copiedOperation;
    }
    /**
     * Recursively transform the given operation to use the given graphs as default graph
     * This will (possibly) create a new operation and not modify the given operation.
     * @param {Operation} operation An operation.
     * @param {RDF.Term[]} defaultGraphs Graph terms.
     * @return {Operation} A new operation.
     */
    static applyOperationDefaultGraph(operation, defaultGraphs) {
        // If the operation is a BGP or Path, change the graph.
        if ((operation.type === 'bgp' && operation.patterns.length > 0) || operation.type === 'path') {
            if (operation.type === 'bgp') {
                return ActorQueryOperationFromQuad.joinOperations(operation.patterns.map((pattern) => {
                    if (pattern.graph.termType !== 'DefaultGraph') {
                        return ActorQueryOperationFromQuad.FACTORY.createBgp([pattern]);
                    }
                    const bgps = defaultGraphs.map((graph) => ActorQueryOperationFromQuad.FACTORY.createBgp([ActorQueryOperationFromQuad.FACTORY
                            .createPattern(pattern.subject, pattern.predicate, pattern.object, graph)]));
                    return ActorQueryOperationFromQuad.unionOperations(bgps);
                }));
            }
            if (operation.graph.termType !== 'DefaultGraph') {
                return operation;
            }
            const paths = defaultGraphs.map((graph) => ActorQueryOperationFromQuad.FACTORY
                .createPath(operation.subject, operation.predicate, operation.object, graph));
            return ActorQueryOperationFromQuad.joinOperations(paths);
        }
        return ActorQueryOperationFromQuad.copyOperation(operation, (subOperation) => this.applyOperationDefaultGraph(subOperation, defaultGraphs));
    }
    /**
     * Recursively transform the given operation to use the given graphs as named graph
     * This will (possibly) create a new operation and not modify the given operation.
     * @param {Operation} operation An operation.
     * @param {RDF.Term[]} namedGraphs Graph terms.
     * @return {Operation} A new operation.
     */
    static applyOperationNamedGraph(operation, namedGraphs, defaultGraphs) {
        // If the operation is a BGP or Path, change the graph.
        if ((operation.type === 'bgp' && operation.patterns.length > 0) || operation.type === 'path') {
            let patternGraph;
            if (operation.type === 'bgp') {
                // We assume that the BGP has at least one pattern and all have the same graph.
                patternGraph = operation.patterns[0].graph;
            }
            else {
                patternGraph = operation.graph;
            }
            if (patternGraph.termType === 'DefaultGraph') {
                // SPARQL spec (8.2) describes that when FROM NAMED's are used without a FROM, the default graph must be empty.
                // The FROMs are transformed before this step to a named node, so this will not apply to this case anymore.
                return { type: 'bgp', patterns: [] };
            }
            if (patternGraph.termType === 'Variable') {
                if (namedGraphs.length === 1) {
                    const graph = namedGraphs[0];
                    // If the pattern graph is a variable, replace the graph and bind the variable using VALUES
                    const bindings = {};
                    bindings[`?${patternGraph.value}`] = graph;
                    const values = ActorQueryOperationFromQuad.FACTORY
                        .createValues([patternGraph], [bindings]);
                    let pattern;
                    if (operation.type === 'bgp') {
                        pattern = ActorQueryOperationFromQuad.FACTORY
                            .createBgp(operation.patterns.map((pat) => ActorQueryOperationFromQuad.FACTORY
                            .createPattern(pat.subject, pat.predicate, pat.object, graph)));
                    }
                    else {
                        pattern = ActorQueryOperationFromQuad.FACTORY
                            .createPath(operation.subject, operation.predicate, operation.object, graph);
                    }
                    return ActorQueryOperationFromQuad.FACTORY.createJoin(values, pattern);
                }
                // If the pattern graph is a variable, take the union of the pattern applied to each available named graph
                return ActorQueryOperationFromQuad.unionOperations(namedGraphs.map((graph) => ActorQueryOperationFromQuad.applyOperationNamedGraph(operation, [graph], defaultGraphs)));
            }
            // The pattern's graph is defined (including the default graphs)
            const isNamedGraphAvailable = namedGraphs.concat(defaultGraphs).some((namedGraph) => namedGraph.equals(patternGraph));
            if (isNamedGraphAvailable) {
                // Return the pattern as-is if the pattern's graph was selected in a FROM NAMED
                return operation;
            }
            // No-op if the pattern's graph was not selected in a FROM NAMED.
            return { type: 'bgp', patterns: [] };
        }
        return ActorQueryOperationFromQuad.copyOperation(operation, (subOperation) => this.applyOperationNamedGraph(subOperation, namedGraphs, defaultGraphs));
    }
    /**
     * Transform the given array of operations into a join operation.
     * @param {Operation[]} operations An array of operations, must contain at least one operation.
     * @return {Join} A join operation.
     */
    static joinOperations(operations) {
        if (operations.length === 1) {
            return operations[0];
        }
        if (operations.length === 2) {
            return ActorQueryOperationFromQuad.FACTORY.createJoin(operations[0], operations[1]);
        }
        if (operations.length > 2) {
            return ActorQueryOperationFromQuad.FACTORY.createJoin(operations.shift(), this.joinOperations(operations));
        }
        throw new Error('A join can only be applied on at least one operation');
    }
    /**
     * Transform the given array of operations into a union operation.
     * @param {Operation[]} operations An array of operations, must contain at least one operation.
     * @return {Union} A union operation.
     */
    static unionOperations(operations) {
        if (operations.length === 1) {
            return operations[0];
        }
        if (operations.length === 2) {
            return ActorQueryOperationFromQuad.FACTORY.createUnion(operations[0], operations[1]);
        }
        if (operations.length > 2) {
            return ActorQueryOperationFromQuad.FACTORY.createUnion(operations.shift(), this.unionOperations(operations));
        }
        throw new Error('A union can only be applied on at least one operation');
    }
    /**
     * Transform an operation based on the default and named graphs in the pattern.
     *
     * FROM sets the default graph.
     * If multiple are available, take the union of the operation for all of them at quad-pattern level.
     *
     * FROM NAMED indicates which named graphs are available.
     * This will rewrite the query so that only triples from the given named graphs can be selected.
     *
     * @param {From} pattern A from operation.
     * @return {Operation} The transformed operation.
     */
    static createOperation(pattern) {
        let operation = pattern.input;
        if (pattern.default.length > 0) {
            operation = ActorQueryOperationFromQuad.applyOperationDefaultGraph(operation, pattern.default);
        }
        if (pattern.named.length > 0) {
            operation = ActorQueryOperationFromQuad.applyOperationNamedGraph(operation, pattern.named, pattern.default);
        }
        return operation;
    }
    async testOperation(pattern, context) {
        return true;
    }
    async runOperation(pattern, context) {
        const operation = ActorQueryOperationFromQuad.createOperation(pattern);
        return this.mediatorQueryOperation.mediate({ operation, context });
    }
}
exports.ActorQueryOperationFromQuad = ActorQueryOperationFromQuad;
ActorQueryOperationFromQuad.FACTORY = new sparqlalgebrajs_1.Factory();
ActorQueryOperationFromQuad.ALGEBRA_TYPES = Object.keys(sparqlalgebrajs_1.Algebra.types).map(key => sparqlalgebrajs_1.Algebra.types[key]);
//# sourceMappingURL=ActorQueryOperationFromQuad.js.map