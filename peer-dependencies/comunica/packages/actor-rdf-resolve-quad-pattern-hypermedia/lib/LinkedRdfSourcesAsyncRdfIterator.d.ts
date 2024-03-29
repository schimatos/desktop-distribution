import type { ILink } from '@comunica/bus-rdf-resolve-hypermedia-links';
import type { IQuadSource } from '@comunica/bus-rdf-resolve-quad-pattern';
import { BufferedIterator } from 'asynciterator';
import LRUCache from 'lru-cache';
import type * as RDF from 'rdf-js';
/**
 * An abstract quad iterator that can iterate over consecutive RDF sources.
 *
 * This iterator stores a queue of sources that need to be iterated over.
 * For each source, its collected metadata is maintained.
 */
export declare abstract class LinkedRdfSourcesAsyncRdfIterator extends BufferedIterator<RDF.Quad> implements RDF.Stream {
    sourcesState?: ISourcesState;
    protected readonly subject: RDF.Term;
    protected readonly predicate: RDF.Term;
    protected readonly object: RDF.Term;
    protected readonly graph: RDF.Term;
    protected nextSource: ISourceState | undefined;
    protected readonly linkQueue: ILink[];
    private readonly cacheSize;
    private readonly firstUrl;
    private started;
    private currentIterator;
    constructor(cacheSize: number, subject: RDF.Term, predicate: RDF.Term, object: RDF.Term, graph: RDF.Term, firstUrl: string);
    /**
     * This method can optionally called after constructing an instance
     * for allowing the sources state to be cached.
     *
     * When calling without args, then the default logic will be followed to determine the sources state.
     * When calling with an arg, then the given sources state will be set instead of following the default logic.
     *
     * After calling this method, the `sourcesState` field can be retrieved and optionally cached.
     *
     * This sources state also contains a hash of all handled datasets that will be copied upon first use.
     *
     * @param {ISourcesState} sourcesState An optional sources state.
     */
    setSourcesState(sourcesState?: ISourcesState): void;
    /**
     * Determine the links to be followed from the current source given its metadata.
     * @param metadata The metadata of a source.
     */
    protected abstract getSourceLinks(metadata: Record<string, any>): Promise<ILink[]>;
    /**
     * Resolve a source for the given URL.
     * @param link A source link.
     * @param handledDatasets A hash of dataset identifiers that have already been handled.
     */
    protected abstract getSource(link: ILink, handledDatasets: Record<string, boolean>): Promise<ISourceState>;
    /**
     * Resolve a source for the given URL.
     * This will first try to retrieve the source from cache.
     * @param link A source ILink.
     * @param handledDatasets A hash of dataset identifiers that have already been handled.
     */
    protected getSourceCached(link: ILink, handledDatasets: Record<string, boolean>): Promise<ISourceState>;
    _read(count: number, done: () => void): void;
    /**
     * Start a new iterator for the given source.
     * Once the iterator is done, it will either determine a new source, or it will close the linked iterator.
     * @param {ISourceState} startSource The start source state.
     * @param {boolean} emitMetadata If the metadata event should be emitted.
     */
    protected setCurrentIterator(startSource: ISourceState, emitMetadata: boolean): void;
    /**
     * Check if a next URL is in the queue.
     * If yes, start a new iterator.
     * If no, close this iterator.
     * @param startSource
     */
    protected handleNextUrl(startSource: ISourceState): void;
}
/**
 * A reusable sources state,
 * containing a cache of all source states.
 */
export interface ISourcesState {
    /**
     * A cache for source URLs to source states.
     */
    sources: LRUCache<string, Promise<ISourceState>>;
}
/**
 * The current state of a source.
 * This is needed for following links within a source.
 */
export interface ISourceState {
    /**
     * A source.
     */
    source?: IQuadSource;
    /**
     * The source's initial metadata.
     */
    metadata: Record<string, any>;
    /**
     * All dataset identifiers that have been passed for this source.
     */
    handledDatasets: Record<string, boolean>;
}
