import type { ActionContext, IActorArgs, IActorTest } from '@comunica/core';
import type { Algebra } from 'sparqlalgebrajs';
import type { IActionQueryOperation, IActorQueryOperationOutput } from './ActorQueryOperation';
import { ActorQueryOperation } from './ActorQueryOperation';
/**
 * @type {string} Context entry for the current query operation.
 */
export declare const KEY_CONTEXT_QUERYOPERATION = "@comunica/bus-query-operation:operation";
/**
 * A base implementation for query operation actors for a specific operation type.
 */
export declare abstract class ActorQueryOperationTyped<O extends Algebra.Operation> extends ActorQueryOperation {
    readonly operationName: string;
    protected constructor(args: IActorArgs<IActionQueryOperation, IActorTest, IActorQueryOperationOutput>, operationName: string);
    test(action: IActionQueryOperation): Promise<IActorTest>;
    run(action: IActionQueryOperation): Promise<IActorQueryOperationOutput>;
    protected abstract testOperation(operation: O, context: ActionContext | undefined): Promise<IActorTest>;
    protected abstract runOperation(operation: O, context: ActionContext | undefined): Promise<IActorQueryOperationOutput>;
}