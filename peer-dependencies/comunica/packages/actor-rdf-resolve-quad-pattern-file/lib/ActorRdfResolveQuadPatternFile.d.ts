import type { ActorHttpInvalidateListenable } from '@comunica/bus-http-invalidate';
import type { IActionRdfDereference, IActorRdfDereferenceOutput } from '@comunica/bus-rdf-dereference';
import type { IActionRdfResolveQuadPattern, IActorRdfResolveQuadPatternOutput, IQuadSource } from '@comunica/bus-rdf-resolve-quad-pattern';
import { ActorRdfResolveQuadPatternSource } from '@comunica/bus-rdf-resolve-quad-pattern';
import type { ActionContext, Actor, IActorArgs, IActorTest, Mediator } from '@comunica/core';
import LRUCache from 'lru-cache';
import { Store } from 'n3';
/**
 * A comunica File RDF Resolve Quad Pattern Actor.
 */
export declare class ActorRdfResolveQuadPatternFile extends ActorRdfResolveQuadPatternSource implements IActorRdfResolveQuadPatternFileArgs {
    readonly mediatorRdfDereference: Mediator<Actor<IActionRdfDereference, IActorTest, IActorRdfDereferenceOutput>, IActionRdfDereference, IActorTest, IActorRdfDereferenceOutput>;
    readonly files?: string[];
    readonly cacheSize: number;
    readonly cache: LRUCache<string, Promise<Store>>;
    readonly httpInvalidator: ActorHttpInvalidateListenable;
    constructor(args: IActorRdfResolveQuadPatternFileArgs);
    initializeFile(file: string, context?: ActionContext): Promise<any>;
    initialize(): Promise<any>;
    test(action: IActionRdfResolveQuadPattern): Promise<IActorTest>;
    protected getSource(context: ActionContext): Promise<IQuadSource>;
}
export interface IActorRdfResolveQuadPatternFileArgs extends IActorArgs<IActionRdfResolveQuadPattern, IActorTest, IActorRdfResolveQuadPatternOutput> {
    /**
     * The mediator to use for dereferencing files.
     */
    mediatorRdfDereference: Mediator<Actor<IActionRdfDereference, IActorTest, IActorRdfDereferenceOutput>, IActionRdfDereference, IActorTest, IActorRdfDereferenceOutput>;
    /**
     * The files to preload.
     */
    files?: string[];
    /**
     * The maximum number of files to be cached.
     */
    cacheSize: number;
    /**
     * An actor that listens to HTTP invalidation events
     */
    httpInvalidator: ActorHttpInvalidateListenable;
}
