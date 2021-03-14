import type { IActorQueryOperationOutputBindings, IActorQueryOperationTypedMediatedArgs } from '@comunica/bus-query-operation';
import { ActorQueryOperationTypedMediated } from '@comunica/bus-query-operation';
import type { ActionContext, IActorTest } from '@comunica/core';
import type { Algebra } from 'sparqlalgebrajs';
/**
 * A comunica Filter Direct Query Operation Actor.
 */
export declare class ActorQueryOperationFilterDirect extends ActorQueryOperationTypedMediated<Algebra.Filter> {
    constructor(args: IActorQueryOperationTypedMediatedArgs);
    testOperation(pattern: Algebra.Filter): Promise<IActorTest>;
    runOperation(pattern: Algebra.Filter, context: ActionContext): Promise<IActorQueryOperationOutputBindings>;
}
