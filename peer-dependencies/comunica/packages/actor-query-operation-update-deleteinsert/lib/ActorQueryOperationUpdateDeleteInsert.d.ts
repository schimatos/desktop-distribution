import { ActorQueryOperationTypedMediated, IActorQueryOperationOutput, IActorQueryOperationTypedMediatedArgs } from '@comunica/bus-query-operation';
import { IActionRdfUpdateQuads, IActorRdfUpdateQuadsOutput } from '@comunica/bus-rdf-update-quads';
import { ActionContext, Actor, IActorTest, Mediator } from '@comunica/core';
import { Algebra } from 'sparqlalgebrajs';
/**
 * A comunica Update DeleteInsert Query Operation Actor.
 */
export declare class ActorQueryOperationUpdateDeleteInsert extends ActorQueryOperationTypedMediated<Algebra.DeleteInsert> {
    readonly mediatorRdfUpdateQuads: Mediator<Actor<IActionRdfUpdateQuads, IActorTest, IActorRdfUpdateQuadsOutput>, IActionRdfUpdateQuads, IActorTest, IActorRdfUpdateQuadsOutput>;
    constructor(args: IActorQueryOperationTypedMediatedArgs);
    testOperation(pattern: Algebra.DeleteInsert, context: ActionContext): Promise<IActorTest>;
    runOperation(pattern: Algebra.DeleteInsert, context: ActionContext): Promise<IActorQueryOperationOutput>;
}
