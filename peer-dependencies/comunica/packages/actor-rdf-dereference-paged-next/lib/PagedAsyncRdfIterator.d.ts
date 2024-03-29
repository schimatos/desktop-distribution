import type { BufferedIteratorOptions } from 'asynciterator';
import { BufferedIterator } from 'asynciterator';
import type * as RDF from 'rdf-js';
/**
 * An abstract quad iterator that iterates over several pages.
 */
export declare abstract class PagedAsyncRdfIterator extends BufferedIterator<RDF.Quad> implements RDF.Stream {
    private readonly startUrl;
    private nextUrl?;
    private page;
    constructor(startUrl: string, options?: BufferedIteratorOptions);
    _read(count: number, done: () => void): void;
    /**
     * Create a new iterator for the given url, with the given page id.
     * @param {string} url The URL for which a quad iterator shuld be created.
     * @param {number} page The numerical page id. The first page is always page 0.
     * @param {(nextPage: string) => void} onNextPage A callback for when the next page url has been determined.
     *                                                This may be falsy if the last page was found
     * @return {Promise<RDF.Stream>} A promise that resolves to the quad data stream for the given page.
     */
    protected abstract getIterator(url: string, page: number, onNextPage: (nextPage?: string) => void): Promise<RDF.Stream>;
    /**
     * Start an iterator for the given page and inherit all its data elements and error event.
     * @param {string} url The URL for which a quad iterator should be created.
     * @param {number} page The numerical page id. The first page is always page 0.
     * @return {Promise<any>} A promise that resolves when a new iterator was started (but not necessarily ended).
     */
    protected startIterator(url: string, page: number): Promise<any>;
}
