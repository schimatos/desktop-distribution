import type { ActionContext, IAction, IActorArgs, IActorOutput, IActorTest } from '@comunica/core';
import { Actor } from '@comunica/core';
/**
 * An abstract actor that handles media-typed actions.
 *
 * It splits up a action between a 'handle' and a 'mediaTypes' action.
 * A 'mediaTypes' action is used to retrieve the available media types from this actor.
 * A 'handle' action is abstract, and can be implemented to do anything,
 * such as parsing, serializing, etc.
 * @see IActionAbstractMediaTyped
 *
 * @see ActorAbstractMediaTypedFixed
 */
export declare abstract class ActorAbstractMediaTyped<HI, HT, HO> extends Actor<IActionAbstractMediaTyped<HI>, IActorTestAbstractMediaTyped<HT>, IActorOutputAbstractMediaTyped<HO>> {
    constructor(args: IActorArgsMediaTyped<HI, HT, HO>);
    run(action: IActionAbstractMediaTyped<HI>): Promise<IActorOutputAbstractMediaTyped<HO>>;
    test(action: IActionAbstractMediaTyped<HI>): Promise<IActorTestAbstractMediaTyped<HT>>;
    /**
     * Check if this actor can run the given handle action,
     * without actually running it.
     *
     * @param {HI} action The handle action to test.
     * @param {string} mediaType The media type to test.
     * @param {ActionContext} context An optional context.
     * @return {Promise<T>} A promise that resolves to the handle test result.
     */
    abstract testHandle(action: HI, mediaType?: string, context?: ActionContext): Promise<HT>;
    /**
     * Run the given handle action on this actor.
     *
     * @param {HI} action The handle action to run.
     * @param {string} mediaType The media type to run with.
     * @param {ActionContext} context An optional context.
     * @return {Promise<T>} A promise that resolves to the handle run result.
     */
    abstract runHandle(action: HI, mediaType?: string, context?: ActionContext): Promise<HO>;
    /**
     * Check if this actor can emit its media types.
     *
     * @param {ActionContext} context An optional context.
     * @return {Promise<boolean>} A promise that resolves to the media type run result.
     */
    abstract testMediaType(context?: ActionContext): Promise<boolean>;
    /**
     * Get the media type of this given actor.
     *
     * @param {ActionContext} context An optional context.
     * @return {Promise<{[id: string]: number}>} A promise that resolves to the media types.
     */
    abstract getMediaTypes(context?: ActionContext): Promise<Record<string, number>>;
    /**
     * Check if this actor can emit its media type formats.
     *
     * @param {ActionContext} context An optional context.
     * @return {Promise<boolean>} A promise that resolves to the media type run result.
     */
    abstract testMediaTypeFormats(context?: ActionContext): Promise<boolean>;
    /**
     * Get the media type formats of this given actor.
     *
     * @param {ActionContext} context An optional context.
     * @return {Promise<{[id: string]: string}>} A promise that resolves to the media types.
     */
    abstract getMediaTypeFormats(context?: ActionContext): Promise<Record<string, string>>;
}
export interface IActorArgsMediaTyped<HI, HT, HO> extends IActorArgs<IActionAbstractMediaTyped<HI>, IActorTestAbstractMediaTyped<HT>, IActorOutputAbstractMediaTyped<HO>> {
}
export declare type IActionAbstractMediaTyped<HI> = IActionAbstractMediaTypedHandle<HI> | IActionAbstractMediaTypedMediaTypes | IActionAbstractMediaTypedMediaTypeFormats;
export interface IActionAbstractMediaTypedHandle<HI> extends IAction {
    /**
     * The handle action input.
     */
    handle: HI;
    /**
     * The handle media type that should be used when 'handle' is truthy.
     */
    handleMediaType?: string;
}
export interface IActionAbstractMediaTypedMediaTypes extends IAction {
    /**
     * True if media types should be retrieved.
     */
    mediaTypes: boolean;
}
export interface IActionAbstractMediaTypedMediaTypeFormats extends IAction {
    /**
     * True if media type formats should be retrieved.
     */
    mediaTypeFormats: boolean;
}
/**
 * Either 'handle', or 'mediaTypes' or 'mediaTypeFormats' must be truthy.
 * Groups may not be truthy at the same time.
 */
export declare type IActorTestAbstractMediaTyped<HT> = IActorTestAbstractMediaTypedHandle<HT> | IActorTestAbstractMediaTypedMediaTypes | IActorTestAbstractMediaTypedMediaTypeFormats;
export interface IActorTestAbstractMediaTypedHandle<HT> extends IActorTest {
    /**
     * The handle test output.
     */
    handle: HT;
}
export interface IActorTestAbstractMediaTypedMediaTypes extends IActorTest {
    /**
     * True if media types can be retrieved.
     */
    mediaTypes: boolean;
}
export interface IActorTestAbstractMediaTypedMediaTypeFormats extends IActorTest {
    /**
     * True if media type formats can be retrieved.
     */
    mediaTypeFormats?: boolean;
}
/**
 * Either 'handle', or 'mediaTypes' or 'mediaTypeFormats' must be truthy.
 * Groups may not be truthy at the same time.
 */
export declare type IActorOutputAbstractMediaTyped<HO> = IActorOutputAbstractMediaTypedHandle<HO> | IActorOutputAbstractMediaTypedMediaTypes | IActorOutputAbstractMediaTypedMediaTypeFormats;
export interface IActorOutputAbstractMediaTypedHandle<HO> extends IActorOutput {
    /**
     * The handle action output.
     */
    handle: HO;
}
export interface IActorOutputAbstractMediaTypedMediaTypes extends IActorOutput {
    /**
     * An object containing media types as keys,
     * and preferences as values, with values ranging from 0 to 1.
     */
    mediaTypes: Record<string, number>;
}
export interface IActorOutputAbstractMediaTypedMediaTypeFormats extends IActorOutput {
    /**
     * An object containing media types as keys,
     * and format IRIs as values.
     */
    mediaTypeFormats: Record<string, string>;
}
