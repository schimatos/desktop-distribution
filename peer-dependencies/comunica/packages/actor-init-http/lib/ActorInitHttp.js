"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorInitHttp = void 0;
const stream_1 = require("stream");
const bus_http_1 = require("@comunica/bus-http");
const bus_init_1 = require("@comunica/bus-init");
/**
 * A http actor that listens on the 'init' bus.
 *
 * It will call `this.mediatorHttp.mediate`.
 */
class ActorInitHttp extends bus_init_1.ActorInit {
    constructor(args) {
        super(args);
    }
    async test(action) {
        return true;
    }
    async run(action) {
        var _a;
        const http = {
            context: action.context,
            init: {},
            input: action.argv.length > 0 ? action.argv[0] : (_a = this.url) !== null && _a !== void 0 ? _a : '',
        };
        if (this.method) {
            http.init.method = this.method;
        }
        if (this.headers) {
            const headers = new Headers();
            for (const value of this.headers) {
                const i = value.indexOf(':');
                headers.append(value.slice(0, i).toLowerCase(), value.slice(i + 2));
            }
            http.init.headers = headers;
        }
        const httpResponse = await this.mediatorHttp.mediate(http);
        const output = {};
        // Wrap WhatWG readable stream into a Node.js readable stream
        // If the body already is a Node.js stream (in the case of node-fetch), don't do explicit conversion.
        const responseStream = bus_http_1.ActorHttp.toNodeReadable(httpResponse.body);
        if (httpResponse.status === 200) {
            output.stdout = responseStream.pipe(new stream_1.PassThrough());
        }
        else {
            output.stderr = responseStream.pipe(new stream_1.PassThrough());
        }
        return output;
    }
}
exports.ActorInitHttp = ActorInitHttp;
//# sourceMappingURL=ActorInitHttp.js.map