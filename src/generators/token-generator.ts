import { OutputFile, createOutputFile } from '../helpers/file-builder';
import { ExporterConfig } from '../config/config-types';
import { BrandResolver } from '../helpers/brand-resolver';
import { TOKEN_CATEGORIES, filterTokensByType, TokenCategory } from '../helpers/token-tree';
import { generateHeader } from '../templates/header';
import { buildAbstractFinalClass, ClassSection, ClassField } from '../templates/class-template';
import { mapColorToken } from '../mappers/color-mapper';
import { mapSpacingToken } from '../mappers/spacing-mapper';
import { mapTypographyToken } from '../mappers/typography-mapper';
import { mapElevationToken } from '../mappers/elevation-mapper';
import { mapBorderWidthToken, mapRadiusToken } from '../mappers/border-mapper';
import { mapAnimationToken } from '../mappers/animation-mapper';
import { mapOpacityToken } from '../mappers/opacity-mapper';
import { mapGradientToken } from '../mappers/gradient-mapper';
import { tokenPathToUniqueDartIdentifier } from '../helpers/naming';

/**
 * Generates Dart token constant files from Supernova tokens.
 * Produces one .g.dart file per token category.
 */
export class TokenGenerator {
  constructor(
    private readonly config: ExporterConfig,
    private readonly brandResolver: BrandResolver,
  ) {}

  /** Generate all token files from the provided tokens. */
  generate(tokens: any[]): OutputFile[] {
    const files: OutputFile[] = [];

    for (const category of TOKEN_CATEGORIES) {
      const categoryTokens = filterTokensByType(tokens, category.tokenTypes);
      if (categoryTokens.length === 0) continue;

      const file = this.generateCategoryFile(category, categoryTokens);
      if (file) files.push(file);
    }

    return files;
  }

  private generateCategoryFile(
    category: TokenCategory,
    tokens: any[],
  ): OutputFile | null {
    const className = `${this.config.classPrefix}${category.dartClassName}Gen`;
    const header = generateHeader({
      brand: this.brandResolver.effectiveBrandName,
    });

    let sections: ClassSection[];
    let imports: string[];

    switch (category.name) {
      case 'colors':
        imports = ["package:flutter/material.dart"];
        sections = this.buildColorSections(tokens);
        break;
      case 'spacing':
        imports = [];
        sections = this.buildSpacingSections(tokens);
        break;
      case 'typography':
        imports = ["package:flutter/material.dart"];
        sections = this.buildTypographySections(tokens);
        break;
      case 'elevation':
        imports = [];
        sections = this.buildElevationSections(tokens);
        break;
      case 'borders':
        imports = [];
        sections = this.buildBorderSections(tokens);
        break;
      case 'animation':
        imports = [];
        sections = this.buildAnimationSections(tokens);
        break;
      case 'opacity':
        imports = [];
        sections = this.buildOpacitySections(tokens);
        break;
      case 'gradients':
        imports = ["package:flutter/material.dart"];
        sections = this.buildGradientSections(tokens);
        break;
      case 'fontWeights':
        imports = ["package:flutter/material.dart"];
        sections = this.buildFontWeightSections(tokens);
        break;
      default:
        return null;
    }

    const classContent = buildAbstractFinalClass({
      className,
      docComment: `${this.config.classPrefix} design system ${category.name} tokens (generated).`,
      imports,
      sections,
    });

    const content = header + classContent;
    const outputDir = `${this.config.outputPath}/${this.brandResolver.getOutputSubdirectory()}`;

    return createOutputFile(outputDir, category.dartFileName, content);
  }

  /** Deduplicate tokens by name path, keeping the last occurrence. */
  private deduplicateTokens(tokens: any[]): any[] {
    const seen = new Map<string, any>();
    for (const token of tokens) {
      seen.set(token.name, token);
    }
    return Array.from(seen.values());
  }

  private buildColorSections(tokens: any[]): ClassSection[] {
    const deduped = this.deduplicateTokens(tokens);
    const grouped = new Map<string, ClassField[]>();
    const seenNames = new Set<string>();

    for (const token of deduped) {
      const mapped = mapColorToken(token as any);
      const parts = token.name.split('/');
      const group = parts.length > 1 ? parts[0] : 'General';

      // Use full-path name if short name would cause duplicate
      let fieldName = mapped.name;
      if (seenNames.has(fieldName)) {
        fieldName = tokenPathToUniqueDartIdentifier(token.name, 'color');
      }
      seenNames.add(fieldName);

      if (!grouped.has(group)) grouped.set(group, []);
      grouped.get(group)!.push({
        name: fieldName,
        type: 'Color',
        value: mapped.dartValue,
        docComment: mapped.docComment,
      });
    }

    return Array.from(grouped.entries()).map(([group, fields]) => ({
      comment: group.charAt(0).toUpperCase() + group.slice(1),
      fields,
    }));
  }

