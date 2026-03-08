import { OutputFile, createOutputFile } from '../helpers/file-builder';
import { ExporterConfig } from '../config/config-types';
import { BrandResolver } from '../helpers/brand-resolver';
import { filterTokensByType, TOKEN_CATEGORIES } from '../helpers/token-tree';
import { generateHeader } from '../templates/header';
import { toCamelCase, capitalize } from '../helpers/naming';

/**
 * Token wrapper definition for code generation.
 * Each wrapper class holds related token values with lerp + copyWith.
 */
interface TokenWrapper {
  /** Dart class name (e.g. 'EdnetSpacingTokensGen'). */
  className: string;
  /** Field definitions. */
  fields: WrapperField[];
  /** Category name for the EdnetTokens field. */
  categoryFieldName: string;
  /** Dart type for lerp (e.g. 'double', 'Color'). */
  lerpType: 'double' | 'color';
}

interface WrapperField {
  name: string;
  type: string;
  defaultValue: string;
  docComment?: string;
}

/**
 * Generates an EdnetTokens ThemeExtension with lerp support.
 *
 * Produces `ednet_tokens.g.dart` containing:
 * - Per-category wrapper classes (spacing, borders, colors, etc.) with
 *   copyWith, lerp, ==, and hashCode
 * - An `EdnetTokensGen extends ThemeExtension<EdnetTokensGen>` that
 *   composes all wrappers
 *
 * Matches the existing 41KB EdnetTokens pattern in ednet_tokens.dart.
 */
export class ThemeExtensionGenerator {
  constructor(
    private readonly config: ExporterConfig,
    private readonly brandResolver: BrandResolver,
  ) {}

  /** Generate the ThemeExtension file. */
  generate(tokens: any[]): OutputFile[] {
    if (!this.config.generateThemeExtension) return [];

    const wrappers = this.buildWrappers(tokens);

    const header = generateHeader({
      brand: this.brandResolver.effectiveBrandName,
    });

    const lines: string[] = [
      header,
      "import 'dart:ui';",
      '',
      "import 'package:flutter/material.dart';",
      '',
    ];

    // Generate each wrapper class
    for (const wrapper of wrappers) {
      lines.push(this.generateWrapperClass(wrapper));
      lines.push('');
    }

    // Generate the top-level ThemeExtension
    lines.push(this.generateThemeExtensionClass(wrappers));

    const content = lines.join('\n');
    const outputDir = `${this.config.outputPath}/${this.brandResolver.getOutputSubdirectory()}`;

    return [createOutputFile(outputDir, 'ednet_tokens.g.dart', content)];
  }

  /** Build wrapper definitions from token data. */
  private buildWrappers(tokens: any[]): TokenWrapper[] {
    const wrappers: TokenWrapper[] = [];
    const prefix = this.config.classPrefix;

    // Spacing wrapper (Space + Dimension routed to spacing)
    const spacingPatterns = ['spacing', 'space', 'gap', 'padding', 'margin', 'inset'];
    const spacingTokens = filterTokensByType(tokens, ['Space', 'Dimension'], spacingPatterns);
    if (spacingTokens.length > 0) {
      wrappers.push({
        className: `${prefix}SpacingTokensGen`,
        categoryFieldName: 'spacing',
        lerpType: 'double',
        fields: spacingTokens.map((t) => ({
          name: toCamelCase(t.name.split('/').pop() ?? t.name),
          type: 'double',
          defaultValue: `${t.value?.measure ?? t.value ?? 0}.0`,
          docComment: t.description,
        })),
      });
    }

    // Border wrapper (BorderRadius + BorderWidth + Dimension routed to borders)
    const borderPatterns = ['border', 'radius', 'corner', 'stroke'];
    const borderTokens = filterTokensByType(tokens, ['BorderRadius', 'BorderWidth', 'Dimension'], borderPatterns);
    if (borderTokens.length > 0) {
      wrappers.push({
        className: `${prefix}BorderTokensGen`,
        categoryFieldName: 'borders',
        lerpType: 'double',
        fields: borderTokens.map((t) => ({
          name: toCamelCase(t.name.split('/').pop() ?? t.name),
          type: 'double',
          defaultValue: `${t.value?.measure ?? t.value ?? 0}.0`,
          docComment: t.description,
        })),
      });
    }

    // Color wrapper
    const colorTokens = filterTokensByType(tokens, ['Color']);
    if (colorTokens.length > 0) {
      wrappers.push({
        className: `${prefix}ColorTokensGen`,
        categoryFieldName: 'colors',
        lerpType: 'color',
        fields: this.buildColorFields(colorTokens),
      });
    }

    return wrappers;
  }

