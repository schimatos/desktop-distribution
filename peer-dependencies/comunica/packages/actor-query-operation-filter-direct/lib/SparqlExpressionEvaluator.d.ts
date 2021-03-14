import type { Bindings } from '@comunica/bus-query-operation';
import type * as RDF from 'rdf-js';
import { Algebra } from 'sparqlalgebrajs';
/**
 * Creates an evaluator function that executes the given Sxpression on the given Bindings.
 * This implementation is copied from the original LDF Client implementation.
 * THIS IMPLEMENTATION IS NOT FULLY SPEC COMPATIBLE!!!
 * But covers most of the standard cases.
 * @param {Expression} expr
 * @returns {(bindings: Bindings) => Term}
 */
export declare function createEvaluator(expr: Algebra.Expression): (bindings: Bindings) => (RDF.Term | undefined);
