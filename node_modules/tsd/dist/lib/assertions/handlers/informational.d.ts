import { CallExpression, TypeChecker } from '@tsd/typescript';
import { Diagnostic } from '../../interfaces';
/**
 * Prints the type of the argument of the assertion as a warning.
 *
 * @param checker - The TypeScript type checker.
 * @param nodes - The `printType` AST nodes.
 * @return List of warning diagnostics containing the type of the first argument.
 */
export declare const printTypeWarning: (checker: TypeChecker, nodes: Set<CallExpression>) => Diagnostic[];
/**
 * Asserts that the documentation comment for the argument of the assertion
 * includes the string literal generic type of the assertion.
 *
 * @param checker - The TypeScript type checker.
 * @param nodes - The `expectDocCommentIncludes` AST nodes.
 * @return List of diagnostics.
 */
export declare const expectDocCommentIncludes: (checker: TypeChecker, nodes: Set<CallExpression>) => Diagnostic[];
