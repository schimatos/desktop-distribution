import type { IActionRdfDereference, IActorRdfDereferenceOutput } from '@comunica/bus-rdf-dereference';
import type { IActionRdfMetadata, IActorRdfMetadataOutput } from '@comunica/bus-rdf-metadata';
import type { IActionRdfMetadataExtract, IActorRdfMetadataExtractOutput } from '@comunica/bus-rdf-metadata-extract';
import type { ActionContext, Actor, IActorTest, Mediator } from '@comunica/core';
import type * as RDF from 'rdf-js';
import { PagedAsyncRdfIterator } from './PagedAsyncRdfIterator';
/**
 * A PagedAsyncRdfIterator that pages based on a set of mediators.
 *
 * It expects the first page to be already processed partially.
 * Based on the data stream of the first page, and a promise to the metadata of the first page,
 * it will emit data elements from this page and all following pages using the 'next' metadata link.
 *
 * `mediatorRdfDereference` is used to dereference the 'next' link to a quad stream.
 * `mediatorMetadata` is used to split this quad stream into a data and metadata stream.
 * `mediatorMetadataExtract` is used to collect the metadata object from this metadata stream,
 * possibly containing another 'next' link.
 */
export declare class MediatedPagedAsyncRdfIterator extends PagedAsyncRdfIterator {
    readonly firstPageData: RDF.Stream;
    readonly firstPageMetadata: () => Promise<Record<string, any>>;
    readonly mediatorRdfDereference: Mediator<Actor<IActionRdfDereference, IActorTest, IActorRdfDereferenceOutput>, IActionRdfDereference, IActorTest, IActorRdfDereferenceOutput>;
    readonly mediatorMetadata: Mediator<Actor<IActionRdfMetadata, IActorTest, IActorRdfMetadataOutput>, IActionRdfMetadata, IActorTest, IActorRdfMetadataOutput>;
    readonly mediatorMetadataExtract: Mediator<Actor<IActionRdfMetadataExtract, IActorTest, IActorRdfMetadataExtractOutput>, IActionRdfMetadataExtract, IActorTest, IActorRdfMetadataExtractOutput>;
    readonly context?: ActionContext;
    constructor(firstPageUrl: string, firstPageData: RDF.Stream, firstPageMetadata: () => Promise<Record<string, any>>, mediatorRdfDereference: Mediator<Actor<IActionRdfDereference, IActorTest, IActorRdfDereferenceOutput>, IActionRdfDereference, IActorTest, IActorRdfDereferenceOutput>, mediatorMetadata: Mediator<Actor<IActionRdfMetadata, IActorTest, IActorRdfMetadataOutput>, IActionRdfMetadata, IActorTest, IActorRdfMetadataOutput>, mediatorMetadataExtract: Mediator<Actor<IActionRdfMetadataExtract, IActorTest, IActorRdfMetadataExtractOutput>, IActionRdfMetadataExtract, IActorTest, IActorRdfMetadataExtractOutput>, context?: ActionContext);
    protected getIterator(url: string, page: number, onNextPage: (nextPage: string) => void): Promise<RDF.Stream>;
}
