import type { IActionHttp, IActorHttpOutput } from '@comunica/bus-http';
import type { BindingsStream } from '@comunica/bus-query-operation';
import type { IActionRdfResolveQuadPattern, IActorRdfResolveQuadPatternOutput } from '@comunica/bus-rdf-resolve-quad-pattern';
import { ActorRdfResolveQuadPattern } from '@comunica/bus-rdf-resolve-quad-pattern';
import type { ActionContext, Actor, IActorArgs, IActorTest, Mediator } from '@comunica/core';
import type * as RDF from 'rdf-js';
import type { Algebra } from 'sparqlalgebrajs';
import { Factory } from 'sparqlalgebrajs';
/**
 * A comunica SPARQL JSON RDF Resolve Quad Pattern Actor.
 */
export declare class ActorRdfResolveQuadPatternSparqlJson extends ActorRdfResolveQuadPattern implements IActorRdfResolveQuadPatternSparqlJsonArgs {
    protected static readonly FACTORY: Factory;
    readonly mediatorHttp: Mediator<Actor<IActionHttp, IActorTest, IActorHttpOutput>, IActionHttp, IActorTest, IActorHttpOutput>;
    constructor(args: IActorRdfResolveQuadPatternSparqlJsonArgs);
    /**
     * Replace all blank nodes in a pattern with variables.
     * If the pattern contains no blank nodes the original pattern gets returned.
     * @param {RDF.BaseQuad} pattern A quad pattern.
     * @return {RDF.BaseQuad} A quad pattern with no blank nodes.
     */
    static replaceBlankNodes(pattern: RDF.BaseQuad): RDF.BaseQuad;
    /**
     * Convert a quad pattern to a BGP with only that pattern.
     * @param {RDF.pattern} quad A quad pattern.
     * @return {Bgp} A BGP.
     */
    static patternToBgp(pattern: RDF.BaseQuad): Algebra.Bgp;
    /**
     * Convert a quad pattern to a select query for this pattern.
     * @param {RDF.Quad} pattern A quad pattern.
     * @return {string} A select query string.
     */
    static patternToSelectQuery(pattern: RDF.BaseQuad): string;
    /**
     * Convert a quad pattern to a count query for the number of matching triples for this pattern.
     * @param {RDF.Quad} pattern A quad pattern.
     * @return {string} A count query string.
     */
    static patternToCountQuery(pattern: RDF.BaseQuad): string;
    test(action: IActionRdfResolveQuadPattern): Promise<IActorTest>;
    run(action: IActionRdfResolveQuadPattern): Promise<IActorRdfResolveQuadPatternOutput>;
    /**
     * Send a SPARQL query to a SPARQL endpoint and retrieve its bindings as a stream.
     * @param {string} endpoint A SPARQL endpoint URL.
     * @param {string} query A SPARQL query string.
     * @param {ActionContext} context An optional context.
     * @return {Promise<BindingsStream>} A promise resolving to a stream of bindings.
     */
    queryBindings(endpoint: string, query: string, context?: ActionContext): Promise<BindingsStream>;
}
export interface IActorRdfResolveQuadPatternSparqlJsonArgs extends IActorArgs<IActionRdfResolveQuadPattern, IActorTest, IActorRdfResolveQuadPatternOutput> {
    mediatorHttp: Mediator<Actor<IActionHttp, IActorTest, IActorHttpOutput>, IActionHttp, IActorTest, IActorHttpOutput>;
}
