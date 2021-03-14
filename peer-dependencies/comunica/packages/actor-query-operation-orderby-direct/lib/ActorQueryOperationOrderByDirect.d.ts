import type { IActorQueryOperationOutputBindings, IActorQueryOperationTypedMediatedArgs } from '@comunica/bus-query-operation';
import { ActorQueryOperationTypedMediated } from '@comunica/bus-query-operation';
import type { ActionContext, IActorTest } from '@comunica/core';
import { Algebra } from 'sparqlalgebrajs';
/**
 * A comunica OrderBy Direct Query Operation Actor.
 */
export declare class ActorQueryOperationOrderByDirect extends ActorQueryOperationTypedMediated<Algebra.OrderBy> {
    private readonly window;
    constructor(args: IActorQueryOperationOrderByDirectArgs);
    testOperation(pattern: Algebra.OrderBy, context: ActionContext): Promise<IActorTest>;
    runOperation(pattern: Algebra.OrderBy, context: ActionContext): Promise<IActorQueryOperationOutputBindings>;
}
/**
 * The window parameter determines how many of the elements to consider when sorting.
 */
export interface IActorQueryOperationOrderByDirectArgs extends IActorQueryOperationTypedMediatedArgs {
    window?: number;
}
