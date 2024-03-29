import type { IActionHandleRdfParse, IActorOutputHandleRdfParse, IActorTestHandleRdfParse } from '@comunica/bus-rdf-parse';
import type { IHtmlParseListener } from '@comunica/bus-rdf-parse-html';
import type { Actor, Mediator } from '@comunica/core';
import { ActionContext } from '@comunica/core';
import type * as RDF from 'rdf-js';
/**
 * An HTML parse listeners that detects <script> data blocks with known RDF media tyoes,
 * parses them, and outputs the resulting quads.
 */
export declare class HtmlScriptListener implements IHtmlParseListener {
    private readonly mediatorRdfParseHandle;
    private readonly cbQuad;
    private readonly cbError;
    private readonly cbEnd;
    private readonly supportedTypes;
    private readonly context;
    private baseIRI;
    private readonly headers?;
    private readonly onlyFirstScript;
    private readonly targetScriptId;
    private handleMediaType?;
    private textChunks?;
    private textChunksJsonLd;
    private endBarrier;
    private passedScripts;
    private isFinalJsonLdProcessing;
    constructor(mediatorRdfParseHandle: Mediator<Actor<IActionHandleRdfParse, IActorTestHandleRdfParse, IActorOutputHandleRdfParse>, IActionHandleRdfParse, IActorTestHandleRdfParse, IActorOutputHandleRdfParse>, cbQuad: (quad: RDF.Quad) => void, cbError: (error: Error) => void, cbEnd: () => void, supportedTypes: Record<string, number>, context: ActionContext | undefined, baseIRI: string, headers: Headers | undefined);
    static newErrorCoded(message: string, code: string): Error;
    onEnd(): void;
    onTagClose(): void;
    onTagOpen(name: string, attributes: Record<string, string>): void;
    onText(data: string): void;
    /**
     * If we require custom JSON-LD handling for the given media type.
     *
     * The JSON-LD spec requires JSON-LD within script tags to be seen as a single document.
     * As such, we have to buffer all JSON-LD until the end of HTML processing,
     * and encapsulate all found contents in an array.
     *
     * @param mediaType A media type.
     */
    requiresCustomJsonLdHandling(mediaType: string): boolean;
}
