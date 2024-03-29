"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfMetadataAll = void 0;
const stream_1 = require("stream");
const bus_rdf_metadata_1 = require("@comunica/bus-rdf-metadata");
/**
 * A comunica All RDF Metadata Actor.
 */
class ActorRdfMetadataAll extends bus_rdf_metadata_1.ActorRdfMetadata {
    constructor(args) {
        super(args);
    }
    async test(action) {
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
            // Forward quads to both streams
            action.quads.on('data', quad => {
                data.push(quad);
                metadata.push(quad);
            });
            // Terminate both streams on-end
            action.quads.on('end', () => {
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
exports.ActorRdfMetadataAll = ActorRdfMetadataAll;
//# sourceMappingURL=ActorRdfMetadataAll.js.map