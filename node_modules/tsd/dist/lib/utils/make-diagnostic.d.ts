import { Node } from '@tsd/typescript';
import { Diagnostic } from '../interfaces';
/**
 * Create a diagnostic from the given `node`, `message` and optional `severity`.
 *
 * @param node - The TypeScript Node where this diagnostic occurs.
 * @param message - Message of the diagnostic.
 * @param severity - Severity of the diagnostic.
 */
declare const _default: (node: Node, message: string, severity?: 'error' | 'warning') => Diagnostic;
export default _default;
