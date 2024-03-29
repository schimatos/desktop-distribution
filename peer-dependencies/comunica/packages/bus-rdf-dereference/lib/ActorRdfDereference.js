"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfDereference = exports.KEY_CONTEXT_LENIENT = void 0;
const stream_1 = require("stream");
const core_1 = require("@comunica/core");
exports.KEY_CONTEXT_LENIENT = '@comunica/actor-init-sparql:lenient';
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
class ActorRdfDereference extends core_1.Actor {
    constructor(args) {
        super(args);
    }
    /**
     * Check if hard errors should occur on HTTP or parse errors.
     * @param {IActionRdfDereference} action An RDF dereference action.
     * @return {boolean} If hard errors are enabled.
     */
    isHardError(action) {
        return !action.context || !action.context.get(exports.KEY_CONTEXT_LENIENT);
    }
    /**
     * If hard errors are disabled, modify the given stream so that errors are delegated to the logger.
     * @param {IActionRdfDereference} action An RDF dereference action.
     * @param {Stream} quads A quad stream.
     * @return {Stream} The resulting quad stream.
     */
    handleDereferenceStreamErrors(action, quads) {
        // If we don't emit hard errors, make parsing error events log instead, and silence them downstream.
        if (!this.isHardError(action)) {
            quads.on('error', error => {
                this.logError(action.context, error.message, () => ({ url: action.url }));
                // Make sure the errored stream is ended.
                quads.push(null);
            });
            quads = quads.pipe(new stream_1.PassThrough({ objectMode: true }));
        }
        return quads;
    }
    /**
     * Handle the given error as a rejection or delegate it to the logger,
     * depending on whether or not hard errors are enabled.
     * @param {IActionRdfDereference} action An RDF dereference action.
     * @param {Error} error An error that has occured.
     * @return {Promise<IActorRdfDereferenceOutput>} A promise that rejects or resolves to an empty output.
     */
    async handleDereferenceError(action, error) {
        if (this.isHardError(action)) {
            throw error;
        }
        else {
            this.logError(action.context, error.message);
            const quads = new stream_1.Readable();
            quads.push(null);
            return { url: action.url, quads };
        }
    }
}
exports.ActorRdfDereference = ActorRdfDereference;
//# sourceMappingURL=ActorRdfDereference.js.map