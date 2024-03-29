"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorQueryOperationConstruct = void 0;
const bus_query_operation_1 = require("@comunica/bus-query-operation");
const rdf_terms_1 = require("rdf-terms");
const BindingsToQuadsIterator_1 = require("./BindingsToQuadsIterator");
/**
 * A comunica Construct Query Operation Actor.
 */
class ActorQueryOperationConstruct extends bus_query_operation_1.ActorQueryOperationTypedMediated {
    constructor(args) {
        super(args, 'construct');
    }
    /**
     * Find all variables in a list of triple patterns.
     * @param {Algebra.Pattern[]} patterns An array of triple patterns.
     * @return {RDF.Variable[]} The variables in the triple patterns.
     */
    static getVariables(patterns) {
        return rdf_terms_1.uniqTerms([].concat
            .apply([], patterns.map(pattern => rdf_terms_1.getVariables(rdf_terms_1.getTerms(pattern)))));
    }
    async testOperation(pattern, context) {
        return true;
    }
    async runOperation(pattern, context) {
        // Apply a projection on our CONSTRUCT variables first, as the query may contain other variables as well.
        const variables = ActorQueryOperationConstruct.getVariables(pattern.template);
        const operation = { type: 'project', input: pattern.input, variables };
        // Evaluate the input query
        const output = bus_query_operation_1.ActorQueryOperation.getSafeBindings(await this.mediatorQueryOperation.mediate({ operation, context }));
        // Construct triples using the result based on the pattern.
        const quadStream = new BindingsToQuadsIterator_1.BindingsToQuadsIterator(pattern.template, output.bindingsStream);
        // Let the final metadata contain the estimated number of triples
        let metadata;
        if (output.metadata) {
            metadata = () => output.metadata().then(meta => {
                if (meta.totalItems) {
                    return Object.assign(Object.assign({}, meta), { totalItems: meta.totalItems * pattern.template.length });
                }
                return meta;
            });
        }
        return {
            metadata,
            quadStream,
            type: 'quads',
        };
    }
}
exports.ActorQueryOperationConstruct = ActorQueryOperationConstruct;
//# sourceMappingURL=ActorQueryOperationConstruct.js.map