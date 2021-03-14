import type { IActionHttp, IActorHttpOutput } from '@comunica/bus-http';
import type { IActionRdfSourceIdentifier, IActorRdfSourceIdentifierArgs, IActorRdfSourceIdentifierOutput } from '@comunica/bus-rdf-source-identifier';
import { ActorRdfSourceIdentifier } from '@comunica/bus-rdf-source-identifier';
import type { Actor, IActorTest, Mediator } from '@comunica/core';
import type { IMediatorTypePriority } from '@comunica/mediatortype-priority';
import 'cross-fetch/polyfill';
/**
 * A comunica Hypermedia Qpf RDF Source Identifier Actor.
 */
export declare class ActorRdfSourceIdentifierHypermediaQpf extends ActorRdfSourceIdentifier {
    readonly mediatorHttp: Mediator<Actor<IActionHttp, IActorTest, IActorHttpOutput>, IActionHttp, IActorTest, IActorHttpOutput>;
    readonly acceptHeader: string;
    readonly toContain: string[];
    constructor(args: IActorRdfSourceIdentifierHypermediaQpfArgs);
    test(action: IActionRdfSourceIdentifier): Promise<IMediatorTypePriority>;
    run(action: IActionRdfSourceIdentifier): Promise<IActorRdfSourceIdentifierOutput>;
}
export interface IActorRdfSourceIdentifierHypermediaQpfArgs extends IActorRdfSourceIdentifierArgs {
    mediatorHttp: Mediator<Actor<IActionHttp, IActorTest, IActorHttpOutput>, IActionHttp, IActorTest, IActorHttpOutput>;
    acceptHeader: string;
    toContain: string[];
}
