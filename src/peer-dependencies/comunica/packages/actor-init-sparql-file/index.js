"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newEngineDynamic = exports.newEngine = void 0;
const QueryDynamic_1 = require("@comunica/actor-init-sparql/lib/QueryDynamic");
/**
 * Create a new comunica engine from the default config.
 * @return {ActorInitSparql} A comunica engine.
 */
function newEngine() {
    return require('./engine-default.js');
}
exports.newEngine = newEngine;
/**
 * Create a new dynamic comunica engine from a given config file.
 * @param {IQueryOptions} options Optional options on how to instantiate the query evaluator.
 * @return {Promise<QueryEngine>} A promise that resolves to a fully wired comunica engine.
 */
function newEngineDynamic(options) {
    return QueryDynamic_1.newEngineDynamicArged(options !== null && options !== void 0 ? options : {}, __dirname, `${__dirname}/config/config-default.json`);
}
exports.newEngineDynamic = newEngineDynamic;
//# sourceMappingURL=index.js.map