"use strict";
/* eslint-disable unicorn/filename-case */
/* ! @license MIT ©2013-2016 Ruben Verborgh, Ghent University - imec */
/* Single-function HTTP(S) request module for browsers */
/* Translated from https://github.com/LinkedDataFragments/Client.js/blob/master/lib/browser/Request.js */
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
const stream_1 = require("stream");
const parseLink = __importStar(require("parse-link-header"));
// Headers we cannot send (see https://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader()-method)
const UNSAFE_REQUEST_HEADERS = { 'accept-encoding': true, 'user-agent': true, referer: true };
class Requester {
    constructor() {
        this.negotiatedResources = {};
    }
    // Creates an HTTP request with the given settings
    createRequest(settings) {
        // PERFORMANCE HACK:
        // Reduce OPTIONS preflight requests by removing the Accept-Datetime header
        // on requests for resources that are presumed to have been time-negotiated
        if (this.negotiatedResources[this.removeQuery(settings.url)]) {
            settings.headers.delete('accept-datetime');
        }
        // Create the actual XMLHttpRequest
        const request = new XMLHttpRequest();
        const reqHeaders = settings.headers;
        request.open(settings.method, settings.url, true);
        request.timeout = settings.timeout;
        request.withCredentials = settings.withCredentials;
        reqHeaders.forEach((value, key) => {
            if (!(key in UNSAFE_REQUEST_HEADERS) && value) {
                request.setRequestHeader(key, value);
            }
        });
        // Create a proxy for the XMLHttpRequest
        const requestProxy = new events_1.EventEmitter();
        requestProxy.abort = () => {
            request.abort();
        };
        // Handle the arrival of a response
        request.onload = () => {
            var _a, _b;
            // Convert the response into an iterator
            const response = new stream_1.Readable();
            response.push(request.responseText || '');
            response.push(null);
            response.statusCode = request.status;
            response.responseUrl = request.responseURL;
            // Parse the response headers
            const resHeaders = this.convertRequestHeadersToFetchHeaders(response.headers);
            response.headers = resHeaders;
            const rawHeaders = request.getAllResponseHeaders() || '';
            const headerMatcher = /^([^\n\r:]+):[\t ]*([^\n\r]*)$/gmu;
            let match = headerMatcher.exec(rawHeaders);
            while (match) {
                resHeaders.set(match[1].toLowerCase(), match[2]);
                match = headerMatcher.exec(rawHeaders);
            }
            // Emit the response
            requestProxy.emit('response', response);
            // If the resource was time-negotiated, store its queryless URI
            // to enable the PERFORMANCE HACK explained above
            if (reqHeaders.has('accept-datetime') && resHeaders.has('memento-datetime')) {
                const resource = this.removeQuery((_a = resHeaders.get('content-location')) !== null && _a !== void 0 ? _a : settings.url);
                if (!this.negotiatedResources[resource]) {
                    // Ensure the resource is not a timegate
                    // @ts-ignore
                    const links = (_b = (resHeaders.get('link') && parseLink(resHeaders.get('link')))) !== null && _b !== void 0 ? _b : undefined;
                    const timegate = this.removeQuery(links && links.timegate && links.timegate.url);
                    if (resource !== timegate) {
                        this.negotiatedResources[resource] = true;
                    }
                }
            }
        };
        // Report errors and timeouts
        request.onerror = () => {
            requestProxy.emit('error', new Error(`Error requesting ${settings.url}`));
        };
        request.ontimeout = () => {
            requestProxy.emit('error', new Error(`Timeout requesting ${settings.url}`));
        };
        // Execute the request
        request.send();
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
    // Removes the query string from a URL
    removeQuery(url) {
        return url ? url.replace(/\?.*$/u, '') : '';
    }
}
exports.default = Requester;
//# sourceMappingURL=Requester-browser.js.map