import type { IActionInit, IActorOutputInit } from '@comunica/bus-init';
import { ActorInit } from '@comunica/bus-init';
import type { IActionRdfDereferencePaged, IActorRdfDereferencePagedOutput } from '@comunica/bus-rdf-dereference-paged';
import type { Actor, IActorArgs, IActorTest, Mediator } from '@comunica/core';
/**
 * A comunica RDF Dereference Paged Init Actor.
 */
export declare class ActorInitRdfDereferencePaged extends ActorInit implements IActorInitRdfDereferencePagedArgs {
    readonly mediatorRdfDereferencePaged: Mediator<Actor<IActionRdfDereferencePaged, IActorTest, IActorRdfDereferencePagedOutput>, IActionRdfDereferencePaged, IActorTest, IActorRdfDereferencePagedOutput>;
    readonly url?: string;
    constructor(args: IActorInitRdfDereferencePagedArgs);
    test(action: IActionInit): Promise<IActorTest>;
    run(action: IActionInit): Promise<IActorOutputInit>;
}
export interface IActorInitRdfDereferencePagedArgs extends IActorArgs<IActionInit, IActorTest, IActorOutputInit> {
    mediatorRdfDereferencePaged: Mediator<Actor<IActionRdfDereferencePaged, IActorTest, IActorRdfDereferencePagedOutput>, IActionRdfDereferencePaged, IActorTest, IActorRdfDereferencePagedOutput>;
    url?: string;
}
