import type { ActorInit, IActionInit, IActorOutputInit } from '@comunica/bus-init';
import type { Actor, Bus, IAction, IActorOutput, IActorTest } from '@comunica/core';
/**
 * A Runner is used to instantiate a comunica workflow.
 *
 * It is instantiated dynamically using a Components.js config file.
 * A bus and a list of actors are injected into this runner dynamically.
 *
 * The {@link Runner#run} function must be called to instantiate the workflow.
 */
export declare class Runner implements IRunnerArgs {
    readonly busInit: Bus<ActorInit, IActionInit, IActorTest, IActorOutputInit>;
    readonly actors: Actor<IAction, IActorTest, IActorOutput>[];
    constructor(args: IRunnerArgs);
    /**
     * Run a comunica workflow.
     *
     * @param {IActionInit} action An 'init' action.
     * @return {Promise<void>}     A promise that resolves when the init actors are triggered.
     */
    run(action: IActionInit): Promise<IActorOutputInit[]>;
    /**
     * Initialize the actors.
     * This should be used for doing things that take a while,
     * such as opening files.
     *
     * @return {Promise<void>} A promise that resolves when the actors have been initialized.
     */
    initialize(): Promise<any>;
    /**
     * Deinitialize the actors.
     * This should be used for cleaning up things when the application is shut down,
     * such as closing files and removing temporary files.
     *
     * @return {Promise<void>} A promise that resolves when the actors have been deinitialized.
     */
    deinitialize(): Promise<any>;
    /**
     * Collect the given actors that are available in this runner.
     *
     * Example:
     * <pre>
     *   const { engine } = runner.collectActors({ engine: 'urn:comunica:sparqlinit' };
     *   // engine is an actor instance
     * </pre>
     *
     * An error will be thrown if any of the actors could not be found in the runner.
     *
     * @param actorIdentifiers A mapping of keys to actor identifiers.
     * @return A mapping of keys to actor instances.
     */
    collectActors(actorIdentifiers: Record<string, string>): Record<string, Actor<IAction, IActorTest, IActorOutput>>;
}
/**
 * The arguments that are passed to a Runner.
 */
export interface IRunnerArgs {
    /**
     * The 'init' event bus.
     */
    busInit: Bus<Actor<IAction, IActorTest, IActorOutput>, IAction, IActorTest, IActorOutput>;
    /**
     * The list of all actors that are part of the comunica workflow.
     */
    actors: Actor<IAction, IActorTest, IActorOutput>[];
}