"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfMetadataExtractHydraControls = void 0;
const bus_rdf_metadata_extract_1 = require("@comunica/bus-rdf-metadata-extract");
const uritemplate_1 = require("uritemplate");
/**
 * An RDF Metadata Extract Actor that extracts all Hydra controls from the metadata stream.
 */
class ActorRdfMetadataExtractHydraControls extends bus_rdf_metadata_extract_1.ActorRdfMetadataExtract {
    constructor(args) {
        super(args);
        this.parsedUriTemplateCache = {};
    }
    async test(action) {
        return true;
    }
    /**
     * Collect all Hydra page links from the given Hydra properties object.
     * @param pageUrl The page URL in which the Hydra properties are defined.
     * @param hydraProperties The collected Hydra properties.
     * @return The Hydra links
     */
    getLinks(pageUrl, hydraProperties) {
        return ActorRdfMetadataExtractHydraControls.LINK_TYPES.reduce((metadata, link) => {
            // First check the correct hydra:next, then the deprecated hydra:nextPage
            const links = hydraProperties[link] || hydraProperties[`${link}Page`];
            const linkTargets = links && links[pageUrl];
            metadata[link] = linkTargets && linkTargets.length > 0 ? linkTargets[0] : null;
            return metadata;
        }, {});
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
     * Collect all search forms from the given Hydra properties object.
     * @param hydraProperties The collected Hydra properties.
     * @return The search forms.
     */
    getSearchForms(hydraProperties) {
        const searchFormData = hydraProperties.search;
        const searchForms = [];
        if (searchFormData) {
            for (const dataset in searchFormData) {
                for (const searchFormId of searchFormData[dataset]) {
                    const searchTemplates = (hydraProperties.template || {})[searchFormId] || [];
                    // Parse the template
                    if (searchTemplates.length !== 1) {
                        throw new Error(`Expected 1 hydra:template for ${searchFormId}`);
                    }
                    const template = searchTemplates[0];
                    const searchTemplate = this.parseUriTemplateCached(template);
                    // Parse the template mappings
                    const mappings = ((hydraProperties.mapping || {})[searchFormId] || [])
                        .reduce((acc, mapping) => {
                        const variable = ((hydraProperties.variable || {})[mapping] || [])[0];
                        const property = ((hydraProperties.property || {})[mapping] || [])[0];
                        if (!variable) {
                            throw new Error(`Expected a hydra:variable for ${mapping}`);
                        }
                        if (!property) {
                            throw new Error(`Expected a hydra:property for ${mapping}`);
                        }
                        acc[property] = variable;
                        return acc;
                    }, {});
                    // Gets the URL of the Triple Pattern Fragment with the given triple pattern
                    const getUri = (entries) => searchTemplate
                        .expand(Object.keys(entries).reduce((variables, key) => {
                        variables[mappings[key]] = entries[key];
                        return variables;
                    }, {}));
                    searchForms.push({ dataset, template, mappings, getUri });
                }
            }
        }
        return { values: searchForms };
    }
    /**
     * Collect all hydra properties from a given metadata stream
     * in a nice convenient nested hash (property / subject / objects).
     * @param {RDF.Stream} metadata
     * @return The collected Hydra properties.
     */
    getHydraProperties(metadata) {
        return new Promise((resolve, reject) => {
            metadata.on('error', reject);
            // Collect all hydra properties in a nice convenient nested hash (property / subject / objects).
            const hydraProperties = {};
            metadata.on('data', quad => {
                if (quad.predicate.value.startsWith(ActorRdfMetadataExtractHydraControls.HYDRA)) {
                    const property = quad.predicate.value.slice(ActorRdfMetadataExtractHydraControls.HYDRA.length);
                    const subjectProperties = hydraProperties[property] || (hydraProperties[property] = {});
                    const objects = subjectProperties[quad.subject.value] || (subjectProperties[quad.subject.value] = []);
                    objects.push(quad.object.value);
                }
            });
            metadata.on('end', () => resolve(hydraProperties));
        });
    }
    async run(action) {
        const metadata = {};
        const hydraProperties = await this.getHydraProperties(action.metadata);
        Object.assign(metadata, this.getLinks(action.url, hydraProperties));
        metadata.searchForms = this.getSearchForms(hydraProperties);
        return { metadata };
    }
}
exports.ActorRdfMetadataExtractHydraControls = ActorRdfMetadataExtractHydraControls;
ActorRdfMetadataExtractHydraControls.HYDRA = 'http://www.w3.org/ns/hydra/core#';
ActorRdfMetadataExtractHydraControls.LINK_TYPES = ['first', 'next', 'previous', 'last'];
//# sourceMappingURL=ActorRdfMetadataExtractHydraControls.js.map