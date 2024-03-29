"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionObserver = void 0;
/**
 * An ActionObserver can passively listen to {@link Actor#run} inputs and outputs for all actors on a certain bus.
 *
 * ActionObserver should not edit inputs and outputs,
 * they should be considered immutable.
 *
 * @see Actor
 * @see Bus
 *
 * @template I The input type of an actor.
 * @template O The output type of an actor.
 */
class ActionObserver {
    /**
     * All enumerable properties from the `args` object are inherited to this observer.
     *
     * The observer will NOT automatically subscribe to the given bus when this constructor is called.
     *
     * @param {IActionObserverArgs<I extends IAction, O extends IActorOutput>} args Arguments object
     * @throws When required arguments are missing.
     */
    constructor(args) {
        Object.assign(this, args);
    }
}
exports.ActionObserver = ActionObserver;
//# sourceMappingURL=ActionObserver.js.map