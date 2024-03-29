import type { Actor, IAction, IActorOutput, IActorReply, IActorTest, IMediatorArgs } from '@comunica/core';
import { Mediator } from '@comunica/core';
/**
 * A comunica mediator that runs all actors that resolve their test.
 * This mediator will always resolve to the first actor's output.
 */
export declare class MediatorAll<A extends Actor<I, T, O>, I extends IAction, T extends IActorTest, O extends IActorOutput> extends Mediator<A, I, T, O> {
    constructor(args: IMediatorArgs<A, I, T, O>);
    mediate(action: I): Promise<O>;
    protected mediateWithResult(): Promise<IActorReply<A, I, T, O>>;
}
