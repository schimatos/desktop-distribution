"use strict";
/* ! @license MIT ©2016 Ruben Verborgh, Ghent University - imec */
/* Single-function HTTP(S) request module */
/* Translated from https://github.com/LinkedDataFragments/Client.js/blob/master/lib/util/Request.js */
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
const events_1 = require("events");
const url = __importStar(require("url"));
const zlib = __importStar(require("zlib"));
require("cross-fetch/polyfill");
const { http } = require('follow-redirects');
const { https } = require('follow-redirects');
// Decode encoded streams with these decoders
const DECODERS = { gzip: zlib.createGunzip, deflate: zlib.createInflate };
class Requester {
    constructor(agentOptions) {
        this.agents = {
            http: new http.Agent(agentOptions !== null && agentOptions !== void 0 ? agentOptions : {}),
            https: new https.Agent(agentOptions !== null && agentOptions !== void 0 ? agentOptions : {}),
        };
    }
    // Creates an HTTP request with the given settings
    createRequest(settings) {
        // Parse the request URL
        if (settings.url) {
            settings = Object.assign(Object.assign({}, url.parse(settings.url)), settings);
        }
        // Emit the response through a proxy
        const requestProxy = new events_1.EventEmitter();
        const requester = settings.protocol === 'http:' ? http : https;
        settings.agents = this.agents;
        // Unpacking headers object into a plain object
        const headersObject = {};
        if (settings.headers) {
            settings.headers.forEach((value, key) => {
                headersObject[key] = value;
            });
        }
        settings.headers = headersObject;
        const request = requester.request(settings, (response) => {
            response = this.decode(response);
            settings.headers = response.headers;
            response.setEncoding('utf8');
            // This was removed compared to the original LDF client implementation
            // response.pause(); // exit flow mode
            requestProxy.emit('response', response);
        });
        request.on('error', error => requestProxy.emit('error', error));
        request.end();
        return requestProxy;
    }
    // Wrap headers into an header object type
    convertRequestHeadersToFetchHeaders(headers) {
        const responseHeaders = new Headers();
        for (const key in headers) {
            responseHeaders.append(key, headers[key]);
        }
        return responseHeaders;
    }
    // Returns a decompressed stream from the HTTP response
    decode(response) {
        const encoding = response.headers['content-encoding'];
        if (encoding) {
            if (encoding in DECODERS) {
                // Decode the stream
                const decoded = DECODERS[encoding]();
                response.pipe(decoded);
                // Copy response properties
                decoded.statusCode = response.statusCode;
                decoded.headers = this.convertRequestHeadersToFetchHeaders(response.headers);
                return decoded;
            }
            // Error when no suitable decoder found
            setImmediate(() => {
                response.emit('error', new Error(`Unsupported encoding: ${encoding}`));
            });
        }
        response.headers = this.convertRequestHeadersToFetchHeaders(response.headers);
        return response;
    }
}
exports.default = Requester;
//# sourceMappingURL=Requester.js.map