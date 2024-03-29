import type { Bindings, BindingsStream } from '@comunica/bus-query-operation';
import type { AsyncIterator } from 'asynciterator';
import { MultiTransformIterator } from 'asynciterator';
import type * as RDF from 'rdf-js';
/**
 * Transforms a bindings stream into a quad stream given a quad template.
 *
 * This conforms to the SPARQL 1.1 spec on constructing triples:
 * https://www.w3.org/TR/sparql11-query/#rConstructTriples
 */
export declare class BindingsToQuadsIterator extends MultiTransformIterator<Bindings, RDF.Quad> {
    protected template: RDF.BaseQuad[];
    protected blankNodeCounter: number;
    constructor(template: RDF.BaseQuad[], bindingsStream: BindingsStream);
    /**
     * Bind the given term.
     * If the term is a variable and the variable is bound in the bindings object,
     * return the bindings value.
     * If the term is a variable and the variable is not bound in the bindings object,
     * a falsy value is returned..
     * Otherwise, the term itself is returned.
     * @param {Bindings}  bindings A bindings object.
     * @param {RDF.Term}  term     An RDF term.
     * @return {RDF.Term}          If the given term is not a variable, the term itself is returned.
     *                             If the given term is a variable, then the bound term is returned,
     *                             or a falsy value if it did not exist in the bindings.
     */
    static bindTerm(bindings: Bindings, term: RDF.Term): RDF.Term;
    /**
     * Bind the given quad pattern.
     * If one of the terms was a variable AND is not bound in the bindings,
     * a falsy value will be returned.
     * @param {Bindings} bindings A bindings object.
     * @param {RDF.Quad} pattern  An RDF quad.
     * @return {RDF.Quad}         A bound RDF quad or undefined.
     */
    static bindQuad(bindings: Bindings, pattern: RDF.BaseQuad): RDF.Quad | undefined;
    /**
     * Convert a blank node to a unique blank node in the given context.
     * If the given term is not a blank node, the term itself will be returned.
     * @param             blankNodeCounter A counter value for the blank node.
     * @param {RDF.Term}  term             The term that should be localized.
     * @return {RDF.Term}                  A term.
     */
    static localizeBlankNode(blankNodeCounter: number, term: RDF.Term): RDF.Term;
    /**
     * Convert the given quad to a quad that only contains unique blank nodes.
     * @param            blankNodeCounter A counter value for the blank node.
     * @param {RDF.BaseQuad} pattern          The pattern that should be localized.
     * @return {RDF.BaseQuad}                 A quad.
     */
    static localizeQuad(blankNodeCounter: number, pattern: RDF.Quad): RDF.Quad;
    /**
     * Convert the given template to a list of quads based on the given bindings.
     * @param {Bindings}    bindings           A bindings object.
     * @param {RDF.Quad[]}  template           A list of quad patterns.
     * @param               blankNodeCounter   A counter value for the blank node.
     * @return {RDF.Quad[]}                    A list of quads.
     */
    static bindTemplate(bindings: Bindings, template: RDF.BaseQuad[], blankNodeCounter: number): RDF.Quad[];
    _createTransformer(bindings: Bindings): AsyncIterator<RDF.Quad>;
}
