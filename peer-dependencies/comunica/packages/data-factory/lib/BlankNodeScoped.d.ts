import type * as RDF from 'rdf-js';
/**
 * A blank node that is scoped to a certain source.
 */
export declare class BlankNodeScoped implements RDF.BlankNode {
    readonly termType: 'BlankNode';
    readonly value: string;
    /**
     * This value can be obtained by consumers in query results,
     * so that this can be passed into another query as an IRI,
     * in order to obtain more results relating to this (blank) node.
     */
    readonly skolemized: RDF.NamedNode;
    constructor(value: string, skolemized: RDF.NamedNode);
    equals(other: RDF.Term | null | undefined): boolean;
}
