import type { IActionHttp, IActorHttpOutput } from '@comunica/bus-http';
import type { IActionRdfSourceIdentifier, IActorRdfSourceIdentifierArgs, IActorRdfSourceIdentifierOutput } from '@comunica/bus-rdf-source-identifier';
import { ActorRdfSourceIdentifier } from '@comunica/bus-rdf-source-identifier';
import type { Actor, IActorTest, Mediator } from '@comunica/core';
import type { IMediatorTypePriority } from '@comunica/mediatortype-priority';
/**
 * A comunica File Content Type RDF Source Identifier Actor.
 */
export declare class ActorRdfSourceIdentifierFileContentType extends ActorRdfSourceIdentifier {
    readonly allowedMediaTypes: string[];
    readonly mediatorHttp: Mediator<Actor<IActionHttp, IActorTest, IActorHttpOutput>, IActionHttp, IActorTest, IActorHttpOutput>;
    constructor(args: IActorRdfSourceIdentifierFileContentTypeArgs);
    test(action: IActionRdfSourceIdentifier): Promise<IMediatorTypePriority>;
    run(action: IActionRdfSourceIdentifier): Promise<IActorRdfSourceIdentifierOutput>;
}
export interface IActorRdfSourceIdentifierFileContentTypeArgs extends IActorRdfSourceIdentifierArgs {
    allowedMediaTypes: string[];
    mediatorHttp: Mediator<Actor<IActionHttp, IActorTest, IActorHttpOutput>, IActionHttp, IActorTest, IActorHttpOutput>;
}
