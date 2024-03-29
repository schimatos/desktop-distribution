import type { Actor, IAction, IActorOutput, IActorReply, IActorTest, IMediatorArgs } from '@comunica/core';
import { Mediator } from '@comunica/core';
/**
 * A mediator that can mediate over a single number field.
 *
 * It takes the required 'field' and 'type' parameters.
 * The 'field' parameter represents the field name of the test result field over which must be mediated.
 * The 'type' parameter
 */
export declare class MediatorNumber<A extends Actor<I, T, O>, I extends IAction, T extends IActorTest, O extends IActorOutput> extends Mediator<A, I, T, O> implements IMediatorNumberArgs<A, I, T, O> {
    static MIN: string;
    static MAX: string;
    readonly field: string;
    readonly type: string;
    readonly ignoreErrors: boolean;
    readonly indexPicker: (tests: T[]) => number;
    constructor(args: IMediatorNumberArgs<A, I, T, O>);
    /**
     * @return {(tests: T[]) => number} A function that returns the index of the test result
     *                                  that has been chosen by this mediator.
     */
    protected createIndexPicker(): (tests: (T | undefined)[]) => number;
    protected getOrDefault(value: number | undefined, defaultValue: number): number;
    protected mediateWithResult(action: I, testResults: IActorReply<A, I, T, O>[]): Promise<IActorReply<A, I, T, O>>;
}
export interface IMediatorNumberArgs<A extends Actor<I, T, O>, I extends IAction, T extends IActorTest, O extends IActorOutput> extends IMediatorArgs<A, I, T, O> {
    /**
     * The field name of the test result field over which must be mediated.
     */
    field: string;
    /**
     * The way how the index should be selected.
     * For choosing the minimum value: {@link MediatorNumber#MIN}
     * For choosing the maximum value: {@link MediatorNumber#MAX}
     */
    type: string;
    /**
     * If actors that throw test errors should be ignored
     */
    ignoreErrors?: boolean;
}
