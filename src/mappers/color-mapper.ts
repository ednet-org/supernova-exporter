import { floatColorToDartHex } from '../helpers/dart-formatter';
import { tokenNameToDartIdentifier } from '../helpers/naming';

/**
 * Color token value from Supernova SDK.
 * SDK type: ColorTokenValue = { color: ColorValue, opacity: OpacityTokenValue, referencedTokenId }
 * ColorValue = { r, g, b, referencedTokenId }
 * OpacityTokenValue = { unit, measure, referencedTokenId }
 */
export interface ColorTokenValue {
  color: {
    r: number; // 0-255
    g: number; // 0-255
    b: number; // 0-255
    referencedTokenId?: string | null;
  };
  opacity: {
    unit: string;
    measure: number; // 0-1
    referencedTokenId?: string | null;
  };
  referencedTokenId?: string | null;
}

/** Mapped color field for Dart output. */
export interface MappedColorField {
  name: string;
  dartValue: string;
  docComment?: string;
}

/** Map a Supernova color token to a Dart Color constant. */
export function mapColorToken(token: {
  name: string;
  description?: string;
  value: ColorTokenValue;
}): MappedColorField {
  const { color, opacity } = token.value;
  // SDK provides r/g/b as 0-255 integers, opacity as 0-1 float
  const r = color.r ?? 0;
  const g = color.g ?? 0;
  const b = color.b ?? 0;
  const a = opacity?.measure ?? 1;
  return {
    name: tokenNameToDartIdentifier(token.name),
    dartValue: floatColorToDartHex(r / 255, g / 255, b / 255, a),
    docComment: token.description || undefined,
  };
}

/** Map multiple color tokens, grouped by their path prefix. */
export function mapColorTokens(tokens: Array<{
  name: string;
  description?: string;
  value: ColorTokenValue;
}>): Map<string, MappedColorField[]> {
  const groups = new Map<string, MappedColorField[]>();

  for (const token of tokens) {
    const parts = token.name.split('/');
    const groupName = parts.length > 1 ? parts[0] : 'general';
    const mapped = mapColorToken(token);

    if (!groups.has(groupName)) {
      groups.set(groupName, []);
    }
    groups.get(groupName)!.push(mapped);
  }

  return groups;
}
