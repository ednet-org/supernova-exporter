import { OutputFile, createOutputFile } from '../helpers/file-builder';
import { ExporterConfig } from '../config/config-types';
import { BrandResolver } from '../helpers/brand-resolver';
import { TOKEN_CATEGORIES, filterTokensByType, TokenCategory } from '../helpers/token-tree';
import { generateHeader } from '../templates/header';
import { buildAbstractFinalClass, ClassSection, ClassField } from '../templates/class-template';
import { mapColorToken, ColorTokenValue } from '../mappers/color-mapper';
import { mapSpacingToken, DimensionTokenValue } from '../mappers/spacing-mapper';
import { mapTypographyToken, TypographyTokenValue } from '../mappers/typography-mapper';
import { mapElevationToken, ShadowTokenValue } from '../mappers/elevation-mapper';
import { mapBorderWidthToken, mapRadiusToken, BorderWidthTokenValue, RadiusTokenValue } from '../mappers/border-mapper';
import { mapAnimationToken, DurationTokenValue } from '../mappers/animation-mapper';
import { mapOpacityToken, OpacityTokenValue } from '../mappers/opacity-mapper';
import { mapGradientToken, GradientTokenValue } from '../mappers/gradient-mapper';

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

  private buildColorSections(tokens: any[]): ClassSection[] {
    const grouped = new Map<string, ClassField[]>();

    for (const token of tokens) {
      const mapped = mapColorToken(token as any);
      const parts = token.name.split('/');
      const group = parts.length > 1 ? parts[0] : 'General';

      if (!grouped.has(group)) grouped.set(group, []);
      grouped.get(group)!.push({
        name: mapped.name,
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
      if (token.tokenType === 'radius') {
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
    const fields: ClassField[] = tokens.map((token) => {
      const value = (token.value as any).measure ?? 400;
      const name = token.name.split('/').pop() ?? token.name;
      return {
        name: name.charAt(0).toLowerCase() + name.slice(1),
        type: 'FontWeight',
        value: `FontWeight.w${Math.round(value)}`,
        docComment: token.description ?? `Font weight ${value}.`,
      };
    });
    return [{ comment: 'Font Weights', fields }];
  }
}
