"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkedRdfSourcesAsyncRdfIterator = void 0;
const asynciterator_1 = require("asynciterator");
const lru_cache_1 = __importDefault(require("lru-cache"));
/**
 * An abstract quad iterator that can iterate over consecutive RDF sources.
 *
 * This iterator stores a queue of sources that need to be iterated over.
 * For each source, its collected metadata is maintained.
 */
class LinkedRdfSourcesAsyncRdfIterator extends asynciterator_1.BufferedIterator {
    constructor(cacheSize, subject, predicate, object, graph, firstUrl) {
        super({ autoStart: true });
        this.started = false;
        this.cacheSize = cacheSize;
        this.subject = subject;
        this.predicate = predicate;
        this.object = object;
        this.graph = graph;
        this.linkQueue = [];
        this.firstUrl = firstUrl;
    }
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
    setSourcesState(sourcesState) {
        if (sourcesState) {
            this.sourcesState = sourcesState;
        }
        else {
            this.sourcesState = {
                sources: new lru_cache_1.default({ max: this.cacheSize }),
            };
            // Ignore the response, we just want the promise to be cached
            this.getSourceCached({ url: this.firstUrl }, {})
                .catch(error => this.destroy(error));
        }
    }
    /**
     * Resolve a source for the given URL.
     * This will first try to retrieve the source from cache.
     * @param link A source ILink.
     * @param handledDatasets A hash of dataset identifiers that have already been handled.
     */
    getSourceCached(link, handledDatasets) {
        let source = this.sourcesState.sources.get(link.url);
        if (source) {
            return source;
        }
        source = this.getSource(link, handledDatasets);
        this.sourcesState.sources.set(link.url, source);
        return source;
    }
    _read(count, done) {
        if (!this.started) {
            // The first time this is called, prepare the first source
            this.started = true;
            // Create a sources state if needed (can be defined if set from actor cache)
            if (!this.sourcesState) {
                this.setSourcesState();
            }
            // Await the source to be set, and start the source iterator
            this.getSourceCached({ url: this.firstUrl }, {})
                .then(sourceState => {
                this.setCurrentIterator(sourceState, true);
                done();
            })
                .catch(error => {
                // We can safely ignore this error, since it handled in setSourcesState
                done();
            });
        }
        else if (this.currentIterator) {
            // If an iterator has been set, read from it.
            while (count > 0) {
                const read = this.currentIterator.read();
                if (read !== null) {
                    count--;
                    this._push(read);
                }
                else {
                    break;
                }
            }
            done();
        }
        else {
            // This can occur during source loading.
            done();
        }
    }
    /**
     * Start a new iterator for the given source.
     * Once the iterator is done, it will either determine a new source, or it will close the linked iterator.
     * @param {ISourceState} startSource The start source state.
     * @param {boolean} emitMetadata If the metadata event should be emitted.
     */
    setCurrentIterator(startSource, emitMetadata) {
        // Delegate the quad pattern query to the given source
        this.currentIterator = startSource.source
            .match(this.subject, this.predicate, this.object, this.graph);
        let receivedMetadata = false;
        // Attach readers to the newly created iterator
        this.currentIterator._destination = this;
        this.currentIterator.on('error', (error) => this.destroy(error));
        this.currentIterator.on('readable', () => this._fillBuffer());
        this.currentIterator.on('end', () => {
            this.currentIterator = undefined;
            // If the metadata was already received, handle the next URL in the queue
            if (receivedMetadata) {
                this.handleNextUrl(startSource);
            }
        });
        // Listen for the metadata of the source
        // The metadata property is guaranteed to be set
        this.currentIterator.getProperty('metadata', (metadata) => {
            startSource.metadata = Object.assign(Object.assign({}, startSource.metadata), metadata);
            // Emit metadata if needed
            if (emitMetadata) {
                this.setProperty('metadata', startSource.metadata);
            }
            // Determine next urls, which will eventually become a next-next source.
            this.getSourceLinks(startSource.metadata)
                .then((nextUrls) => Promise.all(nextUrls))
                .then(async (nextUrls) => {
                // Append all next URLs to our queue
                for (const nextUrl of nextUrls) {
                    this.linkQueue.push(nextUrl);
                }
                // Handle the next queued URL if we don't have an active iterator (in which case it will be called later)
                receivedMetadata = true;
                if (!this.currentIterator) {
                    this.handleNextUrl(startSource);
                }
            }).catch(error => this.destroy(error));
        });
    }
    /**
     * Check if a next URL is in the queue.
     * If yes, start a new iterator.
     * If no, close this iterator.
     * @param startSource
     */
    handleNextUrl(startSource) {
        if (this.linkQueue.length === 0) {
            this.close();
        }
        else {
            this.getSourceCached(this.linkQueue[0], startSource.handledDatasets)
                .then(nextSourceState => this.setCurrentIterator(nextSourceState, false))
                .catch(error => this.destroy(error));
            this.linkQueue.shift();
        }
    }
}
exports.LinkedRdfSourcesAsyncRdfIterator = LinkedRdfSourcesAsyncRdfIterator;
//# sourceMappingURL=LinkedRdfSourcesAsyncRdfIterator.js.map