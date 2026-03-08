import { formatDouble } from '../helpers/dart-formatter';
import { tokenNameToDartIdentifier } from '../helpers/naming';

/**
 * Shadow token value from Supernova SDK.
 * SDK type: ShadowTokenValue = {
 *   color: ColorTokenValue,  // { color: { r, g, b }, opacity: { measure } }
 *   x: number, y: number, radius: number, spread: number,
 *   opacity?: OpacityTokenValue, type: ShadowType, referencedTokenId
 * }
 * Shadow tokens have value as ShadowTokenValue[] (array of layers).
 */
export interface ShadowTokenValue {
  color: {
    color: { r: number; g: number; b: number };
    opacity: { measure: number };
  };
  x: number;
  y: number;
  radius: number;
  spread: number;
  opacity?: { unit: string; measure: number };
  type: string;
  referencedTokenId?: string | null;
}

/** Mapped elevation field for Dart output. */
export interface MappedElevationField {
  name: string;
  dartValue: string;
  docComment?: string;
}

/** Map a Supernova shadow token to a Dart elevation constant. */
export function mapElevationToken(token: {
  name: string;
  description?: string;
  value: ShadowTokenValue | ShadowTokenValue[];
}): MappedElevationField {
  const shadows = Array.isArray(token.value) ? token.value : [token.value];

  if (shadows.length === 0 || (shadows.length === 1 && shadows[0].radius === 0 && shadows[0].x === 0 && shadows[0].y === 0)) {
    return {
      name: tokenNameToDartIdentifier(token.name),
      dartValue: '0.0',
      docComment: token.description ?? 'No elevation.',
    };
  }

  // Use the blur radius as the elevation value (Material 3 convention)
  const primaryShadow = shadows[0];
  return {
    name: tokenNameToDartIdentifier(token.name),
    dartValue: formatDouble(primaryShadow.radius),
    docComment: token.description ?? `Elevation level (${primaryShadow.radius}px blur).`,
  };
}
