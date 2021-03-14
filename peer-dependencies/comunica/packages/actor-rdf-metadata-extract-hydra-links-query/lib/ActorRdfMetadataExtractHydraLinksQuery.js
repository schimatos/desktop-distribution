"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfMetadataExtractHydraLinksQuery = void 0;
const bus_rdf_metadata_extract_1 = require("@comunica/bus-rdf-metadata-extract");
const GRAPHQLLD_CONTEXT = __importStar(require("./context.json"));
/**
 * A comunica Query-based Hydra Links RDF Metadata Extract Actor.
 */
class ActorRdfMetadataExtractHydraLinksQuery extends bus_rdf_metadata_extract_1.ActorRdfMetadataExtractQuery {
    constructor(args) {
        super(GRAPHQLLD_CONTEXT, ActorRdfMetadataExtractHydraLinksQuery.GRAPHQLLD_QUERY, args);
    }
    async test(action) {
        return true;
    }
    async run(action) {
        const metadata = await this.queryData(action.metadata, { '?pageUrl': action.url });
        delete metadata.graph;
        return { metadata };
    }
}
exports.ActorRdfMetadataExtractHydraLinksQuery = ActorRdfMetadataExtractHydraLinksQuery;
ActorRdfMetadataExtractHydraLinksQuery.GRAPHQLLD_QUERY = `
    query($pageUrl: String) @single(scope: all) {
      graph
      id(_: $pageUrl)
      first(alt: firstPage)       @optional
      next(alt: nextPage)         @optional
      previous(alt: previousPage) @optional
      last(alt: lastPage)         @optional
    }`;
//# sourceMappingURL=ActorRdfMetadataExtractHydraLinksQuery.js.map