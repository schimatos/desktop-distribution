import type { IQuadSource } from '@comunica/bus-rdf-resolve-quad-pattern';
import type { AsyncIterator } from 'asynciterator';
import type * as RDF from 'rdf-js';
export declare class N3StoreQuadSource implements IQuadSource {
    protected readonly store: any;
    constructor(store: any);
    match(subject: RDF.Term, predicate: RDF.Term, object: RDF.Term, graph: RDF.Term): AsyncIterator<RDF.Quad>;
}
