import { floatColorToDartHex, colorToDartHex } from '../helpers/dart-formatter';
import { tokenNameToDartIdentifier } from '../helpers/naming';

/** Color token value from Supernova SDK. */
export interface ColorTokenValue {
  color: {
    r: number; // 0-1
    g: number; // 0-1
    b: number; // 0-1
    a: number; // 0-1
  };
  referencedTokenId?: string;
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
  const { r, g, b, a } = token.value.color;
  return {
    name: tokenNameToDartIdentifier(token.name),
    dartValue: floatColorToDartHex(r, g, b, a),
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
