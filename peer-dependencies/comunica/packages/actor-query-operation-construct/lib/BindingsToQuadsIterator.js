"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BindingsToQuadsIterator = void 0;
const asynciterator_1 = require("asynciterator");
const rdf_data_factory_1 = require("rdf-data-factory");
const rdf_terms_1 = require("rdf-terms");
const DF = new rdf_data_factory_1.DataFactory();
/**
 * Transforms a bindings stream into a quad stream given a quad template.
 *
 * This conforms to the SPARQL 1.1 spec on constructing triples:
 * https://www.w3.org/TR/sparql11-query/#rConstructTriples
 */
class BindingsToQuadsIterator extends asynciterator_1.MultiTransformIterator {
    constructor(template, bindingsStream) {
        super(bindingsStream, { autoStart: false });
        this.template = template;
        this.blankNodeCounter = 0;
    }
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
    static bindTerm(bindings, term) {
        if (term.termType === 'Variable') {
            return bindings.get(`?${term.value}`);
        }
        return term;
    }
    /**
     * Bind the given quad pattern.
     * If one of the terms was a variable AND is not bound in the bindings,
     * a falsy value will be returned.
     * @param {Bindings} bindings A bindings object.
     * @param {RDF.Quad} pattern  An RDF quad.
     * @return {RDF.Quad}         A bound RDF quad or undefined.
     */
    static bindQuad(bindings, pattern) {
        try {
            return rdf_terms_1.mapTerms(pattern, term => {
                const boundTerm = BindingsToQuadsIterator.bindTerm(bindings, term);
                if (!boundTerm) {
                    throw new Error('Unbound term');
                }
                return boundTerm;
            });
        }
        catch (_a) {
            // Do nothing
        }
    }
    /**
     * Convert a blank node to a unique blank node in the given context.
     * If the given term is not a blank node, the term itself will be returned.
     * @param             blankNodeCounter A counter value for the blank node.
     * @param {RDF.Term}  term             The term that should be localized.
     * @return {RDF.Term}                  A term.
     */
    static localizeBlankNode(blankNodeCounter, term) {
        if (term.termType === 'BlankNode') {
            return DF.blankNode(`${term.value}${blankNodeCounter}`);
        }
        return term;
    }
    /**
     * Convert the given quad to a quad that only contains unique blank nodes.
     * @param            blankNodeCounter A counter value for the blank node.
     * @param {RDF.BaseQuad} pattern          The pattern that should be localized.
     * @return {RDF.BaseQuad}                 A quad.
     */
    static localizeQuad(blankNodeCounter, pattern) {
        return rdf_terms_1.mapTerms(pattern, term => BindingsToQuadsIterator.localizeBlankNode(blankNodeCounter, term));
    }
    /**
     * Convert the given template to a list of quads based on the given bindings.
     * @param {Bindings}    bindings           A bindings object.
     * @param {RDF.Quad[]}  template           A list of quad patterns.
     * @param               blankNodeCounter   A counter value for the blank node.
     * @return {RDF.Quad[]}                    A list of quads.
     */
    static bindTemplate(bindings, template, blankNodeCounter) {
        return template
            // Bind variables to bound terms
            .map(x => BindingsToQuadsIterator.bindQuad.bind(null, bindings)(x))
            // Remove quads that contained unbound terms, i.e., variables.
            .filter(Boolean)
            // Make sure the multiple instantiations of the template contain different blank nodes, as required by SPARQL 1.1.
            .map(BindingsToQuadsIterator.localizeQuad.bind(null, blankNodeCounter));
    }
    _createTransformer(bindings) {
        return new asynciterator_1.ArrayIterator(BindingsToQuadsIterator.bindTemplate(bindings, this.template, this.blankNodeCounter++));
    }
}
exports.BindingsToQuadsIterator = BindingsToQuadsIterator;
//# sourceMappingURL=BindingsToQuadsIterator.js.map