"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQlQueryEngine = void 0;
const stream_to_string_1 = __importDefault(require("stream-to-string"));
/**
 * A comunica-based GraphQL-LD query engine.
 */
class GraphQlQueryEngine {
    constructor(comunicaEngine) {
        this.comunicaEngine = comunicaEngine;
    }
    async query(query, options) {
        const { data } = await this.comunicaEngine.resultToString(await this.comunicaEngine.query(query, options), 'application/sparql-results+json');
        return JSON.parse(await stream_to_string_1.default(data));
    }
}
exports.GraphQlQueryEngine = GraphQlQueryEngine;
//# sourceMappingURL=GraphQlQueryEngine.js.map