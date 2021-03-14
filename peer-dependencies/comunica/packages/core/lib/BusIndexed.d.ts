import type { Actor, IAction, IActorOutput, IActorTest } from './Actor';
import type { IActorReply, IBusArgs } from './Bus';
import { Bus } from './Bus';
/**
 * A bus that indexes identified actors,
 * so that actions with a corresponding identifier can be published more efficiently.
 *
 * Multiple actors with the same identifier can be subscribed.
 *
 * If actors or actions do not have a valid identifier,
 * then this will fallback to the normal bus behaviour.
 *
 * @see Bus
 *
 * @template A The actor type that can subscribe to the sub.
 * @template I The input type of an actor.
 * @template T The test type of an actor.
 * @template O The output type of an actor.
 */
export declare class BusIndexed<A extends Actor<I, T, O>, I extends IAction, T extends IActorTest, O extends IActorOutput> extends Bus<A, I, T, O> {
    protected readonly actorsIndex: Record<string, A[]>;
    protected readonly actorIdentifierFields: string[];
    protected readonly actionIdentifierFields: string[];
    /**
     * All enumerable properties from the `args` object are inherited to this bus.
     *
     * @param {IBusIndexedArgs} args Arguments object
     * @param {string} args.name The name for the bus
     * @throws When required arguments are missing.
     */
    constructor(args: IBusIndexedArgs);
    subscribe(actor: A): void;
    unsubscribe(actor: A): boolean;
    publish(action: I): IActorReply<A, I, T, O>[];
    protected getActorIdentifier(actor: A): string;
    protected getActionIdentifier(action: I): string;
}
export interface IBusIndexedArgs extends IBusArgs {
    actorIdentifierFields: string[];
    actionIdentifierFields: string[];
}
