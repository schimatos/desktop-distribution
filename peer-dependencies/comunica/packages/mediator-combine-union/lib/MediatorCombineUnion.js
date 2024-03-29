"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediatorCombineUnion = void 0;
const core_1 = require("@comunica/core");
/**
 * A comunica mediator that takes the union of all actor results.
 *
 * The actors that are registered first will have priority on setting overlapping fields.
 */
class MediatorCombineUnion extends core_1.Mediator {
    constructor(args) {
        super(args);
        this.combiner = this.createCombiner();
    }
    async mediate(action) {
        let testResults;
        try {
            testResults = this.publish(action);
        }
        catch (_a) {
            testResults = [];
        }
        // Delegate test errors.
        await Promise.all(testResults.map(({ reply }) => reply));
        // Run action on all actors.
        const results = await Promise.all(testResults.map(result => result.actor.runObservable(action)));
        // Return the combined results.
        return this.combiner(results);
    }
    mediateWithResult() {
        throw new Error('Method not supported.');
    }
    createCombiner() {
        return (results) => {
            const data = {};
            data[this.field] = {};
            [{}].concat(results.map((result) => result[this.field]))
                .forEach((value, index, arr) => {
                data[this.field] = Object.assign(Object.assign({}, value), data[this.field]);
            });
            return data;
        };
    }
}
exports.MediatorCombineUnion = MediatorCombineUnion;
//# sourceMappingURL=MediatorCombineUnion.js.map