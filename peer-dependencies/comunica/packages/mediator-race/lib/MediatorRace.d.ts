import type { Actor, IAction, IActorOutput, IActorReply, IActorTest, IMediatorArgs } from '@comunica/core';
import { Mediator } from '@comunica/core';
/**
 * A mediator that picks the first actor that resolves its test.
 */
export declare class MediatorRace<A extends Actor<I, T, O>, I extends IAction, T extends IActorTest, O extends IActorOutput> extends Mediator<A, I, T, O> {
    constructor(args: IMediatorArgs<A, I, T, O>);
    protected mediateWithResult(action: I, testResults: IActorReply<A, I, T, O>[]): Promise<IActorReply<A, I, T, O>>;
}
