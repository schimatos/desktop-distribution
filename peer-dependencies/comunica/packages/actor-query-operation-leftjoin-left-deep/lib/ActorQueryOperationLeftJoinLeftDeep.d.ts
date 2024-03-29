import type { BindingsStream, IActorQueryOperationOutputBindings, IActorQueryOperationTypedMediatedArgs } from '@comunica/bus-query-operation';
import { ActorQueryOperationTypedMediated } from '@comunica/bus-query-operation';
import type { ActionContext, IActorTest } from '@comunica/core';
import type { Algebra } from 'sparqlalgebrajs';
/**
 * A comunica LeftJoin left-deep Query Operation Actor.
 */
export declare class ActorQueryOperationLeftJoinLeftDeep extends ActorQueryOperationTypedMediated<Algebra.LeftJoin> {
    private static readonly FACTORY;
    constructor(args: IActorQueryOperationTypedMediatedArgs);
    /**
     * Create a new bindings stream
     * that takes every binding of the base stream,
     * materializes the remaining patterns with it,
     * and emits all bindings from this new set of patterns.
     * @param {BindingsStream} leftStream The base stream.
     * @param {Algebra.Operation} rightOperation The operation to materialize with each binding of the base stream.
     * @param {Algebra.Operation => Promise<BindingsStream>} operationBinder A callback to retrieve the bindings stream
     *                                                                       of an operation.
     * @return {BindingsStream}
     */
    static createLeftDeepStream(leftStream: BindingsStream, rightOperation: Algebra.Operation, operationBinder: (operation: Algebra.Operation) => Promise<BindingsStream>): BindingsStream;
    testOperation(pattern: Algebra.LeftJoin, context: ActionContext): Promise<IActorTest>;
    runOperation(pattern: Algebra.LeftJoin, context: ActionContext): Promise<IActorQueryOperationOutputBindings>;
}
