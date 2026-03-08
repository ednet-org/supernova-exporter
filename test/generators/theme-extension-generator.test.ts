import { describe, it, expect } from 'vitest';
import { ThemeExtensionGenerator } from '../../src/generators/theme-extension-generator';
import { BrandResolver } from '../../src/helpers/brand-resolver';
import { DEFAULT_CONFIG } from '../../src/config/config-defaults';

function makeSpacingToken(name: string, value: number) {
  return {
    name,
    tokenType: 'Space',
    description: `Spacing ${name}`,
    value: { measure: value, unit: 'Pixels', referencedTokenId: null },
  };
}

function makeColorToken(name: string, r: number, g: number, b: number) {
  return {
    name,
    tokenType: 'Color',
    description: `Color ${name}`,
    value: {
      color: { r, g, b, referencedTokenId: null },
      opacity: { unit: 'Raw', measure: 1, referencedTokenId: null },
      referencedTokenId: null,
    },
  };
}

function makeBorderToken(name: string, value: number) {
  return {
    name,
    tokenType: 'BorderRadius',
    description: `Radius ${name}`,
    value: { measure: value, unit: 'Pixels', referencedTokenId: null },
  };
}

describe('ThemeExtensionGenerator', () => {
  const brandResolver = new BrandResolver('ednet_ds', undefined);
  const generator = new ThemeExtensionGenerator(DEFAULT_CONFIG, brandResolver);

  it('generates ednet_tokens.g.dart file', () => {
    const tokens = [
      makeSpacingToken('spacing/sm', 8),
      makeSpacingToken('spacing/md', 12),
    ];
    const files = generator.generate(tokens);

    expect(files).toHaveLength(1);
    expect(files[0].fileName).toBe('ednet_tokens.g.dart');
  });

  it('generates wrapper class with lerp', () => {
    const tokens = [
      makeSpacingToken('spacing/sm', 8),
      makeSpacingToken('spacing/md', 12),
    ];
    const files = generator.generate(tokens);
    const content = files[0].content;

    expect(content).toContain('class EdnetSpacingTokensGen');
    expect(content).toContain('static EdnetSpacingTokensGen lerp(');
    expect(content).toContain('lerpDouble(a.sm, b.sm, t)');
  });

  it('generates copyWith on wrappers', () => {
    const tokens = [makeSpacingToken('spacing/sm', 8)];
    const files = generator.generate(tokens);
    const content = files[0].content;

    expect(content).toContain('EdnetSpacingTokensGen copyWith(');
    expect(content).toContain('sm: sm ?? this.sm,');
  });

  it('generates == and hashCode', () => {
    const tokens = [
      makeSpacingToken('spacing/sm', 8),
      makeSpacingToken('spacing/md', 12),
    ];
    const files = generator.generate(tokens);
    const content = files[0].content;

    expect(content).toContain('bool operator ==(Object other)');
    expect(content).toContain('int get hashCode => Object.hash(');
  });

  it('generates ThemeExtension class', () => {
    const tokens = [
      makeSpacingToken('spacing/sm', 8),
      makeColorToken('primary/default', 128, 128, 128),
    ];
    const files = generator.generate(tokens);
    const content = files[0].content;

    expect(content).toContain('class EdnetTokensGen extends ThemeExtension<EdnetTokensGen>');
    expect(content).toContain('required this.spacing,');
    expect(content).toContain('required this.colors,');
    expect(content).toContain('factory EdnetTokensGen.light()');
    expect(content).toContain('factory EdnetTokensGen.dark()');
  });

  it('generates color wrapper with Color.lerp', () => {
    const tokens = [makeColorToken('primary/default', 128, 128, 128)];
    const files = generator.generate(tokens);
    const content = files[0].content;

    expect(content).toContain('class EdnetColorTokensGen');
    expect(content).toContain('Color.lerp(');
  });

  it('generates border wrapper with lerpDouble', () => {
    const tokens = [makeBorderToken('radius/md', 12)];
    const files = generator.generate(tokens);
    const content = files[0].content;

    expect(content).toContain('class EdnetBorderTokensGen');
    expect(content).toContain('lerpDouble(');
  });

  it('returns empty when disabled', () => {
    const config = { ...DEFAULT_CONFIG, generateThemeExtension: false };
    const gen = new ThemeExtensionGenerator(config, brandResolver);
    const files = gen.generate([makeSpacingToken('sm', 8)]);
    expect(files).toHaveLength(0);
  });

  it('includes @immutable annotation', () => {
    const tokens = [makeSpacingToken('spacing/sm', 8)];
    const files = generator.generate(tokens);
    expect(files[0].content).toContain('@immutable');
  });
});
