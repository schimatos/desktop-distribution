"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfResolveQuadPatternFederated = void 0;
const bus_rdf_resolve_quad_pattern_1 = require("@comunica/bus-rdf-resolve-quad-pattern");
const FederatedQuadSource_1 = require("./FederatedQuadSource");
/**
 * A comunica Federated RDF Resolve Quad Pattern Actor.
 */
class ActorRdfResolveQuadPatternFederated extends bus_rdf_resolve_quad_pattern_1.ActorRdfResolveQuadPatternSource {
    constructor(args) {
        super(args);
        this.emptyPatterns = new Map();
    }
    async test(action) {
        const sources = this.getContextSources(action.context);
        if (!sources) {
            throw new Error(`Actor ${this.name} can only resolve quad pattern queries against a sources array.`);
        }
        return true;
    }
    async getSource(context) {
        return new FederatedQuadSource_1.FederatedQuadSource(this.mediatorResolveQuadPattern, context, this.emptyPatterns, this.skipEmptyPatterns);
    }
}
exports.ActorRdfResolveQuadPatternFederated = ActorRdfResolveQuadPatternFederated;
//# sourceMappingURL=ActorRdfResolveQuadPatternFederated.js.map