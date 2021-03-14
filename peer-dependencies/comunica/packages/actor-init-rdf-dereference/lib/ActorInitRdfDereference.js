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
exports.ActorInitRdfDereference = void 0;
const stream_1 = require("stream");
const bus_init_1 = require("@comunica/bus-init");
const RdfString = __importStar(require("rdf-string"));
/**
 * An RDF Parse actor that listens on the 'init' bus.
 *
 * It requires a mediator that is defined over the 'rdf-parse' bus,
 * and a mediaType that identifies the RDF serialization.
 */
class ActorInitRdfDereference extends bus_init_1.ActorInit {
    constructor(args) {
        super(args);
    }
    async test(action) {
        return true;
    }
    async run(action) {
        var _a;
        const dereference = {
            context: action.context,
            url: action.argv.length > 0 ? action.argv[0] : (_a = this.url) !== null && _a !== void 0 ? _a : '',
        };
        if (!dereference.url) {
            throw new Error('A URL must be given either in the config or as CLI arg');
        }
        const result = await this.mediatorRdfDereference.mediate(dereference);
        const readable = new stream_1.Readable();
        readable._read = () => {
            // Do nothing
        };
        result.quads.on('data', quad => readable.push(`${JSON.stringify(RdfString.quadToStringQuad(quad))}\n`));
        result.quads.on('end', () => readable.push(null));
        return { stdout: readable };
    }
}
exports.ActorInitRdfDereference = ActorInitRdfDereference;
//# sourceMappingURL=ActorInitRdfDereference.js.map