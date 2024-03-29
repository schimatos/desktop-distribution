import type { IActionHandleRdfParse, IActionMediaTypesRdfParse, IActorOutputHandleRdfParse, IActorOutputMediaTypesRdfParse, IActorTestHandleRdfParse, IActorTestMediaTypesRdfParse } from '@comunica/bus-rdf-parse';
import type { IActionRdfParseHtml, IActorRdfParseHtmlOutput } from '@comunica/bus-rdf-parse-html';
import { ActorRdfParseHtml } from '@comunica/bus-rdf-parse-html';
import type { Actor, IActorArgs, IActorTest, Mediator } from '@comunica/core';
/**
 * A HTML script RDF Parse actor that listens on the 'rdf-parse' bus.
 *
 * It is able to extract and parse any RDF serialization from script tags in HTML files
 * and announce the presence of them by media type.
 */
export declare class ActorRdfParseHtmlScript extends ActorRdfParseHtml {
    private readonly mediatorRdfParseMediatypes;
    private readonly mediatorRdfParseHandle;
    constructor(args: IActorRdfParseHtmlScriptArgs);
    test(action: IActionRdfParseHtml): Promise<IActorTest>;
    run(action: IActionRdfParseHtml): Promise<IActorRdfParseHtmlOutput>;
}
export interface IActorRdfParseHtmlScriptArgs extends IActorArgs<IActionRdfParseHtml, IActorTest, IActorRdfParseHtmlOutput> {
    mediatorRdfParseMediatypes: Mediator<Actor<IActionMediaTypesRdfParse, IActorTestMediaTypesRdfParse, IActorOutputMediaTypesRdfParse>, IActionMediaTypesRdfParse, IActorTestMediaTypesRdfParse, IActorOutputMediaTypesRdfParse>;
    mediatorRdfParseHandle: Mediator<Actor<IActionHandleRdfParse, IActorTestHandleRdfParse, IActorOutputHandleRdfParse>, IActionHandleRdfParse, IActorTestHandleRdfParse, IActorOutputHandleRdfParse>;
}