  private buildSpacingSections(tokens: any[]): ClassSection[] {
    const fields: ClassField[] = tokens.map((token) => {
      const mapped = mapSpacingToken(token as any);
      return {
        name: mapped.name,
        type: 'double',
        value: mapped.dartValue,
        docComment: mapped.docComment,
      };
    });
    return [{ comment: 'Spacing Scale', fields }];
  }

  private buildTypographySections(tokens: any[]): ClassSection[] {
    const fields: ClassField[] = tokens.map((token) => {
      const mapped = mapTypographyToken(token as any);
      return {
        name: mapped.name,
        type: 'TextStyle',
        value: mapped.dartValue,
        docComment: mapped.docComment,
      };
    });
    return [{ comment: 'Type Scale', fields }];
  }

  private buildElevationSections(tokens: any[]): ClassSection[] {
    const fields: ClassField[] = tokens.map((token) => {
      const mapped = mapElevationToken(token as any);
      return {
        name: mapped.name,
        type: 'double',
        value: mapped.dartValue,
        docComment: mapped.docComment,
      };
    });
    return [{ comment: 'Elevation Levels', fields }];
  }

  private buildBorderSections(tokens: any[]): ClassSection[] {
    const radiusFields: ClassField[] = [];
    const widthFields: ClassField[] = [];

    for (const token of tokens) {
      if (token.tokenType === 'BorderRadius') {
        const mapped = mapRadiusToken(token as any);
        radiusFields.push({
          name: mapped.name,
          type: 'double',
          value: mapped.dartValue,
          docComment: mapped.docComment,
        });
      } else {
        const mapped = mapBorderWidthToken(token as any);
        widthFields.push({
          name: mapped.name,
          type: 'double',
          value: mapped.dartValue,
          docComment: mapped.docComment,
        });
      }
    }

    const sections: ClassSection[] = [];
    if (radiusFields.length > 0) {
      sections.push({ comment: 'Border Radius', fields: radiusFields });
    }
    if (widthFields.length > 0) {
      sections.push({ comment: 'Border Width', fields: widthFields });
    }
    return sections;
  }

  private buildAnimationSections(tokens: any[]): ClassSection[] {
    const fields: ClassField[] = tokens.map((token) => {
      const mapped = mapAnimationToken(token as any);
      return {
        name: mapped.name,
        type: 'Duration',
        value: mapped.dartValue,
        docComment: mapped.docComment,
      };
    });
    return [{ comment: 'Animation Durations', fields }];
  }

  private buildOpacitySections(tokens: any[]): ClassSection[] {
    const fields: ClassField[] = tokens.map((token) => {
      const mapped = mapOpacityToken(token as any);
      return {
        name: mapped.name,
        type: 'double',
        value: mapped.dartValue,
        docComment: mapped.docComment,
      };
    });
    return [{ comment: 'Opacity Levels', fields }];
  }

  private buildGradientSections(tokens: any[]): ClassSection[] {
    const fields: ClassField[] = tokens.map((token) => {
      const mapped = mapGradientToken(token as any);
      return {
        name: mapped.name,
        type: 'Gradient',
        value: mapped.dartValue,
        docComment: mapped.docComment,
      };
    });
    return [{ comment: 'Gradients', fields }];
  }

  private buildFontWeightSections(tokens: any[]): ClassSection[] {
    const weightMap: Record<string, number> = {
      thin: 100, hairline: 100,
      extralight: 200, ultralight: 200,
      light: 300,
      regular: 400, normal: 400,
      medium: 500,
      semibold: 600, demibold: 600,
      bold: 700,
      extrabold: 800, ultrabold: 800,
      black: 900, heavy: 900,
    };

    const fields: ClassField[] = tokens.map((token) => {
      // FontWeight is a StringToken in SDK: value = { text: "Bold", referencedTokenId }
      const text = (token.value as any).text ?? 'Regular';
      const lower = text.toLowerCase().replace(/[\s-_]/g, '');
      const num = parseInt(text, 10);
      const weight = !isNaN(num) && num >= 100 && num <= 900
        ? Math.round(num / 100) * 100
        : (weightMap[lower] ?? 400);

      const name = token.name.split('/').pop() ?? token.name;
      return {
        name: name.charAt(0).toLowerCase() + name.slice(1),
        type: 'FontWeight',
        value: `FontWeight.w${weight}`,
        docComment: token.description ?? `Font weight ${text}.`,
      };
    });
    return [{ comment: 'Font Weights', fields }];
  }
}
