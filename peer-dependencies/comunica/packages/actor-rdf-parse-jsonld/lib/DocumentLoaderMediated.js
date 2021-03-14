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
exports.DocumentLoaderMediated = void 0;
const bus_http_1 = require("@comunica/bus-http");
const jsonld_context_parser_1 = require("jsonld-context-parser");
const stringifyStream = __importStar(require("stream-to-string"));
/**
 * A JSON-LD document loader that fetches over an HTTP bus using a given mediator.
 */
class DocumentLoaderMediated extends jsonld_context_parser_1.FetchDocumentLoader {
    constructor(mediatorHttp, context) {
        super(DocumentLoaderMediated.createFetcher(mediatorHttp, context));
        this.mediatorHttp = mediatorHttp;
        this.context = context;
    }
    static createFetcher(mediatorHttp, context) {
        return async (url, init) => {
            const response = await mediatorHttp.mediate({ input: url, init, context });
            // @ts-ignore
            response.json = async () => JSON.parse(await stringifyStream(bus_http_1.ActorHttp.toNodeReadable(response.body)));
            return response;
        };
    }
}
exports.DocumentLoaderMediated = DocumentLoaderMediated;
//# sourceMappingURL=DocumentLoaderMediated.js.map