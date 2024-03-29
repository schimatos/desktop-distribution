"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfMetadataQuadPredicate = void 0;
const stream_1 = require("stream");
const ActorRdfMetadata_1 = require("./ActorRdfMetadata");
/**
 * An abstract implementation of {@link ActorRdfMetadata} that
 * only requires the quad test {@link ActorRdfMetadata#isMetadata} method to be overridden.
 */
class ActorRdfMetadataQuadPredicate extends ActorRdfMetadata_1.ActorRdfMetadata {
    constructor(args) {
        super(args);
    }
    async run(action) {
        const data = new stream_1.Readable({ objectMode: true });
        const metadata = new stream_1.Readable({ objectMode: true });
        // Delay attachment of listeners until the data or metadata stream is being read.
        // eslint-disable-next-line func-style
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
            const context = {};
            action.quads.on('data', quad => {
                if (this.isMetadata(quad, action.url, context)) {
                    metadata.push(quad);
                }
                else {
                    data.push(quad);
                }
            });
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
exports.ActorRdfMetadataQuadPredicate = ActorRdfMetadataQuadPredicate;
//# sourceMappingURL=ActorRdfMetadataQuadPredicate.js.map