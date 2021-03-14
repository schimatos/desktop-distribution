"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEvaluator = void 0;
const rdf_string_1 = require("rdf-string");
const sparqlalgebrajs_1 = require("sparqlalgebrajs");
/**
 * Creates an evaluator function that executes the given Sxpression on the given Bindings.
 * This implementation is copied from the original LDF Client implementation.
 * THIS IMPLEMENTATION IS NOT FULLY SPEC COMPATIBLE!!!
 * But covers most of the standard cases.
 * @param {Expression} expr
 * @returns {(bindings: Bindings) => Term}
 */
function createEvaluator(expr) {
    const func = handleExpression(expr);
    // Internally the expression evaluator uses primitives, so these have to be converted back
    return (bindings) => {
        const str = func(bindings);
        if (!str) {
            return;
        }
        return rdf_string_1.stringToTerm(str);
    };
}
exports.createEvaluator = createEvaluator;
function handleExpression(expr) {
    if (expr.expressionType === sparqlalgebrajs_1.Algebra.expressionTypes.TERM) {
        return handleTermExpression(expr);
    }
    if (expr.expressionType === sparqlalgebrajs_1.Algebra.expressionTypes.NAMED) {
        return handleNamedExpression(expr);
    }
    if (expr.expressionType === sparqlalgebrajs_1.Algebra.expressionTypes.OPERATOR) {
        return handleOperatorExpression(expr);
    }
    throw new Error(`Unsupported Expression type: ${expr.expressionType}`);
}
function handleTermExpression(expr) {
    if (expr.term.termType === 'Variable') {
        return bindings => {
            const str = rdf_string_1.termToString(expr.term);
            return bindings.has(str) ? rdf_string_1.termToString(bindings.get(str)) : undefined;
        };
    }
    const str = rdf_string_1.termToString(expr.term);
    return () => str;
}
function handleNamedExpression(expr) {
    return handleFunction(expr.name.value, expr.args);
}
function handleOperatorExpression(expr) {
    return handleFunction(expr.operator, expr.args);
}
function handleFunction(operatorName, args) {
    const op = operators[operatorName];
    if (!op) {
        throw new Error(`Unsupported operator ${operatorName}`);
    }
    // Special case: some operators accept expressions instead of evaluated expressions
    if (op.acceptsExpressions) {
        return ((operator, unparsedArgs) => (bindings) => operator.apply(bindings, unparsedArgs))(op, args);
    }
    const funcArgs = args.map(handleExpression);
    return ((operator, argumentExpressions) => (bindings) => {
        // Evaluate the arguments
        const resolvedArgs = new Array(argumentExpressions.length);
        const origArgs = new Array(argumentExpressions.length);
        for (const [i, element] of argumentExpressions.entries()) {
            const arg = resolvedArgs[i] = origArgs[i] = element(bindings);
            // Convert the arguments if necessary
            switch (operator.type) {
                case 'numeric':
                    resolvedArgs[i] = arg ? Number.parseFloat(literalValue(arg)) : undefined;
                    break;
                case 'boolean':
                    resolvedArgs[i] = arg !== XSD_FALSE &&
                        (!isLiteral(arg) || literalValue(arg) !== '0');
                    break;
            }
        }
        // Call the operator on the evaluated arguments
        // eslint-disable-next-line prefer-spread
        const result = operator.apply(null, resolvedArgs);
        // Convert result if necessary
        switch (operator.resultType) {
            case 'numeric':
                // eslint-disable-next-line no-case-declarations
                let type = origArgs[0] ? getLiteralType(origArgs[0]) : undefined;
                if (!type || type === XSD_STRING) {
                    type = XSD_INTEGER;
                }
                return `"${result}"^^${type}`;
            case 'boolean':
                return result ? XSD_TRUE : XSD_FALSE;
            default:
                return result;
        }
    })(op, funcArgs);
}
function isLiteral(entity) {
    return typeof entity === 'string' && entity.startsWith('"');
}
function literalValue(literal) {
    const match = /^"([^]*)"/u.exec(literal);
    return (match && match[1]) || '';
}
function getLiteralType(literal) {
    var _a;
    const match = /^"[^]*"(?:\^\^([^"]+)|(@)[^"@]+)?$/u.exec(literal);
    return (_a = (match && match[1])) !== null && _a !== void 0 ? _a : (match && match[2] ?
        'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString' :
        'http://www.w3.org/2001/XMLSchema#string');
}
function getLiteralLanguage(literal) {
    const match = /^"[^]*"(?:@([^"@]+)|\^\^[^"]+)?$/u.exec(literal);
    return match && match[1] ? match[1].toLowerCase() : '';
}
const XSD = 'http://www.w3.org/2001/XMLSchema#';
const XSD_INTEGER = `${XSD}integer`;
const XSD_DOUBLE = `${XSD}double`;
const XSD_BOOLEAN = `${XSD}boolean`;
const XSD_STRING = `${XSD}string`;
const XSD_TRUE = `"true"^^${XSD_BOOLEAN}`;
const XSD_FALSE = `"false"^^${XSD_BOOLEAN}`;
// Operators for each of the operator types
const operators = {
    '+'(a, b) {
        return a + b;
    },
    '-'(a, b) {
        return a - b;
    },
    '*'(a, b) {
        return a * b;
    },
    '/'(a, b) {
        return a / b;
    },
    '='(a, b) {
        return a === b;
    },
    '!='(a, b) {
        return a !== b;
    },
    '<'(a, b) {
        return a < b;
    },
    '<='(a, b) {
        return a <= b;
    },
    '>'(a, b) {
        return a > b;
    },
    '>='(a, b) {
        return a >= b;
    },
    '!'(a) {
        return !a;
    },
    '&&'(a, b) {
        return a && b;
    },
    '||'(a, b) {
        return a || b;
    },
    'lang'(a) {
        return isLiteral(a) ? `"${getLiteralLanguage(a).toLowerCase()}"` : undefined;
    },
    'langmatches'(langTag, langRange) {
        // Implements https://tools.ietf.org/html/rfc4647#section-3.3.1
        if (!langTag || !langRange) {
            return false;
        }
        langTag = langTag.toLowerCase();
        langRange = langRange.toLowerCase();
        // eslint-disable-next-line no-return-assign
        return langTag === langRange ||
            ((langRange = literalValue(langRange)) === '*' && Boolean(langTag)) ||
            // eslint-disable-next-line unicorn/prefer-string-slice
            langTag.substr(1, langRange.length + 1) === `${langRange}-`;
    },
    'contains'(str, substring) {
        substring = literalValue(substring);
        str = literalValue(str);
        return str.includes(substring);
    },
    'regex'(subject, pattern) {
        if (isLiteral(subject)) {
            subject = literalValue(subject);
        }
        // eslint-disable-next-line require-unicode-regexp
        return new RegExp(literalValue(pattern)).test(subject);
    },
    'str'(a) {
        return isLiteral(a) ? a : `"${a}"`;
    },
    'http://www.w3.org/2001/XMLSchema#integer'(a) {
        return `"${Math.floor(a)}"^^http://www.w3.org/2001/XMLSchema#integer`;
    },
    'http://www.w3.org/2001/XMLSchema#double'(a) {
        let str = a.toString();
        if (!str.includes('.')) {
            str += '.0';
        }
        return `"${str}"^^http://www.w3.org/2001/XMLSchema#double`;
    },
    'bound'(a) {
        if (a.expressionType !== 'term') {
            throw new Error(`BOUND expects a TermExpression but got: ${JSON.stringify(a)}`);
        }
        const { term } = a;
        if (term.termType !== 'Variable') {
            throw new Error(`BOUND expects a Variable but got: ${JSON.stringify(term)}`);
        }
        return this.has(rdf_string_1.termToString(term)) ? XSD_TRUE : XSD_FALSE;
    },
};
// Tag all operators that expect their arguments to be numeric
[
    '+', '-', '*', '/', '<', '<=', '>', '>=',
    XSD_INTEGER, XSD_DOUBLE,
].forEach(operatorName => {
    operators[operatorName].type = 'numeric';
});
// Tag all operators that expect their arguments to be boolean
[
    '!', '&&', '||',
].forEach(operatorName => {
    operators[operatorName].type = 'boolean';
});
// Tag all operators that have numeric results
[
    '+', '-', '*', '/',
].forEach(operatorName => {
    operators[operatorName].resultType = 'numeric';
});
// Tag all operators that have boolean results
[
    '!', '&&', '||', '=', '!=', '<', '<=', '>', '>=',
    'langmatches', 'contains', 'regex',
].forEach(operatorName => {
    operators[operatorName].resultType = 'boolean';
});
// Tag all operators that take expressions instead of evaluated expressions
operators.bound.acceptsExpressions = true;
//# sourceMappingURL=SparqlExpressionEvaluator.js.map