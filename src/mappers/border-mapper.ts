import { formatDouble } from '../helpers/dart-formatter';
import { tokenNameToDartIdentifier } from '../helpers/naming';

/** Border width token value. */
export interface BorderWidthTokenValue {
  measure: number;
  unit: string;
  referencedTokenId?: string;
}

/** Border radius token value. */
export interface RadiusTokenValue {
  measure: number;
  unit: string;
  referencedTokenId?: string;
}

/** Mapped border field for Dart output. */
export interface MappedBorderField {
  name: string;
  dartValue: string;
  docComment?: string;
}

/** Map a border width token to a Dart double constant. */
export function mapBorderWidthToken(token: {
  name: string;
  description?: string;
  value: BorderWidthTokenValue;
}): MappedBorderField {
  return {
    name: tokenNameToDartIdentifier(token.name),
    dartValue: formatDouble(token.value.measure),
    docComment: token.description ?? `Border width (${token.value.measure}${token.value.unit}).`,
  };
}

/** Map a border radius token to a Dart double constant. */
export function mapRadiusToken(token: {
  name: string;
  description?: string;
  value: RadiusTokenValue;
}): MappedBorderField {
  return {
    name: tokenNameToDartIdentifier(token.name),
    dartValue: formatDouble(token.value.measure),
    docComment: token.description ?? `Border radius (${token.value.measure}${token.value.unit}).`,
  };
}
