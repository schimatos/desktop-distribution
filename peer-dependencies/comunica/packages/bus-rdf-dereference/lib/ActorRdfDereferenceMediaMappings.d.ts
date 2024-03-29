import type { IActorArgs, IActorTest } from '@comunica/core';
import type { IActionRdfDereference, IActorRdfDereferenceOutput } from './ActorRdfDereference';
import { ActorRdfDereference } from './ActorRdfDereference';
/**
 * A base actor for dereferencing URLs to quad streams.
 *
 * Actor types:
 * * Input:  IActionRdfDereference:      A URL.
 * * Test:   <none>
 * * Output: IActorRdfDereferenceOutput: A quad stream.
 *
 * @see IActionRdfDereference
 * @see IActorRdfDereferenceOutput
 */
export declare abstract class ActorRdfDereferenceMediaMappings extends ActorRdfDereference {
    readonly mediaMappings: Record<string, string>;
    constructor(args: IActorRdfDereferenceMediaMappingsArgs);
    /**
     * Get the media type based on the extension of the given path,
     * which can be an URL or file path.
     * @param {string} path A path.
     * @return {string} A media type or the empty string.
     */
    getMediaTypeFromExtension(path: string): string;
}
export interface IActorRdfDereferenceMediaMappingsArgs extends IActorArgs<IActionRdfDereference, IActorTest, IActorRdfDereferenceOutput> {
    /**
     * A collection of mappings, mapping file extensions to their corresponding media type.
     */
    mediaMappings: Record<string, string>;
}
