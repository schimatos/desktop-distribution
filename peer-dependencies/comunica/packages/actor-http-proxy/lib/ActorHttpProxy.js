"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KEY_CONTEXT_HTTPPROXYHANDLER = exports.ActorHttpProxy = void 0;
const bus_http_1 = require("@comunica/bus-http");
/**
 * A comunica Proxy Http Actor.
 */
class ActorHttpProxy extends bus_http_1.ActorHttp {
    constructor(args) {
        super(args);
    }
    async test(action) {
        if (!action.context) {
            throw new Error(`Actor ${this.name} could not find a context.`);
        }
        const proxyHandler = action.context.get(exports.KEY_CONTEXT_HTTPPROXYHANDLER);
        if (!proxyHandler) {
            throw new Error(`Actor ${this.name} could not find a proxy handler in the context.`);
        }
        if (!await proxyHandler.getProxy(action)) {
            throw new Error(`Actor ${this.name} could not determine a proxy for the given request.`);
        }
        return { time: Infinity };
    }
    async run(action) {
        var _a;
        const requestedUrl = typeof action.input === 'string' ? action.input : action.input.url;
        if (!action.context) {
            throw new Error('Illegal state: missing context');
        }
        const proxyHandler = action.context.get(exports.KEY_CONTEXT_HTTPPROXYHANDLER);
        // Send a request for the modified request
        const output = await this.mediatorHttp.mediate(Object.assign(Object.assign({}, await proxyHandler.getProxy(action)), { context: action.context.delete(exports.KEY_CONTEXT_HTTPPROXYHANDLER) }));
        // Modify the response URL
        output.url = (_a = output.headers.get('x-final-url')) !== null && _a !== void 0 ? _a : requestedUrl;
        return output;
    }
}
exports.ActorHttpProxy = ActorHttpProxy;
exports.KEY_CONTEXT_HTTPPROXYHANDLER = '@comunica/actor-http-proxy:httpProxyHandler';
//# sourceMappingURL=ActorHttpProxy.js.map