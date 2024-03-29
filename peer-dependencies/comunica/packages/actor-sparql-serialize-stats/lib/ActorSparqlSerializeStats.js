"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorSparqlSerializeStats = void 0;
const stream_1 = require("stream");
const bus_sparql_serialize_1 = require("@comunica/bus-sparql-serialize");
/**
 * Serializes SPARQL results for testing and debugging.
 */
class ActorSparqlSerializeStats extends bus_sparql_serialize_1.ActorSparqlSerializeFixedMediaTypes {
    constructor(args) {
        super(args);
    }
    async testHandleChecked(action, context) {
        if (!['bindings', 'quads'].includes(action.type)) {
            throw new Error('This actor can only handle bindings streams or quad streams.');
        }
        return true;
    }
    pushHeader(data) {
        const header = ['Result', 'Delay (ms)', 'HTTP requests',
        ].join(',');
        data.push(`${header}\n`);
    }
    pushStat(data, startTime, result) {
        const row = [result, this.delay(startTime), this.httpObserver.requests,
        ].join(',');
        data.push(`${row}\n`);
    }
    pushFooter(data, startTime) {
        const footer = ['TOTAL', this.delay(startTime), this.httpObserver.requests,
        ].join(',');
        data.push(`${footer}\n`);
        data.push(null);
    }
    async runHandle(action, mediaType, context) {
        const data = new stream_1.Readable();
        data._read = () => {
            // Do nothing
        };
        const resultStream = action.type === 'bindings' ?
            action.bindingsStream :
            action.quadStream;
        // TODO: Make initiation timer configurable
        const startTime = process.hrtime();
        let result = 1;
        this.pushHeader(data);
        resultStream.on('error', error => data.emit('error', error));
        resultStream.on('data', () => this.pushStat(data, startTime, result++));
        resultStream.on('end', () => this.pushFooter(data, startTime));
        return { data };
    }
    delay(startTime) {
        const time = process.hrtime(startTime);
        return time[0] * 1000 + (time[1] / 1000000);
    }
}
exports.ActorSparqlSerializeStats = ActorSparqlSerializeStats;
//# sourceMappingURL=ActorSparqlSerializeStats.js.map