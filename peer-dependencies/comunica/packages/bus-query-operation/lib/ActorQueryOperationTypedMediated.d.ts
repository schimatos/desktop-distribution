import type { Actor, IActorArgs, IActorTest, Mediator } from '@comunica/core';
import type { Algebra } from 'sparqlalgebrajs';
import type { IActionQueryOperation, IActorQueryOperationOutput } from './ActorQueryOperation';
import { ActorQueryOperationTyped } from './ActorQueryOperationTyped';
/**
 * A base implementation for query operation actors for a specific operation type that have a query operation mediator.
 */
export declare abstract class ActorQueryOperationTypedMediated<O extends Algebra.Operation> extends ActorQueryOperationTyped<O> implements IActorQueryOperationTypedMediatedArgs {
    readonly mediatorQueryOperation: Mediator<Actor<IActionQueryOperation, IActorTest, IActorQueryOperationOutput>, IActionQueryOperation, IActorTest, IActorQueryOperationOutput>;
    constructor(args: IActorQueryOperationTypedMediatedArgs, operationName: string);
}
export interface IActorQueryOperationTypedMediatedArgs extends IActorArgs<IActionQueryOperation, IActorTest, IActorQueryOperationOutput> {
    mediatorQueryOperation: Mediator<Actor<IActionQueryOperation, IActorTest, IActorQueryOperationOutput>, IActionQueryOperation, IActorTest, IActorQueryOperationOutput>;
}