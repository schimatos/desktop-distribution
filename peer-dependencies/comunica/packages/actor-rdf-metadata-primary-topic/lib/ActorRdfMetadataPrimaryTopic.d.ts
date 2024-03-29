import type { IActionRdfMetadata, IActorRdfMetadataOutput } from '@comunica/bus-rdf-metadata';
import { ActorRdfMetadata } from '@comunica/bus-rdf-metadata';
import type { IActorArgs, IActorTest } from '@comunica/core';
/**
 * An RDF Metadata Actor that splits off the metadata based on the existence of a 'foaf:primaryTopic' link.
 * Only non-triple quad streams are supported.
 */
export declare class ActorRdfMetadataPrimaryTopic extends ActorRdfMetadata {
    private readonly metadataToData;
    private readonly dataToMetadataOnInvalidMetadataGraph;
    constructor(args: IActorRdfMetadataPrimaryTopicArgs);
    test(action: IActionRdfMetadata): Promise<IActorTest>;
    run(action: IActionRdfMetadata): Promise<IActorRdfMetadataOutput>;
}
export interface IActorRdfMetadataPrimaryTopicArgs extends IActorArgs<IActionRdfMetadata, IActorTest, IActorRdfMetadataOutput> {
    metadataToData: boolean;
    dataToMetadataOnInvalidMetadataGraph: boolean;
}
