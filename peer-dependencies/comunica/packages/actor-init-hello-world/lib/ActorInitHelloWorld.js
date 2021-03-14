"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorInitHelloWorld = void 0;
const stream_1 = require("stream");
const bus_init_1 = require("@comunica/bus-init");
const stringToStream = require('streamify-string');
/**
 * A Hello World actor that listens on the 'init' bus.
 *
 * It takes an optional `hello` parameter, which defaults to 'Hello'.
 * When run, it will print the `hello` parameter to the console,
 * followed by all arguments it received.
 */
class ActorInitHelloWorld extends bus_init_1.ActorInit {
    constructor(args) {
        super(args);
        if (!this.hello) {
            this.hello = 'Hello';
        }
    }
    async test(action) {
        return true;
    }
    async run(action) {
        return {
            stderr: new stream_1.PassThrough(),
            stdout: stringToStream(`${this.hello} ${action.argv.join(' ')}\n`),
        };
    }
}
exports.ActorInitHelloWorld = ActorInitHelloWorld;
//# sourceMappingURL=ActorInitHelloWorld.js.map