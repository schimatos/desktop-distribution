import type { ActorHttpInvalidateListenable } from '@comunica/bus-http-invalidate';
import type { IActionRdfDereference, IActorRdfDereferenceOutput } from '@comunica/bus-rdf-dereference';
import type { IActionRdfDereferencePaged, IActorRdfDereferencePagedOutput } from '@comunica/bus-rdf-dereference-paged';
import { ActorRdfDereferencePaged } from '@comunica/bus-rdf-dereference-paged';
import type { IActionRdfMetadata, IActorRdfMetadataOutput } from '@comunica/bus-rdf-metadata';
import type { IActionRdfMetadataExtract, IActorRdfMetadataExtractOutput } from '@comunica/bus-rdf-metadata-extract';
import type { Actor, IActorArgs, IActorTest, Mediator } from '@comunica/core';
import LRUCache from 'lru-cache';
/**
 * An RDF Dereference Paged Actor that will lazily follow 'next' links as defined from the extracted metadata.
 */
export declare class ActorRdfDereferencePagedNext extends ActorRdfDereferencePaged implements IActorRdfDereferencePaged {
    readonly mediatorRdfDereference: Mediator<Actor<IActionRdfDereference, IActorTest, IActorRdfDereferenceOutput>, IActionRdfDereference, IActorTest, IActorRdfDereferenceOutput>;
    readonly mediatorMetadata: Mediator<Actor<IActionRdfMetadata, IActorTest, IActorRdfMetadataOutput>, IActionRdfMetadata, IActorTest, IActorRdfMetadataOutput>;
    readonly mediatorMetadataExtract: Mediator<Actor<IActionRdfMetadataExtract, IActorTest, IActorRdfMetadataExtractOutput>, IActionRdfMetadataExtract, IActorTest, IActorRdfMetadataExtractOutput>;
    readonly cacheSize: number;
    readonly cache?: LRUCache<string, Promise<IActorRdfDereferencePagedOutput>>;
    readonly httpInvalidator: ActorHttpInvalidateListenable;
    constructor(args: IActorRdfDereferencePaged);
    test(action: IActionRdfDereferencePaged): Promise<IActorTest>;
    run(action: IActionRdfDereferencePaged): Promise<IActorRdfDereferencePagedOutput>;
    /**
     * Make a copy of the given output promise.
     * @param {Promise<IActorRdfDereferencePagedOutput>} outputPromise An output promise.
     * @return {Promise<IActorRdfDereferencePagedOutput>} A cloned output promise.
     */
    protected cloneOutput(outputPromise: Promise<IActorRdfDereferencePagedOutput>): Promise<IActorRdfDereferencePagedOutput>;
    /**
     * Actual logic to produce the paged output.
     * @param {IActionRdfDereferencePaged} action An action.
     * @return {Promise<IActorRdfDereferencePagedOutput>} The output.
     */
    protected runAsync(action: IActionRdfDereferencePaged): Promise<IActorRdfDereferencePagedOutput>;
}
export interface IActorRdfDereferencePaged extends IActorArgs<IActionRdfDereferencePaged, IActorTest, IActorRdfDereferencePagedOutput> {
    mediatorRdfDereference: Mediator<Actor<IActionRdfDereference, IActorTest, IActorRdfDereferenceOutput>, IActionRdfDereference, IActorTest, IActorRdfDereferenceOutput>;
    mediatorMetadata: Mediator<Actor<IActionRdfMetadata, IActorTest, IActorRdfMetadataOutput>, IActionRdfMetadata, IActorTest, IActorRdfMetadataOutput>;
    mediatorMetadataExtract: Mediator<Actor<IActionRdfMetadataExtract, IActorTest, IActorRdfMetadataExtractOutput>, IActionRdfMetadataExtract, IActorTest, IActorRdfMetadataExtractOutput>;
    cacheSize: number;
    httpInvalidator: ActorHttpInvalidateListenable;
}
