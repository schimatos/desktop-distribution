"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionObserverHttp = void 0;
const core_1 = require("@comunica/core");
/**
 * Observes HTTP actions, and maintains a counter of the number of requests.
 */
class ActionObserverHttp extends core_1.ActionObserver {
    constructor(args) {
        super(args);
        this.requests = 0;
        this.bus.subscribeObserver(this);
    }
    onRun(actor, action, output) {
        this.requests++;
    }
}
exports.ActionObserverHttp = ActionObserverHttp;
//# sourceMappingURL=ActionObserverHttp.js.map