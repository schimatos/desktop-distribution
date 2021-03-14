"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfResolveQuadPatternFile = void 0;
const bus_rdf_resolve_quad_pattern_1 = require("@comunica/bus-rdf-resolve-quad-pattern");
const lru_cache_1 = __importDefault(require("lru-cache"));
const n3_1 = require("n3");
const N3StoreQuadSource_1 = require("./N3StoreQuadSource");
/**
 * A comunica File RDF Resolve Quad Pattern Actor.
 */
class ActorRdfResolveQuadPatternFile extends bus_rdf_resolve_quad_pattern_1.ActorRdfResolveQuadPatternSource {
    constructor(args) {
        super(args);
        this.cache = new lru_cache_1.default({ max: this.cacheSize });
        this.httpInvalidator.addInvalidateListener(({ url }) => url ? this.cache.del(url) : this.cache.reset());
    }
    initializeFile(file, context) {
        const storePromise = this.mediatorRdfDereference.mediate({ context, url: file })
            .then((page) => new Promise((resolve, reject) => {
            const store = new n3_1.Store();
            page.quads.on('data', quad => store.addQuad(quad));
            page.quads.on('error', reject);
            page.quads.on('end', () => resolve(store));
        }));
        this.cache.set(file, storePromise);
        return storePromise;
    }
    async initialize() {
        var _a;
        ((_a = this.files) !== null && _a !== void 0 ? _a : []).forEach(file => this.initializeFile(file));
        return null;
    }
    async test(action) {
        if (!this.hasContextSingleSourceOfType('file', action.context)) {
            throw new Error(`${this.name} requires a single source with a file to be present in the context.`);
        }
        return true;
    }
    async getSource(context) {
        const file = this.getContextSourceUrl(this.getContextSource(context));
        if (!file) {
            throw new Error('Illegal state: Invalid file source found.');
        }
        if (!this.cache.has(file)) {
            await this.initializeFile(file, context);
        }
        return new N3StoreQuadSource_1.N3StoreQuadSource(await this.cache.get(file));
    }
}
exports.ActorRdfResolveQuadPatternFile = ActorRdfResolveQuadPatternFile;
//# sourceMappingURL=ActorRdfResolveQuadPatternFile.js.map