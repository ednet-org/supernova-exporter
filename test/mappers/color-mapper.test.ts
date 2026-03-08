import { describe, it, expect } from 'vitest';
import { mapColorToken } from '../../src/mappers/color-mapper';

describe('ColorMapper', () => {
  it('maps SDK ColorTokenValue to Dart Color hex', () => {
    const result = mapColorToken({
      name: 'brand/primary',
      value: {
        color: { r: 0, g: 102, b: 255 },
        opacity: { unit: 'Raw', measure: 1 },
      },
    });
    expect(result.name).toBe('primary');
    expect(result.dartValue).toBe('Color(0xFF0066FF)');
  });

  it('handles alpha via opacity.measure', () => {
    const result = mapColorToken({
      name: 'surface/scrim',
      value: {
        color: { r: 0, g: 0, b: 0 },
        opacity: { unit: 'Raw', measure: 0.5 },
      },
    });
    expect(result.name).toBe('scrim');
    expect(result.dartValue).toBe('Color(0x80000000)');
  });

  it('handles white', () => {
    const result = mapColorToken({
      name: 'brand/onPrimary',
      value: {
        color: { r: 255, g: 255, b: 255 },
        opacity: { unit: 'Raw', measure: 1 },
      },
    });
    expect(result.dartValue).toBe('Color(0xFFFFFFFF)');
  });

  it('preserves description as doc comment', () => {
    const result = mapColorToken({
      name: 'brand/primary',
      description: 'Primary brand color.',
      value: {
        color: { r: 0, g: 102, b: 255 },
        opacity: { unit: 'Raw', measure: 1 },
      },
    });
    expect(result.docComment).toBe('Primary brand color.');
  });
});
