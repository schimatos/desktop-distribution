import type { IActionInit, IActorOutputInit } from '@comunica/bus-init';
import { ActorInit } from '@comunica/bus-init';
import type { IActionHandleRdfParse, IActorOutputHandleRdfParse, IActorTestHandleRdfParse } from '@comunica/bus-rdf-parse';
import type { Actor, IActorArgs, IActorTest, Mediator } from '@comunica/core';
/**
 * An RDF Parse actor that listens on the 'init' bus.
 *
 * It requires a mediator that is defined over the 'rdf-parse' bus,
 * and a mediaType that identifies the RDF serialization.
 */
export declare class ActorInitRdfParse extends ActorInit implements IActorInitRdfParseArgs {
    readonly mediatorRdfParse: Mediator<Actor<IActionHandleRdfParse, IActorTestHandleRdfParse, IActorOutputHandleRdfParse>, IActionHandleRdfParse, IActorTestHandleRdfParse, IActorOutputHandleRdfParse>;
    readonly mediaType: string;
    constructor(args: IActorInitRdfParseArgs);
    test(action: IActionInit): Promise<IActorTest>;
    run(action: IActionInit): Promise<IActorOutputInit>;
}
export interface IActorInitRdfParseArgs extends IActorArgs<IActionInit, IActorTest, IActorOutputInit> {
    mediatorRdfParse: Mediator<Actor<IActionHandleRdfParse, IActorTestHandleRdfParse, IActorOutputHandleRdfParse>, IActionHandleRdfParse, IActorTestHandleRdfParse, IActorOutputHandleRdfParse>;
    mediaType: string;
}
