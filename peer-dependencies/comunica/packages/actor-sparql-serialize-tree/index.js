"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindingsStreamToGraphQl = void 0;
__exportStar(require("./lib/ActorSparqlSerializeTree"), exports);
// eslint-disable-next-line no-duplicate-imports
const ActorSparqlSerializeTree_1 = require("./lib/ActorSparqlSerializeTree");
const { bindingsStreamToGraphQl } = ActorSparqlSerializeTree_1.ActorSparqlSerializeTree;
exports.bindingsStreamToGraphQl = bindingsStreamToGraphQl;
//# sourceMappingURL=index.js.map