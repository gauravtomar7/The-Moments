import { Handler } from './handler';
/**
 * Asserts that the argument of the assertion is marked as `@deprecated`.
 * If it's not marked as `@deprecated`, an error diagnostic is returned.
 *
 * @param checker - The TypeScript type checker.
 * @param nodes - The `expectDeprecated` AST nodes.
 * @return List of diagnostics.
 */
export declare const expectDeprecated: Handler;
/**
 * Asserts that the argument of the assertion is not marked as `@deprecated`.
 * If it's marked as `@deprecated`, an error diagnostic is returned.
 *
 * @param checker - The TypeScript type checker.
 * @param nodes - The `expectNotDeprecated` AST nodes.
 * @return List of diagnostics.
 */
export declare const expectNotDeprecated: Handler;
