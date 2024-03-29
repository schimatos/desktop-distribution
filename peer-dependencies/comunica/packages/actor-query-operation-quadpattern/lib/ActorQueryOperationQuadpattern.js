"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorQueryOperationQuadpattern = void 0;
const bus_query_operation_1 = require("@comunica/bus-query-operation");
const asynciterator_1 = require("asynciterator");
const rdf_string_1 = require("rdf-string");
const rdf_terms_1 = require("rdf-terms");
/**
 * A comunica actor for handling 'quadpattern' query operations.
 */
class ActorQueryOperationQuadpattern extends bus_query_operation_1.ActorQueryOperationTyped {
    constructor(args) {
        super(args, 'pattern');
    }
    /**
     * Check if a term is a variable.
     * @param {RDF.Term} term An RDF term.
     * @return {any} If the term is a variable or blank node.
     */
    static isTermVariable(term) {
        return term.termType === 'Variable';
    }
    /**
     * Get all variables in the given pattern.
     * No duplicates are returned.
     * @param {RDF.BaseQuad} pattern A quad pattern.
     * @return {string[]} The variables in this pattern, with '?' prefix.
     */
    static getVariables(pattern) {
        return rdf_terms_1.uniqTerms(rdf_terms_1.getTerms(pattern)
            .filter(ActorQueryOperationQuadpattern.isTermVariable))
            .map(x => rdf_string_1.termToString(x));
    }
    /**
     * A helper function to find a hash with quad elements that have duplicate variables.
     *
     * @param {RDF.Quad} pattern A quad pattern.
     *
     * @return {{[p: string]: string[]}} If no equal variable names are present in the four terms, this returns undefined.
     *                                   Otherwise, this maps quad elements ('subject', 'predicate', 'object', 'graph')
     *                                   to the list of quad elements it shares a variable name with.
     *                                   If no links for a certain element exist, this element will
     *                                   not be included in the hash.
     *                                   Note 1: Quad elements will never have a link to themselves.
     *                                           So this can never occur: { subject: [ 'subject'] },
     *                                           instead 'null' would be returned.
     *                                   Note 2: Links only exist in one direction,
     *                                           this means that { subject: [ 'predicate'], predicate: [ 'subject' ] }
     *                                           will not occur, instead only { subject: [ 'predicate'] }
     *                                           will be returned.
     */
    static getDuplicateElementLinks(pattern) {
        // Collect a variable to quad elements mapping.
        const variableElements = {};
        let duplicateVariables = false;
        for (const key of rdf_terms_1.QUAD_TERM_NAMES) {
            if (pattern[key].termType === 'Variable') {
                const val = rdf_string_1.termToString(pattern[key]);
                const length = (variableElements[val] || (variableElements[val] = [])).push(key);
                duplicateVariables = duplicateVariables || length > 1;
            }
        }
        if (!duplicateVariables) {
            return;
        }
        // Collect quad element to elements with equal variables mapping.
        const duplicateElementLinks = {};
        for (const variable in variableElements) {
            const elements = variableElements[variable];
            const remainingElements = elements.slice(1);
            // Only store the elements that have at least one equal element.
            if (remainingElements.length > 0) {
                duplicateElementLinks[elements[0]] = remainingElements;
            }
        }
        return duplicateElementLinks;
    }
    /**
     * Get the metadata of the given action on a quad stream.
     *
     * @param {AsyncIterator<Quad>} data The data stream that is guaranteed to emit the metadata property.
     * @return {() => Promise<{[p: string]: any}>} A lazy promise behind a callback resolving to a metadata object.
     */
    static getMetadata(data) {
        return () => new Promise((resolve, reject) => {
            data.getProperty('metadata', (metadata) => resolve(metadata));
            data.on('error', reject);
        });
    }
    async testOperation(operation, context) {
        return true;
    }
    async runOperation(pattern, context) {
        // Apply the (optional) pattern-specific context
        if (pattern.context) {
            context = context ? context.merge(pattern.context) : pattern.context;
        }
        // Resolve the quad pattern
        const result = await this.mediatorResolveQuadPattern.mediate({ pattern, context });
        // Collect all variables from the pattern
        const variables = ActorQueryOperationQuadpattern.getVariables(pattern);
        // Create the metadata callback
        const metadata = ActorQueryOperationQuadpattern.getMetadata(result.data);
        // Convenience datastructure for mapping quad elements to variables
        const elementVariables = rdf_terms_1.reduceTerms(pattern, (acc, term, key) => {
            if (ActorQueryOperationQuadpattern.isTermVariable(term)) {
                acc[key] = rdf_string_1.termToString(term);
            }
            return acc;
        }, {});
        const quadBindingsReducer = (acc, term, key) => {
            const variable = elementVariables[key];
            if (variable) {
                acc[variable] = term;
            }
            return acc;
        };
        // Optionally filter, and construct bindings
        const bindingsStream = new asynciterator_1.TransformIterator(async () => {
            let filteredOutput = result.data;
            // Detect duplicate variables in the pattern
            const duplicateElementLinks = ActorQueryOperationQuadpattern
                .getDuplicateElementLinks(pattern);
            // If there are duplicate variables in the search pattern,
            // make sure that we filter out the triples that don't have equal values for those triple elements,
            // as QPF ignores variable names.
            if (duplicateElementLinks) {
                filteredOutput = filteredOutput.filter(quad => {
                    // No need to check the graph, because an equal element already would have to be found in s, p, or o.
                    for (const element1 of rdf_terms_1.TRIPLE_TERM_NAMES) {
                        for (const element2 of duplicateElementLinks[element1] || []) {
                            if (!quad[element1].equals(quad[element2])) {
                                return false;
                            }
                        }
                    }
                    return true;
                });
            }
            return filteredOutput.map(quad => bus_query_operation_1.Bindings(rdf_terms_1.reduceTerms(quad, quadBindingsReducer, {})), { autoStart: true, maxBufferSize: 128 });
        }, { autoStart: false });
        return { type: 'bindings', bindingsStream, variables, metadata, canContainUndefs: false };
    }
}
exports.ActorQueryOperationQuadpattern = ActorQueryOperationQuadpattern;
//# sourceMappingURL=ActorQueryOperationQuadpattern.js.map