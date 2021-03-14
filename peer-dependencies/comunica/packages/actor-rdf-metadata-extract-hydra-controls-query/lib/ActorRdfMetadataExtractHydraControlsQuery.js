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
exports.ActorRdfMetadataExtractHydraControlsQuery = void 0;
const bus_rdf_metadata_extract_1 = require("@comunica/bus-rdf-metadata-extract");
const uritemplate_1 = require("uritemplate");
const GRAPHQLLD_CONTEXT = __importStar(require("./context.json"));
/**
 * An RDF Metadata Extract Actor that extracts all Hydra search forms from the metadata stream.
 */
class ActorRdfMetadataExtractHydraControlsQuery extends bus_rdf_metadata_extract_1.ActorRdfMetadataExtractQuery {
    constructor(args) {
        super(GRAPHQLLD_CONTEXT, ActorRdfMetadataExtractHydraControlsQuery.GRAPHQLLD_QUERY, args);
        this.parsedUriTemplateCache = {};
    }
    async test(action) {
        return true;
    }
    async run(action) {
        return {
            metadata: {
                searchForms: this.constructHydraControls(await this.queryData(action.metadata, { '?pageUrl': action.url })),
            },
        };
    }
    /**
     * Parse a URI template, or retrieve it from a cache.
     * @param {string} template A URI template string.
     * @return {} A parsed URI template object.
     */
    parseUriTemplateCached(template) {
        const cachedUriTemplate = this.parsedUriTemplateCache[template];
        if (cachedUriTemplate) {
            return cachedUriTemplate;
        }
        // eslint-disable-next-line no-return-assign
        return this.parsedUriTemplateCache[template] = uritemplate_1.parse(template);
    }
    /**
     * Find all hydra controls within the given query results.
     * @param queryResults The query results.
     * @return The discovered Hydra search forms.
     */
    constructHydraControls(queryResults) {
        const dataset = queryResults.id;
        const values = [];
        if (queryResults.search) {
            for (const search of queryResults.search) {
                const searchTemplate = this.parseUriTemplateCached(search.template);
                const mappings = (search.mapping || []).reduce((acc, entry) => {
                    acc[entry.property] = entry.variable;
                    return acc;
                }, {});
                const getUri = (entries) => searchTemplate
                    .expand(Object.keys(entries).reduce((variables, key) => {
                    variables[mappings[key]] = entries[key];
                    return variables;
                }, {}));
                values.push({
                    dataset,
                    getUri,
                    mappings,
                    template: search.template,
                });
            }
        }
        return { values };
    }
}
exports.ActorRdfMetadataExtractHydraControlsQuery = ActorRdfMetadataExtractHydraControlsQuery;
ActorRdfMetadataExtractHydraControlsQuery.GRAPHQLLD_QUERY = `
    query($pageUrl: String) @single(scope: all) {
      id
      graph
      subset(_: $pageUrl)
      search @plural {
        template
        mapping @optional @plural {
          variable
          property
        }
      }
    }`;
//# sourceMappingURL=ActorRdfMetadataExtractHydraControlsQuery.js.map