"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfDereferenceHttpParse = void 0;
const ActorRdfDereferenceHttpParseBase_1 = require("./ActorRdfDereferenceHttpParseBase");
/**
 * The browser variant of {@link ActorRdfDereferenceHttpParse}.
 */
class ActorRdfDereferenceHttpParse extends ActorRdfDereferenceHttpParseBase_1.ActorRdfDereferenceHttpParseBase {
    constructor(args) {
        super(args);
    }
    getMaxAcceptHeaderLength() {
        return this.maxAcceptHeaderLengthBrowser;
    }
}
exports.ActorRdfDereferenceHttpParse = ActorRdfDereferenceHttpParse;
//# sourceMappingURL=ActorRdfDereferenceHttpParse-browser.js.map