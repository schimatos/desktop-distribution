"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediatorRace = void 0;
const core_1 = require("@comunica/core");
/**
 * A mediator that picks the first actor that resolves its test.
 */
class MediatorRace extends core_1.Mediator {
    constructor(args) {
        super(args);
    }
    mediateWithResult(action, testResults) {
        return new Promise((resolve, reject) => {
            const errors = [];
            for (const testResult of testResults) {
                testResult.reply.then(() => {
                    resolve(testResult);
                }).catch(error => {
                    // Reject if all replies were rejected
                    errors.push(error);
                    if (errors.length === testResults.length) {
                        reject(new Error(`${this.name} mediated over all rejecting actors:\n${errors.map(subError => subError.message).join('\n')}`));
                    }
                });
            }
        });
    }
}
exports.MediatorRace = MediatorRace;
//# sourceMappingURL=MediatorRace.js.map