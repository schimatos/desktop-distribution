import type { IActionRdfMetadataExtract, IActorRdfMetadataExtractOutput } from '@comunica/bus-rdf-metadata-extract';
import { ActorRdfMetadataExtract } from '@comunica/bus-rdf-metadata-extract';
import type { IActorArgs, IActorTest } from '@comunica/core';
/**
 * An RDF Metadata Extract Actor that extracts total items counts from a metadata stream based on the given predicates.
 */
export declare class ActorRdfMetadataExtractHydraCount extends ActorRdfMetadataExtract implements IActorRdfParseFixedMediaTypesArgs {
    readonly predicates: string[];
    constructor(args: IActorRdfParseFixedMediaTypesArgs);
    test(action: IActionRdfMetadataExtract): Promise<IActorTest>;
    run(action: IActionRdfMetadataExtract): Promise<IActorRdfMetadataExtractOutput>;
}
export interface IActorRdfParseFixedMediaTypesArgs extends IActorArgs<IActionRdfMetadataExtract, IActorTest, IActorRdfMetadataExtractOutput> {
    predicates: string[];
}
