"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagedAsyncRdfIterator = void 0;
const asynciterator_1 = require("asynciterator");
/**
 * An abstract quad iterator that iterates over several pages.
 */
class PagedAsyncRdfIterator extends asynciterator_1.BufferedIterator {
    constructor(startUrl, options) {
        super(options);
        this.page = 0;
        this.startUrl = startUrl;
        this.nextUrl = startUrl;
    }
    _read(count, done) {
        if (this.nextUrl) {
            this.startIterator(this.nextUrl, this.page++)
                .then(done)
                .catch(error => this.emit('error', error));
        }
        else {
            done();
        }
    }
    /**
     * Start an iterator for the given page and inherit all its data elements and error event.
     * @param {string} url The URL for which a quad iterator should be created.
     * @param {number} page The numerical page id. The first page is always page 0.
     * @return {Promise<any>} A promise that resolves when a new iterator was started (but not necessarily ended).
     */
    async startIterator(url, page) {
        this.nextUrl = undefined;
        let ended = false;
        let shouldClose = false;
        const it = await this.getIterator(url, page, (nextPage) => {
            if (nextPage) {
                this.nextUrl = nextPage;
                this.readable = true;
            }
            else if (!ended) {
                shouldClose = true;
            }
            else {
                this.close();
            }
        });
        it.on('data', (quad) => {
            this._push(quad);
            this.readable = true;
        });
        it.on('error', (error) => this.emit('error', error));
        it.on('end', () => {
            ended = true;
            if (shouldClose) {
                this.close();
            }
        });
    }
}
exports.PagedAsyncRdfIterator = PagedAsyncRdfIterator;
//# sourceMappingURL=PagedAsyncRdfIterator.js.map