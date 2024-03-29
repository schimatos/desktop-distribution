"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorSparqlSerializeSparqlXml = void 0;
const stream_1 = require("stream");
const bus_sparql_serialize_1 = require("@comunica/bus-sparql-serialize");
const xml_1 = __importDefault(require("xml"));
/**
 * A comunica sparql-results+xml Serialize Actor.
 */
class ActorSparqlSerializeSparqlXml extends bus_sparql_serialize_1.ActorSparqlSerializeFixedMediaTypes {
    constructor(args) {
        super(args);
    }
    /**
     * Converts an RDF term to its object-based XML representation.
     * @param {RDF.Term} value An RDF term.
     * @param {string} key A variable name, '?' must be included as a prefix.
     * @return {any} An object-based XML tag.
     */
    static bindingToXmlBindings(value, key) {
        let xmlValue;
        if (value.termType === 'Literal') {
            const literal = value;
            xmlValue = { literal: literal.value };
            const { language } = literal;
            const { datatype } = literal;
            if (language) {
                xmlValue.literal = [{ _attr: { 'xml:lang': language } }, xmlValue.literal];
            }
            else if (datatype && datatype.value !== 'http://www.w3.org/2001/XMLSchema#string') {
                xmlValue.literal = [{ _attr: { datatype: datatype.value } }, xmlValue.literal];
            }
        }
        else if (value.termType === 'BlankNode') {
            xmlValue = { bnode: value.value };
        }
        else {
            xmlValue = { uri: value.value };
        }
        return { binding: [{ _attr: { name: key.slice(1) } }, xmlValue] };
    }
    async testHandleChecked(action, context) {
        if (!['bindings', 'boolean'].includes(action.type)) {
            throw new Error('This actor can only handle bindings streams or booleans.');
        }
        return true;
    }
    async runHandle(action, mediaType, context) {
        const data = new stream_1.Readable();
        data._read = () => {
            // Do nothing
        };
        // Write head
        const root = xml_1.default.element({ _attr: { xlmns: 'http://www.w3.org/2005/sparql-results#' } });
        xml_1.default({ sparql: root }, { stream: true, indent: '  ', declaration: true })
            .on('data', chunk => data.push(`${chunk}\n`));
        if (action.type === 'bindings' && action.variables.length > 0) {
            root.push({ head: action.variables
                    .map(variable => ({ variable: { _attr: { name: variable.slice(1) } } })) });
        }
        if (action.type === 'bindings') {
            const results = xml_1.default.element({});
            root.push({ results });
            const resultStream = action.bindingsStream;
            // Write bindings
            resultStream.on('error', (error) => {
                data.emit('error', error);
            });
            resultStream.on('data', (bindings) => {
                // XML SPARQL results spec does not allow unbound variables and blank node bindings
                const realBindings = bindings.filter((value, key) => Boolean(value) && key.startsWith('?'));
                results.push({ result: realBindings.map(ActorSparqlSerializeSparqlXml.bindingToXmlBindings) });
            });
            // Close streams
            resultStream.on('end', () => {
                results.close();
                root.close();
                setImmediate(() => data.push(null));
            });
        }
        else {
            try {
                root.push({ boolean: await action.booleanResult });
                root.close();
                setImmediate(() => data.push(null));
            }
            catch (error) {
                setImmediate(() => data.emit('error', error));
            }
        }
        return { data };
    }
}
exports.ActorSparqlSerializeSparqlXml = ActorSparqlSerializeSparqlXml;
//# sourceMappingURL=ActorSparqlSerializeSparqlXml.js.map