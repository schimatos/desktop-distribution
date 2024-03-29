"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorHttpInvalidateListenable = void 0;
const ActorHttpInvalidate_1 = require("./ActorHttpInvalidate");
/**
 * An ActorHttpInvalidate actor that allows listeners to be attached.
 *
 * @see ActorHttpInvalidate
 */
class ActorHttpInvalidateListenable extends ActorHttpInvalidate_1.ActorHttpInvalidate {
    constructor(args) {
        super(args);
        this.invalidateListeners = [];
    }
    addInvalidateListener(listener) {
        this.invalidateListeners.push(listener);
    }
    async test(action) {
        return true;
    }
    async run(action) {
        for (const listener of this.invalidateListeners) {
            listener(action);
        }
        return true;
    }
}
exports.ActorHttpInvalidateListenable = ActorHttpInvalidateListenable;
//# sourceMappingURL=ActorHttpInvalidateListenable.js.map