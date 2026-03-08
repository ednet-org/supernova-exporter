import { describe, it, expect } from 'vitest';
import { ThemeDataGenerator } from '../../src/generators/theme-data-generator';
import { BrandResolver } from '../../src/helpers/brand-resolver';
import { DEFAULT_CONFIG } from '../../src/config/config-defaults';

/** Mock tokens that match the Supernova SDK structure. */
const mockColorTokens = [
  { name: 'primary', tokenType: 'Color', value: { color: { r: 8, g: 145, b: 178 }, opacity: { measure: 1 } } },
  { name: 'onPrimary', tokenType: 'Color', value: { color: { r: 255, g: 255, b: 255 }, opacity: { measure: 1 } } },
  { name: 'surface', tokenType: 'Color', value: { color: { r: 246, g: 250, b: 254 }, opacity: { measure: 1 } } },
];

const mockTypographyTokens = [
  { name: 'displayLarge', tokenType: 'Typography', value: { fontSize: { measure: 57 }, fontFamily: { text: 'Inter' }, fontWeight: { text: 'Regular' } } },
  { name: 'bodyMedium', tokenType: 'Typography', value: { fontSize: { measure: 14 }, fontFamily: { text: 'Inter' }, fontWeight: { text: 'Regular' } } },
];

const mockDimensionTokens = [
  { name: 'md', tokenType: 'Dimension', value: { measure: 12, unit: 'px' }, _groupPath: '' },
  { name: 'lg', tokenType: 'Dimension', value: { measure: 16, unit: 'px' }, _groupPath: '' },
  { name: 'level0', tokenType: 'Dimension', value: { measure: 0, unit: 'px' }, _groupPath: '' },
];

const allMockTokens = [...mockColorTokens, ...mockTypographyTokens, ...mockDimensionTokens];

describe('ThemeDataGenerator', () => {
  const resolver = new BrandResolver('ednet_ds', undefined);
  const generator = new ThemeDataGenerator(DEFAULT_CONFIG, resolver);

  it('generates a theme_data.g.dart file', () => {
    const files = generator.generate(allMockTokens);
    expect(files).toHaveLength(1);
    expect(files[0].fileName).toBe('theme_data.g.dart');
  });

  it('contains ThemeData builder function', () => {
    const files = generator.generate(allMockTokens);
    expect(files[0].content).toContain('ThemeData buildEdnetTheme(');
    expect(files[0].content).toContain('Brightness brightness');
  });

  it('references generated token classes when tokens exist', () => {
    const content = generator.generate(allMockTokens)[0].content;
    expect(content).toContain('EdnetColorsGen.');
    expect(content).toContain('EdnetTypographyGen.');
    expect(content).toContain('EdnetDimensionsGen.');
  });

  it('falls back to inline values when no tokens provided', () => {
    const content = generator.generate([])[0].content;
    // Should use Color(...) inline fallbacks instead of token refs
    expect(content).toContain('Color(0xFF');
    expect(content).not.toContain('EdnetColorsGen.');
    expect(content).not.toContain('EdnetDimensionsGen.');
  });

  it('includes all Material 3 component themes', () => {
    const content = generator.generate(allMockTokens)[0].content;
    expect(content).toContain('appBarTheme:');
    expect(content).toContain('cardTheme:');
    expect(content).toContain('inputDecorationTheme:');
    expect(content).toContain('filledButtonTheme:');
    expect(content).toContain('elevatedButtonTheme:');
    expect(content).toContain('outlinedButtonTheme:');
    expect(content).toContain('textButtonTheme:');
    expect(content).toContain('floatingActionButtonTheme:');
    expect(content).toContain('dialogTheme:');
    expect(content).toContain('bottomSheetTheme:');
    expect(content).toContain('navigationBarTheme:');
    expect(content).toContain('navigationRailTheme:');
    expect(content).toContain('chipTheme:');
    expect(content).toContain('dividerTheme:');
    expect(content).toContain('snackBarTheme:');
    expect(content).toContain('switchTheme:');
    expect(content).toContain('tabBarTheme:');
    expect(content).toContain('tooltipTheme:');
    expect(content).toContain('listTileTheme:');
    expect(content).toContain('checkboxTheme:');
    expect(content).toContain('popupMenuTheme:');
  });

  it('uses custom prefix for Morfik brand', () => {
    const morfikResolver = new BrandResolver('morfik', undefined);
    const morfikGen = new ThemeDataGenerator(
      { ...DEFAULT_CONFIG, classPrefix: 'Morfik' },
      morfikResolver,
    );
    const content = morfikGen.generate(allMockTokens)[0].content;
    expect(content).toContain('ThemeData buildMorfikTheme(');
    expect(content).toContain('MorfikColorsGen.');
    expect(content).toContain('MorfikTypographyGen.');
  });
});
