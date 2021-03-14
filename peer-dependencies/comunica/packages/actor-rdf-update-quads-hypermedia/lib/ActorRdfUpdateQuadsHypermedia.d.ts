import { ActorRdfUpdateQuads, IActionRdfUpdateQuads, IActorRdfUpdateQuadsOutput } from '@comunica/bus-rdf-update-quads';
import { IActorArgs, IActorTest } from '@comunica/core';
/**
 * A comunica Hypermedia RDF Update Quads Actor.
 */
export declare class ActorRdfUpdateQuadsHypermedia extends ActorRdfUpdateQuads {
    constructor(args: IActorArgs<IActionRdfUpdateQuads, IActorTest, IActorRdfUpdateQuadsOutput>);
    testOperation(action: IActionRdfUpdateQuads): Promise<IActorTest>;
    runOperation(action: IActionRdfUpdateQuads): Promise<IActorRdfUpdateQuadsOutput>;
}
