import type { Bindings, BindingsStream, IActorQueryOperationOutputBindings, IActorQueryOperationTypedMediatedArgs } from '@comunica/bus-query-operation';
import { ActorQueryOperationTypedMediated } from '@comunica/bus-query-operation';
import type { ActionContext, IActorTest } from '@comunica/core';
import type * as RDF from 'rdf-js';
import type { Algebra } from 'sparqlalgebrajs';
/**
 * A comunica Query Operation Actor that resolves BGPs in a left-deep manner
 * based on the pattern with the smallest item count and sorts the remaining patterns by increasing count.
 */
export declare class ActorQueryOperationBgpLeftDeepSmallestSort extends ActorQueryOperationTypedMediated<Algebra.Bgp> {
    constructor(args: IActorQueryOperationTypedMediatedArgs);
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
    static createLeftDeepStream(baseStream: BindingsStream, patterns: Algebra.Pattern[], patternBinder: (bindPatterns: Algebra.Pattern[]) => Promise<BindingsStream>): BindingsStream;
    /**
     * Get the combined list of variables of the given pattern outputs.
     * @param {IActorQueryOperationOutput[]} patternOutputs An array of query operation outputs
     * @return {string[]} The array of variable names.
     */
    static getCombinedVariables(patternOutputs: IActorQueryOperationOutputBindings[]): string[];
    /**
     * Sort the given patterns and metadata by increasing estimated count.
     * @param {IOutputMetaTuple[]} patternOutputsMeta An array of pattern output and metadata tuples.
     * @return {IOutputMetaTuple[]} The sorted array.
     */
    static sortPatterns(patternOutputsMeta: IOutputMetaTuple[]): IOutputMetaTuple[];
    /**
     * Estimate an upper bound for the total number of items from the given metadata.
     * @param {{[p: string]: any}} smallestPattern The optional metadata for the pattern
     *                                             with the smallest number of elements.
     * @param {{[p: string]: any}[]} otherPatterns The array of optional metadata for the other patterns.
     * @return {number} The estimated number of total items.
     */
    static estimateCombinedTotalItems(smallestPattern: Record<string, any> | undefined, otherPatterns: (Record<string, any> | undefined)[]): number;
    /**
     * Get the estimated number of items from the given metadata.
     * @param {{[p: string]: any}} metadata An optional metadata object.
     * @return {number} The estimated number of items, or `Infinity` if metadata is falsy.
     */
    static getTotalItems(metadata?: Record<string, any>): number;
    /**
     * Materialize all patterns in the given pattern array with the given bindings.
     * @param {Pattern[]} patterns SPARQL algebra patterns.
     * @param {Bindings} bindings A bindings object.
     * @return {Pattern[]} A new array where each input pattern is materialized.
     */
    static materializePatterns(patterns: Algebra.Pattern[], bindings: Bindings): Algebra.Pattern[];
    /**
     * Materialize a pattern with the given bindings.
     * @param {Pattern} pattern A SPARQL algebra pattern.
     * @param {Bindings} bindings A bindings object.
     * @return {Pattern} A new materialized pattern.
     */
    static materializePattern(pattern: Algebra.Pattern, bindings: Bindings): Algebra.Pattern;
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
    static materializeTerm(term: RDF.Term, bindings: Bindings): RDF.Term;
    /**
     * Check if at least one of the given outputs has an empty output, i.e., when the estimated count is zero.
     * @param {IActorQueryOperationOutputBindings[]} patternOutputs Pattern outputs.
     * @return {Promise<boolean>} A promise for indicating whether or not at least one of the outputs is empty.
     */
    static hasOneEmptyPatternOutput(patternOutputs: IActorQueryOperationOutputBindings[]): Promise<boolean>;
    testOperation(pattern: Algebra.Bgp, context: ActionContext): Promise<IActorTest>;
    runOperation(pattern: Algebra.Bgp, context: ActionContext): Promise<IActorQueryOperationOutputBindings>;
}
export interface IOutputMetaTuple {
    input: Algebra.Pattern;
    output: IActorQueryOperationOutputBindings;
    meta?: Record<string, any>;
}
