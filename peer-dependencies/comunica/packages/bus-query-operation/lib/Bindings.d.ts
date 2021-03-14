import type { AsyncIterator } from 'asynciterator';
import { Map } from 'immutable';
import type * as RDF from 'rdf-js';
import type { Algebra } from 'sparqlalgebrajs';
/**
 * A stream of bindings.
 *
 * Next to the list of available variables,
 * an optional metadata hash can be present.
 *
 * @see Bindings
 */
export declare type BindingsStream = AsyncIterator<Bindings>;
/**
 * An immutable solution mapping object.
 * This maps variables to a terms.
 *
 * Variables are represented as strings containing the variable name prefixed with '?'.
 * Blank nodes are represented as strings containing the blank node name prefixed with '_:'.
 * Terms are named nodes, literals or the default graph.
 */
export declare type Bindings = Map<string, RDF.Term>;
/**
 * A convenience constructor for bindings based on a given hash.
 * @param {{[p: string]: RDF.Term}} hash A hash that maps variable names to terms.
 * @return {Bindings} The immutable bindings from the hash.
 * @constructor
 */
export declare function Bindings(hash: Record<string, RDF.Term>): Bindings;
/**
 * Check if the given object is a bindings object.
 * @param maybeBindings Any object.
 * @return {boolean} If the object is a bindings object.
 */
export declare function isBindings(maybeBindings: any): boolean;
/**
 * Convert the given object to a bindings object if it is not a bindings object yet.
 * If it already is a bindings object, return the object as-is.
 * @param maybeBindings Any object.
 * @return {Bindings} A bindings object.
 */
export declare function ensureBindings(maybeBindings: any): Bindings;
/**
 * Materialize a term with the given binding.
 *
 * If the given term is a variable,
 * and that variable exist in the given bindings object,
 * the value of that binding is returned.
 * In all other cases, the term itself is returned.
 *
 * @param {RDF.Term} term A term.
 * @param {Bindings} bindings A bindings object.
 * @return {RDF.Term} The materialized term.
 */
export declare function materializeTerm(term: RDF.Term, bindings: Bindings): RDF.Term;
/**
 * Materialize the given operation (recursively) with the given bindings.
 * Essentially, all variables in the given operation will be replaced
 * by the terms bound to the variables in the given bindings.
 * @param {Operation} operation SPARQL algebra operation.
 * @param {Bindings} bindings A bindings object.
 * @param {boolean} strictTargetVariables If target variable bindings (such as on SELECT or BIND) should not be allowed.
 * @return Algebra.Operation A new operation materialized with the given bindings.
 */
export declare function materializeOperation(operation: Algebra.Operation, bindings: Bindings, strictTargetVariables?: boolean): Algebra.Operation;