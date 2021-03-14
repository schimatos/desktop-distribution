import { IActionRdfCombineQuads, IActorRdfCombineQuadsOutput } from '@comunica/bus-rdf-combine-quads';
import { IActionRdfDereference, IActorRdfDereferenceOutput } from '@comunica/bus-rdf-dereference';
import { ActorRdfUpdateQuads, IActionRdfUpdateQuads, IActorRdfUpdateQuadsOutput } from '@comunica/bus-rdf-update-quads';
import { IActionRdfWrite, IActorRdfWriteOutput } from '@comunica/bus-rdf-write';
import { Actor, IActorArgs, IActorTest, Mediator } from '@comunica/core';
import * as RDF from 'rdf-js';
/**
 * A comunica File RDF Update Quads Actor.
 */
export declare class ActorRdfUpdateQuadsFile extends ActorRdfUpdateQuads {
    mediatorRdfDereference: Mediator<Actor<IActionRdfDereference, IActorTest, IActorRdfDereferenceOutput>, IActionRdfDereference, IActorTest, IActorRdfDereferenceOutput>;
    mediatorRdfWrite: Mediator<Actor<IActionRdfWrite, IActorTest, IActorRdfWriteOutput>, IActionRdfWrite, IActorTest, IActorRdfWriteOutput>;
    mediatorCombineQuads: Mediator<Actor<IActionRdfCombineQuads, IActorTest, IActorRdfCombineQuadsOutput>, IActionRdfCombineQuads, IActorTest, IActorRdfCombineQuadsOutput>;
    constructor(args: IActorArgs<IActionRdfUpdateQuads, IActorTest, IActorRdfUpdateQuadsOutput>);
    testOperation(action: IActionRdfUpdateQuads): Promise<IActorTest>;
    hash(quad: RDF.Quad): string;
    runOperation(action: IActionRdfUpdateQuads): Promise<IActorRdfUpdateQuadsOutput>;
}
