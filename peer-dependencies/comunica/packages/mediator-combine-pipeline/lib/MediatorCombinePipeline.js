"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediatorCombinePipeline = void 0;
const core_1 = require("@comunica/core");
/**
 * A comunica mediator that goes over all actors in sequence and forwards I/O.
 * This required the action input and the actor output to be of the same type.
 */
class MediatorCombinePipeline extends core_1.Mediator {
    constructor(args) {
        super(args);
    }
    async mediate(action) {
        let testResults;
        try {
            testResults = this.publish(action);
        }
        catch (_a) {
            // If no actors are available, just return the input as output
            return action;
        }
        // Delegate test errors.
        await Promise.all(testResults.map(({ reply }) => reply));
        // Pass action to first actor,
        // and each actor output as input to the following actor.
        let handle = action;
        for (const actor of testResults.map(result => result.actor)) {
            handle = await actor.runObservable(handle);
        }
        // Return the final actor output
        return handle;
    }
    mediateWithResult() {
        throw new Error('Method not supported.');
    }
}
exports.MediatorCombinePipeline = MediatorCombinePipeline;
//# sourceMappingURL=MediatorCombinePipeline.js.map