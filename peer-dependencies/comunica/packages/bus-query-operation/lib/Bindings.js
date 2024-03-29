"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.materializeOperation = exports.materializeTerm = exports.ensureBindings = exports.isBindings = exports.Bindings = void 0;
const immutable_1 = require("immutable");
const rdf_string_1 = require("rdf-string");
const sparqlalgebrajs_1 = require("sparqlalgebrajs");
/**
 * A convenience constructor for bindings based on a given hash.
 * @param {{[p: string]: RDF.Term}} hash A hash that maps variable names to terms.
 * @return {Bindings} The immutable bindings from the hash.
 * @constructor
 */
// eslint-disable-next-line no-redeclare
function Bindings(hash) {
    return immutable_1.Map(hash);
}
exports.Bindings = Bindings;
/**
 * Check if the given object is a bindings object.
 * @param maybeBindings Any object.
 * @return {boolean} If the object is a bindings object.
 */
function isBindings(maybeBindings) {
    return immutable_1.Map.isMap(maybeBindings);
}
exports.isBindings = isBindings;
/**
 * Convert the given object to a bindings object if it is not a bindings object yet.
 * If it already is a bindings object, return the object as-is.
 * @param maybeBindings Any object.
 * @return {Bindings} A bindings object.
 */
function ensureBindings(maybeBindings) {
    return isBindings(maybeBindings) ? maybeBindings : Bindings(maybeBindings);
}
exports.ensureBindings = ensureBindings;
/**
 * Materialize a term with the given binding.
 *
 * If the given term is a variable,
 * and that variable exist in the given bindings object,
 * the value of that binding is returned.
 * In all other cases, the term itself is returned.
 *
 * @param {RDF.Term} term A term.
 * @param {Bindings} bindings A bindings object.
 * @return {RDF.Term} The materialized term.
 */
function materializeTerm(term, bindings) {
    if (term.termType === 'Variable') {
        const value = bindings.get(rdf_string_1.termToString(term));
        if (value) {
            return value;
        }
    }
    return term;
}
exports.materializeTerm = materializeTerm;
/**
 * Materialize the given operation (recursively) with the given bindings.
 * Essentially, all variables in the given operation will be replaced
 * by the terms bound to the variables in the given bindings.
 * @param {Operation} operation SPARQL algebra operation.
 * @param {Bindings} bindings A bindings object.
 * @param {boolean} strictTargetVariables If target variable bindings (such as on SELECT or BIND) should not be allowed.
 * @return Algebra.Operation A new operation materialized with the given bindings.
 */
function materializeOperation(operation, bindings, strictTargetVariables = false) {
    return sparqlalgebrajs_1.Util.mapOperation(operation, {
        path(op, factory) {
            // Materialize variables in a path expression.
            // The predicate expression will be recursed.
            return {
                recurse: false,
                result: factory.createPath(materializeTerm(op.subject, bindings), op.predicate, materializeTerm(op.object, bindings), materializeTerm(op.graph, bindings)),
            };
        },
        pattern(op, factory) {
            // Materialize variables in the quad pattern.
            return {
                recurse: false,
                result: factory.createPattern(materializeTerm(op.subject, bindings), materializeTerm(op.predicate, bindings), materializeTerm(op.object, bindings), materializeTerm(op.graph, bindings)),
            };
        },
        extend(op) {
            // Materialize an extend operation.
            // If strictTargetVariables is true, we throw if the extension target variable is attempted to be bound.
            // Otherwise, we remove the extend operation.
            if (bindings.has(rdf_string_1.termToString(op.variable))) {
                if (strictTargetVariables) {
                    throw new Error(`Tried to bind variable ${rdf_string_1.termToString(op.variable)} in a BIND operator.`);
                }
                else {
                    return {
                        recurse: true,
                        result: materializeOperation(op.input, bindings, strictTargetVariables),
                    };
                }
            }
            return {
                recurse: true,
                result: op,
            };
        },
        group(op, factory) {
            // Materialize a group operation.
            // If strictTargetVariables is true, we throw if the group target variable is attempted to be bound.
            // Otherwise, we just filter out the bound variables.
            if (strictTargetVariables) {
                for (const variable of op.variables) {
                    if (bindings.has(rdf_string_1.termToString(variable))) {
                        throw new Error(`Tried to bind variable ${rdf_string_1.termToString(variable)} in a GROUP BY operator.`);
                    }
                }
                return {
                    recurse: true,
                    result: op,
                };
            }
            const variables = op.variables.filter(variable => !bindings.has(rdf_string_1.termToString(variable)));
            return {
                recurse: true,
                result: factory.createGroup(op.input, variables, op.aggregates),
            };
        },
        project(op, factory) {
            // Materialize a project operation.
            // If strictTargetVariables is true, we throw if the project target variable is attempted to be bound.
            // Otherwise, we just filter out the bound variables.
            if (strictTargetVariables) {
                for (const variable of op.variables) {
                    if (bindings.has(rdf_string_1.termToString(variable))) {
                        throw new Error(`Tried to bind variable ${rdf_string_1.termToString(variable)} in a SELECT operator.`);
                    }
                }
                return {
                    recurse: true,
                    result: op,
                };
            }
            const variables = op.variables.filter(variable => !bindings.has(rdf_string_1.termToString(variable)));
            return {
                recurse: true,
                result: factory.createProject(op.input, variables),
            };
        },
        values(op, factory) {
            // Materialize a values operation.
            // If strictTargetVariables is true, we throw if the values target variable is attempted to be bound.
            // Otherwise, we just filter out the bound variables and their bindings.
            if (strictTargetVariables) {
                for (const variable of op.variables) {
                    if (bindings.has(rdf_string_1.termToString(variable))) {
                        throw new Error(`Tried to bind variable ${rdf_string_1.termToString(variable)} in a VALUES operator.`);
                    }
                }
            }
            else {
                const variables = op.variables.filter(variable => !bindings.has(rdf_string_1.termToString(variable)));
                const valueBindings = op.bindings.map(binding => {
                    const newBinding = Object.assign({}, binding);
                    bindings.forEach((value, key) => delete newBinding[key]);
                    return newBinding;
                });
                return {
                    recurse: true,
                    result: factory.createValues(variables, valueBindings),
                };
            }
            return {
                recurse: false,
                result: op,
            };
        },
        expression(op, factory) {
            if (op.expressionType === 'term') {
                // Materialize a term expression
                return {
                    recurse: false,
                    result: factory.createTermExpression(materializeTerm(op.term, bindings)),
                };
            }
            if (op.expressionType === 'aggregate' &&
                'variable' in op &&
                bindings.has(rdf_string_1.termToString(op.variable))) {
                // Materialize a bound aggregate operation.
                // If strictTargetVariables is true, we throw if the expression target variable is attempted to be bound.
                // Otherwise, we ignore this operation.
                if (strictTargetVariables) {
                    throw new Error(`Tried to bind ${rdf_string_1.termToString(op.variable)} in a ${op.aggregator} aggregate.`);
                }
                else {
                    return {
                        recurse: true,
                        result: op,
                    };
                }
            }
            return {
                recurse: true,
                result: op,
            };
        },
    });
}
exports.materializeOperation = materializeOperation;
//# sourceMappingURL=Bindings.js.map