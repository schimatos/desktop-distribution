import type { IActionHttp, IActorHttpOutput } from '@comunica/bus-http';
import { ActorHttp,
  KEY_CONTEXT_INCLUDE_CREDENTIALS, KEY_CONTEXT_AUTH } from '@comunica/bus-http';
import type { IActorArgs } from '@comunica/core';
import type { IMediatorTypeTime } from '@comunica/mediatortype-time';
import 'cross-fetch/polyfill';

/**
 * A node-fetch actor that listens on the 'init' bus.
 *
 * It will call `fetch` with either action.input or action.url.
 */
export class ActorHttpNodeFetch extends ActorHttp {
  private readonly userAgent: string;

  public constructor(args: IActorArgs<IActionHttp, IMediatorTypeTime, IActorHttpOutput>) {
    super(args);
    this.userAgent = ActorHttpNodeFetch.createUserAgent();
  }

  public static createUserAgent(): string {
    return `Comunica/actor-http-node-fetch (${typeof global.navigator === 'undefined' ?
      `Node.js ${process.version}; ${process.platform}` :
      `Browser-${global.navigator.userAgent}`})`;
  }

  public async test(action: IActionHttp): Promise<IMediatorTypeTime> {
    return { time: Infinity };
  }

  public run(action: IActionHttp): Promise<IActorHttpOutput> {
    // Prepare headers
    const initHeaders = action.init ? action.init.headers || {} : {};
    action.init = action.init ? action.init : {};
    action.init.headers = new Headers(initHeaders);
    if (!action.init.headers.has('user-agent')) {
      action.init.headers.append('user-agent', this.userAgent);
    }
    if (action.context && action.context.get(KEY_CONTEXT_AUTH)) {
      action.init.headers.append('Authorization', `Basic ${Buffer.from(action.context.get(KEY_CONTEXT_AUTH)).toString('base64')}`);
    }

    // Log request
    this.logInfo(action.context, `Requesting ${typeof action.input === 'string' ?
      action.input :
      action.input.url}`, () => ({
      headers: ActorHttp.headersToHash(new Headers(action.init!.headers)),
    }));

    // Perform request
    return fetch(action.input, {
      ...action.init,
      ...action.context && action.context.get(KEY_CONTEXT_INCLUDE_CREDENTIALS) ? { credentials: 'include' } : {},
    });
  }
}
