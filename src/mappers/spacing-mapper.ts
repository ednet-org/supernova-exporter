import { formatDouble } from '../helpers/dart-formatter';
import { tokenNameToDartIdentifier } from '../helpers/naming';

/** Dimension/space/size token value from Supernova SDK. */
export interface DimensionTokenValue {
  measure: number;
  unit: string; // typically 'px'
  referencedTokenId?: string;
}

/** Mapped spacing field for Dart output. */
export interface MappedSpacingField {
  name: string;
  dartValue: string;
  docComment?: string;
}

/** Map a Supernova dimension/space/size token to a Dart double constant. */
export function mapSpacingToken(token: {
  name: string;
  description?: string;
  value: DimensionTokenValue;
}): MappedSpacingField {
  return {
    name: tokenNameToDartIdentifier(token.name),
    dartValue: formatDouble(token.value.measure),
    docComment: token.description
      ? `${token.description} (${token.value.measure}${token.value.unit})`
      : `${token.value.measure}${token.value.unit}`,
  };
}