  /** Build color wrapper fields from color tokens. */
  private buildColorFields(tokens: any[]): WrapperField[] {
    const toHex = (v: number) =>
      Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0').toUpperCase();

    return tokens.slice(0, 50).map((t) => {
      // SDK ColorTokenValue: { color: { r, g, b }, opacity: { measure } }
      const colorVal = t.value?.color ?? { r: 0, g: 0, b: 0 };
      const opacityVal = t.value?.opacity ?? { measure: 1 };
      const alpha = Math.round((opacityVal.measure ?? 1) * 255);
      const red = Math.round(colorVal.r ?? 0);
      const green = Math.round(colorVal.g ?? 0);
      const blue = Math.round(colorVal.b ?? 0);

      return {
        name: toCamelCase(t.name.split('/').pop() ?? t.name),
        type: 'Color',
        defaultValue: `Color(0x${toHex(alpha)}${toHex(red)}${toHex(green)}${toHex(blue)})`,
        docComment: t.description,
      };
    });
  }

  /** Generate a single wrapper class. */
  private generateWrapperClass(wrapper: TokenWrapper): string {
    const lines: string[] = [];
    const { className, fields, lerpType } = wrapper;

    // Class declaration
    lines.push(`/// Generated token wrapper with lerp support.`);
    lines.push(`@immutable`);
    lines.push(`class ${className} {`);

    // Constructor
    lines.push(`  const ${className}({`);
    for (const field of fields) {
      lines.push(`    this.${field.name} = const ${field.defaultValue},`);
    }
    lines.push(`  });`);
    lines.push('');

    // Fields
    for (const field of fields) {
      if (field.docComment) {
        lines.push(`  /// ${field.docComment}`);
      }
      lines.push(`  final ${field.type} ${field.name};`);
      lines.push('');
    }

    // copyWith
    lines.push(`  ${className} copyWith({`);
    for (const field of fields) {
      lines.push(`    ${field.type}? ${field.name},`);
    }
    lines.push(`  }) {`);
    lines.push(`    return ${className}(`);
    for (const field of fields) {
      lines.push(`      ${field.name}: ${field.name} ?? this.${field.name},`);
    }
    lines.push(`    );`);
    lines.push(`  }`);
    lines.push('');

    // lerp
    lines.push(`  // ignore: prefer_constructors_over_static_methods`);
    lines.push(`  static ${className} lerp(`);
    lines.push(`    ${className} a,`);
    lines.push(`    ${className} b,`);
    lines.push(`    double t,`);
    lines.push(`  ) {`);
    lines.push(`    return ${className}(`);
    for (const field of fields) {
      if (lerpType === 'color') {
        lines.push(
          `      ${field.name}: Color.lerp(a.${field.name}, b.${field.name}, t) ?? a.${field.name},`,
        );
      } else {
        lines.push(
          `      ${field.name}: lerpDouble(a.${field.name}, b.${field.name}, t) ?? a.${field.name},`,
        );
      }
    }
    lines.push(`    );`);
    lines.push(`  }`);
    lines.push('');

    // == operator
    lines.push(`  @override`);
    lines.push(`  bool operator ==(Object other) =>`);
    lines.push(`      identical(this, other) ||`);
    lines.push(`      other is ${className} &&`);
    lines.push(`          runtimeType == other.runtimeType &&`);
    for (let i = 0; i < fields.length; i++) {
      const suffix = i < fields.length - 1 ? ' &&' : ';';
      lines.push(`          ${fields[i].name} == other.${fields[i].name}${suffix}`);
    }
    lines.push('');

    // hashCode
    lines.push(`  @override`);
    if (fields.length <= 20) {
      lines.push(`  int get hashCode => Object.hash(`);
      for (let i = 0; i < fields.length; i++) {
        const suffix = i < fields.length - 1 ? ',' : ',';
        lines.push(`    ${fields[i].name}${suffix}`);
      }
      lines.push(`  );`);
    } else {
      // Object.hash supports max 20 args, use hashAll for more
      lines.push(`  int get hashCode => Object.hashAll([`);
      for (const field of fields) {
        lines.push(`    ${field.name},`);
      }
      lines.push(`  ]);`);
    }

    lines.push(`}`);
    return lines.join('\n');
  }

