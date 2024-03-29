import type { IActionRdfDereference, IActorRdfDereferenceOutput } from '@comunica/bus-rdf-dereference';
import type { IActionRdfMetadata, IActorRdfMetadataOutput } from '@comunica/bus-rdf-metadata';
import type { IActionRdfMetadataExtract, IActorRdfMetadataExtractOutput } from '@comunica/bus-rdf-metadata-extract';
import type { IActionRdfResolveHypermedia, IActorRdfResolveHypermediaOutput, IActorRdfResolveHypermediaTest } from '@comunica/bus-rdf-resolve-hypermedia';
import { ActorRdfResolveHypermedia } from '@comunica/bus-rdf-resolve-hypermedia';
import type { ActionContext, Actor, IActorArgs, IActorTest, Mediator } from '@comunica/core';
import type * as RDF from 'rdf-js';
import { RdfSourceQpf } from './RdfSourceQpf';
/**
 * A comunica QPF RDF Resolve Quad Pattern Actor.
 */
export declare class ActorRdfResolveHypermediaQpf extends ActorRdfResolveHypermedia implements IActorRdfResolveHypermediaQpfArgs {
    readonly mediatorMetadata: Mediator<Actor<IActionRdfMetadata, IActorTest, IActorRdfMetadataOutput>, IActionRdfMetadata, IActorTest, IActorRdfMetadataOutput>;
    readonly mediatorMetadataExtract: Mediator<Actor<IActionRdfMetadataExtract, IActorTest, IActorRdfMetadataExtractOutput>, IActionRdfMetadataExtract, IActorTest, IActorRdfMetadataExtractOutput>;
    readonly mediatorRdfDereference: Mediator<Actor<IActionRdfDereference, IActorTest, IActorRdfDereferenceOutput>, IActionRdfDereference, IActorTest, IActorRdfDereferenceOutput>;
    readonly subjectUri: string;
    readonly predicateUri: string;
    readonly objectUri: string;
    readonly graphUri?: string;
    constructor(args: IActorRdfResolveHypermediaQpfArgs);
    testMetadata(action: IActionRdfResolveHypermedia): Promise<IActorRdfResolveHypermediaTest>;
    /**
     * Look for the search form
     * @param {IActionRdfResolveHypermedia} the metadata to look for the form.
     * @return {Promise<IActorRdfResolveHypermediaOutput>} A promise resolving to a hypermedia form.
     */
    run(action: IActionRdfResolveHypermedia): Promise<IActorRdfResolveHypermediaOutput>;
    protected createSource(metadata: Record<string, any>, context?: ActionContext, quads?: RDF.Stream): RdfSourceQpf;
}
export interface IActorRdfResolveHypermediaQpfArgs extends IActorArgs<IActionRdfResolveHypermedia, IActorRdfResolveHypermediaTest, IActorRdfResolveHypermediaOutput> {
    mediatorMetadata: Mediator<Actor<IActionRdfMetadata, IActorTest, IActorRdfMetadataOutput>, IActionRdfMetadata, IActorTest, IActorRdfMetadataOutput>;
    mediatorMetadataExtract: Mediator<Actor<IActionRdfMetadataExtract, IActorTest, IActorRdfMetadataExtractOutput>, IActionRdfMetadataExtract, IActorTest, IActorRdfMetadataExtractOutput>;
    mediatorRdfDereference: Mediator<Actor<IActionRdfDereference, IActorTest, IActorRdfDereferenceOutput>, IActionRdfDereference, IActorTest, IActorRdfDereferenceOutput>;
    subjectUri: string;
    predicateUri: string;
    objectUri: string;
    graphUri?: string;
}
