import type { IActionRdfMetadataExtract, IActorRdfMetadataExtractOutput } from '@comunica/bus-rdf-metadata-extract';
import { ActorRdfMetadataExtract } from '@comunica/bus-rdf-metadata-extract';
import type { IActorArgs, IActorTest } from '@comunica/core';
import type * as RDF from 'rdf-js';
import type { UriTemplate } from 'uritemplate';
/**
 * An RDF Metadata Extract Actor that extracts all Hydra controls from the metadata stream.
 */
export declare class ActorRdfMetadataExtractHydraControls extends ActorRdfMetadataExtract {
    static readonly HYDRA: string;
    static readonly LINK_TYPES: string[];
    protected readonly parsedUriTemplateCache: Record<string, UriTemplate>;
    constructor(args: IActorArgs<IActionRdfMetadataExtract, IActorTest, IActorRdfMetadataExtractOutput>);
    test(action: IActionRdfMetadataExtract): Promise<IActorTest>;
    /**
     * Collect all Hydra page links from the given Hydra properties object.
     * @param pageUrl The page URL in which the Hydra properties are defined.
     * @param hydraProperties The collected Hydra properties.
     * @return The Hydra links
     */
    getLinks(pageUrl: string, hydraProperties: Record<string, Record<string, string[]>>): Record<string, any>;
    /**
     * Parse a URI template, or retrieve it from a cache.
     * @param {string} template A URI template string.
     * @return {} A parsed URI template object.
     */
    parseUriTemplateCached(template: string): UriTemplate;
    /**
     * Collect all search forms from the given Hydra properties object.
     * @param hydraProperties The collected Hydra properties.
     * @return The search forms.
     */
    getSearchForms(hydraProperties: Record<string, Record<string, string[]>>): ISearchForms;
    /**
     * Collect all hydra properties from a given metadata stream
     * in a nice convenient nested hash (property / subject / objects).
     * @param {RDF.Stream} metadata
     * @return The collected Hydra properties.
     */
    getHydraProperties(metadata: RDF.Stream): Promise<Record<string, Record<string, string[]>>>;
    run(action: IActionRdfMetadataExtract): Promise<IActorRdfMetadataExtractOutput>;
}
export interface ISearchForm {
    /**
     * The dataset in which the search form is defined.
     */
    dataset: string;
    /**
     * The URI template containing Hydra variables.
     */
    template: string;
    /**
     * The mappings.
     * With as keys the Hydra properties,
     * and as values the Hydra variables
     */
    mappings: Record<string, string>;
    /**
     * Instantiate a uri based on the given Hydra variable values.
     * @param entries Entries with as keys Hydra properties,
     *                and as values Hydra variable values.
     * @return {string} The instantiated URI
     */
    getUri: (entries: Record<string, string>) => string;
}
export interface ISearchForms {
    /**
     * All available search forms.
     */
    values: ISearchForm[];
}
