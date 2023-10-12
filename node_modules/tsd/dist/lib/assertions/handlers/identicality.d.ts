import { CallExpression, TypeChecker } from '@tsd/typescript';
import { Diagnostic } from '../../interfaces';
/**
 * Asserts that the argument of the assertion is identical to the generic type of the assertion.
 *
 * @param checker - The TypeScript type checker.
 * @param nodes - The `expectType` AST nodes.
 * @return List of custom diagnostics.
 */
export declare const isIdentical: (checker: TypeChecker, nodes: Set<CallExpression>) => Diagnostic[];
/**
 * Asserts that the argument of the assertion is not identical to the generic type of the assertion.
 *
 * @param checker - The TypeScript type checker.
 * @param nodes - The `expectNotType` AST nodes.
 * @return List of custom diagnostics.
 */
export declare const isNotIdentical: (checker: TypeChecker, nodes: Set<CallExpression>) => Diagnostic[];
/**
 * Verifies that the argument of the assertion is `never`
 *
 * @param checker - The TypeScript type checker.
 * @param nodes - The `expectNever` AST nodes.
 * @return List of custom diagnostics.
 */
export declare const isNever: (checker: TypeChecker, nodes: Set<CallExpression>) => Diagnostic[];
