"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorHttpNodeFetch = void 0;
const bus_http_1 = require("@comunica/bus-http");
require("cross-fetch/polyfill");
/**
 * A node-fetch actor that listens on the 'init' bus.
 *
 * It will call `fetch` with either action.input or action.url.
 */
class ActorHttpNodeFetch extends bus_http_1.ActorHttp {
    constructor(args) {
        super(args);
        this.userAgent = ActorHttpNodeFetch.createUserAgent();
    }
    static createUserAgent() {
        return `Comunica/actor-http-node-fetch (${typeof global.navigator === 'undefined' ?
            `Node.js ${process.version}; ${process.platform}` :
            `Browser-${global.navigator.userAgent}`})`;
    }
    async test(action) {
        return { time: Infinity };
    }
    run(action) {
        // Prepare headers
        const initHeaders = action.init ? action.init.headers || {} : {};
        action.init = action.init ? action.init : {};
        action.init.headers = new Headers(initHeaders);
        if (!action.init.headers.has('user-agent')) {
            action.init.headers.append('user-agent', this.userAgent);
        }
        if (action.context && action.context.get(bus_http_1.KEY_CONTEXT_AUTH)) {
            action.init.headers.append('Authorization', `Basic ${Buffer.from(action.context.get(bus_http_1.KEY_CONTEXT_AUTH)).toString('base64')}`);
        }
        // Log request
        this.logInfo(action.context, `Requesting ${typeof action.input === 'string' ?
            action.input :
            action.input.url}`, () => ({
            headers: bus_http_1.ActorHttp.headersToHash(new Headers(action.init.headers)),
        }));
        // Perform request
        return fetch(action.input, Object.assign(Object.assign({}, action.init), action.context && action.context.get(bus_http_1.KEY_CONTEXT_INCLUDE_CREDENTIALS) ? { credentials: 'include' } : {}));
    }
}
exports.ActorHttpNodeFetch = ActorHttpNodeFetch;
//# sourceMappingURL=ActorHttpNodeFetch.js.map