import { ActorRdfJoinQuads, IActionRdfJoinQuads, IActorRdfJoinQuadsOutput } from '@comunica/bus-rdf-join-quads';
import { IActorRdfUpdateQuadStreamOutput } from '@comunica/bus-rdf-update-quad-stream';
import { Actor, IActorArgs, IActorTest, Mediator } from '@comunica/core';
import { IActionRdfCombineQuads, IActorRdfCombineQuadsOutput } from '../../bus-rdf-combine-quads';
/**
 * A comunica Delegate Combine RDF Join Quads Actor.
 */
export declare class ActorRdfJoinQuadsDelegateCombine extends ActorRdfJoinQuads {
    readonly mediatorRdfCombineQuads: Mediator<Actor<IActionRdfCombineQuads, IActorTest, IActorRdfCombineQuadsOutput>, IActionRdfCombineQuads, IActorTest, IActorRdfCombineQuadsOutput>;
    private delegatedActor;
    constructor(args: IActorArgs<IActionRdfJoinQuads, IActorTest, IActorRdfJoinQuadsOutput>);
    private getCombineInput;
    test(action: IActionRdfJoinQuads): Promise<IActorTest>;
    run(action: IActionRdfJoinQuads): Promise<IActorRdfUpdateQuadStreamOutput>;
}
