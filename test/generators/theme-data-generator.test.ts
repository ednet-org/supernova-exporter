import { describe, it, expect } from 'vitest';
import { ThemeDataGenerator } from '../../src/generators/theme-data-generator';
import { BrandResolver } from '../../src/helpers/brand-resolver';
import { DEFAULT_CONFIG } from '../../src/config/config-defaults';

describe('ThemeDataGenerator', () => {
  const resolver = new BrandResolver('ednet_ds', undefined);
  const generator = new ThemeDataGenerator(DEFAULT_CONFIG, resolver);

  it('generates a theme_data.g.dart file', () => {
    const files = generator.generate([]);
    expect(files).toHaveLength(1);
    expect(files[0].fileName).toBe('theme_data.g.dart');
  });

  it('contains ThemeData builder function', () => {
    const files = generator.generate([]);
    expect(files[0].content).toContain('ThemeData buildEdnetTheme(');
    expect(files[0].content).toContain('Brightness brightness');
  });

  it('references generated token classes', () => {
    const files = generator.generate([]);
    expect(files[0].content).toContain('EdnetColorsGen.');
    expect(files[0].content).toContain('EdnetTypographyGen.');
    expect(files[0].content).toContain('EdnetElevationGen.');
    expect(files[0].content).toContain('EdnetBordersGen.');
  });

  it('includes all Material 3 component themes', () => {
    const content = generator.generate([])[0].content;
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
    const content = morfikGen.generate([])[0].content;
    expect(content).toContain('ThemeData buildMorfikTheme(');
    expect(content).toContain('MorfikColorsGen.');
    expect(content).toContain('MorfikTypographyGen.');
  });
});
