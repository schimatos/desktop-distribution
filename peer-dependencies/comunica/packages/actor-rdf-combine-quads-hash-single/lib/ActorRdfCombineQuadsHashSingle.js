"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfCombineQuadsHashSingle = void 0;
const bus_rdf_combine_quads_1 = require("@comunica/bus-rdf-combine-quads");
const asynciterator_1 = require("asynciterator");
const hash_js_1 = require("hash.js");
const rdf_string_1 = require("rdf-string");
/**
 * A comunica Hash, single iteration of each stream RDF Combine Quads Actor.
 */
class ActorRdfCombineQuadsHashSingle extends bus_rdf_combine_quads_1.ActorRdfCombineQuads {
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
        // Odgy
        return inserts + deletes + (hasBase ? 1 : 0);
    }
    /**
     *
     * @param action
     */
    async getOutput(quads, updates) {
        // console.log('start of output', updates, quads);
        const deletions = [];
        const added = {};
        let quadStreamDeleted = new asynciterator_1.AsyncIterator();
        let quadStreamInserted = new asynciterator_1.AsyncIterator();
        for (const update of updates) {
            if (update.type === 'delete') {
                const hashes = {};
                update.quadStream.forEach(quad => {
                    hashes[ActorRdfCombineQuadsHashSingle.hash(quad)] = true;
                });
            }
            else {
                // console.log('inside else');
                deletions.push(undefined);
            }
        }
        quads = quads.filter(quad => {
            if (deletions.every(hashes => !(hashes === null || hashes === void 0 ? void 0 : hashes[ActorRdfCombineQuadsHashSingle.hash(quad)]))) {
                quadStreamDeleted = quadStreamDeleted.append([quad]);
                return false;
            }
            else {
                return true;
            }
            ;
        });
        for (const update of updates) {
            deletions.splice(0, 1);
            if (update.type === 'insert') {
                quadStreamInserted = quadStreamInserted.append(update.quadStream.filter(quad => {
                    const hash = ActorRdfCombineQuadsHashSingle.hash(quad);
                    if (!(hash in added) && deletions.every(hashes => !(hashes === null || hashes === void 0 ? void 0 : hashes[hash]))) {
                        added[hash] = true;
                        return true;
                    }
                    return false;
                }));
            }
        }
        quads = quads.append(quadStreamInserted);
        // console.log('end of combine');
        // console.log('------------------------------------------------------------------------------------------------');
        // await new Promise((res, rej) => {
        //   quads.on('data', data => {console.log(data)});
        //   quads.on('end', () => {
        //     console.log('end');
        //     res(undefined);
        //   })
        // })
        // console.log('------------------------------------------------------------------------------------------------');
        return {
            quads,
            quadStreamDeleted,
            quadStreamInserted
        };
    }
}
exports.ActorRdfCombineQuadsHashSingle = ActorRdfCombineQuadsHashSingle;
//# sourceMappingURL=ActorRdfCombineQuadsHashSingle.js.map