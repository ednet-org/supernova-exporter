/** User-adjustable exporter configuration. */
export interface ExporterConfig {
  /** Base path for generated Dart files relative to package root. */
  outputPath: string;
  /** Dart package name for import paths. */
  packageName: string;
  /** Generate individual Dart token constant files. */
  generateTokenFiles: boolean;
  /** Generate complete Flutter ThemeData builder function. */
  generateThemeData: boolean;
  /** Generate EdnetTokens ThemeExtension with lerp support. */
  generateThemeExtension: boolean;
  /** Generate domain model YAML from component structure. */
  generateEdnetDsl: boolean;
  /** Prefix for generated Dart class names (e.g. Ednet, Morfik). */
  classPrefix: string;
  /** Add /// doc comments to generated Dart code. */
  includeDocComments: boolean;
}
