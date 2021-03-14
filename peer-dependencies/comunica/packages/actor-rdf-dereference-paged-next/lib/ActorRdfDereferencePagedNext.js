"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfDereferencePagedNext = void 0;
const bus_rdf_dereference_paged_1 = require("@comunica/bus-rdf-dereference-paged");
const lru_cache_1 = __importDefault(require("lru-cache"));
const MediatedPagedAsyncRdfIterator_1 = require("./MediatedPagedAsyncRdfIterator");
/**
 * An RDF Dereference Paged Actor that will lazily follow 'next' links as defined from the extracted metadata.
 */
class ActorRdfDereferencePagedNext extends bus_rdf_dereference_paged_1.ActorRdfDereferencePaged {
    constructor(args) {
        super(args);
        this.cache = this.cacheSize ? new lru_cache_1.default({ max: this.cacheSize }) : undefined;
        const cache = this.cache;
        if (cache) {
            this.httpInvalidator.addInvalidateListener(({ url }) => url ? cache.del(url) : cache.reset());
        }
    }
    test(action) {
        // Try to determine an actor in the RDF dereference bus to see if we can handle the given URL.
        return this.mediatorRdfDereference.mediateActor({ context: action.context, url: action.url });
    }
    run(action) {
        if (this.cache && this.cache.has(action.url)) {
            return this.cloneOutput(this.cache.get(action.url));
        }
        const output = this.runAsync(action);
        if (this.cache) {
            this.cache.set(action.url, output);
            return this.cloneOutput(output);
        }
        return output;
    }
    /**
     * Make a copy of the given output promise.
     * @param {Promise<IActorRdfDereferencePagedOutput>} outputPromise An output promise.
     * @return {Promise<IActorRdfDereferencePagedOutput>} A cloned output promise.
     */
    async cloneOutput(outputPromise) {
        const output = await outputPromise;
        return {
            data: output.data.clone(),
            firstPageMetadata: () => output.firstPageMetadata().then((metadata) => (Object.assign({}, metadata))),
            firstPageUrl: output.firstPageUrl,
            triples: output.triples,
        };
    }
    /**
     * Actual logic to produce the paged output.
     * @param {IActionRdfDereferencePaged} action An action.
     * @return {Promise<IActorRdfDereferencePagedOutput>} The output.
     */
    async runAsync(action) {
        const firstPage = await this.mediatorRdfDereference.mediate(action);
        const firstPageUrl = firstPage.url;
        const firstPageMetaSplit = await this.mediatorMetadata
            .mediate({ context: action.context, url: firstPageUrl, quads: firstPage.quads, triples: firstPage.triples });
        let materializedFirstPageMetadata;
        // eslint-disable-next-line no-return-assign
        const firstPageMetadata = () => materializedFirstPageMetadata !== null && materializedFirstPageMetadata !== void 0 ? materializedFirstPageMetadata : (materializedFirstPageMetadata = this.mediatorMetadataExtract.mediate({ context: action.context, url: firstPageUrl, metadata: firstPageMetaSplit.metadata }).then(output => output.metadata));
        const data = new MediatedPagedAsyncRdfIterator_1.MediatedPagedAsyncRdfIterator(firstPageUrl, firstPageMetaSplit.data, firstPageMetadata, this.mediatorRdfDereference, this.mediatorMetadata, this.mediatorMetadataExtract, action.context);
        return { firstPageUrl, data, firstPageMetadata, triples: firstPage.triples };
    }
}
exports.ActorRdfDereferencePagedNext = ActorRdfDereferencePagedNext;
//# sourceMappingURL=ActorRdfDereferencePagedNext.js.map