import type { IActionHttp, IActorHttpOutput } from '@comunica/bus-http';
import type { IActionRdfSourceIdentifier, IActorRdfSourceIdentifierArgs, IActorRdfSourceIdentifierOutput } from '@comunica/bus-rdf-source-identifier';
import { ActorRdfSourceIdentifier } from '@comunica/bus-rdf-source-identifier';
import type { Actor, IActorTest, Mediator } from '@comunica/core';
import type { IMediatorTypePriority } from '@comunica/mediatortype-priority';
/**
 * A comunica SPARQL RDF Source Identifier Actor.
 */
export declare class ActorRdfSourceIdentifierSparql extends ActorRdfSourceIdentifier {
    readonly mediatorHttp: Mediator<Actor<IActionHttp, IActorTest, IActorHttpOutput>, IActionHttp, IActorTest, IActorHttpOutput>;
    constructor(args: IActorRdfSourceIdentifierSparqlArgs);
    test(action: IActionRdfSourceIdentifier): Promise<IMediatorTypePriority>;
    run(action: IActionRdfSourceIdentifier): Promise<IActorRdfSourceIdentifierOutput>;
}
export interface IActorRdfSourceIdentifierSparqlArgs extends IActorRdfSourceIdentifierArgs {
    mediatorHttp: Mediator<Actor<IActionHttp, IActorTest, IActorHttpOutput>, IActionHttp, IActorTest, IActorHttpOutput>;
}
