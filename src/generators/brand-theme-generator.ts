import { OutputFile, createOutputFile } from '../helpers/file-builder';
import { ExporterConfig } from '../config/config-types';
import { BrandResolver } from '../helpers/brand-resolver';
import { generateHeader } from '../templates/header';

/**
 * Generates a brand-specific theme file that imports and wraps
 * the base ThemeData builder with brand-specific overrides.
 */
export class BrandThemeGenerator {
  constructor(
    private readonly config: ExporterConfig,
    private readonly brandResolver: BrandResolver,
  ) {}

  generate(tokens: any[]): OutputFile[] {
    const prefix = this.config.classPrefix;
    const brandName = this.brandResolver.effectiveBrandName;
    const outputDir = `${this.config.outputPath}/${this.brandResolver.getOutputSubdirectory()}`;

    const header = generateHeader({ brand: brandName });

    const content = `${header}
import 'package:flutter/material.dart';
import 'theme_data.g.dart';

/// Brand-specific theme for ${brandName}.
///
/// Wraps the base [build${prefix}Theme] with brand identity overrides.
/// Use this as the entry point for brand-themed apps:
///
/// \`\`\`dart
/// MaterialApp(
///   theme: build${prefix}BrandTheme(Brightness.light),
///   darkTheme: build${prefix}BrandTheme(Brightness.dark),
/// );
/// \`\`\`
ThemeData build${prefix}BrandTheme(
  Brightness brightness, {
  ColorScheme? baseScheme,
}) {
  return build${prefix}Theme(brightness, baseScheme: baseScheme);
}
`;

    return [createOutputFile(outputDir, 'brand_theme.g.dart', content)];
  }
}
