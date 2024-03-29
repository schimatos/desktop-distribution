"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorHttpNative = void 0;
const bus_http_1 = require("@comunica/bus-http");
require("cross-fetch/polyfill");
const Requester_1 = __importDefault(require("./Requester"));
/**
 * A comunica Follow Redirects Http Actor.
 */
class ActorHttpNative extends bus_http_1.ActorHttp {
    constructor(args) {
        super(args);
        this.userAgent = ActorHttpNative.createUserAgent();
        this.requester = new Requester_1.default(args.agentOptions ? JSON.parse(args.agentOptions) : undefined);
    }
    static createUserAgent() {
        return `Comunica/actor-http-native (${typeof global.navigator === 'undefined' ?
            `Node.js ${process.version}; ${process.platform}` :
            `Browser-${global.navigator.userAgent}`})`;
    }
    async test(action) {
        // TODO: check for unsupported fetch features
        return { time: Infinity };
    }
    async run(action) {
        const options = {};
        // Input can be a Request object or a string
        // if it is a Request object it can contain the same settings as the init object
        if (action.input.url) {
            options.url = action.input.url;
            Object.assign(options, action.input);
        }
        else {
            options.url = action.input;
        }
        if (action.init) {
            Object.assign(options, action.init);
            options.headers = new Headers(action.init.headers);
        }
        else {
            options.headers = action.input.headers;
        }
        if (!options.headers) {
            options.headers = new Headers();
        }
        if (!options.headers.has('user-agent')) {
            options.headers.append('user-agent', this.userAgent);
        }
        options.method = options.method || 'GET';
        if (action.context && action.context.get(bus_http_1.KEY_CONTEXT_INCLUDE_CREDENTIALS)) {
            options.withCredentials = true;
        }
        if (action.context && action.context.get(bus_http_1.KEY_CONTEXT_AUTH)) {
            options.auth = action.context.get(bus_http_1.KEY_CONTEXT_AUTH);
        }
        this.logInfo(action.context, `Requesting ${options.url}`, () => ({
            headers: bus_http_1.ActorHttp.headersToHash(options.headers),
        }));
        // Not all options are supported
        return new Promise((resolve, reject) => {
            const req = this.requester.createRequest(options);
            req.on('error', reject);
            req.on('response', httpResponse => {
                httpResponse.on('error', (error) => {
                    httpResponse = null;
                    reject(error);
                });
                // Avoid memory leak on HEAD requests
                if (options.method === 'HEAD') {
                    httpResponse.destroy();
                }
                // Using setImmediate so error can be caught should it be thrown
                setImmediate(() => {
                    if (httpResponse) {
                        // Expose fetch cancel promise
                        httpResponse.cancel = () => {
                            httpResponse.destroy();
                            return Promise.resolve();
                        };
                        // Missing several of the required fetch fields
                        const headers = httpResponse.headers;
                        const result = {
                            body: httpResponse,
                            headers,
                            ok: httpResponse.statusCode < 300,
                            redirected: options.url !== httpResponse.responseUrl,
                            status: httpResponse.statusCode,
                            // When the content came from another resource because of conneg, let Content-Location deliver the url
                            url: headers.has('content-location') ? headers.get('content-location') : httpResponse.responseUrl,
                        };
                        resolve(result);
                    }
                });
            });
        });
    }
}
exports.ActorHttpNative = ActorHttpNative;
//# sourceMappingURL=ActorHttpNative.js.map