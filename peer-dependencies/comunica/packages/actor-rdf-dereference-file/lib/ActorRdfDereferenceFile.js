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
exports.ActorRdfDereferenceFile = void 0;
const fs = __importStar(require("fs"));
const url_1 = require("url");
const util_1 = require("util");
const bus_rdf_dereference_1 = require("@comunica/bus-rdf-dereference");
/**
 * A comunica File RDF Dereference Actor.
 */
class ActorRdfDereferenceFile extends bus_rdf_dereference_1.ActorRdfDereferenceMediaMappings {
    constructor(args) {
        super(args);
    }
    async test(action) {
        // console.log("dereference testing");
        try {
            await util_1.promisify(fs.access)(action.url.startsWith('file://') ? new url_1.URL(action.url) : action.url, fs.constants.F_OK);
        }
        catch (error) {
            throw new Error(`This actor only works on existing local files. (${error})`);
        }
        return true;
    }
    async run(action) {
        // console.log("dereference running");
        let { mediaType } = action;
        // Deduce media type from file extension if possible
        if (!mediaType) {
            mediaType = this.getMediaTypeFromExtension(action.url);
        }
        const parseAction = {
            context: action.context,
            handle: {
                baseIRI: action.url,
                input: fs.createReadStream(action.url.startsWith('file://') ? new url_1.URL(action.url) : action.url),
            },
        };
        if (mediaType) {
            parseAction.handleMediaType = mediaType;
        }
        let parseOutput;
        try {
            parseOutput = (await this.mediatorRdfParse.mediate(parseAction)).handle;
        }
        catch (error) {
            return this.handleDereferenceError(action, error);
        }
        return {
            headers: {},
            quads: this.handleDereferenceStreamErrors(action, parseOutput.quads),
            triples: parseOutput.triples,
            url: action.url,
        };
    }
}
exports.ActorRdfDereferenceFile = ActorRdfDereferenceFile;
//# sourceMappingURL=ActorRdfDereferenceFile.js.map