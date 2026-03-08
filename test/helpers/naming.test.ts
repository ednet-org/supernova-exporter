import { describe, it, expect } from 'vitest';
import {
  toCamelCase,
  toSnakeCase,
  tokenNameToDartIdentifier,
  categoryToDartClassName,
  capitalize,
} from '../../src/helpers/naming';

describe('Naming helpers', () => {
  it('toCamelCase', () => {
    expect(toCamelCase('display-large')).toBe('displayLarge');
    expect(toCamelCase('border_width')).toBe('borderWidth');
    expect(toCamelCase('FontWeight')).toBe('fontWeight');
  });

  it('toSnakeCase', () => {
    expect(toSnakeCase('displayLarge')).toBe('display_large');
    expect(toSnakeCase('borderWidth')).toBe('border_width');
  });

  it('tokenNameToDartIdentifier', () => {
    expect(tokenNameToDartIdentifier('brand/primary')).toBe('primary');
    expect(tokenNameToDartIdentifier('spacing/xxs')).toBe('xxs');
    expect(tokenNameToDartIdentifier('fontSize/displayLarge')).toBe('displayLarge');
  });

  it('categoryToDartClassName', () => {
    expect(categoryToDartClassName('Ednet', 'Colors')).toBe('EdnetColorsGen');
    expect(categoryToDartClassName('Morfik', 'Typography')).toBe('MorfikTypographyGen');
  });

  it('capitalize', () => {
    expect(capitalize('colors')).toBe('Colors');
    expect(capitalize('Typography')).toBe('Typography');
  });
});
