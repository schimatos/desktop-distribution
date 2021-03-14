"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KEY_CONTEXT_DATETIME = exports.ActorHttpMemento = void 0;
const bus_http_1 = require("@comunica/bus-http");
require("cross-fetch/polyfill");
const parseLink = __importStar(require("parse-link-header"));
/**
 * A comunica Memento Http Actor.
 */
class ActorHttpMemento extends bus_http_1.ActorHttp {
    constructor(args) {
        super(args);
    }
    async test(action) {
        var _a;
        if (!(action.context && action.context.has(exports.KEY_CONTEXT_DATETIME) &&
            action.context.get(exports.KEY_CONTEXT_DATETIME) instanceof Date)) {
            throw new Error('This actor only handles request with a set valid datetime.');
        }
        if (action.init && new Headers((_a = action.init.headers) !== null && _a !== void 0 ? _a : {}).has('accept-datetime')) {
            throw new Error('The request already has a set datetime.');
        }
        return true;
    }
    async run(action) {
        var _a;
        // Duplicate the ActionHttp to append a datetime header to the request.
        const init = action.init ? Object.assign({}, action.init) : {};
        const headers = init.headers = new Headers((_a = init.headers) !== null && _a !== void 0 ? _a : {});
        if (action.context && action.context.has(exports.KEY_CONTEXT_DATETIME)) {
            headers.append('accept-datetime', action.context.get(exports.KEY_CONTEXT_DATETIME).toUTCString());
        }
        const httpAction = { context: action.context, input: action.input, init };
        // Execute the request and follow the timegate in the response (if any).
        const result = await this.mediatorHttp.mediate(httpAction);
        // Did we ask for a time-negotiated response, but haven't received one?
        if (headers.has('accept-datetime') && result.headers && !result.headers.has('memento-datetime')) {
            // The links might have a timegate that can help us
            // @ts-ignore
            const links = result.headers.has('link') && parseLink(result.headers.get('link'));
            if (links && links.timegate) {
                if (result.body) {
                    await result.body.cancel();
                }
                // Respond with a time-negotiated response from the timegate instead
                const followLink = { context: action.context, input: links.timegate.url, init };
                return this.mediatorHttp.mediate(followLink);
            }
        }
        return result;
    }
}
exports.ActorHttpMemento = ActorHttpMemento;
/**
 * @type {string} Context entry for the desired datetime.
 */
exports.KEY_CONTEXT_DATETIME = '@comunica/actor-http-memento:datetime';
//# sourceMappingURL=ActorHttpMemento.js.map