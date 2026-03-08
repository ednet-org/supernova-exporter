import { tokenNameToDartIdentifier } from '../helpers/naming';

/**
 * Duration token value from Supernova SDK.
 * SDK type: DurationTokenValue = { unit: MsUnit, measure: number, referencedTokenId }
 */
export interface DurationTokenValue {
  unit: string; // 'ms'
  measure: number; // milliseconds
  referencedTokenId?: string | null;
}

/** Mapped animation field for Dart output. */
export interface MappedAnimationField {
  name: string;
  dartValue: string;
  docComment?: string;
}

/** Map a Supernova duration token to a Dart Duration constant. */
export function mapAnimationToken(token: {
  name: string;
  description?: string;
  value: DurationTokenValue;
}): MappedAnimationField {
  const ms = token.value.measure ?? 0;
  return {
    name: tokenNameToDartIdentifier(token.name),
    dartValue: `Duration(milliseconds: ${Math.round(ms)})`,
    docComment: token.description ?? `Animation duration (${ms}ms).`,
  };
}
