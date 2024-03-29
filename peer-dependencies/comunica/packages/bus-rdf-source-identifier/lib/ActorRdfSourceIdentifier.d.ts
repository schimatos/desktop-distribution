import type { IAction, IActorArgs, IActorOutput, IActorTest } from '@comunica/core';
import { Actor } from '@comunica/core';
import type { IMediatorTypePriority } from '@comunica/mediatortype-priority';
/**
 * A comunica actor for rdf-source-identifier events.
 *
 * Actor types:
 * * Input:  IActionRdfSourceIdentifier:      The source value to discover the type of.
 * * Test:   <none>
 * * Output: IActorRdfSourceIdentifierOutput: The identified source type.
 *
 * @see IActionRdfSourceIdentifier
 * @see IActorRdfSourceIdentifierOutput
 */
export declare abstract class ActorRdfSourceIdentifier extends Actor<IActionRdfSourceIdentifier, IActorTest, IActorRdfSourceIdentifierOutput> {
    readonly priority: number;
    constructor(args: IActorRdfSourceIdentifierArgs);
    abstract test(action: IActionRdfSourceIdentifier): Promise<IMediatorTypePriority>;
    protected getSourceUrl(action: IActionRdfSourceIdentifier): string;
}
export interface IActionRdfSourceIdentifier extends IAction {
    /**
     * The provided source value in the context.
     */
    sourceValue: string;
}
export interface IActorRdfSourceIdentifierOutput extends IActorOutput {
    /**
     * The identified source type.
     */
    sourceType: string;
}
export interface IActorRdfSourceIdentifierArgs extends IActorArgs<IActionRdfSourceIdentifier, IActorTest, IActorRdfSourceIdentifierOutput> {
    priority: number;
}
