import type { Actor, IAction, IActorOutput, IActorReply, IActorTest, IMediatorArgs } from '@comunica/core';
import { Mediator } from '@comunica/core';
/**
 * A comunica mediator that goes over all actors in sequence and forwards I/O.
 * This required the action input and the actor output to be of the same type.
 */
export declare class MediatorCombinePipeline<A extends Actor<H, T, H>, H extends IAction | IActorOutput, T extends IActorTest> extends Mediator<A, H, T, H> {
    constructor(args: IMediatorArgs<A, H, T, H>);
    mediate(action: H): Promise<H>;
    protected mediateWithResult(): Promise<IActorReply<A, H, T, H>>;
}
