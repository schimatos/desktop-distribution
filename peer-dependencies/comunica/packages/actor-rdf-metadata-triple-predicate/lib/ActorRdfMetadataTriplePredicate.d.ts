import type { IActionRdfMetadata, IActorRdfMetadataOutput } from '@comunica/bus-rdf-metadata';
import { ActorRdfMetadataQuadPredicate } from '@comunica/bus-rdf-metadata';
import type { IActorArgs, IActorTest } from '@comunica/core';
import type * as RDF from 'rdf-js';
/**
 * An RDF Metadata Actor that splits off the metadata based on the existence of a preconfigured set of predicates
 * with the page url as subject.
 */
export declare class ActorRdfMetadataTriplePredicate extends ActorRdfMetadataQuadPredicate implements IActorRdfParseFixedMediaTypesArgs {
    readonly predicateRegexes: string[];
    constructor(args: IActorRdfParseFixedMediaTypesArgs);
    test(action: IActionRdfMetadata): Promise<IActorTest>;
    isMetadata(quad: RDF.Quad, url: string, context: any): boolean;
}
export interface IActorRdfParseFixedMediaTypesArgs extends IActorArgs<IActionRdfMetadata, IActorTest, IActorRdfMetadataOutput> {
    predicateRegexes: string[];
}
