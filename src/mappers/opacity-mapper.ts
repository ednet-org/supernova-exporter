import { formatDouble } from '../helpers/dart-formatter';
import { tokenNameToDartIdentifier } from '../helpers/naming';

/** Opacity token value from Supernova SDK. */
export interface OpacityTokenValue {
  measure: number; // 0-1
  referencedTokenId?: string;
}

/** Mapped opacity field for Dart output. */
export interface MappedOpacityField {
  name: string;
  dartValue: string;
  docComment?: string;
}

/** Map a Supernova opacity token to a Dart double constant. */
export function mapOpacityToken(token: {
  name: string;
  description?: string;
  value: OpacityTokenValue;
}): MappedOpacityField {
  return {
    name: tokenNameToDartIdentifier(token.name),
    dartValue: formatDouble(token.value.measure),
    docComment: token.description ?? `Opacity value (${(token.value.measure * 100).toFixed(0)}%).`,
  };
}
