import type { ActionObserver } from './ActionObserver';
import type { Actor, IAction, IActorOutput, IActorTest } from './Actor';
/**
 * A publish-subscribe bus for sending actions to actors
 * to test whether or not they can run an action.
 *
 * This bus does not run the action itself,
 * for that a {@link Mediator} can be used.
 *
 * @see Actor
 * @see Mediator
 *
 * @template A The actor type that can subscribe to the sub.
 * @template I The input type of an actor.
 * @template T The test type of an actor.
 * @template O The output type of an actor.
 */
export declare class Bus<A extends Actor<I, T, O>, I extends IAction, T extends IActorTest, O extends IActorOutput> implements IBusArgs {
    readonly name: string;
    protected readonly actors: A[];
    protected readonly observers: ActionObserver<I, O>[];
    protected readonly dependencyLinks: Map<A, A[]>;
    /**
     * All enumerable properties from the `args` object are inherited to this bus.
     *
     * @param {IBusArgs} args Arguments object
     * @param {string} args.name The name for the bus
     * @throws When required arguments are missing.
     */
    constructor(args: IBusArgs);
    /**
     * Subscribe the given actor to the bus.
     * After this, the given actor can be unsubscribed from the bus by calling {@link Bus#unsubscribe}.
     *
     * An actor that is subscribed multiple times will exist that amount of times in the bus.
     *
     * @param {A} actor The actor to subscribe.
     */
    subscribe(actor: A): void;
    /**
     * Subscribe the given observer to the bus.
     * After this, the given observer can be unsubscribed from the bus by calling {@link Bus#unsubscribeObserver}.
     *
     * An observer that is subscribed multiple times will exist that amount of times in the bus.
     *
     * @param {ActionObserver<I, O>} observer The observer to subscribe.
     */
    subscribeObserver(observer: ActionObserver<I, O>): void;
    /**
     * Unsubscribe the given actor from the bus.
     *
     * An actor that is subscribed multiple times will be unsubscribed only once.
     *
     * @param {A} actor The actor to unsubscribe
     * @return {boolean} If the given actor was successfully unsubscribed,
     *         otherwise it was not subscribed before.
     */
    unsubscribe(actor: A): boolean;
    /**
     * Unsubscribe the given observer from the bus.
     *
     * An observer that is subscribed multiple times will be unsubscribed only once.
     *
     * @param {ActionObserver<I, O>} observer The observer to unsubscribe.
     * @return {boolean} If the given observer was successfully unsubscribed,
     *         otherwise it was not subscribed before.
     */
    unsubscribeObserver(observer: ActionObserver<I, O>): boolean;
    /**
     * Publish an action to all actors in the bus to test if they can run the action.
     *
     * @param {I} action An action to publish
     * @return {IActorReply<A extends Actor<I, T, O>, I extends IAction, T extends IActorTest,
     *         O extends IActorOutput>[]}
     *         An array of reply objects. Each object contains a reference to the actor,
     *         and a promise to its {@link Actor#test} result.
     */
    publish(action: I): IActorReply<A, I, T, O>[];
    /**
     * Invoked when an action was run by an actor.
     *
     * @param actor               The action on which the {@link Actor#run} method was invoked.
     * @param {I}          action The original action input.
     * @param {Promise<O>} output A promise resolving to the final action output.
     */
    onRun(actor: Actor<I, T, O>, action: I, output: Promise<O>): void;
    /**
     * Indicate that the given actor has the given actor dependencies.
     *
     * This will ensure that the given actor will be present in the bus *before* the given dependencies.
     *
     * @param {A} dependent A dependent actor that will be placed before the given actors.
     * @param {A[]} dependencies Actor dependencies that will be placed after the given actor.
     */
    addDependencies(dependent: A, dependencies: A[]): void;
    /**
     * Reorder the bus based on all present dependencies.
     */
    reorderForDependencies(): void;
}
export interface IBusArgs {
    name: string;
}
/**
 * Data interface for holding an actor and a promise to a reply from that actor.
 */
export interface IActorReply<A extends Actor<I, T, O>, I extends IAction, T extends IActorTest, O extends IActorOutput> {
    actor: A;
    reply: Promise<T>;
}
