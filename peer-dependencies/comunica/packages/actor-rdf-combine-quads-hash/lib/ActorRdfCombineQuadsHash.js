"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfCombineQuadsHash = void 0;
const bus_rdf_combine_quads_1 = require("@comunica/bus-rdf-combine-quads");
const asynciterator_1 = require("asynciterator");
const hash_js_1 = require("hash.js");
const rdf_string_1 = require("rdf-string");
/**
 * A comunica Hash, stream RDF Combine Quads Actor.
 */
class ActorRdfCombineQuadsHash extends bus_rdf_combine_quads_1.ActorRdfCombineQuads {
    constructor(args) {
        super(args);
        this.canTrackChanges = true;
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
     * this operation. Insert operations are iterated (at most) twice and the delete
     * and base streams are iterated over once each.
     * @param inserts The number of insert operations
     * @param deletes The number of delete operations
     * @param hasBase Whether there is a base quad stream
     */
    async getIterations(inserts, deletes, hasBase) {
        return (2 * inserts) + deletes - (hasBase ? 1 : 0);
    }
    async getOutput(quads, updates) {
        // console.log('get output');
        let quadStreamInserted = new asynciterator_1.AsyncIterator();
        const add = {};
        const hashes = {};
        // let quad: RDF.Quad | null = null;
        // First we create a hash map of deletions
        for (const update of updates.reverse()) {
            if (update.type === 'delete') {
                update.quadStream.forEach(quad => {
                    hashes[ActorRdfCombineQuadsHash.hash(quad)] = true;
                });
            }
            else {
                update.quadStream.forEach(quad => {
                    const hash = ActorRdfCombineQuadsHash.hash(quad);
                    if (!(hash in add) && !(hash in hashes)) {
                        add[hash] = true;
                        quadStreamInserted.append([quad]);
                    }
                });
            }
        }
        const quadStreamDeleted = new asynciterator_1.AsyncIterator();
        quads = quads.filter((quad) => {
            const hash = ActorRdfCombineQuadsHash.hash(quad);
            if (hash in hashes) {
                quadStreamDeleted.append([quad]);
                return false;
            }
            hashes[hash] = true;
            return true;
        });
        quadStreamInserted = quadStreamInserted.filter(quad => !(ActorRdfCombineQuadsHash.hash(quad) in hashes));
        quads.append(quadStreamInserted);
        // console.log('end of combine quads');
        return {
            quadStreamInserted,
            quadStreamDeleted,
            quads,
        };
    }
}
exports.ActorRdfCombineQuadsHash = ActorRdfCombineQuadsHash;
//# sourceMappingURL=ActorRdfCombineQuadsHash.js.map