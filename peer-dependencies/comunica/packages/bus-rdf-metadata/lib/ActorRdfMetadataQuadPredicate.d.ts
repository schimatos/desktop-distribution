import type { IActorArgs, IActorTest } from '@comunica/core';
import type * as RDF from 'rdf-js';
import type { IActionRdfMetadata, IActorRdfMetadataOutput } from './ActorRdfMetadata';
import { ActorRdfMetadata } from './ActorRdfMetadata';
/**
 * An abstract implementation of {@link ActorRdfMetadata} that
 * only requires the quad test {@link ActorRdfMetadata#isMetadata} method to be overridden.
 */
export declare abstract class ActorRdfMetadataQuadPredicate extends ActorRdfMetadata {
    constructor(args: IActorArgs<IActionRdfMetadata, IActorTest, IActorRdfMetadataOutput>);
    /**
     * If the given quad should be sent to the metadata stream.
     * Otherwise, it will be sent to the data stream.
     * @param {RDF.Quad} quad A quad.
     * @param pageUrl         The page URL from which the quads were retrieved.
     * @param context         An object that is shared across all invocations in a single action.
     *                        This can be used to maintain a state inside a single stream.
     * @return {boolean}      If the given quad is a metadata quad.
     */
    abstract isMetadata(quad: RDF.Quad, pageUrl: string, context: any): boolean;
    run(action: IActionRdfMetadata): Promise<IActorRdfMetadataOutput>;
}
