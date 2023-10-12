/**
 * Retrieve the line and column position of a property in a JSON document.
 *
 * @param content - Content of the JSON document.
 * @param property - Property to search for.
 * @returns Position of the property or `undefined` if the property could not be found.
 */
declare const _default: (content: string, property: string) => {
    line: number;
    column: number;
} | undefined;
export default _default;
