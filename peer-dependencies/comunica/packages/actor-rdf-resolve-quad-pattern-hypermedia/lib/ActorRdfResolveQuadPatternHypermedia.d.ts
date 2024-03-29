import type { ActorHttpInvalidateListenable } from '@comunica/bus-http-invalidate';
import type { IActionRdfDereference, IActorRdfDereferenceOutput } from '@comunica/bus-rdf-dereference';
import type { IActionRdfMetadata, IActorRdfMetadataOutput } from '@comunica/bus-rdf-metadata';
import type { IActionRdfMetadataExtract, IActorRdfMetadataExtractOutput } from '@comunica/bus-rdf-metadata-extract';
import type { IActionRdfResolveHypermedia, IActorRdfResolveHypermediaOutput } from '@comunica/bus-rdf-resolve-hypermedia';
import type { IActionRdfResolveHypermediaLinks, IActorRdfResolveHypermediaLinksOutput } from '@comunica/bus-rdf-resolve-hypermedia-links';
import type { IActionRdfResolveQuadPattern, IActorRdfResolveQuadPatternOutput, IQuadSource } from '@comunica/bus-rdf-resolve-quad-pattern';
import { ActorRdfResolveQuadPatternSource } from '@comunica/bus-rdf-resolve-quad-pattern';
import type { ActionContext, Actor, IActorArgs, IActorTest, Mediator } from '@comunica/core';
import LRUCache from 'lru-cache';
import type { Algebra } from 'sparqlalgebrajs';
import { MediatedQuadSource } from './MediatedQuadSource';
/**
 * A comunica Hypermedia RDF Resolve Quad Pattern Actor.
 */
export declare class ActorRdfResolveQuadPatternHypermedia extends ActorRdfResolveQuadPatternSource implements IActorRdfResolveQuadPatternHypermediaArgs {
    readonly mediatorRdfDereference: Mediator<Actor<IActionRdfDereference, IActorTest, IActorRdfDereferenceOutput>, IActionRdfDereference, IActorTest, IActorRdfDereferenceOutput>;
    readonly mediatorMetadata: Mediator<Actor<IActionRdfMetadata, IActorTest, IActorRdfMetadataOutput>, IActionRdfMetadata, IActorTest, IActorRdfMetadataOutput>;
    readonly mediatorMetadataExtract: Mediator<Actor<IActionRdfMetadataExtract, IActorTest, IActorRdfMetadataExtractOutput>, IActionRdfMetadataExtract, IActorTest, IActorRdfMetadataExtractOutput>;
    readonly mediatorRdfResolveHypermedia: Mediator<Actor<IActionRdfResolveHypermedia, IActorTest, IActorRdfResolveHypermediaOutput>, IActionRdfResolveHypermedia, IActorTest, IActorRdfResolveHypermediaOutput>;
    readonly mediatorRdfResolveHypermediaLinks: Mediator<Actor<IActionRdfResolveHypermediaLinks, IActorTest, IActorRdfResolveHypermediaLinksOutput>, IActionRdfResolveHypermediaLinks, IActorTest, IActorRdfResolveHypermediaLinksOutput>;
    readonly cacheSize: number;
    readonly cache?: LRUCache<string, MediatedQuadSource>;
    readonly httpInvalidator: ActorHttpInvalidateListenable;
    constructor(args: IActorRdfResolveQuadPatternHypermediaArgs);
    test(action: IActionRdfResolveQuadPattern): Promise<IActorTest>;
    protected getSource(context: ActionContext, operation: Algebra.Pattern): Promise<IQuadSource>;
}
export interface IActorRdfResolveQuadPatternHypermediaArgs extends IActorArgs<IActionRdfResolveQuadPattern, IActorTest, IActorRdfResolveQuadPatternOutput> {
    cacheSize: number;
    httpInvalidator: ActorHttpInvalidateListenable;
    mediatorRdfDereference: Mediator<Actor<IActionRdfDereference, IActorTest, IActorRdfDereferenceOutput>, IActionRdfDereference, IActorTest, IActorRdfDereferenceOutput>;
    mediatorMetadata: Mediator<Actor<IActionRdfMetadata, IActorTest, IActorRdfMetadataOutput>, IActionRdfMetadata, IActorTest, IActorRdfMetadataOutput>;
    mediatorMetadataExtract: Mediator<Actor<IActionRdfMetadataExtract, IActorTest, IActorRdfMetadataExtractOutput>, IActionRdfMetadataExtract, IActorTest, IActorRdfMetadataExtractOutput>;
    mediatorRdfResolveHypermedia: Mediator<Actor<IActionRdfResolveHypermedia, IActorTest, IActorRdfResolveHypermediaOutput>, IActionRdfResolveHypermedia, IActorTest, IActorRdfResolveHypermediaOutput>;
    mediatorRdfResolveHypermediaLinks: Mediator<Actor<IActionRdfResolveHypermediaLinks, IActorTest, IActorRdfResolveHypermediaLinksOutput>, IActionRdfResolveHypermediaLinks, IActorTest, IActorRdfResolveHypermediaLinksOutput>;
}
