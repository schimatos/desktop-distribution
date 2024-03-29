"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorSparqlSerializeTree = void 0;
const stream_1 = require("stream");
const bus_sparql_serialize_1 = require("@comunica/bus-sparql-serialize");
const core_1 = require("@comunica/core");
const sparqljson_to_tree_1 = require("sparqljson-to-tree");
/**
 * A comunica Tree SPARQL Serialize Actor.
 */
class ActorSparqlSerializeTree extends bus_sparql_serialize_1.ActorSparqlSerializeFixedMediaTypes {
    constructor(args) {
        super(args);
    }
    /**
     *
     * @param {BindingsStream} bindingsStream
     * @param context
     * @param {IConverterSettings} converterSettings
     * @return {Promise<string>}
     */
    static bindingsStreamToGraphQl(bindingsStream, context, converterSettings) {
        const actionContext = core_1.ensureActionContext(context);
        return new Promise((resolve, reject) => {
            const bindingsArray = [];
            const converter = new sparqljson_to_tree_1.Converter(converterSettings);
            const schema = {
                singularizeVariables: actionContext.get('@comunica/actor-init-sparql:singularizeVariables') || {},
            };
            bindingsStream.on('error', reject);
            bindingsStream.on('data', bindings => {
                const rawBindings = bindings.toJS();
                const reKeyedBindings = {};
                // Removes the '?' prefix
                for (const key in rawBindings) {
                    reKeyedBindings[key.slice(1)] = rawBindings[key];
                }
                bindingsArray.push(reKeyedBindings);
            });
            bindingsStream.on('end', () => {
                resolve(converter.bindingsToTree(bindingsArray, schema));
            });
        });
    }
    async testHandleChecked(action) {
        if (action.type !== 'bindings') {
            throw new Error('This actor can only handle bindings streams.');
        }
        return true;
    }
    async runHandle(action, mediaType) {
        const data = new stream_1.Readable();
        data._read = () => {
            // Do nothing
        };
        const resultStream = action.bindingsStream;
        resultStream.on('error', error => data.emit('error', error));
        ActorSparqlSerializeTree.bindingsStreamToGraphQl(resultStream, action.context, { materializeRdfJsTerms: true })
            .then((result) => {
            data.push(JSON.stringify(result, null, '  '));
            data.push(null);
        })
            .catch(error => data.emit('error', error));
        return { data };
    }
}
exports.ActorSparqlSerializeTree = ActorSparqlSerializeTree;
//# sourceMappingURL=ActorSparqlSerializeTree.js.map