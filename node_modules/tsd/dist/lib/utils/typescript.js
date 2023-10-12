"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressionToString = exports.resolveDocComment = exports.resolveJSDocTags = void 0;
const typescript_1 = require("@tsd/typescript");
const resolveCommentHelper = (resolve) => {
    const handler = (checker, expression) => {
        const ref = (0, typescript_1.isCallLikeExpression)(expression) ?
            checker.getResolvedSignature(expression) :
            checker.getSymbolAtLocation(expression);
        if (!ref) {
            return;
        }
        switch (resolve) {
            case 'JSDoc':
                return new Map(ref.getJsDocTags().map(tag => [tag.name, tag]));
            case 'DocComment':
                return (0, typescript_1.displayPartsToString)(ref.getDocumentationComment(checker));
            default:
                return undefined;
        }
    };
    return handler;
};
/**
 * Resolve the JSDoc tags from the expression. If these tags couldn't be found, it will return `undefined`.
 *
 * @param checker - The TypeScript type checker.
 * @param expression - The expression to resolve the JSDoc tags for.
 * @return A unique Set of JSDoc tags or `undefined` if they couldn't be resolved.
 */
exports.resolveJSDocTags = resolveCommentHelper('JSDoc');
/**
 * Resolve the documentation comment from the expression. If the comment can't be found, it will return `undefined`.
 *
 * @param checker - The TypeScript type checker.
 * @param expression - The expression to resolve the documentation comment for.
 * @return A string of the documentation comment or `undefined` if it can't be resolved.
 */
exports.resolveDocComment = resolveCommentHelper('DocComment');
/**
 * Convert a TypeScript expression to a string.
 *
 * @param checker - The TypeScript type checker.
 * @param expression - The expression to convert.
 * @return The string representation of the expression or `undefined` if it couldn't be resolved.
 */
const expressionToString = (checker, expression) => {
    if ((0, typescript_1.isCallLikeExpression)(expression)) {
        const signature = checker.getResolvedSignature(expression);
        if (!signature) {
            return;
        }
        return checker.signatureToString(signature);
    }
    const symbol = checker.getSymbolAtLocation(expression);
    if (!symbol) {
        return;
    }
    return checker.symbolToString(symbol, expression);
};
exports.expressionToString = expressionToString;
