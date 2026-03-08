import { ExporterConfig } from './config-types';

/** Default configuration values matching config.json. */
export const DEFAULT_CONFIG: ExporterConfig = {
  outputPath: 'lib/src/generated',
  packageName: 'ednet_design_system',
  generateTokenFiles: true,
  generateThemeData: true,
  generateThemeExtension: true,
  generateEdnetDsl: false,
  classPrefix: 'Ednet',
  includeDocComments: true,
};

/** Merge user config overrides with defaults. */
export function resolveConfig(
  userConfig: Partial<ExporterConfig>,
): ExporterConfig {
  return { ...DEFAULT_CONFIG, ...userConfig };
}
