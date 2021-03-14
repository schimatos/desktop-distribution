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
exports.ActorRdfMetadataExtractHydraCountQuery = void 0;
const bus_rdf_metadata_extract_1 = require("@comunica/bus-rdf-metadata-extract");
const GRAPHQLLD_CONTEXT = __importStar(require("./context.json"));
/**
 * An RDF Metadata Extract Actor that extracts total items counts from a metadata stream based on the given predicates.
 */
class ActorRdfMetadataExtractHydraCountQuery extends bus_rdf_metadata_extract_1.ActorRdfMetadataExtractQuery {
    constructor(args) {
        super(GRAPHQLLD_CONTEXT, ActorRdfMetadataExtractHydraCountQuery.GRAPHQLLD_QUERY, args);
    }
    async test(action) {
        return true;
    }
    async run(action) {
        const queryData = await this.queryData(action.metadata, { '?pageUrl': action.url });
        if ('totalItems' in queryData && typeof queryData.totalItems !== 'number') {
            queryData.totalItems = Number.parseInt(queryData.totalItems, 10);
        }
        return {
            metadata: {
                totalItems: 'totalItems' in queryData ? queryData.totalItems : Infinity,
            },
        };
    }
}
exports.ActorRdfMetadataExtractHydraCountQuery = ActorRdfMetadataExtractHydraCountQuery;
ActorRdfMetadataExtractHydraCountQuery.GRAPHQLLD_QUERY = `
    query($pageUrl: String) @single(scope: all) {
      graph
      id(_: $pageUrl)
      totalItems(alt: triples)
    }`;
//# sourceMappingURL=ActorRdfMetadataExtractHydraCountQuery.js.map