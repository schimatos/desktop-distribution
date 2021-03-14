"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfCombineQuadsHashSingleNoHistory = void 0;
const bus_rdf_combine_quads_1 = require("@comunica/bus-rdf-combine-quads");
const asynciterator_1 = require("asynciterator");
const hash_js_1 = require("hash.js");
const rdf_string_1 = require("rdf-string");
/**
 * A comunica Combine quads using hashes, does not maintain history RDF Combine Quads Actor.
 */
class ActorRdfCombineQuadsHashSingleNoHistory extends bus_rdf_combine_quads_1.ActorRdfCombineQuads {
    constructor(args) {
        super(args);
        this.canTrackChanges = false;
        this.canMaintainOrder = true;
        this.canAvoidDuplicates = true;
        this.limitInsertsMin = 0;
        this.limitInsertsMax = Infinity;
        this.limitDeletesMin = 0;
        this.limitDeletesMax = Infinity;
    }
    /**
     * Create a string-based hash of the given object.
     * @param quad The quad to hash
     * @return {string} The object's hash.
     */
    static hash(quad) {
        return hash_js_1.sha1()
            .update(require('canonicalize')(rdf_string_1.quadToStringQuad(quad)))
            .digest('hex');
    }
    /**
     * Gets the number of 'iterations' over streams required to complete
     * this operation.
     * @param inserts The number of insert operations
     * @param deletes The number of delete operations
     * @param hasBase Whether there is a base quad stream
     */
    async getIterations(inserts, deletes) {
        return inserts + deletes;
    }
    async getOutput(quads, updates) {
        const hashes = {};
        const result = new asynciterator_1.ArrayIterator([...updates.reverse(), { quadStream: quads, type: 'insert' }])
            .transform({
            transform: (item, done, push) => {
                if (item.type === 'insert') {
                    item.quadStream.forEach(quad => {
                        const hash = ActorRdfCombineQuadsHashSingleNoHistory.hash(quad);
                        if (!(hash in hashes)) {
                            push(quad);
                            hashes[hash] = true;
                        }
                        ;
                    });
                }
                else {
                    item.quadStream.forEach(quad => {
                        hashes[ActorRdfCombineQuadsHashSingleNoHistory.hash(quad)] = true;
                    });
                }
                done();
            }
        });
        return { quads: result };
    }
}
exports.ActorRdfCombineQuadsHashSingleNoHistory = ActorRdfCombineQuadsHashSingleNoHistory;
//# sourceMappingURL=ActorRdfCombineQuadsHashSingleNoHistory.js.map