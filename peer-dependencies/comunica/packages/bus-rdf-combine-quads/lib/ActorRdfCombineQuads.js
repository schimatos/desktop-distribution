"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfCombineQuads = void 0;
const core_1 = require("@comunica/core");
const asynciterator_1 = require("asynciterator");
// TODO: Determine if in general the first insert stream should be made
// the base (currently doing this in simplify need to confirm)
/**
 * A comunica actor for rdf-combine-quads events including joining and diffing quad streams
 *
 * Actor types:
 * * Input:  IActionRdfCombineQuads:      The streams to be inserted/deleted and (optionally) a base stream
 * * Test:   <none>
 * * Output: IActorRdfCombineQuadsOutput: The resultant quad stream of the combine operation and (optionally)
 *                                        the insertions/deletions with respect to the base stream
 *
 * @see IActionRdfCombineQuads
 * @see IActorRdfCombineQuadsOutput
 */
class ActorRdfCombineQuads extends core_1.Actor {
    constructor(args) {
        super(args);
        /**
         * The max/min number of insertion/deletion
         * streams that an actor can handle.
         *
         * Note that the quads parameter - if defined
         * is considered an insert stream
         */
        this.limitInsertsMin = 0;
        this.limitInsertsMax = Infinity;
        this.limitDeletesMin = 0;
        this.limitDeletesMax = Infinity;
    }
    /**
     * If there is no 'base stream' to compare to, we can search remove all 'delete'
     * streams before the first update stream.
     */
    simplify(action) {
        if (action.quads) {
            return action;
        }
        else {
            let count = 0;
            for (const quads of action.quadStreamUpdates) {
                if (quads.type === 'delete') {
                    count++;
                }
                else {
                    return {
                        trackChanges: action.trackChanges,
                        maintainOrder: action.maintainOrder,
                        avoidDuplicates: action.avoidDuplicates,
                        quads: quads.quadStream,
                        // TODO: See if we need to specify the end element
                        quadStreamUpdates: action.quadStreamUpdates.slice(count + 1)
                    };
                }
            }
            // This means that there are no insert operations whatsoever
            return {
                trackChanges: action.trackChanges,
                maintainOrder: action.maintainOrder,
                avoidDuplicates: action.avoidDuplicates,
                quadStreamUpdates: []
            };
        }
    }
    ;
    // TODO: Use estimated quad stream lengths in context (if present) to produce better estimates
    /**
     * Counts the number of streams that insert quads and the number of streams that delete
     * quads. Note that base stream is counted as an *insertion* stream.
     */
    counters(action) {
        let inserts = action.quads ? 1 : 0;
        let deletes = 0;
        for (const { type } of action.quadStreamUpdates) {
            if (type === 'insert') {
                inserts++;
            }
            else if (type === 'delete') {
                deletes++;
            }
        }
        return { inserts, deletes };
    }
    /**
     * Returns default input for 0 input entries, or 1 input entry with no deletions.
     * Calls the getOutput function otherwise
     * @param {IActionRdfCombineQuads} action
     * @returns {Promise<IActorRdfCombineQuadsOutput>}
     */
    async run(action) {
        var _a, _b, _c;
        action = this.simplify(action);
        const { inserts, deletes } = this.counters(action);
        if (inserts === 0) {
            return { quads: new asynciterator_1.AsyncIterator() };
        }
        if (deletes === 0 && inserts === 1) {
            if (action.quads) {
                return { quads: action.quads };
            }
            const quads = (_b = (_a = action.quadStreamUpdates.find(stream => stream.type === 'insert')) === null || _a === void 0 ? void 0 : _a.quadStream) !== null && _b !== void 0 ? _b : new asynciterator_1.AsyncIterator();
            // This ^^ is not strictly necessary since inserts === 1 - just here for type safety.
            return {
                quads,
                quadStreamInserted: quads,
            };
        }
        return await this.getOutput((_c = action.quads) !== null && _c !== void 0 ? _c : new asynciterator_1.AsyncIterator(), action.quadStreamUpdates);
    }
    /**
     * Default test function for combine actors.
     */
    async test(action) {
        var _a, _b, _c;
        action = this.simplify(action);
        const { inserts, deletes } = this.counters(action);
        /**
         * If there are no insertions we can just return an empty
         * stream - if there are no deletions and only one insertion
         * stream we can just return the insertion stream.
         */
        if (inserts === 0 || (deletes === 0 && inserts === 1)) {
            return { iterations: 0 };
        }
        if (inserts < this.limitInsertsMin) {
            throw new Error(`${this.name} requires at least ${this.limitInsertsMin} insert operations`);
        }
        if (inserts > this.limitInsertsMax) {
            throw new Error(`${this.name} handles at most ${this.limitInsertsMax} insert operations`);
        }
        if (deletes < this.limitDeletesMin) {
            throw new Error(`${this.name} requires at least ${this.limitDeletesMin} delete operations`);
        }
        if (deletes > this.limitDeletesMax) {
            throw new Error(`${this.name} handles at most ${this.limitDeletesMax} delete operations`);
        }
        if (((_a = action.trackChanges) !== null && _a !== void 0 ? _a : true) && !this.canTrackChanges) {
            throw new Error(`${this.name} cannot track changes`);
        }
        // Order doesn't matter if we only have insertions or only have deletions
        if (inserts > 0 && deletes > 0 && ((_b = action.maintainOrder) !== null && _b !== void 0 ? _b : true) && !this.canMaintainOrder) {
            throw new Error(`${this.name} cannot maintain order of insertions/deletions`);
        }
        // Duplicates are only an issue if we have 1 or more insertion streams
        if (inserts > 1 && ((_c = action.avoidDuplicates) !== null && _c !== void 0 ? _c : true) && !this.canAvoidDuplicates) {
            throw new Error(`${this.name} cannot avoid duplicates`);
        }
        return { iterations: await this.getIterations(inserts, deletes, Boolean(action.quads)) };
    }
}
exports.ActorRdfCombineQuads = ActorRdfCombineQuads;
//# sourceMappingURL=ActorRdfCombineQuads.js.map