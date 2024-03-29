import type { ActionContext } from '@comunica/core';
import type { IActorArgsMediaTyped } from './ActorAbstractMediaTyped';
import { ActorAbstractMediaTyped } from './ActorAbstractMediaTyped';
export declare abstract class ActorAbstractMediaTypedFixed<HI, HT, HO> extends ActorAbstractMediaTyped<HI, HT, HO> {
    /**
     * A hash of media types, with media type name as key, and its priority as value.
     * Priorities are numbers between [0, 1].
     */
    readonly mediaTypes: Record<string, number>;
    /**
     * A hash of media types, with media type name as key, and its format IRI as value.
     */
    readonly mediaTypeFormats: Record<string, string>;
    /**
     * A multiplier for media type priorities.
     * This can be used for keeping the original media types in place,
     * but scaling all of their scores with a certain value.
     */
    readonly priorityScale: number;
    constructor(args: IActorArgsMediaTypedFixed<HI, HT, HO>);
    testHandle(action: HI, mediaType: string, context: ActionContext): Promise<HT>;
    /**
     * Check to see if this actor can handle the given action.
     * The media type has already been checked before this is called.
     *
     * @param {ActionContext} context An optional context.
     * @param {HI} action The action to test.
     */
    abstract testHandleChecked(action: HI, context: ActionContext): Promise<HT>;
    testMediaType(context: ActionContext): Promise<boolean>;
    getMediaTypes(context: ActionContext): Promise<Record<string, number>>;
    testMediaTypeFormats(context: ActionContext): Promise<boolean>;
    getMediaTypeFormats(context: ActionContext): Promise<Record<string, string>>;
}
export interface IActorArgsMediaTypedFixed<HI, HT, HO> extends IActorArgsMediaTyped<HI, HT, HO> {
    mediaTypes: Record<string, number>;
    priorityScale?: number;
}
