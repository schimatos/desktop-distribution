"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfWrite = void 0;
const core_1 = require("@comunica/core");
// TODO: Steal other necessary components from the dereference module.
/**
 * A comunica actor for rdf-write events.
 *
 * Actor types:
 * * Input:  IActionRdfWrite:      TODO: fill in.
 * * Test:   <none>
 * * Output: IActorRdfWriteOutput: TODO: fill in.
 *
 * @see IActionRdfWrite
 * @see IActorRdfWriteOutput
 */
class ActorRdfWrite extends core_1.Actor {
    constructor(args) {
        super(args);
    }
    // TODO: This is taken from the dereference bus - refactor so they can just share the same function
    /**
     * Get the media type based on the extension of the given path,
     * which can be an URL or file path.
     * @param {string} path A path.
     * @return {string} A media type or the empty string.
     */
    getMediaTypeFromExtension(path) {
        var _a;
        const dotIndex = path.lastIndexOf('.');
        if (dotIndex >= 0) {
            const ext = path.slice(dotIndex);
            // Ignore dot
            // console.log(this.mediaMappings);
            return ((_a = this.mediaMappings) !== null && _a !== void 0 ? _a : { ttl: 'text/turtle' })[ext.slice(1)] || '';
        }
        return '';
    }
}
exports.ActorRdfWrite = ActorRdfWrite;
//# sourceMappingURL=ActorRdfWrite.js.map