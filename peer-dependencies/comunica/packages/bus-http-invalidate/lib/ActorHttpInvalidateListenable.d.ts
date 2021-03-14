import type { IActorArgs, IActorTest } from '@comunica/core';
import type { IActionHttpInvalidate, IActorHttpInvalidateOutput } from './ActorHttpInvalidate';
import { ActorHttpInvalidate } from './ActorHttpInvalidate';
/**
 * An ActorHttpInvalidate actor that allows listeners to be attached.
 *
 * @see ActorHttpInvalidate
 */
export declare class ActorHttpInvalidateListenable extends ActorHttpInvalidate {
    private readonly invalidateListeners;
    constructor(args: IActorArgs<IActionHttpInvalidate, IActorTest, IActorHttpInvalidateOutput>);
    addInvalidateListener(listener: IInvalidateListener): void;
    test(action: IActionHttpInvalidate): Promise<IActorTest>;
    run(action: IActionHttpInvalidate): Promise<IActorHttpInvalidateOutput>;
}
/**
 * Called when a {@link IActionHttpInvalidate} is received.
 */
export declare type IInvalidateListener = (action: IActionHttpInvalidate) => void;
