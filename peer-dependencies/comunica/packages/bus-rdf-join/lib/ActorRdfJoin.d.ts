import type { Bindings, IActorQueryOperationOutput, IActorQueryOperationOutputBindings } from '@comunica/bus-query-operation';
import type { IAction, IActorArgs } from '@comunica/core';
import { Actor } from '@comunica/core';
import type { IMediatorTypeIterations } from '@comunica/mediatortype-iterations';
/**
 * A comunica actor for joining 2 binding streams.
 *
 * Actor types:
 * * Input:  IActionRdfJoin:      The streams that need to be joined.
 * * Test:   <none>
 * * Output: IActorRdfJoinOutput: The resulting joined stream.
 *
 * @see IActionRdfJoin
 * @see IActorQueryOperationOutput
 */
export declare abstract class ActorRdfJoin extends Actor<IActionRdfJoin, IMediatorTypeIterations, IActorQueryOperationOutput> {
    /**
     * Can be used by subclasses to indicate the max or min number of streams that can be joined.
     * 0 for infinity.
     * By default, this indicates the max number, but can be inverted by setting limitEntriesMin to true.
     */
    protected limitEntries: number;
    /**
     * If true, the limitEntries field is a lower limit,
     * otherwise, it is an upper limit.
     */
    protected limitEntriesMin: boolean;
    /**
     * If this actor can handle undefs in the bindings.
     */
    protected canHandleUndefs: boolean;
    constructor(args: IActorArgs<IActionRdfJoin, IMediatorTypeIterations, IActorQueryOperationOutput>, limitEntries?: number, limitEntriesMin?: boolean, canHandleUndefs?: boolean);
    /**
     * Returns an array containing all the variable names that occur in all bindings streams.
     * @param {IActionRdfJoin} action
     * @returns {string[]}
     */
    static overlappingVariables(action: IActionRdfJoin): string[];
    /**
     * Returns the variables that will occur in the joined bindings.
     * @param {IActionRdfJoin} action
     * @returns {string[]}
     */
    static joinVariables(action: IActionRdfJoin): string[];
    /**
     * Returns the result of joining bindings, or `null` if no join is possible.
     * @param {Bindings[]} bindings
     * @returns {Bindings}
     */
    static join(...bindings: Bindings[]): Bindings | null;
    /**
     * Checks if all metadata objects are present in the action, and if they have the specified key.
     * @param {IActionRdfJoin} action
     * @param {string} key
     * @returns {boolean}
     */
    static iteratorsHaveMetadata(action: IActionRdfJoin, key: string): Promise<boolean>;
    /**
     * Default test function for join actors.
     * Checks whether all iterators have metadata.
     * If yes: call the abstract getIterations method, if not: return Infinity.
     * @param {IActionRdfJoin} action The input action containing the relevant iterators
     * @returns {Promise<IMediatorTypeIterations>} The calculated estime.
     */
    test(action: IActionRdfJoin): Promise<IMediatorTypeIterations>;
    /**
     * Returns default input for 0 or 1 entries. Calls the getOutput function otherwise
     * @param {IActionRdfJoin} action
     * @returns {Promise<IActorQueryOperationOutput>}
     */
    run(action: IActionRdfJoin): Promise<IActorQueryOperationOutputBindings>;
    /**
     * Returns the resulting output for joining the given entries.
     * This is called after removing the trivial cases in run.
     * @param {IActionRdfJoin} action
     * @returns {Promise<IActorQueryOperationOutput>}
     */
    protected abstract getOutput(action: IActionRdfJoin): Promise<IActorQueryOperationOutputBindings>;
    /**
     * Used when calculating the number of iterations in the test function.
     * All metadata objects are guaranteed to have a value for the `totalItems` key.
     * @param {IActionRdfJoin} action
     * @returns {number} The estimated number of iterations when joining the given iterators.
     */
    protected abstract getIterations(action: IActionRdfJoin): Promise<number>;
}
export interface IActionRdfJoin extends IAction {
    /**
     * The list of streams and their corresponding metadata that need to be joined.
     */
    entries: IActorQueryOperationOutputBindings[];
}
