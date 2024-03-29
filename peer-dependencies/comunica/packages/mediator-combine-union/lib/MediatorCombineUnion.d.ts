import type { Actor, IAction, IActorOutput, IActorReply, IActorTest, IMediatorArgs } from '@comunica/core';
import { Mediator } from '@comunica/core';
/**
 * A comunica mediator that takes the union of all actor results.
 *
 * The actors that are registered first will have priority on setting overlapping fields.
 */
export declare class MediatorCombineUnion<A extends Actor<I, T, O>, I extends IAction, T extends IActorTest, O extends IActorOutput> extends Mediator<A, I, T, O> implements IMediatorCombineUnionArgs<A, I, T, O> {
    readonly field: string;
    readonly combiner: (results: O[]) => O;
    constructor(args: IMediatorCombineUnionArgs<A, I, T, O>);
    mediate(action: I): Promise<O>;
    protected mediateWithResult(): Promise<IActorReply<A, I, T, O>>;
    protected createCombiner(): (results: O[]) => O;
}
export interface IMediatorCombineUnionArgs<A extends Actor<I, T, O>, I extends IAction, T extends IActorTest, O extends IActorOutput> extends IMediatorArgs<A, I, T, O> {
    /**
     * The field name of the test result field over which must be mediated.
     */
    field: string;
}
