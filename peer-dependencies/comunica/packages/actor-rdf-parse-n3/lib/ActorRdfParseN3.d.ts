import type { IActionRdfParse, IActorRdfParseFixedMediaTypesArgs, IActorRdfParseOutput } from '@comunica/bus-rdf-parse';
import { ActorRdfParseFixedMediaTypes } from '@comunica/bus-rdf-parse';
import type { ActionContext } from '@comunica/core';
/**
 * An N3 RDF Parse actor that listens on the 'rdf-parse' bus.
 *
 * It is able to parse N3-based RDF serializations and announce the presence of them by media type.
 */
export declare class ActorRdfParseN3 extends ActorRdfParseFixedMediaTypes {
    constructor(args: IActorRdfParseFixedMediaTypesArgs);
    runHandle(action: IActionRdfParse, mediaType: string, context: ActionContext): Promise<IActorRdfParseOutput>;
}
