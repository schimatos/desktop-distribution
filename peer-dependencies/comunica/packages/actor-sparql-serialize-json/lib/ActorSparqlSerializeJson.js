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
exports.ActorSparqlSerializeJson = void 0;
const stream_1 = require("stream");
const bus_sparql_serialize_1 = require("@comunica/bus-sparql-serialize");
const RdfString = __importStar(require("rdf-string"));
/**
 * A comunica JSON SPARQL Serialize Actor.
 */
class ActorSparqlSerializeJson extends bus_sparql_serialize_1.ActorSparqlSerializeFixedMediaTypes {
    constructor(args) {
        super(args);
    }
    async testHandleChecked(action, context) {
        if (!['bindings', 'quads', 'boolean'].includes(action.type)) {
            throw new Error('This actor can only handle bindings or quad streams.');
        }
        return true;
    }
    async runHandle(action, mediaType, context) {
        const data = new stream_1.Readable();
        data._read = () => {
            // Do nothing
        };
        let empty = true;
        if (action.type === 'bindings') {
            const resultStream = action.bindingsStream;
            data.push('[');
            resultStream.on('error', error => data.emit('error', error));
            resultStream.on('data', element => {
                data.push(empty ? '\n' : ',\n');
                data.push(JSON.stringify(element.map(RdfString.termToString)));
                empty = false;
            });
            resultStream.on('end', () => {
                data.push(empty ? ']\n' : '\n]\n');
                data.push(null);
            });
        }
        else if (action.type === 'quads') {
            const resultStream = action.quadStream;
            data.push('[');
            resultStream.on('error', error => data.emit('error', error));
            resultStream.on('data', element => {
                data.push(empty ? '\n' : ',\n');
                data.push(JSON.stringify(RdfString.quadToStringQuad(element)));
                empty = false;
            });
            resultStream.on('end', () => {
                data.push(empty ? ']\n' : '\n]\n');
                data.push(null);
            });
        }
        else {
            try {
                data.push(`${JSON.stringify(await action.booleanResult)}\n`);
                data.push(null);
            }
            catch (error) {
                setImmediate(() => data.emit('error', error));
            }
        }
        return { data };
    }
}
exports.ActorSparqlSerializeJson = ActorSparqlSerializeJson;
//# sourceMappingURL=ActorSparqlSerializeJson.js.map