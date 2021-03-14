import { BufferedIterator } from 'asynciterator';
import type { Store } from 'n3';
import type * as RDF from 'rdf-js';
export declare class N3StoreIterator extends BufferedIterator<RDF.Quad> {
    protected readonly store: Store;
    protected readonly subject: RDF.Term | null;
    protected readonly predicate: RDF.Term | null;
    protected readonly object: RDF.Term | null;
    protected readonly graph: RDF.Term | null;
    constructor(store: any, subject?: RDF.Term, predicate?: RDF.Term, object?: RDF.Term, graph?: RDF.Term);
    static nullifyVariables(term?: RDF.Term): RDF.Term | null;
    _read(count: number, done: () => void): void;
}
