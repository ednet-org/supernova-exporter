import { describe, it, expect } from 'vitest';
import { mapColorToken } from '../../src/mappers/color-mapper';

describe('ColorMapper', () => {
  it('maps RGBA float to Dart Color hex', () => {
    const result = mapColorToken({
      name: 'brand/primary',
      value: { color: { r: 0, g: 0.4, b: 1, a: 1 } },
    });
    expect(result.name).toBe('primary');
    expect(result.dartValue).toBe('Color(0xFF0066FF)');
  });

  it('handles alpha channel', () => {
    const result = mapColorToken({
      name: 'surface/scrim',
      value: { color: { r: 0, g: 0, b: 0, a: 0.5 } },
    });
    expect(result.name).toBe('scrim');
    expect(result.dartValue).toBe('Color(0x80000000)');
  });

  it('handles white', () => {
    const result = mapColorToken({
      name: 'brand/onPrimary',
      value: { color: { r: 1, g: 1, b: 1, a: 1 } },
    });
    expect(result.dartValue).toBe('Color(0xFFFFFFFF)');
  });

  it('preserves description as doc comment', () => {
    const result = mapColorToken({
      name: 'brand/primary',
      description: 'Primary brand color.',
      value: { color: { r: 0, g: 0.4, b: 1, a: 1 } },
    });
    expect(result.docComment).toBe('Primary brand color.');
  });
});
