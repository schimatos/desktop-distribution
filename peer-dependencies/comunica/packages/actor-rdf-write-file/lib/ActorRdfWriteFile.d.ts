import { IActionRdfSerialize, IActorRdfSerializeOutput } from '@comunica/bus-rdf-serialize';
import { ActorRdfWrite, IActionRdfWrite, IActorRdfWriteOutput } from '@comunica/bus-rdf-write';
import { Actor, IActorArgs, IActorTest, Mediator } from '@comunica/core';
/**
 * A comunica File RDF Write Actor.
 */
export declare class ActorRdfWriteFile extends ActorRdfWrite {
    readonly mediatorRdfSerialize: Mediator<Actor<IActionRdfSerialize, IActorTest, IActorRdfSerializeOutput>, IActionRdfSerialize, IActorTest, IActorRdfSerializeOutput>;
    constructor(args: IActorArgs<IActionRdfWrite, IActorTest, IActorRdfWriteOutput>);
    test(action: IActionRdfWrite): Promise<IActorTest>;
    run(action: IActionRdfWrite): Promise<IActorRdfWriteOutput>;
}
