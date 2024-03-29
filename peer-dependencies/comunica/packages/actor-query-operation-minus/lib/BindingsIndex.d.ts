import type { Bindings } from '@comunica/bus-query-operation';
import type * as RDF from 'rdf-js';
/**
 * A simple efficient tree-based index for maintaining bindings,
 * and checking whether or not a bindings is contained in this index.
 *
 * This will consider bindings with a variable term or a missing term
 * as a 'match-all' with other terms.
 */
export declare class BindingsIndex {
    private readonly keys;
    private readonly data;
    constructor(keys: string[]);
    protected static hashTerm(term: RDF.Term): string;
    /**
     * Add the given bindings to the index.
     * @param {Bindings} bindings A bindings.
     */
    add(bindings: Bindings): void;
    /**
     * Check if the given bindings is contained in this index.
     * @param {Bindings} bindings A bindings.
     * @return {boolean} If it exists in the index.
     */
    contains(bindings: Bindings): boolean;
    protected isBindingsValid(bindings: Bindings): boolean;
    protected containsRecursive(bindings: Bindings, keys: string[], dataIndexes: IDataIndex[]): boolean;
}
export interface IDataIndex {
    [key: string]: IDataIndex;
}
