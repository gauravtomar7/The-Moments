import { Diagnostic } from './interfaces';
export interface Options {
    cwd: string;
    typingsFile?: string;
    testFiles?: readonly string[];
}
/**
 * Type check the type definition of the project.
 *
 * @returns A promise which resolves the diagnostics of the type definition.
 */
declare const _default: (options?: Options) => Promise<Diagnostic[]>;
export default _default;
