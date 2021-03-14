import type { IActionRdfMetadataExtract, IActorRdfMetadataExtractOutput, IActorRdfMetadataExtractQueryArgs } from '@comunica/bus-rdf-metadata-extract';
import { ActorRdfMetadataExtractQuery } from '@comunica/bus-rdf-metadata-extract';
import type { IActorTest } from '@comunica/core';
/**
 * A comunica Query-based Hydra Links RDF Metadata Extract Actor.
 */
export declare class ActorRdfMetadataExtractHydraLinksQuery extends ActorRdfMetadataExtractQuery {
    static readonly GRAPHQLLD_QUERY: string;
    constructor(args: IActorRdfMetadataExtractQueryArgs);
    test(action: IActionRdfMetadataExtract): Promise<IActorTest>;
    run(action: IActionRdfMetadataExtract): Promise<IActorRdfMetadataExtractOutput>;
}