  /** Generate the top-level ThemeExtension class. */
  private generateThemeExtensionClass(wrappers: TokenWrapper[]): string {
    const prefix = this.config.classPrefix;
    const className = `${prefix}TokensGen`;
    const lines: string[] = [];

    lines.push(`/// Generated ThemeExtension composing all token wrappers.`);
    lines.push(`///`);
    lines.push(`/// Access via:`);
    lines.push(`/// \`\`\`dart`);
    lines.push(`/// final tokens = Theme.of(context).extension<${className}>()!;`);
    lines.push(`/// final spacing = tokens.spacing;`);
    lines.push(`/// \`\`\``);
    lines.push(`class ${className} extends ThemeExtension<${className}> {`);

    // Constructor
    lines.push(`  const ${className}({`);
    for (const w of wrappers) {
      lines.push(`    required this.${w.categoryFieldName},`);
    }
    lines.push(`  });`);
    lines.push('');

    // Factory constructors for light/dark
    lines.push(`  /// Default light theme tokens.`);
    lines.push(`  factory ${className}.light() => const ${className}(`);
    for (const w of wrappers) {
      lines.push(`    ${w.categoryFieldName}: ${w.className}(),`);
    }
    lines.push(`  );`);
    lines.push('');

    lines.push(`  /// Default dark theme tokens.`);
    lines.push(`  factory ${className}.dark() => const ${className}(`);
    for (const w of wrappers) {
      lines.push(`    ${w.categoryFieldName}: ${w.className}(),`);
    }
    lines.push(`  );`);
    lines.push('');

    // Fields
    for (const w of wrappers) {
      lines.push(`  /// ${capitalize(w.categoryFieldName)} tokens.`);
      lines.push(`  final ${w.className} ${w.categoryFieldName};`);
      lines.push('');
    }

    // copyWith
    lines.push(`  @override`);
    lines.push(`  ${className} copyWith({`);
    for (const w of wrappers) {
      lines.push(`    ${w.className}? ${w.categoryFieldName},`);
    }
    lines.push(`  }) {`);
    lines.push(`    return ${className}(`);
    for (const w of wrappers) {
      lines.push(
        `      ${w.categoryFieldName}: ${w.categoryFieldName} ?? this.${w.categoryFieldName},`,
      );
    }
    lines.push(`    );`);
    lines.push(`  }`);
    lines.push('');

    // lerp
    lines.push(`  @override`);
    lines.push(`  ${className} lerp(${className}? other, double t) {`);
    lines.push(`    if (other is! ${className}) return this;`);
    lines.push(`    return ${className}(`);
    for (const w of wrappers) {
      lines.push(
        `      ${w.categoryFieldName}: ${w.className}.lerp(${w.categoryFieldName}, other.${w.categoryFieldName}, t),`,
      );
    }
    lines.push(`    );`);
    lines.push(`  }`);

    lines.push(`}`);
    lines.push('');

    return lines.join('\n');
  }
}
