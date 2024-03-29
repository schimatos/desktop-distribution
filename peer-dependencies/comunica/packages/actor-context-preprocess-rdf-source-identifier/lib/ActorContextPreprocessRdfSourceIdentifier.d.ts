import type { IActorContextPreprocessOutput } from '@comunica/bus-context-preprocess';
import { ActorContextPreprocess } from '@comunica/bus-context-preprocess';
import type { IActionRdfSourceIdentifier, IActorRdfSourceIdentifierOutput } from '@comunica/bus-rdf-source-identifier';
import type { Actor, IAction, IActorArgs, IActorTest, Mediator } from '@comunica/core';
/**
 * A comunica RDF Source Identifier Context Preprocess Actor.
 */
export declare class ActorContextPreprocessRdfSourceIdentifier extends ActorContextPreprocess {
    readonly mediatorRdfSourceIdentifier: Mediator<Actor<IActionRdfSourceIdentifier, IActorTest, IActorRdfSourceIdentifierOutput>, IActionRdfSourceIdentifier, IActorTest, IActorRdfSourceIdentifierOutput>;
    constructor(args: IActorContextPreprocessRdfSourceIdentifierArgs);
    test(action: IAction): Promise<IActorTest>;
    run(action: IAction): Promise<IActorContextPreprocessOutput>;
    private identifySource;
}
export interface IActorContextPreprocessRdfSourceIdentifierArgs extends IActorArgs<IAction, IActorTest, IActorContextPreprocessOutput> {
    mediatorRdfSourceIdentifier: Mediator<Actor<IActionRdfSourceIdentifier, IActorTest, IActorRdfSourceIdentifierOutput>, IActionRdfSourceIdentifier, IActorTest, IActorRdfSourceIdentifierOutput>;
}
