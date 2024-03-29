"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfDereferenceMediaMappings = void 0;
const ActorRdfDereference_1 = require("./ActorRdfDereference");
/**
 * A base actor for dereferencing URLs to quad streams.
 *
 * Actor types:
 * * Input:  IActionRdfDereference:      A URL.
 * * Test:   <none>
 * * Output: IActorRdfDereferenceOutput: A quad stream.
 *
 * @see IActionRdfDereference
 * @see IActorRdfDereferenceOutput
 */
class ActorRdfDereferenceMediaMappings extends ActorRdfDereference_1.ActorRdfDereference {
    constructor(args) {
        super(args);
    }
    /**
     * Get the media type based on the extension of the given path,
     * which can be an URL or file path.
     * @param {string} path A path.
     * @return {string} A media type or the empty string.
     */
    getMediaTypeFromExtension(path) {
        const dotIndex = path.lastIndexOf('.');
        if (dotIndex >= 0) {
            const ext = path.slice(dotIndex);
            // Ignore dot
            return this.mediaMappings[ext.slice(1)] || '';
        }
        return '';
    }
}
exports.ActorRdfDereferenceMediaMappings = ActorRdfDereferenceMediaMappings;
//# sourceMappingURL=ActorRdfDereferenceMediaMappings.js.map