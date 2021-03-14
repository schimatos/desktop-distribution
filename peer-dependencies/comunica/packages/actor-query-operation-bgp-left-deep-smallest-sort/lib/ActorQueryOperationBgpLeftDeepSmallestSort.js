"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorQueryOperationBgpLeftDeepSmallestSort = void 0;
const bus_query_operation_1 = require("@comunica/bus-query-operation");
const asynciterator_1 = require("asynciterator");
const rdf_string_1 = require("rdf-string");
const rdf_terms_1 = require("rdf-terms");
/**
 * A comunica Query Operation Actor that resolves BGPs in a left-deep manner
 * based on the pattern with the smallest item count and sorts the remaining patterns by increasing count.
 */
class ActorQueryOperationBgpLeftDeepSmallestSort extends bus_query_operation_1.ActorQueryOperationTypedMediated {
    constructor(args) {
        super(args, 'bgp');
    }
    /**
     * Create a new bindings stream
     * that takes every binding of the base stream,
     * materializes the remaining patterns with it,
     * and emits all bindings from this new set of patterns.
     * @param {BindingsStream} baseStream The base stream.
     * @param {Algebra.Pattern[]} patterns The patterns to materialize with each binding of the base stream.
     * @param {(patterns: Algebra.Pattern[]) => Promise<IActorQueryOperationOutput>} patternBinder A callback
     * to retrieve the bindings stream of an array of patterns.
     * @return {BindingsStream}
     */
    static createLeftDeepStream(baseStream, patterns, patternBinder) {
        return new asynciterator_1.MultiTransformIterator(baseStream, {
            autoStart: false,
            multiTransform(bindings) {
                const bindingsMerger = (subBindings) => subBindings.merge(bindings);
                return new asynciterator_1.TransformIterator(async () => (await patternBinder(ActorQueryOperationBgpLeftDeepSmallestSort.materializePatterns(patterns, bindings))).map(bindingsMerger), { maxBufferSize: 128 });
            },
        });
    }
    /**
     * Get the combined list of variables of the given pattern outputs.
     * @param {IActorQueryOperationOutput[]} patternOutputs An array of query operation outputs
     * @return {string[]} The array of variable names.
     */
    static getCombinedVariables(patternOutputs) {
        const withDuplicates = [].concat.apply([], patternOutputs.map(patternOutput => patternOutput.variables));
        // @ts-ignore
        return [...new Set(withDuplicates)];
    }
    /**
     * Sort the given patterns and metadata by increasing estimated count.
     * @param {IOutputMetaTuple[]} patternOutputsMeta An array of pattern output and metadata tuples.
     * @return {IOutputMetaTuple[]} The sorted array.
     */
    static sortPatterns(patternOutputsMeta) {
        return patternOutputsMeta.sort((tuple1, tuple2) => ActorQueryOperationBgpLeftDeepSmallestSort.getTotalItems(tuple1.meta) -
            ActorQueryOperationBgpLeftDeepSmallestSort.getTotalItems(tuple2.meta));
    }
    /**
     * Estimate an upper bound for the total number of items from the given metadata.
     * @param {{[p: string]: any}} smallestPattern The optional metadata for the pattern
     *                                             with the smallest number of elements.
     * @param {{[p: string]: any}[]} otherPatterns The array of optional metadata for the other patterns.
     * @return {number} The estimated number of total items.
     */
    static estimateCombinedTotalItems(smallestPattern, otherPatterns) {
        const smallestCount = ActorQueryOperationBgpLeftDeepSmallestSort.getTotalItems(smallestPattern);
        return otherPatterns
            .map(otherPattern => smallestCount * ActorQueryOperationBgpLeftDeepSmallestSort.getTotalItems(otherPattern))
            .reduce((sum, element) => sum + element, 0);
    }
    /**
     * Get the estimated number of items from the given metadata.
     * @param {{[p: string]: any}} metadata An optional metadata object.
     * @return {number} The estimated number of items, or `Infinity` if metadata is falsy.
     */
    static getTotalItems(metadata) {
        const { totalItems } = metadata !== null && metadata !== void 0 ? metadata : {};
        return totalItems || totalItems === 0 ? totalItems : Infinity;
    }
    /**
     * Materialize all patterns in the given pattern array with the given bindings.
     * @param {Pattern[]} patterns SPARQL algebra patterns.
     * @param {Bindings} bindings A bindings object.
     * @return {Pattern[]} A new array where each input pattern is materialized.
     */
    static materializePatterns(patterns, bindings) {
        return patterns.map(pattern => ActorQueryOperationBgpLeftDeepSmallestSort.materializePattern(pattern, bindings));
    }
    /**
     * Materialize a pattern with the given bindings.
     * @param {Pattern} pattern A SPARQL algebra pattern.
     * @param {Bindings} bindings A bindings object.
     * @return {Pattern} A new materialized pattern.
     */
    static materializePattern(pattern, bindings) {
        return Object.assign(rdf_terms_1.mapTerms(pattern, (term) => ActorQueryOperationBgpLeftDeepSmallestSort.materializeTerm(term, bindings)), { type: 'pattern', context: pattern.context });
    }
    /**
     * Materialize a term with the given binding.
     *
     * If the given term is a variable (or blank node)
     * and that variable exist in the given bindings object,
     * the value of that binding is returned.
     * In all other cases, the term itself is returned.
     *
     * @param {RDF.Term} term A term.
     * @param {Bindings} bindings A bindings object.
     * @return {RDF.Term} The materialized term.
     */
    static materializeTerm(term, bindings) {
        if (term.termType === 'Variable') {
            const value = bindings.get(rdf_string_1.termToString(term));
            if (value) {
                return value;
            }
        }
        return term;
    }
    /**
     * Check if at least one of the given outputs has an empty output, i.e., when the estimated count is zero.
     * @param {IActorQueryOperationOutputBindings[]} patternOutputs Pattern outputs.
     * @return {Promise<boolean>} A promise for indicating whether or not at least one of the outputs is empty.
     */
    static async hasOneEmptyPatternOutput(patternOutputs) {
        for (const patternOutput of patternOutputs) {
            if (patternOutput.metadata) {
                const metadata = await patternOutput.metadata();
                if (!ActorQueryOperationBgpLeftDeepSmallestSort.getTotalItems(metadata)) {
                    return true;
                }
            }
        }
        return false;
    }
    async testOperation(pattern, context) {
        if (pattern.patterns.length < 2) {
            throw new Error(`Actor ${this.name} can only operate on BGPs with at least two patterns.`);
        }
        return true;
    }
    async runOperation(pattern, context) {
        // Get the total number of items for all patterns by resolving the quad patterns
        const patternOutputs = (await Promise.all(pattern.patterns
            .map((subPattern) => this.mediatorQueryOperation.mediate({ operation: subPattern, context }))))
            .map(bus_query_operation_1.ActorQueryOperation.getSafeBindings);
        // If a triple pattern has no matches, the entire graph pattern has no matches.
        if (await ActorQueryOperationBgpLeftDeepSmallestSort.hasOneEmptyPatternOutput(patternOutputs)) {
            return {
                bindingsStream: new asynciterator_1.ArrayIterator([], { autoStart: false }),
                metadata: () => Promise.resolve({ totalItems: 0 }),
                type: 'bindings',
                variables: [],
                canContainUndefs: false,
            };
        }
        // Resolve the metadata for all patterns
        const metadatas = await Promise.all(patternOutputs.map(async (patternOutput) => patternOutput.metadata ? await patternOutput.metadata() : {}));
        // Sort patterns by increasing total items
        const outputMetaTuples = ActorQueryOperationBgpLeftDeepSmallestSort.sortPatterns(patternOutputs.map((output, i) => ({ input: pattern.patterns[i], output, meta: metadatas[i] })));
        // Close the non-smallest streams
        for (let i = 1; i < outputMetaTuples.length; i++) {
            outputMetaTuples[i].output.bindingsStream.close();
        }
        // Take the pattern with the smallest number of items
        const smallestPattern = outputMetaTuples.slice(0)[0];
        outputMetaTuples.splice(0, 1);
        // Materialize the remaining patterns for each binding in the stream.
        const bindingsStream = ActorQueryOperationBgpLeftDeepSmallestSort.createLeftDeepStream(smallestPattern.output.bindingsStream, outputMetaTuples.map(pat => pat.input), async (patterns) => {
            // Send the materialized patterns to the mediator for recursive BGP evaluation.
            const operation = { type: 'bgp', patterns };
            return bus_query_operation_1.ActorQueryOperation.getSafeBindings(await this.mediatorQueryOperation.mediate({ operation, context }))
                .bindingsStream;
        });
        // Prepare variables and metadata
        const variables = ActorQueryOperationBgpLeftDeepSmallestSort.getCombinedVariables(patternOutputs);
        const metadata = () => Promise.resolve({
            totalItems: ActorQueryOperationBgpLeftDeepSmallestSort.estimateCombinedTotalItems(smallestPattern.meta, outputMetaTuples.map(pat => pat.meta)),
        });
        return { type: 'bindings', bindingsStream, variables, metadata, canContainUndefs: false };
    }
}
exports.ActorQueryOperationBgpLeftDeepSmallestSort = ActorQueryOperationBgpLeftDeepSmallestSort;
//# sourceMappingURL=ActorQueryOperationBgpLeftDeepSmallestSort.js.map