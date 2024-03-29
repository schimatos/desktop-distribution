"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediatedPagedAsyncRdfIterator = void 0;
const PagedAsyncRdfIterator_1 = require("./PagedAsyncRdfIterator");
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
class MediatedPagedAsyncRdfIterator extends PagedAsyncRdfIterator_1.PagedAsyncRdfIterator {
    constructor(firstPageUrl, firstPageData, firstPageMetadata, mediatorRdfDereference, mediatorMetadata, mediatorMetadataExtract, context) {
        super(firstPageUrl, { autoStart: false });
        this.firstPageData = firstPageData;
        this.firstPageMetadata = firstPageMetadata;
        this.mediatorRdfDereference = mediatorRdfDereference;
        this.mediatorMetadata = mediatorMetadata;
        this.mediatorMetadataExtract = mediatorMetadataExtract;
        this.context = context;
    }
    async getIterator(url, page, onNextPage) {
        let pageData;
        // Don't call mediators again if we are on the first page
        if (!page) {
            pageData = this.firstPageData;
            let next = '';
            try {
                next = (await this.firstPageMetadata()).next;
            }
            catch (error) {
                this.emit('error', error);
            }
            onNextPage(next);
        }
        else {
            const pageQuads = await this.mediatorRdfDereference
                .mediate({ context: this.context, url });
            const pageMetaSplit = await this.mediatorMetadata.mediate({ context: this.context, url: pageQuads.url, quads: pageQuads.quads, triples: pageQuads.triples });
            pageData = pageMetaSplit.data;
            // Don't await, we want to process metadata in the background.
            this.mediatorMetadataExtract
                .mediate({ context: this.context, url: pageQuads.url, metadata: pageMetaSplit.metadata })
                .then(result => onNextPage(result.metadata.next)).catch(error => this.emit('error', error));
        }
        return pageData;
    }
}
exports.MediatedPagedAsyncRdfIterator = MediatedPagedAsyncRdfIterator;
//# sourceMappingURL=MediatedPagedAsyncRdfIterator.js.map