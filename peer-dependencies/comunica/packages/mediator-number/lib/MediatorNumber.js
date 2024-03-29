"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediatorNumber = void 0;
const core_1 = require("@comunica/core");
/**
 * A mediator that can mediate over a single number field.
 *
 * It takes the required 'field' and 'type' parameters.
 * The 'field' parameter represents the field name of the test result field over which must be mediated.
 * The 'type' parameter
 */
class MediatorNumber extends core_1.Mediator {
    constructor(args) {
        super(args);
        this.indexPicker = this.createIndexPicker();
    }
    /**
     * @return {(tests: T[]) => number} A function that returns the index of the test result
     *                                  that has been chosen by this mediator.
     */
    createIndexPicker() {
        switch (this.type) {
            case MediatorNumber.MIN:
                return (tests) => tests.reduce((prev, curr, i) => {
                    const val = this.getOrDefault(curr[this.field], Infinity);
                    return val !== null && (Number.isNaN(prev[0]) || prev[0] > val) ? [val, i] : prev;
                }, [Number.NaN, -1])[1];
            case MediatorNumber.MAX:
                return (tests) => tests.reduce((prev, curr, i) => {
                    const val = this.getOrDefault(curr[this.field], -Infinity);
                    return val !== null && (Number.isNaN(prev[0]) || prev[0] < val) ? [val, i] : prev;
                }, [Number.NaN, -1])[1];
            default:
                throw new Error(`No valid "type" value was given, must be either ${MediatorNumber.MIN} or ${MediatorNumber.MAX}, but got: ${this.type}`);
        }
    }
    getOrDefault(value, defaultValue) {
        return value === undefined ? defaultValue : value;
    }
    async mediateWithResult(action, testResults) {
        let promises = testResults.map(({ reply }) => reply);
        const errors = [];
        if (this.ignoreErrors) {
            const dummy = {};
            dummy[this.field] = null;
            promises = promises.map(promise => promise.catch(error => {
                errors.push(error);
                return dummy;
            }));
        }
        const results = await Promise.all(promises);
        const index = this.indexPicker(results);
        if (index < 0) {
            throw new Error(`All actors rejected their test in ${this.name}\n${errors.map(error => error.message).join('\n')}`);
        }
        return testResults[index];
    }
}
exports.MediatorNumber = MediatorNumber;
MediatorNumber.MIN = 'https://linkedsoftwaredependencies.org/bundles/npm/@comunica/mediator-number/' +
    'Mediator/Number/type/TypeMin';
MediatorNumber.MAX = 'https://linkedsoftwaredependencies.org/bundles/npm/@comunica/mediator-number/' +
    'Mediator/Number/type/TypeMax';
//# sourceMappingURL=MediatorNumber.js.map