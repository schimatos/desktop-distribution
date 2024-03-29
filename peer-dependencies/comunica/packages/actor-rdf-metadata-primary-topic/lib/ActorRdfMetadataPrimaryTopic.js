"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfMetadataPrimaryTopic = void 0;
const stream_1 = require("stream");
const bus_rdf_metadata_1 = require("@comunica/bus-rdf-metadata");
/**
 * An RDF Metadata Actor that splits off the metadata based on the existence of a 'foaf:primaryTopic' link.
 * Only non-triple quad streams are supported.
 */
class ActorRdfMetadataPrimaryTopic extends bus_rdf_metadata_1.ActorRdfMetadata {
    constructor(args) {
        super(args);
    }
    async test(action) {
        if (action.triples) {
            throw new Error('This actor only supports non-triple quad streams.');
        }
        return true;
    }
    async run(action) {
        const data = new stream_1.Readable({ objectMode: true });
        const metadata = new stream_1.Readable({ objectMode: true });
        // Delay attachment of listeners until the data or metadata stream is being read.
        const attachListeners = () => {
            // Attach listeners only once
            data._read = metadata._read = () => {
                // Do nothing
            };
            // Forward errors
            action.quads.on('error', error => {
                data.emit('error', error);
                metadata.emit('error', error);
            });
            // First pass over data to categorize in graphs,
            // and to detect the primaryTopic triple.
            const graphs = {};
            let endpointIdentifier;
            const primaryTopics = {};
            action.quads.on('data', quad => {
                if (quad.predicate.value === 'http://rdfs.org/ns/void#subset' &&
                    quad.object.value === action.url) {
                    endpointIdentifier = quad.subject.value;
                }
                else if (quad.predicate.value === 'http://xmlns.com/foaf/0.1/primaryTopic') {
                    primaryTopics[quad.object.value] = quad.subject.value;
                }
                let quads = graphs[quad.graph.value];
                if (!quads) {
                    quads = graphs[quad.graph.value] = [];
                }
                quads.push(quad);
            });
            // When the stream has finished,
            // determine the appropriate metadata graph,
            // and emit all quads to the appropriate streams.
            action.quads.on('end', () => {
                const metadataGraph = endpointIdentifier ? primaryTopics[endpointIdentifier] : undefined;
                for (const graphName in graphs) {
                    if (graphName === metadataGraph) {
                        for (const quad of graphs[graphName]) {
                            metadata.push(quad);
                        }
                        // Also emit metadata to data if requested
                        if (this.metadataToData) {
                            for (const quad of graphs[graphName]) {
                                data.push(quad);
                            }
                        }
                    }
                    else {
                        for (const quad of graphs[graphName]) {
                            data.push(quad);
                        }
                        if (!metadataGraph && this.dataToMetadataOnInvalidMetadataGraph) {
                            for (const quad of graphs[graphName]) {
                                metadata.push(quad);
                            }
                        }
                    }
                }
                data.push(null);
                metadata.push(null);
            });
        };
        data._read = metadata._read = () => {
            attachListeners();
        };
        return { data, metadata };
    }
}
exports.ActorRdfMetadataPrimaryTopic = ActorRdfMetadataPrimaryTopic;
//# sourceMappingURL=ActorRdfMetadataPrimaryTopic.js.map