import { IActionHttp, IActorHttpOutput } from '@comunica/bus-http';
import { ActorRdfUpdateQuads, IActionRdfUpdateQuads, IActorRdfUpdateQuadsOutput } from '@comunica/bus-rdf-update-quads';
import { ActionContext, Actor, IActorArgs, IActorTest, Mediator } from '@comunica/core';
import { Factory } from 'sparqlalgebrajs';
import { SparqlEndpointFetcher } from 'fetch-sparql-endpoint';
/**
 * A comunica Sparql Endpoint RDF Update Quads Actor.
 */
export declare class ActorRdfUpdateQuadsSparqlEndpoint extends ActorRdfUpdateQuads {
    protected static readonly FACTORY: Factory;
    readonly mediatorHttp: Mediator<Actor<IActionHttp, IActorTest, IActorHttpOutput>, IActionHttp, IActorTest, IActorHttpOutput>;
    readonly endpointFetcher: SparqlEndpointFetcher;
    protected lastContext?: ActionContext;
    constructor(args: IActorArgs<IActionRdfUpdateQuads, IActorTest, IActorRdfUpdateQuadsOutput>);
    testOperation(action: IActionRdfUpdateQuads): Promise<IActorTest>;
    runOperation(action: IActionRdfUpdateQuads): Promise<IActorRdfUpdateQuadsOutput>;
}
