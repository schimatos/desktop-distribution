"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureActionContext = exports.ActionContext = exports.Actor = void 0;
const immutable_1 = require("immutable");
const Logger_1 = require("./Logger");
/**
 * An actor can act on messages of certain types and provide output of a certain type.
 *
 * The flow of an actor is as follows:
 * 1. Send a message to {@link Actor#test} to test if an actor can run that action.
 * 2. If the actor can reply to the message, let the actor run the action using {@link Actor#run}.
 *
 * An actor is typically subscribed to a bus,
 * using which the applicability to an action can be tested.
 *
 * @see Bus
 *
 * @template I The input type of an actor.
 * @template T The test type of an actor.
 * @template O The output type of an actor.
 */
class Actor {
    /**
     * All enumerable properties from the `args` object are inherited to this actor.
     *
     * The actor will subscribe to the given bus when this constructor is called.
     *
     * @param {IActorArgs<I extends IAction, T extends IActorTest, O extends IActorOutput>} args Arguments object
     * @param {string} args.name The name for this actor.
     * @param {Bus<A extends Actor<I, T, O>, I extends IAction, T extends IActorTest, O extends IActorOutput>} args.bus
     *        The bus this actor subscribes to.
     * @throws When required arguments are missing.
     */
    constructor(args) {
        this.beforeActors = [];
        Object.assign(this, args);
        this.bus.subscribe(this);
        if (this.beforeActors.length > 0) {
            this.bus.addDependencies(this, this.beforeActors);
        }
    }
    /**
     * Get the logger from the given context.
     * @param {ActionContext} context An optional context.
     * @return {Logger} The logger or undefined.
     */
    static getContextLogger(context) {
        return context && context.get(Logger_1.KEY_CONTEXT_LOG);
    }
    /**
     * Run the given action on this actor
     * AND invokes the {@link Bus#onRun} method.
     *
     * @param {I} action The action to run.
     * @return {Promise<T>} A promise that resolves to the run result.
     */
    runObservable(action) {
        const output = this.run(action);
        this.bus.onRun(this, action, output);
        return output;
    }
    /**
     * Initialize this actor.
     * This should be used for doing things that take a while,
     * such as opening files.
     *
     * @return {Promise<void>} A promise that resolves when the actor has been initialized.
     */
    async initialize() {
        return true;
    }
    /**
     * Deinitialize this actor.
     * This should be used for cleaning up things when the application is shut down,
     * such as closing files and removing temporary files.
     *
     * @return {Promise<void>} A promise that resolves when the actor has been deinitialized.
     */
    async deinitialize() {
        return true;
    }
    /* Proxy methods for the (optional) logger that is defined in the context */
    getDefaultLogData(context, data) {
        const dataActual = data ? data() : {};
        dataActual.actor = this.name;
        return dataActual;
    }
    logTrace(context, message, data) {
        const logger = Actor.getContextLogger(context);
        if (logger) {
            logger.trace(message, this.getDefaultLogData(context, data));
        }
    }
    logDebug(context, message, data) {
        const logger = Actor.getContextLogger(context);
        if (logger) {
            logger.debug(message, this.getDefaultLogData(context, data));
        }
    }
    logInfo(context, message, data) {
        const logger = Actor.getContextLogger(context);
        if (logger) {
            logger.info(message, this.getDefaultLogData(context, data));
        }
    }
    logWarn(context, message, data) {
        const logger = Actor.getContextLogger(context);
        if (logger) {
            logger.warn(message, this.getDefaultLogData(context, data));
        }
    }
    logError(context, message, data) {
        const logger = Actor.getContextLogger(context);
        if (logger) {
            logger.error(message, this.getDefaultLogData(context, data));
        }
    }
    logFatal(context, message, data) {
        const logger = Actor.getContextLogger(context);
        if (logger) {
            logger.fatal(message, this.getDefaultLogData(context, data));
        }
    }
}
exports.Actor = Actor;
/**
 * A convenience constructor for {@link ActionContext} based on a given hash.
 * @param {{[p: string]: any}} hash A hash that maps keys to values.
 * @return {ActionContext} The immutable action context from the hash.
 * @constructor
 */
// eslint-disable-next-line no-redeclare
function ActionContext(hash) {
    return immutable_1.Map(hash);
}
exports.ActionContext = ActionContext;
/**
 * Convert the given object to an action context object if it is not an action context object yet.
 * If it already is an action context object, return the object as-is.
 * @param maybeActionContext Any object.
 * @return {ActionContext} An action context object.
 */
function ensureActionContext(maybeActionContext) {
    return immutable_1.Map.isMap(maybeActionContext) ? maybeActionContext : ActionContext(maybeActionContext);
}
exports.ensureActionContext = ensureActionContext;
//# sourceMappingURL=Actor.js.map