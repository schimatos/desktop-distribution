import type { IActionHttp, IActorHttpOutput } from '@comunica/bus-http';
import type { IActionQueryOperation, IActorQueryOperationOutput } from '@comunica/bus-query-operation';
import { ActorQueryOperation } from '@comunica/bus-query-operation';
import type { ActionContext, Actor, IActorArgs, IActorTest, Mediator } from '@comunica/core';
import type { IMediatorTypeHttpRequests } from '@comunica/mediatortype-httprequests';
import { SparqlEndpointFetcher } from 'fetch-sparql-endpoint';
import type * as RDF from 'rdf-js';
import { Factory } from 'sparqlalgebrajs';
/**
 * A comunica SPARQL Endpoint Query Operation Actor.
 */
export declare class ActorQueryOperationSparqlEndpoint extends ActorQueryOperation {
    protected static readonly FACTORY: Factory;
    readonly mediatorHttp: Mediator<Actor<IActionHttp, IActorTest, IActorHttpOutput>, IActionHttp, IActorTest, IActorHttpOutput>;
    readonly endpointFetcher: SparqlEndpointFetcher;
    protected lastContext?: ActionContext;
    constructor(args: IActorQueryOperationSparqlEndpointArgs);
    test(action: IActionQueryOperation): Promise<IMediatorTypeHttpRequests>;
    run(action: IActionQueryOperation): Promise<IActorQueryOperationOutput>;
    /**
     * Execute the given SELECT or CONSTRUCT query against the given endpoint.
     * @param endpoint A SPARQL endpoint URL.
     * @param query A SELECT or CONSTRUCT query.
     * @param quads If the query returns quads, i.e., if it is a CONSTRUCT query.
     * @param variables Variables for SELECT queries.
     */
    executeQuery(endpoint: string, query: string, quads: boolean, variables?: RDF.Variable[]): IActorQueryOperationOutput;
}
export interface IActorQueryOperationSparqlEndpointArgs extends IActorArgs<IActionQueryOperation, IActorTest, IActorQueryOperationOutput> {
    mediatorHttp: Mediator<Actor<IActionHttp, IActorTest, IActorHttpOutput>, IActionHttp, IActorTest, IActorHttpOutput>;
}
