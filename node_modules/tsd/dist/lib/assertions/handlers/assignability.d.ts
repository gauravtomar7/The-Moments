import { CallExpression, TypeChecker } from '@tsd/typescript';
import { Diagnostic } from '../../interfaces';
/**
 * Asserts that the argument of the assertion is not assignable to the generic type of the assertion.
 *
 * @param checker - The TypeScript type checker.
 * @param nodes - The `expectNotAssignable` AST nodes.
 * @return List of custom diagnostics.
 */
export declare const isNotAssignable: (checker: TypeChecker, nodes: Set<CallExpression>) => Diagnostic[];
