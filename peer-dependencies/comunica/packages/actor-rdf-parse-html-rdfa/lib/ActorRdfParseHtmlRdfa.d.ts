import type { IActionRdfParseHtml, IActorRdfParseHtmlOutput } from '@comunica/bus-rdf-parse-html';
import { ActorRdfParseHtml } from '@comunica/bus-rdf-parse-html';
import type { IActorArgs, IActorTest } from '@comunica/core';
/**
 * A comunica RDFa RDF Parse Html Actor.
 */
export declare class ActorRdfParseHtmlRdfa extends ActorRdfParseHtml {
    constructor(args: IActorArgs<IActionRdfParseHtml, IActorTest, IActorRdfParseHtmlOutput>);
    test(action: IActionRdfParseHtml): Promise<IActorTest>;
    run(action: IActionRdfParseHtml): Promise<IActorRdfParseHtmlOutput>;
}
