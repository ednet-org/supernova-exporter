import { describe, it, expect } from 'vitest';
import { mapSpacingToken } from '../../src/mappers/spacing-mapper';

describe('SpacingMapper', () => {
  it('maps dimension to Dart double', () => {
    const result = mapSpacingToken({
      name: 'spacing/md',
      value: { measure: 12, unit: 'px' },
    });
    expect(result.name).toBe('md');
    expect(result.dartValue).toBe('12.0');
  });

  it('maps fractional spacing', () => {
    const result = mapSpacingToken({
      name: 'spacing/xxs',
      value: { measure: 2, unit: 'px' },
    });
    expect(result.dartValue).toBe('2.0');
  });
});
