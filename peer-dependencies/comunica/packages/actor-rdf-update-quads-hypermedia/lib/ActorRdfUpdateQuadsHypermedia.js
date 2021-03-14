"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfUpdateQuadsHypermedia = void 0;
const bus_rdf_update_quads_1 = require("@comunica/bus-rdf-update-quads");
/**
 * A comunica Hypermedia RDF Update Quads Actor.
 */
class ActorRdfUpdateQuadsHypermedia extends bus_rdf_update_quads_1.ActorRdfUpdateQuads {
    constructor(args) {
        super(args);
    }
    async testOperation(action) {
        return true; // TODO implement
    }
    async runOperation(action) {
        return {}; // TODO implement
    }
}
exports.ActorRdfUpdateQuadsHypermedia = ActorRdfUpdateQuadsHypermedia;
//# sourceMappingURL=ActorRdfUpdateQuadsHypermedia.js.map