import { describe, it, expect } from 'vitest';
import { BrandThemeGenerator } from '../../src/generators/brand-theme-generator';
import { BrandResolver } from '../../src/helpers/brand-resolver';
import { DEFAULT_CONFIG } from '../../src/config/config-defaults';

describe('BrandThemeGenerator', () => {
  it('generates brand_theme.g.dart', () => {
    const brandResolver = new BrandResolver('morfik', undefined);
    const generator = new BrandThemeGenerator(DEFAULT_CONFIG, brandResolver);
    const files = generator.generate([]);

    expect(files).toHaveLength(1);
    expect(files[0].fileName).toBe('brand_theme.g.dart');
    expect(files[0].relativePath).toContain('morfik');
  });

  it('generates wrapper function', () => {
    const brandResolver = new BrandResolver('morfik', undefined);
    const generator = new BrandThemeGenerator(DEFAULT_CONFIG, brandResolver);
    const files = generator.generate([]);
    const content = files[0].content;

    expect(content).toContain('ThemeData buildEdnetBrandTheme(');
    expect(content).toContain('return buildEdnetTheme(brightness');
  });

  it('imports base theme_data.g.dart', () => {
    const brandResolver = new BrandResolver('morfik', undefined);
    const generator = new BrandThemeGenerator(DEFAULT_CONFIG, brandResolver);
    const files = generator.generate([]);

    expect(files[0].content).toContain("import 'theme_data.g.dart';");
  });

  it('includes doc comments with brand name', () => {
    const brandResolver = new BrandResolver('morfik', undefined);
    const generator = new BrandThemeGenerator(DEFAULT_CONFIG, brandResolver);
    const files = generator.generate([]);

    expect(files[0].content).toContain('Brand-specific theme for morfik');
  });

  it('includes generated header', () => {
    const brandResolver = new BrandResolver('morfik', undefined);
    const generator = new BrandThemeGenerator(DEFAULT_CONFIG, brandResolver);
    const files = generator.generate([]);

    expect(files[0].content).toContain('// GENERATED CODE - DO NOT MODIFY BY HAND');
    expect(files[0].content).toContain('// Brand: morfik');
  });

  it('uses config classPrefix', () => {
    const brandResolver = new BrandResolver('morfik', undefined);
    const config = { ...DEFAULT_CONFIG, classPrefix: 'Morfik' };
    const generator = new BrandThemeGenerator(config, brandResolver);
    const files = generator.generate([]);

    expect(files[0].content).toContain('buildMorfikBrandTheme');
    expect(files[0].content).toContain('buildMorfikTheme');
  });
});
