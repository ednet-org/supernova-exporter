/**
 * EDNet Design System Supernova Exporter
 *
 * Generates Dart token files, Flutter ThemeData, and EDNet DSL v2 YAML
 * from Supernova design tokens. Runs inside Supernova's secure sandbox.
 *
 * Entry point: Pulsar.export(async (sdk, context) => [...])
 */

import { ExporterConfig } from './config/config-types';
import { resolveConfig } from './config/config-defaults';
import { TokenGenerator } from './generators/token-generator';
import { ThemeDataGenerator } from './generators/theme-data-generator';
import { ThemeExtensionGenerator } from './generators/theme-extension-generator';
import { BrandThemeGenerator } from './generators/brand-theme-generator';
import { EdnetDslGenerator } from './generators/ednet-dsl-generator';
import { BrandResolver } from './helpers/brand-resolver';
import { OutputFile } from './helpers/file-builder';

// Supernova Pulsar globals (injected by runtime)
declare const Pulsar: {
  export: (fn: (sdk: any, context: any) => Promise<any[]>) => void;
  exportConfig: <T>() => T;
};

declare const FileHelper: {
  createTextFile: (opts: {
    relativePath: string;
    fileName: string;
    content: string;
  }) => any;
};

Pulsar.export(async (sdk: any, context: any): Promise<any[]> => {
  const userConfig = Pulsar.exportConfig<Partial<ExporterConfig>>();
  const config = resolveConfig(userConfig);

  // Resolve brand/theme from pipeline context
  const brandResolver = new BrandResolver(context.brand, context.theme);

  // Collect all output files
  const outputFiles: OutputFile[] = [];

  // Fetch all tokens once for reuse across generators
  const allTokens = await sdk.tokens.getTokens({
    versionId: context.designSystemVersion,
  });

  // Phase 1: Token files
  if (config.generateTokenFiles) {
    const tokenGen = new TokenGenerator(config, brandResolver);
    outputFiles.push(...tokenGen.generate(allTokens));
  }

  // Phase 2: ThemeData
  if (config.generateThemeData) {
    const themeGen = new ThemeDataGenerator(config, brandResolver);
    outputFiles.push(...themeGen.generate(allTokens));
  }

  // Phase 2: ThemeExtension (EdnetTokensGen with lerp/copyWith)
  if (config.generateThemeExtension) {
    const extGen = new ThemeExtensionGenerator(config, brandResolver);
    outputFiles.push(...extGen.generate(allTokens));
  }

  // Phase 3: EDNet DSL v2 YAML
  if (config.generateEdnetDsl) {
    const components = await sdk.components.getComponents({
      versionId: context.designSystemVersion,
    });
    const componentGroups = await sdk.components.getComponentGroups({
      versionId: context.designSystemVersion,
    });

    const dslGen = new EdnetDslGenerator(config);
    outputFiles.push(...dslGen.generate(components, componentGroups));
  }

  // Brand-specific theme wrapper
  const brandThemeGen = new BrandThemeGenerator(config, brandResolver);
  outputFiles.push(...brandThemeGen.generate(allTokens));

  // Convert our OutputFile[] to Supernova's AnyOutputFile[] via FileHelper
  return outputFiles.map((f) =>
    FileHelper.createTextFile({
      relativePath: f.relativePath,
      fileName: f.fileName,
      content: f.content,
    }),
  );
});
