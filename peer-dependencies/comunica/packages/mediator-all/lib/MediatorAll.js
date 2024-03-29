"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediatorAll = void 0;
const core_1 = require("@comunica/core");
/**
 * A comunica mediator that runs all actors that resolve their test.
 * This mediator will always resolve to the first actor's output.
 */
class MediatorAll extends core_1.Mediator {
    constructor(args) {
        super(args);
    }
    async mediate(action) {
        // Collect all actors that resolve their test
        const validActors = [];
        let testResults;
        try {
            testResults = this.publish(action);
        }
        catch (_a) {
            testResults = [];
        }
        for (const testResult of testResults) {
            try {
                await testResult.reply;
                validActors.push(testResult.actor);
            }
            catch (_b) {
                // Ignore errors
            }
        }
        // Send action to all valid actors
        const outputs = await Promise.all(validActors.map(actor => actor.runObservable(action)));
        return outputs[0];
    }
    async mediateWithResult() {
        throw new Error('Unsupported operation: MediatorAll#mediateWith');
    }
}
exports.MediatorAll = MediatorAll;
//# sourceMappingURL=MediatorAll.js.map