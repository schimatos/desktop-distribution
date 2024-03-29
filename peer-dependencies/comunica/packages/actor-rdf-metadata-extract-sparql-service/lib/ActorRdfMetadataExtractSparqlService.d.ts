import type { IActionRdfMetadataExtract, IActorRdfMetadataExtractOutput } from '@comunica/bus-rdf-metadata-extract';
import { ActorRdfMetadataExtract } from '@comunica/bus-rdf-metadata-extract';
import type { IActorArgs, IActorTest } from '@comunica/core';
/**
 * A comunica RDF Metadata Extract Actor for SPARQL service descriptions.
 */
export declare class ActorRdfMetadataExtractSparqlService extends ActorRdfMetadataExtract {
    constructor(args: IActorArgs<IActionRdfMetadataExtract, IActorTest, IActorRdfMetadataExtractOutput>);
    test(action: IActionRdfMetadataExtract): Promise<IActorTest>;
    run(action: IActionRdfMetadataExtract): Promise<IActorRdfMetadataExtractOutput>;
}
