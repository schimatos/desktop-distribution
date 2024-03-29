"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetadata = exports.ActorQueryOperation = exports.KEY_CONTEXT_QUERY_TIMESTAMP = exports.KEY_CONTEXT_BASEIRI = exports.KEY_CONTEXT_PATTERN_PARENTMETADATA = exports.KEY_CONTEXT_BGP_PATTERNBINDINGS = exports.KEY_CONTEXT_BGP_PARENTMETADATA = exports.KEY_CONTEXT_BGP_CURRENTMETADATA = void 0;
const core_1 = require("@comunica/core");
const Bindings_1 = require("./Bindings");
/**
 * @type {string} Context entry for current metadata.
 *                I.e., the metadata that was used to determine the next BGP operation.
 * @value {any} A metadata hash.
 */
exports.KEY_CONTEXT_BGP_CURRENTMETADATA = '@comunica/bus-query-operation:bgpCurrentMetadata';
/**
 * @type {string} Context entry for an array of parent metadata.
 *                I.e., an array of the metadata that was present before materializing the current BGP operations.
 *                This can be passed in 'bgp' actions.
 *                The array entries should correspond to the pattern entries in the BGP.
 * @value {any} An array of metadata hashes.
 */
exports.KEY_CONTEXT_BGP_PARENTMETADATA = '@comunica/bus-query-operation:bgpParentMetadata';
/**
 * @type {string} Context entry for indicating which patterns were bound from variables.
 *                I.e., an array of the same length as the value of KEY_CONTEXT_BGP_PARENTMETADATA,
 *                where each array value corresponds to the pattern bindings for the corresponding pattern.
 * @value {any} An array of {@link IPatternBindings}.
 */
exports.KEY_CONTEXT_BGP_PATTERNBINDINGS = '@comunica/bus-query-operation:bgpPatternBindings';
/**
 * @type {string} Context entry for parent metadata.
 *                I.e., the metadata that was present before materializing the current operation.
 *                This can be passed in 'pattern' actions.
 * @value {any} A metadata hash.
 */
exports.KEY_CONTEXT_PATTERN_PARENTMETADATA = '@comunica/bus-query-operation:patternParentMetadata';
/**
 * @type {string} Context entry for query's base IRI.
 * @value {any} A string.
 */
exports.KEY_CONTEXT_BASEIRI = '@comunica/actor-init-sparql:baseIRI';
/**
 * @type {string} A timestamp representing the current time.
 *                This is required for certain SPARQL operations such as NOW().
 * @value {any} a date.
 */
exports.KEY_CONTEXT_QUERY_TIMESTAMP = '@comunica/actor-init-sparql:queryTimestamp';
/**
 * A comunica actor for query-operation events.
 *
 * Actor types:
 * * Input:  IActionQueryOperation:      A SPARQL Algebra operation.
 * * Test:   <none>
 * * Output: IActorQueryOperationOutput: A bindings stream.
 *
 * @see IActionQueryOperation
 * @see IActorQueryOperationOutput
 */
class ActorQueryOperation extends core_1.Actor {
    constructor(args) {
        super(args);
    }
    /**
     * Safely cast a query operation output to a bindings output.
     * This will throw a runtime error if the output is of the incorrect type.
     * @param {IActorQueryOperationOutput} output A query operation output.
     * @return {IActorQueryOperationOutputBindings} A bindings query operation output.
     */
    static getSafeBindings(output) {
        ActorQueryOperation.validateQueryOutput(output, 'bindings');
        return output;
    }
    /**
     * Safely cast a query operation output to a quads output.
     * This will throw a runtime error if the output is of the incorrect type.
     * @param {IActorQueryOperationOutput} output A query operation output.
     * @return {IActorQueryOperationOutputQuads} A quads query operation output.
     */
    static getSafeQuads(output) {
        ActorQueryOperation.validateQueryOutput(output, 'quads');
        return output;
    }
    /**
     * Safely cast a query operation output to a boolean output.
     * This will throw a runtime error if the output is of the incorrect type.
     * @param {IActorQueryOperationOutput} output A query operation output.
     * @return {IActorQueryOperationOutputBoolean} A boolean query operation output.
     */
    static getSafeBoolean(output) {
        ActorQueryOperation.validateQueryOutput(output, 'boolean');
        return output;
    }
    /**
     * Safely cast a query operation output to an update output.
     * This will throw a runtime error if the output is of the incorrect type.
     * @param {IActorQueryOperationOutput} output A query operation output.
     * @return {IActorQueryOperationOutputUpdate} An update query operation output.
     */
    static getSafeUpdate(output) {
        ActorQueryOperation.validateQueryOutput(output, 'update');
        return output;
    }
    /**
     * Convert a metadata callback to a lazy callback where the response value is cached.
     * @param {() => Promise<{[p: string]: any}>} metadata A metadata callback
     * @return {() => Promise<{[p: string]: any}>} The callback where the response will be cached.
     */
    static cachifyMetadata(metadata) {
        let lastReturn;
        // eslint-disable-next-line no-return-assign,@typescript-eslint/no-misused-promises
        return (metadata && (() => (lastReturn || (lastReturn = metadata()))));
    }
    /**
     * Throw an error if the output type does not match the expected type.
     * @param {IActorQueryOperationOutput} output A query operation output.
     * @param {string} expectedType The expected output type.
     */
    static validateQueryOutput(output, expectedType) {
        if (output.type !== expectedType) {
            throw new Error(`Invalid query output type: Expected '${expectedType}' but got '${output.type}'`);
        }
    }
    /**
     * Create an options object that can be used to construct a sparqlee evaluator.
     * @param context An action context.
     * @param mediatorQueryOperation An optional query query operation mediator.
     *                               If defined, the existence resolver will be defined as `exists`.
     */
    static getExpressionContext(context, mediatorQueryOperation) {
        if (context) {
            const now = context.get(exports.KEY_CONTEXT_QUERY_TIMESTAMP);
            const baseIRI = context.get(exports.KEY_CONTEXT_BASEIRI);
            return Object.assign({ now,
                baseIRI }, mediatorQueryOperation ?
                {
                    exists: ActorQueryOperation.createExistenceResolver(context, mediatorQueryOperation),
                } :
                {});
        }
        return {};
    }
    /**
     * Create an existence resolver for usage within an expression context.
     * @param context An action context.
     * @param mediatorQueryOperation A query operation mediator.
     */
    static createExistenceResolver(context, mediatorQueryOperation) {
        return async (expr, bindings) => {
            const operation = Bindings_1.materializeOperation(expr.input, bindings);
            const outputRaw = await mediatorQueryOperation.mediate({ operation, context });
            const output = ActorQueryOperation.getSafeBindings(outputRaw);
            return new Promise((resolve, reject) => {
                output.bindingsStream.on('end', () => {
                    resolve(false);
                });
                output.bindingsStream.on('error', reject);
                output.bindingsStream.on('data', () => {
                    output.bindingsStream.close();
                    resolve(true);
                });
            })
                .then((exists) => expr.not ? !exists : exists);
        };
    }
}
exports.ActorQueryOperation = ActorQueryOperation;
/**
 * Helper function to get the metadata of an action output.
 * @param actionOutput An action output, with an optional metadata function.
 * @return The metadata.
 */
function getMetadata(actionOutput) {
    if (!actionOutput.metadata) {
        return Promise.resolve({});
    }
    return actionOutput.metadata();
}
exports.getMetadata = getMetadata;
//# sourceMappingURL=ActorQueryOperation.js.map