import type { IActionHttp, IActorHttpOutput } from '@comunica/bus-http';
import { ActorHttp } from '@comunica/bus-http';
import type { IActorArgs } from '@comunica/core';
import type { IMediatorTypeTime } from '@comunica/mediatortype-time';
import 'cross-fetch/polyfill';
/**
 * A node-fetch actor that listens on the 'init' bus.
 *
 * It will call `fetch` with either action.input or action.url.
 */
export declare class ActorHttpNodeFetch extends ActorHttp {
    private readonly userAgent;
    constructor(args: IActorArgs<IActionHttp, IMediatorTypeTime, IActorHttpOutput>);
    static createUserAgent(): string;
    test(action: IActionHttp): Promise<IMediatorTypeTime>;
    run(action: IActionHttp): Promise<IActorHttpOutput>;
}
