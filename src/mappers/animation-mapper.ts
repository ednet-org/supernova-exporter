import { tokenNameToDartIdentifier } from '../helpers/naming';

/** Duration token value from Supernova SDK. */
export interface DurationTokenValue {
  duration: number; // milliseconds
  referencedTokenId?: string;
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
  return {
    name: tokenNameToDartIdentifier(token.name),
    dartValue: `Duration(milliseconds: ${Math.round(token.value.duration)})`,
    docComment: token.description ?? `Animation duration (${token.value.duration}ms).`,
  };
}
