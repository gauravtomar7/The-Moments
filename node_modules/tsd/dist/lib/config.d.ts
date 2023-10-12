import { Config, PackageJsonWithTsdConfig } from './interfaces';
/**
 * Load the configuration settings.
 *
 * @param pkg - The package.json object.
 * @returns The config object.
 */
declare const _default: (pkg: PackageJsonWithTsdConfig, cwd: string) => Config;
export default _default;
