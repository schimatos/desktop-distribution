import type { IActionHttp, IActorHttpOutput } from '@comunica/bus-http';
import type { ActionContext, Actor, IActorTest, Mediator } from '@comunica/core';
import { FetchDocumentLoader } from 'jsonld-context-parser';
/**
 * A JSON-LD document loader that fetches over an HTTP bus using a given mediator.
 */
export declare class DocumentLoaderMediated extends FetchDocumentLoader {
    private readonly mediatorHttp;
    private readonly context;
    constructor(mediatorHttp: Mediator<Actor<IActionHttp, IActorTest, IActorHttpOutput>, IActionHttp, IActorTest, IActorHttpOutput>, context: ActionContext);
    protected static createFetcher(mediatorHttp: Mediator<Actor<IActionHttp, IActorTest, IActorHttpOutput>, IActionHttp, IActorTest, IActorHttpOutput>, context: ActionContext): (input: RequestInfo, init: RequestInit) => Promise<Response>;
}
