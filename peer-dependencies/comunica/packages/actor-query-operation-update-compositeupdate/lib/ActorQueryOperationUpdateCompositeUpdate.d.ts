import { ActorQueryOperationTypedMediated, IActorQueryOperationOutput, IActorQueryOperationTypedMediatedArgs } from '@comunica/bus-query-operation';
import { IActionRdfJoinQuads, IActorRdfJoinQuadsOutput } from '@comunica/bus-rdf-join-quads';
import { ActionContext, Actor, IActorTest, Mediator } from '@comunica/core';
import { Algebra } from 'sparqlalgebrajs';
/**
 * A comunica Update CompositeUpdate Query Operation Actor.
 */
export declare class ActorQueryOperationUpdateCompositeUpdate extends ActorQueryOperationTypedMediated<Algebra.CompositeUpdate> {
    readonly mediatorJoinQuads: Mediator<Actor<IActionRdfJoinQuads, IActorTest, IActorRdfJoinQuadsOutput>, IActionRdfJoinQuads, IActorTest, IActorRdfJoinQuadsOutput>;
    constructor(args: IActorQueryOperationTypedMediatedArgs);
    testOperation(pattern: Algebra.CompositeUpdate, context: ActionContext): Promise<IActorTest>;
    runOperation(pattern: Algebra.CompositeUpdate, context: ActionContext): Promise<IActorQueryOperationOutput>;
}
