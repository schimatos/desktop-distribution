import type { IActionRdfDereference, IActorRdfDereferenceMediaMappingsArgs, IActorRdfDereferenceOutput } from '@comunica/bus-rdf-dereference';
import { ActorRdfDereferenceMediaMappings } from '@comunica/bus-rdf-dereference';
import type { IActionHandleRdfParse, IActorOutputHandleRdfParse, IActorTestHandleRdfParse } from '@comunica/bus-rdf-parse';
import type { Actor, IActorTest, Mediator } from '@comunica/core';
/**
 * A comunica File RDF Dereference Actor.
 */
export declare class ActorRdfDereferenceFile extends ActorRdfDereferenceMediaMappings {
    readonly mediatorRdfParse: Mediator<Actor<IActionHandleRdfParse, IActorTestHandleRdfParse, IActorOutputHandleRdfParse>, IActionHandleRdfParse, IActorTestHandleRdfParse, IActorOutputHandleRdfParse>;
    constructor(args: IActorRdfDereferenceFileArgs);
    test(action: IActionRdfDereference): Promise<IActorTest>;
    run(action: IActionRdfDereference): Promise<IActorRdfDereferenceOutput>;
}
export interface IActorRdfDereferenceFileArgs extends IActorRdfDereferenceMediaMappingsArgs {
    /**
     * Mediator used for parsing the file contents.
     */
    mediatorRdfParse: Mediator<Actor<IActionHandleRdfParse, IActorTestHandleRdfParse, IActorOutputHandleRdfParse>, IActionHandleRdfParse, IActorTestHandleRdfParse, IActorOutputHandleRdfParse>;
}
