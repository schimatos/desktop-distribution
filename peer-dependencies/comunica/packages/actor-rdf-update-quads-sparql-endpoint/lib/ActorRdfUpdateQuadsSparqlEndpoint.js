"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfUpdateQuadsSparqlEndpoint = void 0;
const bus_rdf_update_quads_1 = require("@comunica/bus-rdf-update-quads");
const utils_datasource_1 = require("@comunica/utils-datasource");
const sparqlalgebrajs_1 = require("sparqlalgebrajs");
const fetch_sparql_endpoint_1 = require("fetch-sparql-endpoint");
const bus_rdf_resolve_quad_pattern_1 = require("@comunica/bus-rdf-resolve-quad-pattern");
// import { QuadStream } from '@comunica/bus-query-operation';
// import { AsyncIterator } from 'asynciterator';
// import arrayifyStream from 'arrayify-stream'
/**
 * A comunica Sparql Endpoint RDF Update Quads Actor.
 */
class ActorRdfUpdateQuadsSparqlEndpoint extends bus_rdf_update_quads_1.ActorRdfUpdateQuads {
    constructor(args) {
        super(args);
        // TODO: Make sure endpoint fetcher is selecting and endpoint that allows updates
        this.endpointFetcher = new fetch_sparql_endpoint_1.SparqlEndpointFetcher({
            fetch: (input, init) => this.mediatorHttp.mediate({ input, init, context: this.lastContext }),
            prefixVariableQuestionMark: true,
        });
    }
    // TODO: Add test to ensure update requests are allowed.
    async testOperation(action) {
        var _a, _b;
        // console.log("test sparql operation");
        const source = await utils_datasource_1.DataSourceUtils.getSingleSource(action.context);
        if (!source) {
            // console.log("a");
            throw new Error('Illegal state: undefined sparql endpoint source.');
        }
        // @ts-ignore AFTER `||` is hacky workaround - do not use in production
        if (source && bus_rdf_resolve_quad_pattern_1.getDataSourceType(source) === 'sparql'
            // @ts-ignore
            || (bus_rdf_resolve_quad_pattern_1.getDataSourceType(source) === undefined && /\/sparql$/.test((_a = source === null || source === void 0 ? void 0 : source.value) !== null && _a !== void 0 ? _a : ''))
            // This is for the default apache jena fuseki config
            // @ts-ignore
            || (bus_rdf_resolve_quad_pattern_1.getDataSourceType(source) === undefined && /\/update$/.test((_b = source === null || source === void 0 ? void 0 : source.value) !== null && _b !== void 0 ? _b : ''))) {
            return { httpRequests: 1 };
        }
        // console.log(this);
        // console.log("Throwing error for sparql endpoint");
        throw new Error(`${this.name} requires a single source with a 'sparql' endpoint to be present in the context.`);
    }
    async runOperation(action) {
        // console.log("Run sparql operation");
        const source = await utils_datasource_1.DataSourceUtils.getSingleSource(action.context);
        if (!source) {
            throw new Error('Illegal state: undefined sparql endpoint source.');
        }
        const endpoint = bus_rdf_resolve_quad_pattern_1.getDataSourceValue(source);
        this.lastContext = action.context;
        const insertions = await action.quadStreamInsert
            ? await require('arrayify-stream')(action.quadStreamInsert)
                .then((array) => {
                // console.log("inside then", array);
                if (array.length === 0) {
                    return undefined;
                }
                else {
                    return array.map(quad => ActorRdfUpdateQuadsSparqlEndpoint.FACTORY.createPattern(quad.subject, quad.predicate, quad.object, quad.graph));
                }
            }).catch((e) => {
                // console.log(e);
            })
            : undefined;
        // console.log(insertions);
        const deletions = action.quadStreamDelete
            ? await require('arrayify-stream')(action.quadStreamDelete)
                .then((array) => {
                if (array.length === 0) {
                    return undefined;
                }
                else {
                    return array.map(quad => ActorRdfUpdateQuadsSparqlEndpoint.FACTORY.createPattern(quad.subject, quad.predicate, quad.object, quad.graph));
                }
            })
            : undefined;
        const query = sparqlalgebrajs_1.toSparql(ActorRdfUpdateQuadsSparqlEndpoint.FACTORY.createDeleteInsert(deletions, insertions));
        try {
            await this.endpointFetcher.fetchUpdate(endpoint, query);
        }
        catch (e) {
            return {};
        }
        ;
        return {
            quadStreamInserted: action.quadStreamInsert,
            quadStreamDeleted: action.quadStreamDelete
        };
    }
}
exports.ActorRdfUpdateQuadsSparqlEndpoint = ActorRdfUpdateQuadsSparqlEndpoint;
ActorRdfUpdateQuadsSparqlEndpoint.FACTORY = new sparqlalgebrajs_1.Factory();
//# sourceMappingURL=ActorRdfUpdateQuadsSparqlEndpoint.js.map