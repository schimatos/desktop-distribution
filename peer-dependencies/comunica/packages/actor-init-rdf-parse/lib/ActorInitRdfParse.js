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
exports.ActorInitRdfParse = void 0;
const stream_1 = require("stream");
const bus_init_1 = require("@comunica/bus-init");
const RdfString = __importStar(require("rdf-string"));
/**
 * An RDF Parse actor that listens on the 'init' bus.
 *
 * It requires a mediator that is defined over the 'rdf-parse' bus,
 * and a mediaType that identifies the RDF serialization.
 */
class ActorInitRdfParse extends bus_init_1.ActorInit {
    constructor(args) {
        super(args);
    }
    async test(action) {
        return true;
    }
    async run(action) {
        const mediaType = action.argv.length > 0 ? action.argv[0] : this.mediaType;
        const parseAction = { input: action.stdin, baseIRI: action.argv.length > 1 ? action.argv[1] : '' };
        const result = (await this.mediatorRdfParse.mediate({ context: action.context, handle: parseAction, handleMediaType: mediaType })).handle;
        result.quads.on('data', quad => readable.push(`${JSON.stringify(RdfString.quadToStringQuad(quad))}\n`));
        result.quads.on('end', () => readable.push(null));
        const readable = new stream_1.Readable();
        readable._read = () => {
            // Do nothing
        };
        return { stdout: readable, stderr: new stream_1.PassThrough() };
    }
}
exports.ActorInitRdfParse = ActorInitRdfParse;
//# sourceMappingURL=ActorInitRdfParse.js.map