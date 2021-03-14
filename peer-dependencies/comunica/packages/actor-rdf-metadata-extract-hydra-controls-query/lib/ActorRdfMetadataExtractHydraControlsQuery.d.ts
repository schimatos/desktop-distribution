import type { IActionRdfMetadataExtract, IActorRdfMetadataExtractOutput, IActorRdfMetadataExtractQueryArgs } from '@comunica/bus-rdf-metadata-extract';
import { ActorRdfMetadataExtractQuery } from '@comunica/bus-rdf-metadata-extract';
import type { IActorTest } from '@comunica/core';
import type { UriTemplate } from 'uritemplate';
/**
 * An RDF Metadata Extract Actor that extracts all Hydra search forms from the metadata stream.
 */
export declare class ActorRdfMetadataExtractHydraControlsQuery extends ActorRdfMetadataExtractQuery {
    static readonly GRAPHQLLD_QUERY: string;
    protected readonly parsedUriTemplateCache: Record<string, UriTemplate>;
    constructor(args: IActorRdfMetadataExtractQueryArgs);
    test(action: IActionRdfMetadataExtract): Promise<IActorTest>;
    run(action: IActionRdfMetadataExtract): Promise<IActorRdfMetadataExtractOutput>;
    /**
     * Parse a URI template, or retrieve it from a cache.
     * @param {string} template A URI template string.
     * @return {} A parsed URI template object.
     */
    parseUriTemplateCached(template: string): UriTemplate;
    /**
     * Find all hydra controls within the given query results.
     * @param queryResults The query results.
     * @return The discovered Hydra search forms.
     */
    constructHydraControls(queryResults: any): ISearchForms;
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
