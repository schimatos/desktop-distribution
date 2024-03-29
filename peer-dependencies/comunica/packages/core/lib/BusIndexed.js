"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusIndexed = void 0;
const Bus_1 = require("./Bus");
/**
 * A bus that indexes identified actors,
 * so that actions with a corresponding identifier can be published more efficiently.
 *
 * Multiple actors with the same identifier can be subscribed.
 *
 * If actors or actions do not have a valid identifier,
 * then this will fallback to the normal bus behaviour.
 *
 * @see Bus
 *
 * @template A The actor type that can subscribe to the sub.
 * @template I The input type of an actor.
 * @template T The test type of an actor.
 * @template O The output type of an actor.
 */
class BusIndexed extends Bus_1.Bus {
    /**
     * All enumerable properties from the `args` object are inherited to this bus.
     *
     * @param {IBusIndexedArgs} args Arguments object
     * @param {string} args.name The name for the bus
     * @throws When required arguments are missing.
     */
    constructor(args) {
        super(args);
        this.actorsIndex = {};
    }
    subscribe(actor) {
        const actorId = this.getActorIdentifier(actor) || '_undefined_';
        let actors = this.actorsIndex[actorId];
        if (!actors) {
            actors = this.actorsIndex[actorId] = [];
        }
        actors.push(actor);
        super.subscribe(actor);
    }
    unsubscribe(actor) {
        const actorId = this.getActorIdentifier(actor) || '_undefined_';
        const actors = this.actorsIndex[actorId];
        if (actors) {
            const i = actors.indexOf(actor);
            if (i >= 0) {
                actors.splice(i, 1);
            }
            if (actors.length === 0) {
                delete this.actorsIndex[actorId];
            }
        }
        return super.unsubscribe(actor);
    }
    publish(action) {
        const actionId = this.getActionIdentifier(action);
        if (actionId) {
            const actors = (this.actorsIndex[actionId] || []).concat(this.actorsIndex._undefined_ || []);
            return actors.map((actor) => ({ actor, reply: actor.test(action) }));
        }
        return super.publish(action);
    }
    getActorIdentifier(actor) {
        return this.actorIdentifierFields.reduce((object, field) => object[field], actor);
    }
    getActionIdentifier(action) {
        return this.actionIdentifierFields.reduce((object, field) => object[field], action);
    }
}
exports.BusIndexed = BusIndexed;
//# sourceMappingURL=BusIndexed.js.map