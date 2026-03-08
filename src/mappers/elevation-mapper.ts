import { floatColorToDartHex, formatDouble } from '../helpers/dart-formatter';
import { tokenNameToDartIdentifier } from '../helpers/naming';

/** Shadow token value from Supernova SDK. */
export interface ShadowTokenValue {
  color: { r: number; g: number; b: number; a: number };
  x: { measure: number; unit: string };
  y: { measure: number; unit: string };
  radius: { measure: number; unit: string };
  spread: { measure: number; unit: string };
  opacity: number;
  referencedTokenId?: string;
}

/** Mapped elevation field for Dart output. */
export interface MappedElevationField {
  name: string;
  dartValue: string;
  docComment?: string;
}

/** Map a Supernova shadow token to a Dart BoxShadow list. */
export function mapElevationToken(token: {
  name: string;
  description?: string;
  value: ShadowTokenValue | ShadowTokenValue[];
}): MappedElevationField {
  const shadows = Array.isArray(token.value) ? token.value : [token.value];

  if (shadows.length === 0 || (shadows.length === 1 && shadows[0].radius.measure === 0 && shadows[0].x.measure === 0 && shadows[0].y.measure === 0)) {
    return {
      name: tokenNameToDartIdentifier(token.name),
      dartValue: '0.0',
      docComment: token.description ?? 'No elevation.',
    };
  }

  // For simple elevation, just use the blur radius as the elevation value
  // (matching Material 3 convention where elevation = blur radius proxy)
  const primaryShadow = shadows[0];
  return {
    name: tokenNameToDartIdentifier(token.name),
    dartValue: formatDouble(primaryShadow.radius.measure),
    docComment: token.description ?? `Elevation level (${primaryShadow.radius.measure}px blur).`,
  };
}
