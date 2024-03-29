"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfResolveQuadPatternHypermedia = void 0;
const bus_rdf_resolve_quad_pattern_1 = require("@comunica/bus-rdf-resolve-quad-pattern");
const lru_cache_1 = __importDefault(require("lru-cache"));
const MediatedQuadSource_1 = require("./MediatedQuadSource");
/**
 * A comunica Hypermedia RDF Resolve Quad Pattern Actor.
 */
class ActorRdfResolveQuadPatternHypermedia extends bus_rdf_resolve_quad_pattern_1.ActorRdfResolveQuadPatternSource {
    constructor(args) {
        super(args);
        this.cache = this.cacheSize ? new lru_cache_1.default({ max: this.cacheSize }) : undefined;
        const cache = this.cache;
        if (cache) {
            this.httpInvalidator.addInvalidateListener(({ url }) => url ? cache.del(url) : cache.reset());
        }
    }
    async test(action) {
        const sources = this.hasContextSingleSource(action.context);
        if (!sources) {
            throw new Error(`Actor ${this.name} can only resolve quad pattern queries against a single source.`);
        }
        return true;
    }
    getSource(context, operation) {
        const contextSource = this.getContextSource(context);
        const url = this.getContextSourceUrl(contextSource);
        let source;
        // Try to read from cache
        if (this.cache && this.cache.has(url)) {
            source = this.cache.get(url);
        }
        else {
            // If not in cache, create a new source
            source = new MediatedQuadSource_1.MediatedQuadSource(this.cacheSize, context, url, bus_rdf_resolve_quad_pattern_1.getDataSourceType(contextSource), {
                mediatorMetadata: this.mediatorMetadata,
                mediatorMetadataExtract: this.mediatorMetadataExtract,
                mediatorRdfDereference: this.mediatorRdfDereference,
                mediatorRdfResolveHypermedia: this.mediatorRdfResolveHypermedia,
                mediatorRdfResolveHypermediaLinks: this.mediatorRdfResolveHypermediaLinks,
            });
            // Set in cache
            if (this.cache) {
                this.cache.set(url, source);
            }
        }
        return Promise.resolve(source);
    }
}
exports.ActorRdfResolveQuadPatternHypermedia = ActorRdfResolveQuadPatternHypermedia;
//# sourceMappingURL=ActorRdfResolveQuadPatternHypermedia.js.map