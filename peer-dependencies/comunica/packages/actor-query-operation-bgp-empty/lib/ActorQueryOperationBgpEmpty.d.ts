import type { IActionQueryOperation, IActorQueryOperationOutput, IActorQueryOperationOutputBindings } from '@comunica/bus-query-operation';
import { ActorQueryOperationTyped } from '@comunica/bus-query-operation';
import type { ActionContext, IActorArgs, IActorTest } from '@comunica/core';
import type { Algebra } from 'sparqlalgebrajs';
/**
 * A comunica Query Operation Actor for empty BGPs.
 */
export declare class ActorQueryOperationBgpEmpty extends ActorQueryOperationTyped<Algebra.Bgp> {
    constructor(args: IActorArgs<IActionQueryOperation, IActorTest, IActorQueryOperationOutput>);
    /**
     * Get all variables in the given patterns.
     * No duplicates are returned.
     * @param {Algebra.Pattern} patterns Quad patterns.
     * @return {string[]} The variables in this pattern, with '?' prefix.
     */
    static getVariables(patterns: Algebra.Pattern[]): string[];
    testOperation(pattern: Algebra.Bgp, context: ActionContext): Promise<IActorTest>;
    runOperation(pattern: Algebra.Bgp, context: ActionContext): Promise<IActorQueryOperationOutputBindings>;
}
