import type { IActionRdfMetadataExtract, IActorRdfMetadataExtractOutput, IActorRdfMetadataExtractQueryArgs } from '@comunica/bus-rdf-metadata-extract';
import { ActorRdfMetadataExtractQuery } from '@comunica/bus-rdf-metadata-extract';
import type { IActorTest } from '@comunica/core';
/**
 * An RDF Metadata Extract Actor that extracts total items counts from a metadata stream based on the given predicates.
 */
export declare class ActorRdfMetadataExtractHydraCountQuery extends ActorRdfMetadataExtractQuery {
    static readonly GRAPHQLLD_QUERY: string;
    constructor(args: IActorRdfMetadataExtractQueryArgs);
    test(action: IActionRdfMetadataExtract): Promise<IActorTest>;
    run(action: IActionRdfMetadataExtract): Promise<IActorRdfMetadataExtractOutput>;
}
